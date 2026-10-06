package foreignflow

import (
	"math"
	"time"

	"sector-insight/backend/internal/model"
)

type AnomalyResult struct {
	Ticker           string
	Tanggal          time.Time
	NetForeignInflow float64
	ZScore           float64
	StatusAnomali    string
	IsAnomaly        bool
	MultipleOfNormal float64
}

func CalculateZScoreAnomaly(ticker string, todayDate time.Time, flows []float64, todayFlow float64) AnomalyResult {
	if len(flows) < 10 {
		return AnomalyResult{
			Ticker:           ticker,
			Tanggal:          todayDate,
			NetForeignInflow: todayFlow,
			ZScore:           0,
			StatusAnomali:    "DATA_HISTORIS_KURANG",
			IsAnomaly:        false,
		}
	}

	var sum float64
	for _, v := range flows {
		sum += v
	}
	mean := sum / float64(len(flows))

	var varianceSum float64
	for _, v := range flows {
		varianceSum += math.Pow(v-mean, 2)
	}
	stdDev := math.Sqrt(varianceSum / float64(len(flows)))
	if stdDev == 0 {
		stdDev = 1
	}

	zScore := (todayFlow - mean) / stdDev
	absZ := math.Abs(zScore)

	var status string
	isAnomaly := false

	if absZ >= 3.0 {
		isAnomaly = true
		if zScore > 0 {
			status = "EKSTREM_INFLOW"
		} else {
			status = "EKSTREM_OUTFLOW"
		}
	} else if absZ >= 2.0 {
		isAnomaly = true
		if zScore > 0 {
			status = "ANOMALI_INFLOW"
		} else {
			status = "ANOMALI_OUTFLOW"
		}
	} else {
		status = "NORMAL"
	}

	var absFlowSum float64
	for _, v := range flows {
		absFlowSum += math.Abs(v)
	}
	meanAbsFlow := absFlowSum / float64(len(flows))

	multipleOfNormal := 1.0
	if meanAbsFlow > 0 {
		multipleOfNormal = math.Abs(todayFlow) / meanAbsFlow
	}
	if multipleOfNormal > 50.0 {
		multipleOfNormal = 50.0
	}

	return AnomalyResult{
		Ticker:           ticker,
		Tanggal:          todayDate,
		NetForeignInflow: todayFlow,
		ZScore:           math.Round(zScore*100) / 100,
		StatusAnomali:    status,
		IsAnomaly:        isAnomaly,
		MultipleOfNormal: math.Round(multipleOfNormal*10) / 10,
	}
}

func (ar *AnomalyResult) ToModel() model.ForeignFlowAnomaly {
	return model.ForeignFlowAnomaly{
		Ticker:           ar.Ticker,
		Tanggal:          ar.Tanggal,
		NetForeignInflow: ar.NetForeignInflow,
		ZScore:           ar.ZScore,
		StatusAnomali:    ar.StatusAnomali,
	}
}

