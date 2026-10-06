package jobs

import (
	"log"

	"sector-insight/backend/internal/client/ai"
	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/service/community"
	"sector-insight/backend/internal/service/foreignflow"
	"sector-insight/backend/internal/service/fundamental"
	"sector-insight/backend/internal/service/sector"
	"sector-insight/backend/internal/service/sentiment"

	"github.com/robfig/cron/v3"
)

type JobRunner struct {
	cfg           *config.Config
	sectorsClient *sectors.Client
	aiClient      *ai.Client
	cronEngine    *cron.Cron
}

func NewJobRunner(cfg *config.Config, sectorsClient *sectors.Client, aiClient *ai.Client) *JobRunner {
	return &JobRunner{
		cfg:           cfg,
		sectorsClient: sectorsClient,
		aiClient:      aiClient,
		cronEngine:    cron.New(),
	}
}

func (j *JobRunner) StartScheduledJobs() {
	trackedTickers := []string{"BBCA", "BBRI", "BMRI", "BBNI", "BBTN", "BRIS", "BDMN"}

	go func() {
		log.Println("[STARTUP] Running initial live data sync from Sectors API...")
		if _, err := sentiment.SyncLiveNewsFromSectors(j.cfg, j.sectorsClient, j.aiClient); err != nil {
			log.Printf("[STARTUP] Initial news sync error: %v", err)
		}
		if err := fundamental.SyncFundamentalsFromReports(j.sectorsClient); err != nil {
			log.Printf("[STARTUP] Initial fundamental sync error: %v", err)
		}
		if err := foreignflow.SyncForeignFlowAndDetectAnomalies(j.sectorsClient); err != nil {
			log.Printf("[STARTUP] Initial foreign flow sync error: %v", err)
		}
	}()

	j.cronEngine.AddFunc("*/30 * * * *", func() {
		log.Println("[CRON] Running 30-minute Realtime News Ingestion Job...")
		if _, err := sentiment.SyncLiveNewsFromSectors(j.cfg, j.sectorsClient, j.aiClient); err != nil {
			log.Printf("[CRON] News Ingestion error: %v", err)
		}
	})

	j.cronEngine.AddFunc("0 17 * * 1-5", func() {
		log.Println("[CRON] Running Daily Foreign Flow & Anomaly Detection...")
		if err := foreignflow.SyncForeignFlowAndDetectAnomalies(j.sectorsClient); err != nil {
			log.Printf("[CRON] Foreign Flow Detection error: %v", err)
		}
	})

	j.cronEngine.AddFunc("0 0 * * *", func() {
		log.Println("[CRON] Running Daily Sentiment Aggregator Job...")
		if err := sentiment.RunDailySentimentAggregation(trackedTickers); err != nil {
			log.Printf("[CRON] Daily Sentiment Aggregation error: %v", err)
		}
	})

	j.cronEngine.AddFunc("0 6 * * *", func() {
		log.Println("[CRON] Running Daily Fundamental Quarterly Polling...")
		if err := fundamental.SyncFundamentalsFromReports(j.sectorsClient); err != nil {
			log.Printf("[CRON] Fundamental Polling error: %v", err)
		}
	})

	j.cronEngine.AddFunc("*/15 * * * *", func() {
		log.Println("[CRON] Running 15-Minute Community Crowd Sentiment Recalculation...")
		for _, t := range trackedTickers {
			if _, err := community.CalculateCrowdSentimentAggregates(t); err != nil {
				log.Printf("[CRON] Crowd Sentiment error for %s: %v", t, err)
			}
		}
	})

	j.cronEngine.AddFunc("30 17 * * 1-5", func() {
		log.Println("[CRON] Running Daily Sector Rotation Momentum (SMRS) Engine...")
		if _, err := sector.GetSectorRanking(); err != nil {
			log.Printf("[CRON] SMRS Calculation error: %v", err)
		}
	})

	j.cronEngine.Start()
	log.Println("Cron job scheduler started successfully with all background pipelines active.")
}

func (j *JobRunner) Stop() {
	j.cronEngine.Stop()
}

