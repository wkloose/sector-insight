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
)

type NewsAPIResponse struct {
	Results []struct {
		Title     string   `json:"title"`
		Body      string   `json:"body"`
		Source    string   `json:"source"`
		Timestamp string   `json:"timestamp"`
		Symbols   []string `json:"symbols"`
		Tags      []string `json:"tags"`
	} `json:"results"`
}

func main() {
	fmt.Println("================================================================")
	fmt.Println("  LIVE DATA SYNC: SECTORS API v2 -> PYTHON AI -> GO DATABASE")
	fmt.Println("================================================================")

	cfg := config.LoadConfig()
	db, err := database.InitDB(cfg)
	if err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}

	aiClient := ai.NewClient(cfg.AIServiceURL)
	httpClient := &http.Client{Timeout: 15 * time.Second}

	newsURL := fmt.Sprintf("%s/news/?sub_sector=banks", cfg.SectorsBaseURL)
	fmt.Printf("[1/3] Fetching live banking news from: %s\n", newsURL)

	req, _ := http.NewRequest("GET", newsURL, nil)
	req.Header.Set("Authorization", cfg.SectorsAPIKey)
	req.Header.Set("Accept", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		log.Fatalf("Failed to fetch news from Sectors API: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Fatalf("Sectors API returned status %d", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	var newsData NewsAPIResponse
	if err := json.Unmarshal(body, &newsData); err != nil {
		log.Fatalf("Failed to decode news JSON: %v", err)
	}

	fmt.Printf("[2/3] Retrieved %d live articles from Sectors API. Processing with AI...\n", len(newsData.Results))

	var rawArticles []model.RawArticle
	var scoredArticles []sentiment.ScoredArticle

	maxArticles := 5
	if len(newsData.Results) < maxArticles {
		maxArticles = len(newsData.Results)
	}

	for i := 0; i < maxArticles; i++ {
		item := newsData.Results[i]
		pubDate, _ := time.Parse("2006-01-02T15:04:05", item.Timestamp)
		if pubDate.IsZero() {
			pubDate = time.Now()
		}

		ticker := "SECTOR"
		if len(item.Symbols) > 0 {
			ticker = item.Symbols[0]
		}

		raw := model.RawArticle{
			ExternalID:       item.Source,
			Ticker:           ticker,
			Judul:            item.Title,
			Snippet:          item.Body,
			URL:              item.Source,
			TanggalPublikasi: pubDate,
			StatusDiproses:   true,
			CreatedAt:        time.Now(),
		}
		db.Save(&raw)
		rawArticles = append(rawArticles, raw)

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
			fmt.Printf("   [WARNING] AI processing error for '%s': %v\n", raw.Judul[:40], err)
			continue
		}

		if len(aiResp.Results) > 0 {
			res := aiResp.Results[0]
			fmt.Printf("   -> [%s] %.2f | %s\n", res.Category, res.SentimentScore, raw.Judul[:60])

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
			db.Save(&proc)

			scoredArticles = append(scoredArticles, sentiment.ScoredArticle{
				Category:       res.Category,
				SentimentScore: res.SentimentScore,
				Confidence:     res.Confidence,
				PublishDate:    raw.TanggalPublikasi,
			})
		}
	}

	fmt.Println("[3/3] Computing live rolling sentiment & policy exposure scores...")
	liveSentiment := sentiment.CalculateDailySentimentAggregates("BBCA", time.Now(), scoredArticles)
	db.Save(&liveSentiment)

	fmt.Printf("\n[SYNC COMPLETE] Live Aggregation Results:\n")
	fmt.Printf("  Ticker                  : %s\n", liveSentiment.Ticker)
	fmt.Printf("  Company Sentiment Score : %.2f\n", liveSentiment.CompanySentimentScore)
	fmt.Printf("  Policy Exposure Score   : %.2f\n", liveSentiment.PolicyExposureScore)
	fmt.Printf("  Company Articles        : %d\n", liveSentiment.JumlahArtikelCompany)
	fmt.Printf("  Policy Articles         : %d\n", liveSentiment.JumlahArtikelPolicy)
	fmt.Println("================================================================")
}

