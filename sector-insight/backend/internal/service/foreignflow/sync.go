package foreignflow

import (
	"log"
	"time"

	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"

	"gorm.io/gorm/clause"
)

func SyncForeignFlowAndDetectAnomalies(sectorsClient *sectors.Client) error {
	log.Println("[FOREIGN-FLOW] Running daily foreign flow ingestion & Z-score anomaly detector...")

	trackedTickers := []string{"BBCA", "BBRI", "BMRI", "BBNI", "BBTN", "BRIS", "BDMN"}
	today := time.Now().Truncate(24 * time.Hour)

	for _, ticker := range trackedTickers {
		items, err := sectorsClient.FetchDailyForeignFlow(ticker, 90)
		if err != nil || len(items) == 0 {
			continue
		}

		flows := make([]float64, len(items))
		var latestFlow float64
		var latestDate time.Time

		for i, it := range items {
			flows[i] = it.NetForeignInflow
			parsedDate, err := time.Parse("2006-01-02", it.Date)
			if err != nil {
				parsedDate = today.AddDate(0, 0, -(len(items) - 1 - i))
			}
			if i == len(items)-1 {
				latestFlow = it.NetForeignInflow
				latestDate = parsedDate
			}

			dff := model.DailyForeignFlow{
				Ticker:           ticker,
				Tanggal:          parsedDate,
				NetForeignInflow: it.NetForeignInflow,
				CreatedAt:        time.Now(),
			}
			database.DB.Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "ticker"}, {Name: "tanggal"}},
				DoUpdates: clause.AssignmentColumns([]string{"net_foreign_inflow"}),
			}).Create(&dff)
		}

		anomalyRes := CalculateZScoreAnomaly(ticker, latestDate, flows, latestFlow)

		if anomalyRes.IsAnomaly {
			log.Printf("[FOREIGN-FLOW] ANOMALY DETECTED for %s: %s (Z=%.2f, Flow=%.0f)", ticker, anomalyRes.StatusAnomali, anomalyRes.ZScore, anomalyRes.NetForeignInflow)

			anomalyModel := anomalyRes.ToModel()
			anomalyModel.CreatedAt = time.Now()
			database.DB.Create(&anomalyModel)

			topBrokers, err := sectorsClient.FetchTopBrokers(ticker, latestDate.Format("2006-01-02"))
			if err == nil {
				for _, b := range topBrokers {
					brokerDetail := model.AnomalyBrokerDetail{
						AnomalyID:  anomalyModel.ID,
						KodeBroker: b.BrokerCode,
						NamaBroker: b.BrokerName,
						Kategori:   b.Category,
						NetValue:   b.NetValue,
						CreatedAt:  time.Now(),
					}
					database.DB.Create(&brokerDetail)
				}
			}
		}
	}

	log.Println("[FOREIGN-FLOW] Daily foreign flow sync completed.")
	return nil
}

