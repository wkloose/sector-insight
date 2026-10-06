package sentiment

import (
	"math"
	"time"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"

	"gorm.io/gorm/clause"
)

type ScoredArticle struct {
	Category       string
	SentimentScore float64
	Confidence     float64
	PublishDate    time.Time
}

func ComputeDecayWeight(now, pubDate time.Time) float64 {
	daysAgo := now.Sub(pubDate).Hours() / 24.0
	if daysAgo < 0 {
		daysAgo = 0
	}
	lambda := 0.0767
	return math.Exp(-lambda * daysAgo)
}

func CalculateDailySentimentAggregates(ticker string, today time.Time, articles []ScoredArticle) model.DailySentimentScore {
	var companyWeightedSum, companyWeightTotal float64
	var policyWeightedSum, policyWeightTotal float64
	var countCompany, countPolicy int

	for _, a := range articles {

		daysAgo := today.Sub(a.PublishDate).Hours() / 24.0
		if daysAgo > 30.0 || daysAgo < 0 {
			continue
		}

		w := ComputeDecayWeight(today, a.PublishDate) * a.Confidence

		if a.Category == "company_specific" {
			companyWeightedSum += a.SentimentScore * w
			companyWeightTotal += w
			countCompany++
		} else if a.Category == "macro_policy" {
			policyWeightedSum += a.SentimentScore * w
			policyWeightTotal += w
			countPolicy++
		}
	}

	var companyScore, policyScore float64
	if companyWeightTotal > 0 {
		companyScore = companyWeightedSum / companyWeightTotal
	}
	if policyWeightTotal > 0 {
		policyScore = policyWeightedSum / policyWeightTotal
	}

	return model.DailySentimentScore{
		Ticker:                ticker,
		Tanggal:               today,
		CompanySentimentScore: math.Round(companyScore*100) / 100,
		PolicyExposureScore:   math.Round(policyScore*100) / 100,
		JumlahArtikelCompany:  countCompany,
		JumlahArtikelPolicy:   countPolicy,
		CreatedAt:             time.Now(),
	}
}

func RunDailySentimentAggregation(tickers []string) error {
	today := time.Now().Truncate(24 * time.Hour)
	thirtyDaysAgo := today.AddDate(0, 0, -30)

	for _, ticker := range tickers {
		var articles []model.ProcessedArticle
		database.DB.Preload("RawArticle").
			Joins("JOIN raw_articles ON raw_articles.id = processed_articles.article_id").
			Where("(raw_articles.ticker = ? OR (processed_articles.category = 'macro_policy' AND (processed_articles.affected_entities LIKE ? OR processed_articles.affected_entities LIKE '%makro%' OR processed_articles.affected_entities LIKE '%keuangan%' OR processed_articles.affected_entities LIKE '%perbankan%'))) AND raw_articles.tanggal_publikasi >= ?", ticker, "%"+ticker+"%", thirtyDaysAgo).
			Find(&articles)

		scored := make([]ScoredArticle, 0, len(articles))
		for _, a := range articles {
			scored = append(scored, ScoredArticle{
				Category:       a.Category,
				SentimentScore: a.SentimentScore,
				Confidence:     a.Confidence,
				PublishDate:    a.RawArticle.TanggalPublikasi,
			})
		}

		dailyScore := CalculateDailySentimentAggregates(ticker, today, scored)

		database.DB.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "ticker"}, {Name: "tanggal"}},
			DoUpdates: clause.AssignmentColumns([]string{"company_sentiment_score", "policy_exposure_score", "jumlah_artikel_company", "jumlah_artikel_policy"}),
		}).Create(&dailyScore)
	}
	return nil
}

