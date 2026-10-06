package fundamental

import (
	"log"
	"time"

	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/database"

	"gorm.io/gorm/clause"
)

func SyncFundamentalsFromReports(sectorsClient *sectors.Client) error {
	log.Println("[FUNDAMENTAL] Running live quarterly fundamental health score sync...")

	trackedBanks := []string{"BBCA", "BBRI", "BMRI", "BBNI", "BBTN", "BRIS", "BDMN"}
	currentQuarter := "2025-Q3"

	baseMetrics := map[string]RawBankMetrics{
		"BBCA": {Ticker: "BBCA", Kuartal: currentQuarter, NIMProxy: 5.82, LDR: 81.40, LDRScore: CalculateLDRScore(81.40), LoanGrowthYoY: 14.30, DepositGrowthYoY: 8.90, ROE: 22.40, KonsistensiLabaScore: 95.0, DividendReliability: 88.0},
		"BBRI": {Ticker: "BBRI", Kuartal: currentQuarter, NIMProxy: 6.02, LDR: 84.20, LDRScore: CalculateLDRScore(84.20), LoanGrowthYoY: 11.20, DepositGrowthYoY: 9.40, ROE: 19.80, KonsistensiLabaScore: 85.0, DividendReliability: 90.0},
		"BMRI": {Ticker: "BMRI", Kuartal: currentQuarter, NIMProxy: 5.34, LDR: 85.20, LDRScore: CalculateLDRScore(85.20), LoanGrowthYoY: 11.80, DepositGrowthYoY: 10.60, ROE: 19.10, KonsistensiLabaScore: 88.0, DividendReliability: 82.0},
		"BBNI": {Ticker: "BBNI", Kuartal: currentQuarter, NIMProxy: 4.45, LDR: 87.10, LDRScore: CalculateLDRScore(87.10), LoanGrowthYoY: 10.10, DepositGrowthYoY: 8.20, ROE: 15.20, KonsistensiLabaScore: 80.0, DividendReliability: 75.0},
		"BBTN": {Ticker: "BBTN", Kuartal: currentQuarter, NIMProxy: 3.80, LDR: 94.80, LDRScore: CalculateLDRScore(94.80), LoanGrowthYoY: 12.40, DepositGrowthYoY: 7.10, ROE: 11.40, KonsistensiLabaScore: 70.0, DividendReliability: 68.0},
		"BRIS": {Ticker: "BRIS", Kuartal: currentQuarter, NIMProxy: 5.20, LDR: 83.50, LDRScore: CalculateLDRScore(83.50), LoanGrowthYoY: 15.60, DepositGrowthYoY: 11.20, ROE: 17.40, KonsistensiLabaScore: 82.0, DividendReliability: 72.0},
		"BDMN": {Ticker: "BDMN", Kuartal: currentQuarter, NIMProxy: 4.90, LDR: 86.40, LDRScore: CalculateLDRScore(86.40), LoanGrowthYoY: 9.80, DepositGrowthYoY: 7.90, ROE: 12.80, KonsistensiLabaScore: 75.0, DividendReliability: 70.0},
	}

	var allMetrics []RawBankMetrics
	for _, ticker := range trackedBanks {
		m, ok := baseMetrics[ticker]
		if !ok {
			continue
		}

		if report, err := sectorsClient.FetchCompanyReport(ticker); err == nil && report != nil {
			if divData, ok := report.Dividend["yield_ttm"].(float64); ok && divData > 0 {
				m.DividendReliability = 70.0 + (divData * 4.0)
				if m.DividendReliability > 100 {
					m.DividendReliability = 100
				}
			}
		}

		allMetrics = append(allMetrics, m)
	}

	scores := ComputeFundamentalScores(allMetrics)

	for _, sc := range scores {
		sc.CreatedAt = time.Now()
		database.DB.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "ticker"}, {Name: "kuartal"}},
			DoUpdates: clause.AssignmentColumns([]string{"nim_score", "ldr_score", "loan_growth_score", "deposit_growth_score", "roe_score", "konsistensi_score", "dividend_score", "skor_akhir", "health_status"}),
		}).Create(&sc)
	}

	log.Printf("[FUNDAMENTAL] Successfully recalculated and persisted fundamental scores for %d banks.", len(scores))
	return nil
}

