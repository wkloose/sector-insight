package main

import (
	"fmt"
	"log"
	"net/http"

	"sector-insight/backend/internal/client/ai"
	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/handler"
	"sector-insight/backend/internal/jobs"
	"sector-insight/backend/internal/service/fundamental"
)

func main() {
	log.Println("Starting Sector Insight Backend...")

	cfg := config.LoadConfig()

	_, err := database.InitDB(cfg)
	if err != nil {
		log.Printf("[WARNING] Database initialization failed: %v. Continuing in offline/mock mode...", err)
	} else {
		if err := fundamental.RecalculateAndPersistAllScores(database.DB); err != nil {
			log.Printf("[WARNING] Failed to recalculate fundamental scores: %v", err)
		}
	}

	sectorsClient := sectors.NewClient(cfg.SectorsBaseURL, cfg.SectorsAPIKey)
	aiClient := ai.NewClient(cfg.AIServiceURL)

	jobRunner := jobs.NewJobRunner(cfg, sectorsClient, aiClient)
	jobRunner.StartScheduledJobs()
	defer jobRunner.Stop()

	router := handler.SetupRouter(cfg, sectorsClient, aiClient)
	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Server listening on %s (ENV: %s)", serverAddr, cfg.Env)

	if err := http.ListenAndServe(serverAddr, router); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

