package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"sector-insight/backend/internal/client/ai"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
	"sector-insight/backend/internal/service/sentiment"

	"gorm.io/gorm/clause"
)

type SectorsNewsResponse struct {
	Results []struct {
		Title     string   `json:"title"`
		Body      string   `json:"body"`
		Source    string   `json:"source"`
		Timestamp string   `json:"timestamp"`
		Symbols   []string `json:"symbols"`
		Tags      []string `json:"tags"`
		SubSector []string `json:"sub_sector"`
	} `json:"results"`
}

func truncate(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen]
}

func main() {
	fmt.Println("================================================================")
	fmt.Println("  SYNCHRONIZING 100% REAL LIVE NEWS ARTICLES FROM SECTORS API")
	fmt.Println("================================================================")

	cfg := config.LoadConfig()
	db, err := database.InitDB(cfg)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}

	aiClient := ai.NewClient(cfg.AIServiceURL)
	httpClient := &http.Client{Timeout: 15 * time.Second}

	fmt.Println("[1/4] Clearing old articles with placeholder links...")
	db.Exec("DELETE FROM processed_articles")
	db.Exec("DELETE FROM raw_articles")

	tickers := []string{"BBCA", "BBRI", "BMRI", "BBTN", "BBNI"}

	fmt.Println("[2/4] Fetching authentic news per ticker from Sectors API v2...")

	for _, ticker := range tickers {
		url := fmt.Sprintf("%s/news/?symbols=%s&limit=6", cfg.SectorsBaseURL, ticker)
		fmt.Printf("\n-> Fetching real news for %s (%s)...\n", ticker, url)

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			fmt.Printf("   Error creating request: %v\n", err)
			continue
		}
		req.Header.Set("Authorization", cfg.SectorsAPIKey)
		req.Header.Set("Accept", "application/json")

		resp, err := httpClient.Do(req)
		if err != nil {
			fmt.Printf("   HTTP Error: %v\n", err)
			continue
		}

		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		var newsData SectorsNewsResponse
		if err := json.Unmarshal(body, &newsData); err != nil {
			fmt.Printf("   JSON Decode Error: %v\n", err)
			continue
		}

		fmt.Printf("   Retrieved %d real articles for %s. Analyzing with AI...\n", len(newsData.Results), ticker)

		var scoredArticles []sentiment.ScoredArticle

		for _, item := range newsData.Results {
			pubDate, err := time.Parse("2006-01-02T15:04:05", item.Timestamp)
			if err != nil {
				pubDate = time.Now()
			}

			tagsJSON, _ := json.Marshal(item.Tags)

			raw := model.RawArticle{
				ExternalID:       fmt.Sprintf("%s-%s", ticker, item.Source),
				Ticker:           ticker,
				Judul:            item.Title,
				Snippet:          item.Body,
				URL:              item.Source,
				TanggalPublikasi: pubDate,
				Tags:             string(tagsJSON),
				StatusDiproses:   true,
				CreatedAt:        time.Now(),
			}

			db.Clauses(clause.OnConflict{DoNothing: true}).Create(&raw)
			if raw.ID == 0 {
				db.Where("external_id = ?", raw.ExternalID).First(&raw)
			}

			aiReq := []ai.ArticleAnalysisRequest{
				{
					ArticleID: raw.ID,
					Title:     raw.Judul,
					Snippet:   raw.Snippet,
					Ticker:    raw.Ticker,
				},
			}

			aiResp, err := aiClient.AnalyzeArticlesBatch(aiReq)
			if err != nil {
				fmt.Printf("   [WARNING] AI Analysis failed for '%s': %v\n", truncate(raw.Judul, 30), err)
				continue
			}

			if len(aiResp.Results) > 0 {
				res := aiResp.Results[0]
				fmt.Printf("     [%s] %.2f | %s\n", res.Category, res.SentimentScore, truncate(raw.Judul, 50))
				fmt.Printf("     Source: %s\n", raw.URL)

				entitiesJSON, _ := json.Marshal(res.AffectedEntities)
				proc := model.ProcessedArticle{
					ArticleID:        raw.ID,
					Category:         res.Category,
					AffectedEntities: string(entitiesJSON),
					SentimentScore:   res.SentimentScore,
					Confidence:       res.Confidence,
					Reasoning:        res.Reasoning,
					CreatedAt:        time.Now(),
				}
				db.Clauses(clause.OnConflict{DoNothing: true}).Create(&proc)

				scoredArticles = append(scoredArticles, sentiment.ScoredArticle{
					Category:       res.Category,
					SentimentScore: res.SentimentScore,
					Confidence:     res.Confidence,
					PublishDate:    raw.TanggalPublikasi,
				})
			}
		}

		if len(scoredArticles) > 0 {
			agg := sentiment.CalculateDailySentimentAggregates(ticker, time.Now(), scoredArticles)
			db.Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "ticker"}, {Name: "tanggal"}},
				DoUpdates: clause.AssignmentColumns([]string{"company_sentiment_score", "policy_exposure_score", "jumlah_artikel_company", "jumlah_artikel_policy"}),
			}).Create(&agg)
		}
	}

	fmt.Println("\n[3/4] Fetching real Macro Policy & Central Bank news (sub_sector=banks)...")
	macroURL := fmt.Sprintf("%s/news/?sub_sector=banks&limit=6", cfg.SectorsBaseURL)
	reqMacro, _ := http.NewRequest("GET", macroURL, nil)
	reqMacro.Header.Set("Authorization", cfg.SectorsAPIKey)
	reqMacro.Header.Set("Accept", "application/json")

	respMacro, err := httpClient.Do(reqMacro)
	if err == nil && respMacro.StatusCode == http.StatusOK {
		body, _ := io.ReadAll(respMacro.Body)
		respMacro.Body.Close()

		var macroData SectorsNewsResponse
		json.Unmarshal(body, &macroData)

		for _, item := range macroData.Results {
			pubDate, _ := time.Parse("2006-01-02T15:04:05", item.Timestamp)
			if pubDate.IsZero() {
				pubDate = time.Now()
			}
			tagsJSON, _ := json.Marshal(item.Tags)

			raw := model.RawArticle{
				ExternalID:       fmt.Sprintf("MACRO-%s", item.Source),
				Ticker:           "SECTOR",
				Judul:            item.Title,
				Snippet:          item.Body,
				URL:              item.Source,
				TanggalPublikasi: pubDate,
				Tags:             string(tagsJSON),
				StatusDiproses:   true,
				CreatedAt:        time.Now(),
			}
			db.Clauses(clause.OnConflict{DoNothing: true}).Create(&raw)
			if raw.ID == 0 {
				db.Where("external_id = ?", raw.ExternalID).First(&raw)
			}

			aiReq := []ai.ArticleAnalysisRequest{
				{
					ArticleID: raw.ID,
					Title:     raw.Judul,
					Snippet:   raw.Snippet,
					Ticker:    "SECTOR",
				},
			}
			aiResp, err := aiClient.AnalyzeArticlesBatch(aiReq)
			if err == nil && len(aiResp.Results) > 0 {
				res := aiResp.Results[0]
				entitiesJSON, _ := json.Marshal(res.AffectedEntities)
				proc := model.ProcessedArticle{
					ArticleID:        raw.ID,
					Category:         "macro_policy",
					AffectedEntities: string(entitiesJSON),
					SentimentScore:   res.SentimentScore,
					Confidence:       res.Confidence,
					Reasoning:        res.Reasoning,
					CreatedAt:        time.Now(),
				}
				db.Clauses(clause.OnConflict{DoNothing: true}).Create(&proc)
				fmt.Printf("   [MACRO] %.2f | %s\n", res.SentimentScore, truncate(raw.Judul, 50))
				fmt.Printf("   Source: %s\n", raw.URL)
			}
		}
	}

	fmt.Println("\n[4/4] 100% Real Live News Articles Synced Successfully!")
	fmt.Println("================================================================")
}

