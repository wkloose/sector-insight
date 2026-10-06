package sentiment

import (
	"crypto/md5"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"sector-insight/backend/internal/client/ai"
	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"

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

type SyncSummary struct {
	NewArticlesCount int      `json:"new_articles_count"`
	SyncedTickers    []string `json:"synced_tickers"`
	LastSyncedAt     string   `json:"last_synced_at"`
}

func SyncLiveNewsFromSectors(cfg *config.Config, sectorsClient *sectors.Client, aiClient *ai.Client) (*SyncSummary, error) {
	log.Println("[SYNC] Starting live news ingestion from Sectors API v2...")

	httpClient := &http.Client{Timeout: 15 * time.Second}
	tickers := []string{"BBCA", "BBRI", "BMRI", "BBTN", "BBNI"}
	totalNew := 0

	for _, ticker := range tickers {
		url := fmt.Sprintf("%s/news/?symbols=%s&limit=6", cfg.SectorsBaseURL, ticker)
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			continue
		}
		req.Header.Set("Authorization", cfg.SectorsAPIKey)
		req.Header.Set("Accept", "application/json")

		resp, err := httpClient.Do(req)
		if err != nil {
			log.Printf("[SYNC] Failed to fetch news for %s: %v", ticker, err)
			continue
		}

		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		var newsData SectorsNewsResponse
		if err := json.Unmarshal(body, &newsData); err != nil {
			continue
		}

		var scoredArticles []ScoredArticle

		for _, item := range newsData.Results {
			pubDate, err := time.Parse("2006-01-02T15:04:05", item.Timestamp)
			if err != nil {
				pubDate = time.Now()
			}
			tagsJSON, _ := json.Marshal(item.Tags)

			hasher := md5.New()
			hasher.Write([]byte(ticker + ":" + item.Title + ":" + item.Timestamp))
			externalID := fmt.Sprintf("%s-%x", ticker, hasher.Sum(nil))

			var existing model.RawArticle
			database.DB.Where("external_id = ?", externalID).First(&existing)
			if existing.ID != 0 {

				var proc model.ProcessedArticle
				database.DB.Where("article_id = ?", existing.ID).First(&proc)
				if proc.ID != 0 {
					scoredArticles = append(scoredArticles, ScoredArticle{
						Category:       proc.Category,
						SentimentScore: proc.SentimentScore,
						Confidence:     proc.Confidence,
						PublishDate:    existing.TanggalPublikasi,
					})
				}
				continue
			}

			raw := model.RawArticle{
				ExternalID:       externalID,
				Ticker:           ticker,
				Judul:            item.Title,
				Snippet:          item.Body,
				URL:              item.Source,
				TanggalPublikasi: pubDate,
				Tags:             string(tagsJSON),
				StatusDiproses:   true,
				CreatedAt:        time.Now(),
			}
			database.DB.Create(&raw)
			totalNew++

			aiReq := []ai.ArticleAnalysisRequest{
				{
					ArticleID: raw.ID,
					Title:     raw.Judul,
					Snippet:   raw.Snippet,
					Ticker:    raw.Ticker,
				},
			}

			aiResp, err := aiClient.AnalyzeArticlesBatch(aiReq)
			if err == nil && len(aiResp.Results) > 0 {
				res := aiResp.Results[0]
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
				database.DB.Create(&proc)

				scoredArticles = append(scoredArticles, ScoredArticle{
					Category:       res.Category,
					SentimentScore: res.SentimentScore,
					Confidence:     res.Confidence,
					PublishDate:    raw.TanggalPublikasi,
				})
			}
		}

		if len(scoredArticles) > 0 {
			agg := CalculateDailySentimentAggregates(ticker, time.Now(), scoredArticles)
			database.DB.Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "ticker"}, {Name: "tanggal"}},
				DoUpdates: clause.AssignmentColumns([]string{"company_sentiment_score", "policy_exposure_score", "jumlah_artikel_company", "jumlah_artikel_policy"}),
			}).Create(&agg)
		}
	}

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
			externalID := fmt.Sprintf("MACRO-%s", item.Source)

			var existing model.RawArticle
			database.DB.Where("external_id = ?", externalID).First(&existing)
			if existing.ID != 0 {
				continue
			}

			raw := model.RawArticle{
				ExternalID:       externalID,
				Ticker:           "SECTOR",
				Judul:            item.Title,
				Snippet:          item.Body,
				URL:              item.Source,
				TanggalPublikasi: pubDate,
				Tags:             string(tagsJSON),
				StatusDiproses:   true,
				CreatedAt:        time.Now(),
			}
			database.DB.Create(&raw)
			totalNew++

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
				database.DB.Create(&proc)
			}
		}
	}

	summary := &SyncSummary{
		NewArticlesCount: totalNew,
		SyncedTickers:    tickers,
		LastSyncedAt:     time.Now().Format("2006-01-02 15:04:05 WIB"),
	}

	log.Printf("[SYNC] News sync completed. Added %d new live articles.\n", totalNew)
	return summary, nil
}

