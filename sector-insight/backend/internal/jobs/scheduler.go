package jobs

import (
	"log"

	"sector-insight/backend/internal/client/ai"
	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/service/community"
	"sector-insight/backend/internal/service/market"
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
		log.Println("[STARTUP] Running initial stock quote synchronization...")
		if _, err := market.SyncLiveStockQuotes(j.sectorsClient); err != nil {
			log.Printf("[STARTUP] Initial stock quote sync error: %v", err)
		}
	}()

	j.cronEngine.AddFunc("*/5 * * * *", func() {
		log.Println("[CRON] Running 5-Minute Live Stock Quote Synchronization Job...")
		if _, err := market.SyncLiveStockQuotes(j.sectorsClient); err != nil {
			log.Printf("[CRON] Stock quote sync error: %v", err)
		}
	})

	j.cronEngine.AddFunc("0 0 * * *", func() {
		log.Println("[CRON] Running Daily Sentiment Aggregator Job...")
		if err := sentiment.RunDailySentimentAggregation(trackedTickers); err != nil {
			log.Printf("[CRON] Daily Sentiment Aggregation error: %v", err)
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
	log.Println("Cron job scheduler started successfully.")
}

func (j *JobRunner) Stop() {
	j.cronEngine.Stop()
}
