package market

import (
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"sector-insight/backend/internal/client/idx"
	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

var (
	quoteCacheMu sync.RWMutex
	cachedQuotes []model.StockQuote
	cacheExpiry  time.Time
	syncMu       sync.Mutex
)

const CacheDuration = 5 * time.Minute

var priorityBanks = []string{
	"BBCA", "BBRI", "BMRI", "BBNI", "BRIS", "BBTN",
	"BNGA", "BDMN", "BJBR", "BJTM", "ARTO", "PNBN",
}

func SyncLiveStockQuotes(client *sectors.Client) ([]model.StockQuote, error) {
	syncMu.Lock()
	defer syncMu.Unlock()

	log.Println("[QUOTE_SYNC] Synchronizing stock quotes from market data provider...")

	tickerMap := make(map[string]bool)
	targetTickers := make([]string, 0, len(idx.TopMarketMovers))

	for _, t := range idx.TopMarketMovers {
		tickerMap[t] = true
		targetTickers = append(targetTickers, t)
	}

	for _, dq := range model.GetDefaultStockQuotes() {
		sym := strings.ToUpper(dq.Ticker)
		if !tickerMap[sym] {
			tickerMap[sym] = true
			targetTickers = append(targetTickers, sym)
		}
	}

	if database.DB != nil {
		var dbTickers []string
		if err := database.DB.Model(&model.StockQuote{}).Pluck("ticker", &dbTickers).Error; err == nil {
			for _, t := range dbTickers {
				sym := strings.ToUpper(strings.TrimSpace(t))
				if sym != "" && !tickerMap[sym] {
					tickerMap[sym] = true
					targetTickers = append(targetTickers, sym)
				}
			}
		}
	}

	stockQuotes, err := idx.GetAllBankingQuotes(targetTickers)
	if err != nil || len(stockQuotes) == 0 {
		log.Printf("[QUOTE_SYNC] Quotes provider empty (%v), using database/fallback", err)
		return fallbackQuotes()
	}

	quotesMap := make(map[string]model.StockQuote)
	for _, q := range stockQuotes {
		quotesMap[strings.ToUpper(q.Ticker)] = q
	}

	finalQuotes := make([]model.StockQuote, 0, len(targetTickers))
	for _, tk := range targetTickers {
		q, found := quotesMap[tk]
		if !found || q.Price <= 0 {
			if dbQuote, ok := getQuoteFromDB(tk); ok {
				q = dbQuote
			} else {
				q = getDefaultQuoteForTicker(tk)
			}
		} else {
			if dbQuote, ok := getQuoteFromDB(tk); ok {
				if q.Sector == "" && dbQuote.Sector != "" {
					q.Sector = dbQuote.Sector
				}
				if q.MarketCap == 0 && dbQuote.MarketCap > 0 {
					q.MarketCap = dbQuote.MarketCap
				}
				if q.PE == 0 && dbQuote.PE > 0 {
					q.PE = dbQuote.PE
				}
				if q.PBV == 0 && dbQuote.PBV > 0 {
					q.PBV = dbQuote.PBV
				}
				if q.Coverage == 0 && dbQuote.Coverage > 0 {
					q.Coverage = dbQuote.Coverage
					q.AnalystCoverage = dbQuote.Coverage
				}
			}
		}

		if q.Sector == "" {
			if info, ok := idx.GetIDXStockInfo(q.Ticker); ok {
				q.Sector = info.Sector
			}
		}

		q.PopulateComputedFields()

		if database.DB != nil {
			UpsertStockQuote(&q)
		}

		finalQuotes = append(finalQuotes, q)
	}

	if len(finalQuotes) == 0 {
		return fallbackQuotes()
	}

	quoteCacheMu.Lock()
	cachedQuotes = make([]model.StockQuote, len(finalQuotes))
	copy(cachedQuotes, finalQuotes)
	cacheExpiry = time.Now().Add(CacheDuration)
	quoteCacheMu.Unlock()

	log.Printf("[QUOTE_SYNC] Successfully synchronized %d stock quotes.", len(finalQuotes))
	return finalQuotes, nil
}

func UpsertStockQuote(quote *model.StockQuote) {
	if database.DB == nil {
		return
	}

	if quote.Sector == "" {
		if info, ok := idx.GetIDXStockInfo(quote.Ticker); ok {
			quote.Sector = info.Sector
		}
	}

	var existing model.StockQuote
	err := database.DB.Where("ticker = ?", quote.Ticker).First(&existing).Error
	if err == nil {
		quote.ID = existing.ID
		if quote.Sector == "" && existing.Sector != "" {
			quote.Sector = existing.Sector
		}
		if quote.Name == "" && existing.Name != "" {
			quote.Name = existing.Name
		}
		if quote.Coverage == 0 && existing.Coverage > 0 {
			quote.Coverage = existing.Coverage
			quote.AnalystCoverage = existing.Coverage
		}
		if quote.PE == 0 && existing.PE > 0 {
			quote.PE = existing.PE
		}
		if quote.PBV == 0 && existing.PBV > 0 {
			quote.PBV = existing.PBV
		}
		if quote.MarketCap == 0 && existing.MarketCap > 0 {
			quote.MarketCap = existing.MarketCap
		}
		quote.UpdatedAt = time.Now()
		database.DB.Save(quote)
	} else {
		quote.CreatedAt = time.Now()
		quote.UpdatedAt = time.Now()
		database.DB.Create(quote)
	}
}

func getQuoteFromDB(ticker string) (model.StockQuote, bool) {
	if database.DB == nil {
		return model.StockQuote{}, false
	}
	var q model.StockQuote
	if err := database.DB.Where("ticker = ?", ticker).First(&q).Error; err == nil && q.Ticker != "" {
		return q, true
	}
	return model.StockQuote{}, false
}

func getDefaultQuoteForTicker(ticker string) model.StockQuote {
	for _, dq := range model.GetDefaultStockQuotes() {
		if strings.EqualFold(dq.Ticker, ticker) {
			return dq
		}
	}
	name := fmt.Sprintf("PT %s Tbk", ticker)
	sector := ""
	if info, ok := idx.GetIDXStockInfo(ticker); ok {
		if info.Name != "" {
			name = info.Name
		}
		sector = info.Sector
	} else if n, ok := idx.DefaultBankNames[ticker]; ok {
		name = n
		sector = "Financials"
	}
	return model.StockQuote{
		Ticker:          ticker,
		Name:            name,
		Sector:          sector,
		Price:           2500,
		ChangePercent:   0.0,
		Coverage:        15,
		AnalystCoverage: 15,
		MarketCap:       25000000000000,
		Status:          "Netral",
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}
}

func fallbackQuotes() ([]model.StockQuote, error) {
	if database.DB != nil {
		var quotes []model.StockQuote
		if err := database.DB.Order("market_cap desc").Find(&quotes).Error; err == nil && len(quotes) > 0 {
			for i := range quotes {
				quotes[i].PopulateComputedFields()
			}
			return quotes, nil
		}
	}
	defaults := model.GetDefaultStockQuotes()
	for i := range defaults {
		defaults[i].PopulateComputedFields()
	}
	return defaults, nil
}

func GetOrSyncStockQuotes(client *sectors.Client) ([]model.StockQuote, error) {
	quoteCacheMu.RLock()
	if len(cachedQuotes) > 0 && time.Now().Before(cacheExpiry) {
		res := make([]model.StockQuote, len(cachedQuotes))
		copy(res, cachedQuotes)
		quoteCacheMu.RUnlock()
		return res, nil
	}
	quoteCacheMu.RUnlock()

	return SyncLiveStockQuotes(client)
}

func GetCachedStockQuotes() ([]model.StockQuote, bool) {
	quoteCacheMu.RLock()
	defer quoteCacheMu.RUnlock()

	if len(cachedQuotes) > 0 && time.Now().Before(cacheExpiry) {
		res := make([]model.StockQuote, len(cachedQuotes))
		copy(res, cachedQuotes)
		return res, true
	}
	return nil, false
}
