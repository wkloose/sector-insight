package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
	"sector-insight/backend/internal/service/foreignflow"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func setupHandlerTestDB(t *testing.T) func() {
	origDB := database.DB
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		t.Fatalf("failed to open sqlite in-memory db: %v", err)
	}

	err = db.AutoMigrate(
		&model.DailyForeignFlow{},
		&model.ForeignFlowAnomaly{},
		&model.AnomalyBrokerDetail{},
		&model.SectorDailyScore{},
		&model.StockQuote{},
	)
	if err != nil {
		t.Fatalf("failed to auto migrate: %v", err)
	}

	database.DB = db
	return func() {
		database.DB = origDB
	}
}

func TestHandleGetMarketForeignFlow(t *testing.T) {
	cleanup := setupHandlerTestDB(t)
	defer cleanup()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/foreign-flow/market", nil)
	rr := httptest.NewRecorder()

	HandleGetMarketForeignFlow(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var summary foreignflow.MarketForeignFlowSummary
	if err := json.Unmarshal(rr.Body.Bytes(), &summary); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if summary.TotalNetFlowToday <= 0 {
		t.Errorf("expected positive total net flow today, got %f", summary.TotalNetFlowToday)
	}
	if len(summary.SectorBreakdown) != 11 {
		t.Errorf("expected 11 sectors, got %d", len(summary.SectorBreakdown))
	}
}

func TestHandleGetAllStockForeignFlows(t *testing.T) {
	cleanup := setupHandlerTestDB(t)
	defer cleanup()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/foreign-flow/stocks?q=BBCA&limit=10", nil)
	rr := httptest.NewRecorder()

	HandleGetAllStockForeignFlows(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var items []foreignflow.StockForeignFlowItem
	if err := json.Unmarshal(rr.Body.Bytes(), &items); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if len(items) == 0 {
		t.Fatalf("expected results for BBCA")
	}
	if items[0].Ticker != "BBCA" {
		t.Errorf("expected first ticker BBCA, got %s", items[0].Ticker)
	}
}

func TestHandleGetForeignFlowHistoryWithEnsure(t *testing.T) {
	cleanup := setupHandlerTestDB(t)
	defer cleanup()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/foreign-flow/ISAT", nil)
	rr := httptest.NewRecorder()

	HandleGetForeignFlowHistory(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var flows []model.DailyForeignFlow
	if err := json.Unmarshal(rr.Body.Bytes(), &flows); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if len(flows) != 90 {
		t.Errorf("expected 90 flow records for ISAT, got %d", len(flows))
	}
}

func TestHandleGetForeignFlowAnomaliesWithEnsure(t *testing.T) {
	cleanup := setupHandlerTestDB(t)
	defer cleanup()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/foreign-flow/ISAT/anomalies", nil)
	rr := httptest.NewRecorder()

	HandleGetForeignFlowAnomalies(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var anomalies []model.ForeignFlowAnomaly
	if err := json.Unmarshal(rr.Body.Bytes(), &anomalies); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if len(anomalies) == 0 {
		t.Errorf("expected anomalies for ISAT")
	}
}
