package main

import (
	"fmt"
	"log"

	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/service/market"
)

func main() {
	fmt.Println("================================================================")
	fmt.Println("  TESTING LIVE SECTORS API v2 (Client & Quote Sync)")
	fmt.Println("================================================================")

	cfg := config.LoadConfig()

	if cfg.SectorsAPIKey == "" || cfg.SectorsAPIKey == "your_sectors_api_key_here" {
		log.Println("[WARNING] SECTORS_API_KEY belum diisi di backend/.env!")
		return
	}

	client := sectors.NewClient(cfg.SectorsBaseURL, cfg.SectorsAPIKey)

	fmt.Println("\n[1] Testing FetchBankingCompanies()...")
	comps, err := client.FetchBankingCompanies()
	if err != nil {
		fmt.Printf("FetchBankingCompanies error: %v\n", err)
	} else {
		fmt.Printf("Retrieved %d banking companies.\n", len(comps))
		for i, c := range comps {
			if i < 5 {
				fmt.Printf("  - %s: %s\n", c.Symbol, c.CompanyName)
			}
		}
	}

	fmt.Println("\n[2] Testing FetchDailyPrices('BBCA')...")
	dailyPrices, err := client.FetchDailyPrices("BBCA")
	if err != nil {
		fmt.Printf("FetchDailyPrices error: %v\n", err)
	} else {
		fmt.Printf("Retrieved %d daily price records for BBCA.\n", len(dailyPrices))
		if len(dailyPrices) > 0 {
			latest := dailyPrices[len(dailyPrices)-1]
			fmt.Printf("  Latest: Date=%s, Close=%.0f, Volume=%d, MarketCap=%.0f\n",
				latest.Date, latest.Close, latest.Volume, latest.MarketCap)
		}
	}

	fmt.Println("\n[3] Testing market.SyncLiveStockQuotes(client)...")
	quotes, err := market.SyncLiveStockQuotes(client)
	if err != nil {
		fmt.Printf("SyncLiveStockQuotes error: %v\n", err)
	} else {
		fmt.Printf("Synced %d stock quotes:\n", len(quotes))
		for _, q := range quotes {
			fmt.Printf("  [%s] %s | Price: %.0f | Chg: %.2f%% (%.0f) | Status: %s | Mcap: %.2e | Cov: %d\n",
				q.Ticker, q.Name, q.Price, q.ChangePercent, q.Change, q.Status, q.MarketCap, q.Coverage)
		}
	}

	fmt.Println("================================================================")
}

