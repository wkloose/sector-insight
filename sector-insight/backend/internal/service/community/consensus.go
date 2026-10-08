package community

import (
	"math"
	"strings"
	"time"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

func CalculateCrowdSentimentAggregates(ticker string) (*model.DailyCrowdSentiment, error) {
	upperTicker := strings.ToUpper(ticker)
	now := time.Now()
	since24h := now.Add(-24 * time.Hour)

	var posts []model.CommunityPost
	err := database.DB.Where("ticker = ? AND created_at >= ?", upperTicker, since24h).Find(&posts).Error
	if err != nil {
		return nil, err
	}

	if len(posts) == 0 {

		var existing model.DailyCrowdSentiment
		if err := database.DB.Where("ticker = ?", upperTicker).Order("tanggal desc").First(&existing).Error; err == nil {
			return &existing, nil
		}

		return &model.DailyCrowdSentiment{
			Ticker:           upperTicker,
			Tanggal:          now,
			SentimentScore:   0.0,
			BullishPercent:   50.0,
			TotalPosts:       0,
			DiscussionZScore: 0.0,
			DivergenceStatus: "NORMAL",
			CreatedAt:        now,
		}, nil
	}

	var sumSentimentEffective float64 = 0
	var sumEffective float64 = 0
	var totalBullishWeight float64 = 0
	var totalBearishWeight float64 = 0

	for _, p := range posts {
		effective := p.WeightedScore
		if effective <= 0 {
			effective = 1.0
		}

		var sentValue float64 = 0.0
		switch strings.ToUpper(p.SentimentTag) {
		case "BULLISH":
			sentValue = 1.0
			totalBullishWeight += effective
		case "BEARISH":
			sentValue = -1.0
			totalBearishWeight += effective
		default:
			sentValue = 0.0
		}

		sumSentimentEffective += (sentValue * effective)
		sumEffective += effective
	}

	css := 0.0
	if sumEffective > 0 {
		css = sumSentimentEffective / sumEffective
	}

	if css > 1.0 {
		css = 1.0
	} else if css < -1.0 {
		css = -1.0
	}

	totalDirectionalWeight := totalBullishWeight + totalBearishWeight
	bullishPercent := 50.0
	if totalDirectionalWeight > 0 {
		bullishPercent = (totalBullishWeight / totalDirectionalWeight) * 100.0
	}

	var baselineMean float64 = 15.0
	var baselineStdDev float64 = 8.0
	countPosts := float64(len(posts))
	zBuzz := (countPosts - baselineMean) / baselineStdDev
	if zBuzz < 0 {
		zBuzz = 0
	}
	zBuzz = math.Round(zBuzz*100) / 100

	divergenceStatus := DetectDivergenceStatus(upperTicker, css, zBuzz, bullishPercent)

	crowdRecord := &model.DailyCrowdSentiment{
		Ticker:           upperTicker,
		Tanggal:          now,
		SentimentScore:   math.Round(css*100) / 100,
		BullishPercent:   math.Round(bullishPercent*10) / 10,
		TotalPosts:       len(posts),
		DiscussionZScore: zBuzz,
		DivergenceStatus: divergenceStatus,
		CreatedAt:        now,
	}

	database.DB.Save(crowdRecord)

	return crowdRecord, nil
}

