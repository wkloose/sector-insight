package idx

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

//go:embed idx_stocks.json
var idxStocksJSON []byte

type IDXStockInfo struct {
	Ticker string `json:"ticker"`
	Name   string `json:"name"`
	Sector string `json:"sector"`
	Board  string `json:"board"`
}

var (
	AllIDXStocks      []IDXStockInfo
	StockInfoByTicker map[string]IDXStockInfo
	stocksInitOnce    sync.Once
)

func init() {
	stocksInitOnce.Do(func() {
		StockInfoByTicker = make(map[string]IDXStockInfo)
		if len(idxStocksJSON) > 0 {
			var list []IDXStockInfo
			if err := json.Unmarshal(idxStocksJSON, &list); err == nil {
				AllIDXStocks = list
				for _, s := range list {
					StockInfoByTicker[s.Ticker] = s
				}
			}
		}
	})
}

var TopMarketMovers = []string{
	// Financials
	"BBCA", "BBRI", "BMRI", "BBNI", "BRIS",
	// Energy
	"ADRO", "PTBA", "PGAS", "MEDC", "AKRA",
	// Consumer Non-Cyclicals
	"ICBP", "INDF", "UNVR", "MYOR", "AMRT",
	// Consumer Cyclicals
	"ACES", "MAPI", "ERAA", "AUTO", "MAPA",
	// Basic Materials
	"ANTM", "INCO", "MDKA", "BRPT", "TPIA",
	// Infrastructures
	"TLKM", "ISAT", "EXCL", "JSMR", "TOWR",
	// Industrials
	"ASII", "UNTR", "HEXA", "IMPC", "BNBR",
	// Technology
	"GOTO", "BUKA", "EMTK", "DCII", "MTDL",
	// Healthcare
	"KLBF", "MIKA", "SILO", "SIDO", "HEAL",
	// Properties & Real Estate
	"CTRA", "BSDE", "PWON", "SMRA", "PANI",
	// Transportation & Logistic
	"BIRD", "SMDR", "TMAS", "ASSA", "GIAA",
}

var SectorIndonesianMap = map[string]string{
	"Consumer Non-Cyclicals":     "Barang Konsumen Primer",
	"Consumer Cyclicals":         "Barang Konsumen Non-Primer",
	"Financials":                 "Keuangan & Perbankan",
	"Energy":                     "Energi",
	"Infrastructure":             "Infrastruktur & Telekomunikasi",
	"Infrastructures":            "Infrastruktur & Telekomunikasi",
	"Properties & Real Estate":   "Properti & Real Estat",
	"Basic Materials":            "Barang Baku",
	"Industrials":                "Perindustrian",
	"Technology":                 "Teknologi",
	"Healthcare":                 "Kesehatan",
	"Transportation & Logistics": "Transportasi & Logistik",
	"Transportation & Logistic":  "Transportasi & Logistik",
}

var IDXBankingTickers = []string{
	"BBCA", "BBRI", "BMRI", "BBNI", "BRIS", "BBTN", "BNGA", "BDMN", "BJBR", "BJTM",
	"ARTO", "PNBN", "AGRO", "AGRS", "AMAR", "BABP", "BACA", "BANK", "BBHI", "BBKP",
	"BBMD", "BBSI", "BBYB", "BCIC", "BEKS", "BGTG", "BINA", "BKSW", "BMAS", "BNBA",
	"BNII", "BNLI", "BSIM", "BSWD", "BTPN", "BTPS", "BVIC", "DNAR", "INPC", "MASB",
	"MAYA", "MCOR", "MEGA", "NISP", "NOBU", "PNBS", "SDRA", "SUPA",
}

var DefaultBankNames = map[string]string{
	"BBCA": "PT Bank Central Asia Tbk",
	"BBRI": "PT Bank Rakyat Indonesia (Persero) Tbk",
	"BMRI": "PT Bank Mandiri (Persero) Tbk",
	"BBNI": "PT Bank Negara Indonesia (Persero) Tbk",
	"BRIS": "PT Bank Syariah Indonesia Tbk",
	"BBTN": "PT Bank Tabungan Negara (Persero) Tbk",
	"BNGA": "PT Bank CIMB Niaga Tbk",
	"BDMN": "PT Bank Danamon Indonesia Tbk",
	"BJBR": "Bank Pembangunan Daerah Jawa Barat dan Banten Tbk",
	"BJTM": "Bank Pembangunan Daerah Jawa Timur Tbk",
	"ARTO": "PT Bank Jago Tbk",
	"PNBN": "Bank Pan Indonesia Tbk",
}

func GetStockQuote(ticker string) (*model.StockQuote, error) {
	cleanTicker := strings.ToUpper(strings.TrimSpace(ticker))
	cleanTicker = strings.TrimSuffix(cleanTicker, ".JK")
	if cleanTicker == "" {
		return nil, fmt.Errorf("empty ticker")
	}

	initStocks()
	sector := ""
	name := ""
	var exists bool
	if info, ok := StockInfoByTicker[cleanTicker]; ok {
		exists = true
		if info.Name != "" {
			name = info.Name
		}
		sector = info.Sector
	}
	if name == "" {
		if def, ok := DefaultBankNames[cleanTicker]; ok {
			exists = true
			name = def
			if sector == "" {
				sector = "Financials"
			}
		}
	}

	now := time.Now()
	if database.DB != nil {
		var q model.StockQuote
		if err := database.DB.Where("ticker = ?", cleanTicker).First(&q).Error; err == nil && q.Price > 0 {
			if q.Name == "" {
				q.Name = name
			}
			if q.Sector == "" {
				q.Sector = sector
			}
			return &q, nil
		}
	}

	if !exists {
		return nil, fmt.Errorf("stock %s not found in IDX universe", cleanTicker)
	}

	basePrice := 1500.0
	switch cleanTicker {
	case "BBCA":
		basePrice = 6050
	case "BBRI":
		basePrice = 3140
	case "BMRI":
		basePrice = 4110
	case "BBNI":
		basePrice = 5250
	case "BRIS":
		basePrice = 2850
	case "ADRO":
		basePrice = 3680
	case "PTBA":
		basePrice = 2640
	case "TLKM":
		basePrice = 2780
	case "ASII":
		basePrice = 4920
	case "ANTM":
		basePrice = 1530
	case "GOTO":
		basePrice = 68
	}

	quote := &model.StockQuote{
		Ticker:          cleanTicker,
		Name:            name,
		Sector:          sector,
		Price:           basePrice,
		Change:          15.0,
		ChangePercent:   0.85,
		Volume:          15000000,
		High52w:         basePrice * 1.25,
		Low52w:          basePrice * 0.75,
		Status:          "Stabil",
		Coverage:        15,
		AnalystCoverage: 15,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	return quote, nil
}

func GetIHSGOverview() (index float64, change float64, changePercent float64, err error) {
	return 7324.50, 35.20, 0.48, nil
}

func GetAllBankingQuotes(tickers []string) ([]model.StockQuote, error) {
	if len(tickers) == 0 {
		tickers = TopMarketMovers
	}

	quotes := make([]model.StockQuote, 0, len(tickers))
	for _, tk := range tickers {
		if q, err := GetStockQuote(tk); err == nil && q != nil {
			quotes = append(quotes, *q)
		}
	}
	return quotes, nil
}

func initStocks() {
	if len(AllIDXStocks) == 0 && len(idxStocksJSON) > 0 {
		var list []IDXStockInfo
		if err := json.Unmarshal(idxStocksJSON, &list); err == nil {
			AllIDXStocks = list
			if StockInfoByTicker == nil {
				StockInfoByTicker = make(map[string]IDXStockInfo)
			}
			for _, s := range list {
				StockInfoByTicker[s.Ticker] = s
			}
		}
	}
}

func GetAllIDXStocks() []IDXStockInfo {
	initStocks()
	return AllIDXStocks
}

func GetIDXStockInfo(ticker string) (IDXStockInfo, bool) {
	initStocks()
	info, ok := StockInfoByTicker[strings.ToUpper(strings.TrimSpace(ticker))]
	return info, ok
}

func SearchIDXStocks(query, sector string, limit int) []IDXStockInfo {
	initStocks()
	q := strings.ToUpper(strings.TrimSpace(query))
	sec := strings.ToLower(strings.TrimSpace(sector))

	if limit <= 0 {
		limit = 50
	}

	results := make([]IDXStockInfo, 0, limit)
	for _, s := range AllIDXStocks {
		if sec != "" {
			secMatch := strings.Contains(strings.ToLower(s.Sector), sec)
			if !secMatch {
				if indLabel, ok := SectorIndonesianMap[s.Sector]; ok {
					secMatch = strings.Contains(strings.ToLower(indLabel), sec)
				}
			}
			if !secMatch {
				continue
			}
		}
		if q != "" {
			tickerMatch := strings.Contains(strings.ToUpper(s.Ticker), q)
			nameMatch := strings.Contains(strings.ToUpper(s.Name), q)
			if !tickerMatch && !nameMatch {
				continue
			}
		}
		results = append(results, s)
		if len(results) >= limit {
			break
		}
	}
	return results
}

func GetSectorsList() []map[string]interface{} {
	initStocks()
	counts := make(map[string]int)
	for _, s := range AllIDXStocks {
		sec := strings.TrimSpace(s.Sector)
		counts[sec]++
	}

	sectorsMeta := []struct {
		name    string
		labelID string
	}{
		{"Consumer Non-Cyclicals", "Barang Konsumen Primer"},
		{"Consumer Cyclicals", "Barang Konsumen Non-Primer"},
		{"Financials", "Keuangan & Perbankan"},
		{"Energy", "Energi"},
		{"Infrastructure", "Infrastruktur & Telekomunikasi"},
		{"Properties & Real Estate", "Properti & Real Estat"},
		{"Basic Materials", "Barang Baku"},
		{"Industrials", "Perindustrian"},
		{"Technology", "Teknologi"},
		{"Healthcare", "Kesehatan"},
		{"Transportation & Logistics", "Transportasi & Logistik"},
	}

	result := make([]map[string]interface{}, 0, len(sectorsMeta))
	for _, m := range sectorsMeta {
		c := counts[m.name]
		result = append(result, map[string]interface{}{
			"name":        m.name,
			"sector":      m.name,
			"label":       m.labelID,
			"label_id":    m.labelID,
			"count":       c,
			"stock_count": c,
		})
	}
	return result
}
