package foreignflow

import (
	"math"
	"testing"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func setupTestDB(t *testing.T) {
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
}

func TestGetMarketForeignFlowSummary(t *testing.T) {
	setupTestDB(t)

	summary, err := GetMarketForeignFlowSummary()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if summary.TotalNetFlowToday != 571000000000 {
		t.Errorf("expected TotalNetFlowToday 571000000000, got %f", summary.TotalNetFlowToday)
	}

	if len(summary.SectorBreakdown) != 11 {
		t.Errorf("expected 11 sectors breakdown, got %d", len(summary.SectorBreakdown))
	}

	if len(summary.History30D) != 30 {
		t.Errorf("expected 30 history points, got %d", len(summary.History30D))
	}

	if len(summary.TopAccumulated) != 5 {
		t.Errorf("expected 5 top accumulated stocks, got %d", len(summary.TopAccumulated))
	}

	if len(summary.TopDistributed) != 5 {
		t.Errorf("expected 5 top distributed stocks, got %d", len(summary.TopDistributed))
	}

	if summary.TopAccumulated[0].Ticker != "BBCA" {
		t.Errorf("expected first accumulated stock BBCA, got %s", summary.TopAccumulated[0].Ticker)
	}

	if summary.TopDistributed[0].Ticker != "BBRI" {
		t.Errorf("expected first distributed stock BBRI, got %s", summary.TopDistributed[0].Ticker)
	}
}

func TestGetStockForeignFlows(t *testing.T) {
	setupTestDB(t)

	flows := GetStockForeignFlows("", "", "", 50)
	if len(flows) == 0 {
		t.Fatalf("expected non-empty stock flows")
	}

	// Test search
	bbcaFlows := GetStockForeignFlows("BBCA", "", "", 10)
	if len(bbcaFlows) == 0 || bbcaFlows[0].Ticker != "BBCA" {
		t.Errorf("expected search BBCA to return BBCA, got %+v", bbcaFlows)
	}

	// Test sector filter
	energyFlows := GetStockForeignFlows("", "energy", "", 50)
	for _, f := range energyFlows {
		if f.Sector != "Energy" {
			t.Errorf("expected Energy sector, got %s", f.Sector)
		}
	}

	// Test inflow filter
	inflows := GetStockForeignFlows("", "", "inflow", 30)
	for _, f := range inflows {
		if f.NetForeignFlow <= 0 {
			t.Errorf("expected positive net flow for inflow filter, got %f", f.NetForeignFlow)
		}
	}

	// Test outflow filter
	outflows := GetStockForeignFlows("", "", "outflow", 30)
	for _, f := range outflows {
		if f.NetForeignFlow >= 0 {
			t.Errorf("expected negative net flow for outflow filter, got %f", f.NetForeignFlow)
		}
	}

	// Test anomaly filter
	anomalies := GetStockForeignFlows("", "", "anomaly", 30)
	for _, f := range anomalies {
		if math.Abs(f.ZScore) < 2.0 && f.AnomalyStatus == "NORMAL" {
			t.Errorf("expected anomaly ZScore >= 2.0 or status anomaly, got Z=%f, status=%s", f.ZScore, f.AnomalyStatus)
		}
	}
}

func TestEnsureStockForeignFlowHistory(t *testing.T) {
	setupTestDB(t)

	err := EnsureStockForeignFlowHistory("TLKM")
	if err != nil {
		t.Fatalf("EnsureStockForeignFlowHistory failed: %v", err)
	}

	var count int64
	database.DB.Model(&model.DailyForeignFlow{}).Where("ticker = ?", "TLKM").Count(&count)
	if count != 90 {
		t.Errorf("expected 90 daily flows for TLKM, got %d", count)
	}

	var anomCount int64
	database.DB.Model(&model.ForeignFlowAnomaly{}).Where("ticker = ?", "TLKM").Count(&anomCount)
	if anomCount == 0 {
		t.Errorf("expected at least 1 anomaly generated for TLKM")
	}

	var brokerCount int64
	database.DB.Model(&model.AnomalyBrokerDetail{}).Count(&brokerCount)
	if brokerCount == 0 {
		t.Errorf("expected broker details to be inserted for anomalies")
	}

	// Calling again should be idempotent (no duplicates added)
	err = EnsureStockForeignFlowHistory("TLKM")
	if err != nil {
		t.Fatalf("idempotent EnsureStockForeignFlowHistory failed: %v", err)
	}
	var count2 int64
	database.DB.Model(&model.DailyForeignFlow{}).Where("ticker = ?", "TLKM").Count(&count2)
	if count2 != 90 {
		t.Errorf("expected still 90 daily flows on second call, got %d", count2)
	}
}
