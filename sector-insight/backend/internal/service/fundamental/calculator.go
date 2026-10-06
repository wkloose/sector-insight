package fundamental

import (
	"math"
	"sort"
	"sector-insight/backend/internal/model"
)

type RawBankMetrics struct {
	Ticker              string
	Kuartal             string
	NIMProxy            float64
	LDR                 float64
	LDRScore            float64
	LoanGrowthYoY       float64
	DepositGrowthYoY    float64
	ROE                 float64
	KonsistensiLabaScore float64
	DividendReliability  float64
}

func CalculateLDRScore(ldr float64) float64 {

	if ldr >= 78.0 && ldr <= 92.0 {
		return 100.0
	}
	var diff float64
	if ldr < 78.0 {
		diff = 78.0 - ldr
	} else {
		diff = ldr - 92.0
	}

	penalty := diff * 2.0
	score := 100.0 - penalty
	if score < 0 {
		return 0
	}
	return score
}

func CalculatePercentileRank(values []float64, val float64) float64 {
	if len(values) <= 1 {
		return 50.0
	}
	sorted := make([]float64, len(values))
	copy(sorted, values)
	sort.Float64s(sorted)

	countLower := 0
	countEqual := 0
	for _, v := range sorted {
		if v < val {
			countLower++
		} else if v == val {
			countEqual++
		}
	}
	rank := (float64(countLower) + 0.5*float64(countEqual)) / float64(len(sorted)) * 100.0
	if rank > 100.0 {
		rank = 100.0
	}
	if rank < 0.0 {
		rank = 0.0
	}
	return rank
}

func ComputeFundamentalScores(allMetrics []RawBankMetrics) []model.FundamentalScore {
	n := len(allMetrics)
	if n == 0 {
		return nil
	}

	nimList := make([]float64, n)
	loanGrowthList := make([]float64, n)
	depositGrowthList := make([]float64, n)
	roeList := make([]float64, n)

	for i, m := range allMetrics {
		nimList[i] = m.NIMProxy
		loanGrowthList[i] = m.LoanGrowthYoY
		depositGrowthList[i] = m.DepositGrowthYoY
		roeList[i] = m.ROE
	}

	results := make([]model.FundamentalScore, n)
	for i, m := range allMetrics {
		nimScore := CalculatePercentileRank(nimList, m.NIMProxy)
		ldrScore := m.LDRScore
		loanGrowthScore := CalculatePercentileRank(loanGrowthList, m.LoanGrowthYoY)
		depositGrowthScore := CalculatePercentileRank(depositGrowthList, m.DepositGrowthYoY)
		roeScore := CalculatePercentileRank(roeList, m.ROE)
		konsistensiScore := m.KonsistensiLabaScore
		dividendScore := m.DividendReliability

		finalScore := (nimScore * 0.20) +
			(ldrScore * 0.15) +
			(loanGrowthScore * 0.15) +
			(depositGrowthScore * 0.10) +
			(roeScore * 0.15) +
			(konsistensiScore * 0.15) +
			(dividendScore * 0.10)

		finalScore = math.Round(finalScore*10) / 10

		var healthStatus string
		switch {
		case finalScore >= 80.0:
			healthStatus = "Sangat Sehat"
		case finalScore >= 60.0:
			healthStatus = "Sehat"
		case finalScore >= 40.0:
			healthStatus = "Cukup"
		default:
			healthStatus = "Perlu Perhatian"
		}

		results[i] = model.FundamentalScore{
			Ticker:             m.Ticker,
			Kuartal:            m.Kuartal,
			NIMScore:           math.Round(nimScore*10) / 10,
			LDRScore:           math.Round(ldrScore*10) / 10,
			LoanGrowthScore:    math.Round(loanGrowthScore*10) / 10,
			DepositGrowthScore: math.Round(depositGrowthScore*10) / 10,
			ROEScore:           math.Round(roeScore*10) / 10,
			KonsistensiScore:   math.Round(konsistensiScore*10) / 10,
			DividendScore:      math.Round(dividendScore*10) / 10,
			SkorAkhir:          finalScore,
			HealthStatus:       healthStatus,
		}
	}

	return results
}

