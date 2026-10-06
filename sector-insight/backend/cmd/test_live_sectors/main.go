package main

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"sector-insight/backend/internal/config"
)

func main() {
	fmt.Println("================================================================")
	fmt.Println("  TESTING LIVE SECTORS API (https://api.sectors.app/v2)")
	fmt.Println("================================================================")

	cfg := config.LoadConfig()

	if cfg.SectorsAPIKey == "" || cfg.SectorsAPIKey == "your_sectors_api_key_here" {
		fmt.Println("[WARNING] SECTORS_API_KEY belum diisi di backend/.env!")
		fmt.Println("Silakan isi SECTORS_API_KEY di file:")
		fmt.Println("  sector-insight/backend/.env")
		fmt.Println("Lalu jalankan skrip ini kembali.")
		return
	}

	client := &http.Client{Timeout: 10 * time.Second}

	testEndpoints := []string{
		"/companies/?sub_sector=banks",
		"/company/report/BBCA/",
	}

	for _, ep := range testEndpoints {
		url := fmt.Sprintf("%s%s", cfg.SectorsBaseURL, ep)
		fmt.Printf("\n[REQUEST] GET %s\n", url)

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			fmt.Printf("Error creating request: %v\n", err)
			continue
		}
		req.Header.Set("Authorization", cfg.SectorsAPIKey)
		req.Header.Set("Accept", "application/json")

		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("HTTP Request failed: %v\n", err)
			continue
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)
		fmt.Printf("[RESPONSE] Status: %s\n", resp.Status)
		if len(body) > 300 {
			fmt.Printf("Preview Body: %s...\n", string(body[:300]))
		} else {
			fmt.Printf("Body: %s\n", string(body))
		}
	}
	fmt.Println("================================================================")
}

