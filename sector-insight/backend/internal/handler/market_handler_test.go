package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"

	"sector-insight/backend/internal/client/idx"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func TestHandleGetMarketSummary(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/market/summary", nil)
	rr := httptest.NewRecorder()

	HandleGetMarketSummary(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var resp model.MarketSummaryResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if resp.IHSGIndex <= 0 {
		t.Errorf("expected positive ihsg_index, got %f", resp.IHSGIndex)
	}
	if resp.IHSGChangePercent == "" {
		t.Errorf("expected non-empty ihsg_change_percent")
	}
	if resp.IHSGStatus == "" {
		t.Errorf("expected non-empty ihsg_status")
	}
	if resp.TotalForeignFlowIDR != 210000000000 {
		t.Errorf("expected total_foreign_flow_idr 210000000000, got %f", resp.TotalForeignFlowIDR)
	}
	if resp.TotalForeignFlowFormatted != "+Rp 210 M" {
		t.Errorf("expected total_foreign_flow_formatted '+Rp 210 M', got %s", resp.TotalForeignFlowFormatted)
	}
	if resp.ActiveSector != "Perbankan Big 4" {
		t.Errorf("expected active_sector 'Perbankan Big 4', got %s", resp.ActiveSector)
	}
	if resp.LeadingSector == "" {
		t.Errorf("expected leading_sector to be non-empty")
	}
	if resp.MarketSession == "" {
		t.Errorf("expected market_session to be non-empty")
	}
	if resp.MarketStatusText == "" {
		t.Errorf("expected market_status_text to be non-empty")
	}
	if resp.WIBTime == "" {
		t.Errorf("expected wib_time to be non-empty")
	}
}

func TestHandleGetMarketSummarySessions(t *testing.T) {
	testCases := []struct {
		session        string
		expectedStatus string
	}{
		{"Sesi I", "Sesi Berjalan"},
		{"Sesi II", "Sesi Berjalan"},
		{"Pasar Tutup", "Pasar Tutup"},
	}

	for _, tc := range testCases {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/market/summary?session="+url.QueryEscape(tc.session), nil)
		rr := httptest.NewRecorder()

		HandleGetMarketSummary(rr, req)

		var resp model.MarketSummaryResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("failed to decode JSON: %v", err)
		}

		if resp.MarketSession != tc.session {
			t.Errorf("expected session %s, got %s", tc.session, resp.MarketSession)
		}
		if resp.MarketStatusText != tc.expectedStatus {
			t.Errorf("expected status %s, got %s", tc.expectedStatus, resp.MarketStatusText)
		}
	}
}

func TestHandleGetStockQuotes(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes", nil)
	rr := httptest.NewRecorder()

	HandleGetStockQuotes(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var quotes []model.StockQuote
	if err := json.Unmarshal(rr.Body.Bytes(), &quotes); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if len(quotes) < 10 {
		t.Fatalf("expected at least 10 quotes, got %d", len(quotes))
	}

	tickerMap := make(map[string]model.StockQuote)
	for _, q := range quotes {
		tickerMap[q.Ticker] = q
	}

	defaultQuotes := model.GetDefaultStockQuotes()
	for _, exp := range defaultQuotes {
		q, ok := tickerMap[exp.Ticker]
		if !ok {
			t.Errorf("ticker %s missing from quotes", exp.Ticker)
			continue
		}
		if q.Price <= 0 {
			t.Errorf("%s: expected positive price, got %f", exp.Ticker, q.Price)
		}
		if q.Coverage <= 0 {
			t.Errorf("%s: expected positive coverage, got %d", exp.Ticker, q.Coverage)
		}
	}
}

func TestHandleGetStockQuoteDetail(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes/BBCA", nil)
	rr := httptest.NewRecorder()

	HandleGetStockQuoteDetail(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var quote model.StockQuote
	if err := json.Unmarshal(rr.Body.Bytes(), &quote); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if quote.Ticker != "BBCA" {
		t.Errorf("expected ticker 'BBCA', got %s", quote.Ticker)
	}
	if quote.Price <= 0 {
		t.Errorf("expected positive price, got %f", quote.Price)
	}
}

func TestHandleGetStockQuoteDetailNotFound(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes/UNKNOWN", nil)
	rr := httptest.NewRecorder()

	HandleGetStockQuoteDetail(rr, req)

	if rr.Code != http.StatusNotFound {
		t.Fatalf("expected status 404, got %d", rr.Code)
	}
}

func TestRouterRoutesAndCORS(t *testing.T) {
	router := SetupRouter(&config.Config{}, nil, nil)

	routesToTest := []string{
		"/api/v1/market/summary",
		"/api/v1/stocks/quotes",
		"/api/v1/stocks/quotes/BBCA",
		"/api/v1/stocks/universe",
		"/api/v1/stocks/sectors",
		"/api/v1/stocks/search",
		"/api/v1/watchlist/search",
	}

	for _, route := range routesToTest {
		req := httptest.NewRequest(http.MethodGet, route, nil)
		rr := httptest.NewRecorder()
		router.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("route %s: expected 200, got %d", route, rr.Code)
		}

		if origin := rr.Header().Get("Access-Control-Allow-Origin"); origin != "*" {
			t.Errorf("route %s: expected Access-Control-Allow-Origin '*', got '%s'", route, origin)
		}
	}

	optionsReq := httptest.NewRequest(http.MethodOptions, "/api/v1/market/summary", nil)
	optionsRR := httptest.NewRecorder()
	router.ServeHTTP(optionsRR, optionsReq)

	if optionsRR.Code != http.StatusOK {
		t.Errorf("expected 200 for OPTIONS preflight, got %d", optionsRR.Code)
	}
	if origin := optionsRR.Header().Get("Access-Control-Allow-Origin"); origin != "*" {
		t.Errorf("OPTIONS: expected Access-Control-Allow-Origin '*', got '%s'", origin)
	}
}

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		t.Fatalf("failed to open in-memory sqlite: %v", err)
	}

	err = db.AutoMigrate(
		&model.StockQuote{},
		&model.SectorMaster{},
		&model.SectorDailyScore{},
		&model.DailyForeignFlow{},
	)
	if err != nil {
		t.Fatalf("failed to auto migrate: %v", err)
	}

	quotes := model.GetDefaultStockQuotes()
	db.Create(&quotes)

	sectors := []model.SectorMaster{
		{SectorSlug: "energy", SectorName: "Energi (Energy)"},
		{SectorSlug: "financials", SectorName: "Keuangan (Financials)"},
	}
	db.Create(&sectors)

	scores := []model.SectorDailyScore{
		{SectorSlug: "energy", Tanggal: time.Now(), SMRSScore: 84.6, PriceReturn7D: 12.4},
		{SectorSlug: "financials", Tanggal: time.Now(), SMRSScore: 76.2, PriceReturn7D: 4.8},
	}
	db.Create(&scores)

	prevDB := database.DB
	database.DB = db
	t.Cleanup(func() {
		database.DB = prevDB
	})

	return db
}

func TestHandleGetMarketSummaryWithDB(t *testing.T) {
	setupTestDB(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/market/summary", nil)
	rr := httptest.NewRecorder()

	HandleGetMarketSummary(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var resp model.MarketSummaryResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if resp.LeadingSector != "Energi (+12.4%)" {
		t.Errorf("expected leading_sector 'Energi (+12.4%%)', got '%s'", resp.LeadingSector)
	}
	if resp.ActiveSector != "Perbankan Big 4" {
		t.Errorf("expected active_sector 'Perbankan Big 4', got '%s'", resp.ActiveSector)
	}
	if resp.MarketStatus != resp.MarketStatusText {
		t.Errorf("expected market_status to match market_status_text")
	}
	if resp.MarketTime != resp.WIBTime {
		t.Errorf("expected market_time to match wib_time")
	}
	if resp.TotalForeignFlow != resp.TotalForeignFlowIDR {
		t.Errorf("expected total_foreign_flow to match total_foreign_flow_idr")
	}
}

func TestHandleGetStockQuotesWithDB(t *testing.T) {
	setupTestDB(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes", nil)
	rr := httptest.NewRecorder()

	HandleGetStockQuotes(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var quotes []model.StockQuote
	if err := json.Unmarshal(rr.Body.Bytes(), &quotes); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if len(quotes) < 10 {
		t.Fatalf("expected at least 10 quotes from DB, got %d", len(quotes))
	}

	if quotes[0].Ticker != "BBCA" {
		t.Errorf("expected first quote to be BBCA (largest market cap), got %s", quotes[0].Ticker)
	}
	if quotes[0].AnalystCoverage <= 0 {
		t.Errorf("expected BBCA positive analyst_coverage, got %d", quotes[0].AnalystCoverage)
	}
	if quotes[0].Price <= 0 {
		t.Errorf("expected BBCA positive price, got %f", quotes[0].Price)
	}
}

func TestHandleGetStockQuotesFilterWithDB(t *testing.T) {
	setupTestDB(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes?ticker=BMRI", nil)
	rr := httptest.NewRecorder()
	HandleGetStockQuotes(rr, req)

	var quotes []model.StockQuote
	if err := json.Unmarshal(rr.Body.Bytes(), &quotes); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}
	if len(quotes) != 1 {
		t.Fatalf("expected 1 quote for BMRI, got %d", len(quotes))
	}
	if quotes[0].Ticker != "BMRI" || quotes[0].Price <= 0 {
		t.Errorf("unexpected quote data for BMRI: %+v", quotes[0])
	}

	reqEmpty := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes?ticker=NONEXISTENT", nil)
	rrEmpty := httptest.NewRecorder()
	HandleGetStockQuotes(rrEmpty, reqEmpty)

	if rrEmpty.Body.String() == "null\n" {
		t.Errorf("expected empty array '[]', got 'null'")
	}
	var emptyQuotes []model.StockQuote
	if err := json.Unmarshal(rrEmpty.Body.Bytes(), &emptyQuotes); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}
	if len(emptyQuotes) != 0 {
		t.Errorf("expected 0 quotes, got %d", len(emptyQuotes))
	}
}

func TestHandleGetStockQuoteDetailWithDB(t *testing.T) {
	setupTestDB(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes/BMRI", nil)
	rr := httptest.NewRecorder()
	HandleGetStockQuoteDetail(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var quote model.StockQuote
	if err := json.Unmarshal(rr.Body.Bytes(), &quote); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}
	if quote.Ticker != "BMRI" || quote.Price <= 0 {
		t.Errorf("unexpected quote: %+v", quote)
	}
	if quote.AnalystCoverage <= 0 {
		t.Errorf("expected positive analyst_coverage, got %d", quote.AnalystCoverage)
	}

	req404 := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes/UNKNOWN_BANK", nil)
	rr404 := httptest.NewRecorder()
	HandleGetStockQuoteDetail(rr404, req404)
	if rr404.Code != http.StatusNotFound {
		t.Errorf("expected 404 for unknown ticker, got %d", rr404.Code)
	}
}

func TestMethodsNotAllowed(t *testing.T) {
	endpoints := []struct {
		path    string
		handler http.HandlerFunc
	}{
		{"/api/v1/market/summary", HandleGetMarketSummary},
		{"/api/v1/stocks/quotes", HandleGetStockQuotes},
		{"/api/v1/stocks/quotes/BBCA", HandleGetStockQuoteDetail},
	}

	for _, ep := range endpoints {
		req := httptest.NewRequest(http.MethodPost, ep.path, nil)
		rr := httptest.NewRecorder()
		ep.handler(rr, req)
		if rr.Code != http.StatusMethodNotAllowed {
			t.Errorf("%s: expected 405 Method Not Allowed, got %d", ep.path, rr.Code)
		}
	}
}

func TestHandleGetStockUniverse(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/universe?limit=10", nil)
	rr := httptest.NewRecorder()
	HandleGetStockUniverse(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var results []idx.IDXStockInfo
	if err := json.Unmarshal(rr.Body.Bytes(), &results); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if len(results) != 10 {
		t.Fatalf("expected 10 items, got %d", len(results))
	}
}

func TestHandleGetStockSectors(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/sectors", nil)
	rr := httptest.NewRecorder()
	HandleGetStockSectors(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var sectors []map[string]interface{}
	if err := json.Unmarshal(rr.Body.Bytes(), &sectors); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if len(sectors) != 11 {
		t.Fatalf("expected 11 sectors, got %d", len(sectors))
	}

	for _, s := range sectors {
		if s["name"] == "" || s["label"] == "" {
			t.Errorf("expected sector name and label, got %+v", s)
		}
	}
}

func TestHandleWatchlistSearch(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/watchlist/search?q=TLKM", nil)
	rr := httptest.NewRecorder()
	HandleWatchlistSearch(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var results []SearchStockResult
	if err := json.Unmarshal(rr.Body.Bytes(), &results); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if len(results) == 0 {
		t.Fatalf("expected at least 1 search result for TLKM")
	}

	found := false
	for _, r := range results {
		if r.Ticker == "TLKM" {
			found = true
			if r.Name == "" || r.Subsector == "" {
				t.Errorf("incomplete data for TLKM: %+v", r)
			}
		}
	}
	if !found {
		t.Errorf("expected TLKM in search results")
	}
}

func TestHandleGetStockQuotesSectorFilter(t *testing.T) {
	setupTestDB(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/stocks/quotes?sector=Financials", nil)
	rr := httptest.NewRecorder()
	HandleGetStockQuotes(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var quotes []model.StockQuote
	if err := json.Unmarshal(rr.Body.Bytes(), &quotes); err != nil {
		t.Fatalf("failed to decode JSON: %v", err)
	}

	if len(quotes) == 0 {
		t.Fatalf("expected at least 1 quote for Financials sector")
	}
}

