package database

import (
	"os"
	"testing"

	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/model"
)

func TestInitDBWithStockQuotes(t *testing.T) {
	testDB := "test_database_stock_quotes.db"
	t.Setenv("SQLITE_PATH", testDB)
	t.Cleanup(func() {
		os.Remove(testDB)
	})

	cfg := config.LoadConfig()
	db, err := InitDB(cfg)
	if err != nil {
		t.Fatalf("InitDB failed: %v", err)
	}

	var count int64
	if err := db.Model(&model.StockQuote{}).Count(&count).Error; err != nil {
		t.Fatalf("failed to query stock_quotes table: %v", err)
	}

	if count != 10 {
		t.Fatalf("expected 10 stock quotes, got %d", count)
	}

	var bbca model.StockQuote
	if err := db.Where("ticker = ?", "BBCA").First(&bbca).Error; err != nil {
		t.Fatalf("failed to find BBCA quote: %v", err)
	}

	if bbca.Price != 10250 {
		t.Errorf("expected BBCA price 10250, got %f", bbca.Price)
	}
	if bbca.ChangePercent != 1.23 {
		t.Errorf("expected BBCA change_percent 1.23, got %f", bbca.ChangePercent)
	}
	if bbca.Coverage != 28 {
		t.Errorf("expected BBCA coverage 28, got %d", bbca.Coverage)
	}
	if bbca.MarketCap != 1263000000000000 {
		t.Errorf("expected BBCA market_cap 1263000000000000, got %f", bbca.MarketCap)
	}
	if bbca.PE != 21.4 {
		t.Errorf("expected BBCA pe 21.4, got %f", bbca.PE)
	}
	if bbca.PBV != 4.6 {
		t.Errorf("expected BBCA pbv 4.6, got %f", bbca.PBV)
	}

	bbca.PopulateComputedFields()
	if bbca.AnalystCoverage != 28 {
		t.Errorf("expected BBCA analyst_coverage 28, got %d", bbca.AnalystCoverage)
	}
	if bbca.Change == 0 {
		t.Errorf("expected BBCA change to be non-zero")
	}
}
