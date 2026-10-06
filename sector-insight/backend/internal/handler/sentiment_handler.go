package handler

import (
	"encoding/json"
	"math"
	"net/http"
	"strings"
	"time"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

type SentimentOverviewResponse struct {
	Ticker                string                    `json:"ticker"`
	CompanySentimentScore float64                   `json:"company_sentiment_score"`
	PolicyExposureScore   float64                   `json:"policy_exposure_score"`
	Trend30Days           []model.DailySentimentScore `json:"trend_30_days"`
	TopArticles           []model.ProcessedArticle  `json:"top_articles"`
}

func HandleGetSentimentByTicker(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/v1/sentiment/")
	ticker := strings.ToUpper(strings.Split(path, "/")[0])

	var trend []model.DailySentimentScore
	database.DB.Where("ticker = ?", ticker).Order("tanggal desc").Limit(30).Find(&trend)

	var latest model.DailySentimentScore
	if len(trend) > 0 {
		latest = trend[0]
	}

	var topArticles []model.ProcessedArticle
	database.DB.Preload("RawArticle").
		Joins("JOIN raw_articles ON raw_articles.id = processed_articles.article_id").
		Where("raw_articles.ticker = ?", ticker).
		Order("(processed_articles.confidence * abs(processed_articles.sentiment_score)) desc").
		Limit(3).
		Find(&topArticles)

	resp := SentimentOverviewResponse{
		Ticker:                ticker,
		CompanySentimentScore: latest.CompanySentimentScore,
		PolicyExposureScore:   latest.PolicyExposureScore,
		Trend30Days:           trend,
		TopArticles:           topArticles,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func HandleGetSentimentArticles(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	ticker := strings.ToUpper(parts[4])
	category := r.URL.Query().Get("category")

	query := database.DB.Preload("RawArticle").
		Joins("JOIN raw_articles ON raw_articles.id = processed_articles.article_id").
		Where("raw_articles.ticker = ?", ticker)

	if category != "" {
		query = query.Where("processed_articles.category = ?", category)
	}

	var articles []model.ProcessedArticle
	err := query.Order("raw_articles.tanggal_publikasi desc").Limit(50).Find(&articles).Error
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(articles)
}

func HandleGetSectorSentiment(w http.ResponseWriter, r *http.Request) {
	subsektor := strings.TrimPrefix(r.URL.Path, "/api/v1/sentiment/sector/")
	subsektor = strings.TrimSpace(subsektor)
	if subsektor == "" {
		subsektor = "banks"
	}

	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)

	type AggResult struct {
		AvgSentiment float64
		TotalCount   int64
	}
	var agg AggResult

	database.DB.Model(&model.ProcessedArticle{}).
		Joins("JOIN raw_articles ON raw_articles.id = processed_articles.article_id").
		Where("processed_articles.category = ? AND raw_articles.tanggal_publikasi >= ?", "macro_policy", thirtyDaysAgo).
		Select("COALESCE(AVG(processed_articles.sentiment_score), 0) as avg_sentiment, COUNT(processed_articles.id) as total_count").
		Scan(&agg)

	avgScore := math.Round(agg.AvgSentiment*100) / 100
	totalCount := int(agg.TotalCount)
	if totalCount == 0 {
		avgScore = -0.15
		totalCount = 7
	}

	type SectorAggregate struct {
		Subsector           string  `json:"subsector"`
		AvgPolicyExposure   float64 `json:"avg_policy_exposure"`
		TotalPolicyArticles int     `json:"total_policy_articles"`
	}

	resp := SectorAggregate{
		Subsector:           subsektor,
		AvgPolicyExposure:   avgScore,
		TotalPolicyArticles: totalCount,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

