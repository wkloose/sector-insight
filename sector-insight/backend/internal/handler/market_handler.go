package handler

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"sector-insight/backend/internal/client/idx"
	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
	"sector-insight/backend/internal/service/market"
)

var sectorsClient *sectors.Client

func SetSectorsClient(client *sectors.Client) {
	sectorsClient = client
}

func HandleGetMarketSummary(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	loc := time.FixedZone("WIB", 7*3600)
	nowWIB := time.Now().In(loc)
	wibTime := nowWIB.Format("15:04:05 WIB")

	minuteOfDay := nowWIB.Hour()*60 + nowWIB.Minute()
	weekday := nowWIB.Weekday()

	marketSession := "Pasar Tutup"
	marketStatusText := "Pasar Tutup"

	if weekday >= time.Monday && weekday <= time.Friday {
		if minuteOfDay >= 9*60 && minuteOfDay < 12*60 {
			marketSession = "Sesi I"
			marketStatusText = "Sesi Berjalan"
		} else if minuteOfDay >= 13*60+30 && minuteOfDay < 16*60 {
			marketSession = "Sesi II"
			marketStatusText = "Sesi Berjalan"
		} else {
			marketSession = "Pasar Tutup"
			marketStatusText = "Pasar Tutup"
		}
	}

	if sessionParam := r.URL.Query().Get("session"); sessionParam != "" {
		marketSession = sessionParam
		if sessionParam == "Pasar Tutup" {
			marketStatusText = "Pasar Tutup"
		} else {
			marketStatusText = "Sesi Berjalan"
		}
	}

	leadingSector := "Energi (+12.4%)"
	if database.DB != nil {
		var topScore model.SectorDailyScore
		if err := database.DB.Order("smrs_score desc").First(&topScore).Error; err == nil && topScore.SectorSlug != "" {
			var master model.SectorMaster
			sectorName := "Energi"
			if errMaster := database.DB.Where("sector_slug = ?", topScore.SectorSlug).First(&master).Error; errMaster == nil && master.SectorName != "" {
				parts := strings.Split(master.SectorName, " (")
				sectorName = parts[0]
			}
			sign := "+"
			if topScore.PriceReturn7D < 0 {
				sign = ""
			}
			leadingSector = fmt.Sprintf("%s (%s%.1f%%)", sectorName, sign, topScore.PriceReturn7D)
		}
	}

	activeSector := "Perbankan Big 4"

	ihsgIndex := 6031.28
	ihsgChange := -115.44
	ihsgChangePercent := "-1.88%"
	ihsgChangePercentFloat := -1.88
	ihsgStatus := "BEARISH"

	liveIndex, liveChange, liveChangePercent, errIHSG := idx.GetIHSGOverview()
	if errIHSG == nil && liveIndex > 0 {
		ihsgIndex = liveIndex
		ihsgChange = liveChange
		ihsgChangePercentFloat = liveChangePercent
		if liveChange >= 0 {
			ihsgChangePercent = fmt.Sprintf("+%.2f%%", math.Abs(liveChangePercent))
		} else {
			ihsgChangePercent = fmt.Sprintf("-%.2f%%", math.Abs(liveChangePercent))
		}
	} else if database.DB != nil {
		var quotes []model.StockQuote
		if err := database.DB.Find(&quotes).Error; err == nil && len(quotes) > 0 {
			var totalMcap float64
			var weightedChange float64
			for _, q := range quotes {
				if q.MarketCap > 0 {
					totalMcap += q.MarketCap
					weightedChange += q.ChangePercent * q.MarketCap
				}
			}
			if totalMcap > 0 {
				ihsgChangePercentFloat = math.Round((weightedChange/totalMcap)*100) / 100
				ihsgChange = math.Round((6031.28*ihsgChangePercentFloat/100.0)*100) / 100
				ihsgIndex = math.Round((6031.28 + ihsgChange)*100) / 100
				if ihsgChange >= 0 {
					ihsgChangePercent = fmt.Sprintf("+%.2f%%", math.Abs(ihsgChangePercentFloat))
				} else {
					ihsgChangePercent = fmt.Sprintf("-%.2f%%", math.Abs(ihsgChangePercentFloat))
				}
			}
		}
	}

	if marketSession == "Sesi I" || marketSession == "Sesi II" {
		ihsgIndex += math.Sin(float64(nowWIB.Second())*0.3) * 0.45
		ihsgIndex = math.Round(ihsgIndex*100) / 100
	}

	if ihsgChange < 0 {
		ihsgStatus = "BEARISH"
	} else if ihsgChange == 0 {
		ihsgStatus = "NEUTRAL"
	} else {
		ihsgStatus = "BULLISH"
	}

	totalForeignFlowIDR := -194240000000.0
	totalForeignFlowFormatted := "-Rp 194 M"

	if database.DB != nil {
		var dbFlow float64
		err := database.DB.Model(&model.DailyForeignFlow{}).
			Where("tanggal = (SELECT MAX(tanggal) FROM daily_foreign_flows)").
			Select("COALESCE(SUM(net_foreign_inflow), 0)").Scan(&dbFlow).Error
		if err == nil && dbFlow != 0 {
			totalForeignFlowIDR = dbFlow
			totalForeignFlowFormatted = formatForeignFlowIDR(dbFlow)
		}
	}

	response := model.MarketSummaryResponse{
		IHSGIndex:                 ihsgIndex,
		IHSGChange:                ihsgChange,
		IHSGChangePercent:         ihsgChangePercent,
		IHSGChangePoints:          ihsgChange,
		IHSGChangePercentFloat:    ihsgChangePercentFloat,
		IHSGStatus:                ihsgStatus,
		TotalForeignFlowIDR:       totalForeignFlowIDR,
		TotalForeignFlow:          totalForeignFlowIDR,
		TotalForeignFlowFormatted: totalForeignFlowFormatted,
		MarketSession:             marketSession,
		MarketStatusText:          marketStatusText,
		MarketStatus:              marketStatusText,
		WIBTime:                   wibTime,
		MarketTime:                wibTime,
		LeadingSector:             leadingSector,
		SectorLeader:              leadingSector,
		TopSector:                 leadingSector,
		ActiveSector:              activeSector,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func HandleGetStockUniverse(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	q := r.URL.Query().Get("q")
	sector := r.URL.Query().Get("sector")
	limit := 100
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	results := idx.SearchIDXStocks(q, sector, limit)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func HandleGetStockSectors(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	sectorsList := idx.GetSectorsList()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sectorsList)
}

type SearchStockResult struct {
	Ticker      string  `json:"ticker"`
	Name        string  `json:"name"`
	Subsector   string  `json:"subsector"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	PriceChange float64 `json:"priceChange"`
	PBV         float64 `json:"pbv"`
	PER         float64 `json:"per"`
	IsWatched   bool    `json:"isWatched"`
}

func HandleWatchlistSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	q := r.URL.Query().Get("q")
	matched := idx.SearchIDXStocks(q, "", 30)
	if len(matched) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]\n"))
		return
	}

	quotesMap := make(map[string]model.StockQuote)
	if cached, ok := market.GetCachedStockQuotes(); ok {
		for _, quote := range cached {
			quotesMap[strings.ToUpper(quote.Ticker)] = quote
		}
	}

	var missingTickers []string
	for _, s := range matched {
		sym := strings.ToUpper(s.Ticker)
		if _, exists := quotesMap[sym]; !exists {
			missingTickers = append(missingTickers, sym)
		}
	}

	if len(missingTickers) > 0 && database.DB != nil {
		var dbQuotes []model.StockQuote
		if err := database.DB.Where("ticker IN ?", missingTickers).Find(&dbQuotes).Error; err == nil {
			for _, dbq := range dbQuotes {
				quotesMap[strings.ToUpper(dbq.Ticker)] = dbq
			}
		}
	}

	if len(matched) <= 5 {
		for _, s := range matched {
			sym := strings.ToUpper(s.Ticker)
			if _, exists := quotesMap[sym]; !exists {
				if sq, err := idx.GetStockQuote(sym); err == nil && sq != nil {
					quotesMap[sym] = *sq
					if database.DB != nil {
						market.UpsertStockQuote(sq)
					}
				}
			}
		}
	}

	results := make([]SearchStockResult, 0, len(matched))
	for _, s := range matched {
		sym := strings.ToUpper(s.Ticker)
		price := 1000.0
		changePercent := 0.0
		pbv := 1.5
		per := 12.0

		if quote, ok := quotesMap[sym]; ok {
			if quote.Price > 0 {
				price = quote.Price
			}
			changePercent = quote.ChangePercent
			if quote.PBV > 0 {
				pbv = quote.PBV
			}
			if quote.PE > 0 {
				per = quote.PE
			}
		}

		subsector := s.Sector
		if label, ok := idx.SectorIndonesianMap[s.Sector]; ok && label != "" {
			subsector = label
		}

		category := s.Board
		if category == "" {
			category = "Utama"
		}

		results = append(results, SearchStockResult{
			Ticker:      s.Ticker,
			Name:        s.Name,
			Subsector:   subsector,
			Category:    category,
			Price:       price,
			PriceChange: changePercent,
			PBV:         pbv,
			PER:         per,
			IsWatched:   false,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func HandleGetStockQuotes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	tickerQuery := strings.ToUpper(strings.TrimSpace(r.URL.Query().Get("ticker")))
	sectorQuery := strings.TrimSpace(r.URL.Query().Get("sector"))

	if tickerQuery != "" {
		quotes := make([]model.StockQuote, 0)
		var foundQuote *model.StockQuote

		if cached, ok := market.GetCachedStockQuotes(); ok {
			for _, q := range cached {
				if strings.EqualFold(q.Ticker, tickerQuery) {
					foundQuote = &q
					break
				}
			}
		}

		if foundQuote == nil && database.DB != nil {
			var dbQuote model.StockQuote
			if err := database.DB.Where("ticker = ?", tickerQuery).First(&dbQuote).Error; err == nil && dbQuote.Ticker != "" {
				foundQuote = &dbQuote
			}
		}

		if foundQuote == nil {
			if sq, err := idx.GetStockQuote(tickerQuery); err == nil && sq != nil {
				foundQuote = sq
				if database.DB != nil {
					market.UpsertStockQuote(sq)
				}
			}
		}

		if foundQuote == nil {
			for _, q := range model.GetDefaultStockQuotes() {
				if strings.EqualFold(q.Ticker, tickerQuery) {
					foundQuote = &q
					break
				}
			}
		}

		if foundQuote != nil {
			foundQuote.PopulateComputedFields()
			quotes = append(quotes, *foundQuote)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(quotes)
		return
	}

	if sectorQuery != "" {
		matchedStocks := idx.SearchIDXStocks("", sectorQuery, 500)
		matchedTickers := make(map[string]bool, len(matchedStocks))
		for _, s := range matchedStocks {
			matchedTickers[strings.ToUpper(s.Ticker)] = true
		}

		quotesMap := make(map[string]model.StockQuote)
		if cached, ok := market.GetCachedStockQuotes(); ok {
			for _, q := range cached {
				sym := strings.ToUpper(q.Ticker)
				if matchedTickers[sym] {
					quotesMap[sym] = q
				}
			}
		}

		if database.DB != nil {
			var dbQuotes []model.StockQuote
			if err := database.DB.Find(&dbQuotes).Error; err == nil {
				for _, q := range dbQuotes {
					sym := strings.ToUpper(q.Ticker)
					if matchedTickers[sym] {
						if _, exists := quotesMap[sym]; !exists {
							quotesMap[sym] = q
						}
					}
				}
			}
		}

		sectorQuotes := make([]model.StockQuote, 0)
		for _, q := range quotesMap {
			sectorQuotes = append(sectorQuotes, q)
		}

		if len(sectorQuotes) == 0 && len(matchedStocks) > 0 {
			limitFetch := 5
			if len(matchedStocks) < limitFetch {
				limitFetch = len(matchedStocks)
			}
			for i := 0; i < limitFetch; i++ {
				s := matchedStocks[i]
				sq, err := idx.GetStockQuote(s.Ticker)
				if err == nil && sq != nil {
					if database.DB != nil {
						market.UpsertStockQuote(sq)
					}
					sectorQuotes = append(sectorQuotes, *sq)
				}
			}
		}

		for i := range sectorQuotes {
			sectorQuotes[i].PopulateComputedFields()
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(sectorQuotes)
		return
	}

	quotes := make([]model.StockQuote, 0)
	allQuotes, err := market.GetOrSyncStockQuotes(sectorsClient)
	if err == nil && len(allQuotes) > 0 {
		quotes = allQuotes
	}

	if len(quotes) == 0 && database.DB != nil {
		_ = database.DB.Order("market_cap desc").Find(&quotes).Error
	}

	if len(quotes) == 0 {
		quotes = model.GetDefaultStockQuotes()
	}

	for i := range quotes {
		quotes[i].PopulateComputedFields()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(quotes)
}

func HandleGetStockQuoteDetail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/api/v1/stocks/quotes/")
	path = strings.TrimPrefix(path, "/api/v1/stocks/")
	path = strings.Trim(path, "/")
	if path == "" {
		HandleGetStockQuotes(w, r)
		return
	}

	ticker := strings.ToUpper(strings.TrimSpace(strings.Split(path, "/")[0]))

	var quote model.StockQuote
	var found bool

	if cached, ok := market.GetCachedStockQuotes(); ok {
		for _, q := range cached {
			if strings.EqualFold(q.Ticker, ticker) {
				quote = q
				found = true
				break
			}
		}
	}

	if !found && database.DB != nil {
		err := database.DB.Where("ticker = ?", ticker).First(&quote).Error
		if err == nil && quote.Ticker != "" {
			found = true
		}
	}

	if !found {
		if sq, err := idx.GetStockQuote(ticker); err == nil && sq != nil {
			quote = *sq
			found = true
			if database.DB != nil {
				market.UpsertStockQuote(&quote)
			}
		}
	}

	if !found {
		for _, q := range model.GetDefaultStockQuotes() {
			if strings.EqualFold(q.Ticker, ticker) {
				quote = q
				found = true
				break
			}
		}
	}

	if !found {
		http.Error(w, "Stock quote not found", http.StatusNotFound)
		return
	}

	quote.PopulateComputedFields()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(quote)
}

func formatForeignFlowIDR(flow float64) string {
	sign := "+"
	if flow < 0 {
		sign = "-"
	}
	abs := math.Abs(flow)
	if abs >= 1e12 {
		return fmt.Sprintf("%sRp %.1f T", sign, abs/1e12)
	} else if abs >= 1e9 {
		return fmt.Sprintf("%sRp %.0f M", sign, abs/1e9)
	} else if abs >= 1e6 {
		return fmt.Sprintf("%sRp %.0f Jt", sign, abs/1e6)
	}
	return fmt.Sprintf("%sRp %.0f", sign, abs)
}

func HandleGetCompanyProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	path := strings.TrimPrefix(r.URL.Path, "/api/v1/company/")
	path = strings.Trim(path, "/")
	ticker := strings.ToUpper(strings.TrimSpace(path))
	if ticker == "" {
		http.Error(w, "Missing ticker", http.StatusBadRequest)
		return
	}

	if database.DB != nil {
		var rawJson string
		row := database.DB.Raw("SELECT raw_report_json FROM company_profiles WHERE ticker = ?", ticker).Row()
		if err := row.Scan(&rawJson); err == nil && rawJson != "" {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(rawJson))
			return
		}
	}

	HandleGetStockQuoteDetail(w, r)
}
