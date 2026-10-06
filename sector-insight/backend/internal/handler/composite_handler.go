package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
	"sector-insight/backend/internal/service/composite"
)

func HandleGetCompositeAlert(w http.ResponseWriter, r *http.Request) {
	ticker := strings.ToUpper(strings.TrimPrefix(r.URL.Path, "/api/v1/composite-alert/"))

	var fundScore model.FundamentalScore
	database.DB.Where("ticker = ?", ticker).Order("kuartal desc").First(&fundScore)

	var sentScore model.DailySentimentScore
	database.DB.Where("ticker = ?", ticker).Order("tanggal desc").First(&sentScore)

	var anomaly model.ForeignFlowAnomaly
	database.DB.Where("ticker = ?", ticker).Order("tanggal desc").First(&anomaly)

	anomalyStatus := anomaly.StatusAnomali
	if anomalyStatus == "" {
		anomalyStatus = "NORMAL"
	}

	var crowd model.DailyCrowdSentiment
	database.DB.Where("ticker = ?", ticker).Order("tanggal desc").First(&crowd)

	alert := composite.GenerateCompositeAlert(composite.AlertInput{
		Ticker:           ticker,
		FundamentalScore: fundScore.SkorAkhir,
		CompanySentiment: sentScore.CompanySentimentScore,
		PolicyExposure:   sentScore.PolicyExposureScore,
		ForeignAnomaly:   anomalyStatus,
		CrowdSentiment:   crowd.SentimentScore,
		BullishPercent:   crowd.BullishPercent,
		DivergenceStatus: crowd.DivergenceStatus,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(alert)
}

func HandleGetCompositeSummary(w http.ResponseWriter, r *http.Request) {
	trackedTickers := []string{"BBCA", "BBRI", "BMRI", "BBNI", "BBTN", "BDMN"}
	var summaries []model.CompositeAlertResponse

	for _, ticker := range trackedTickers {
		var fundScore model.FundamentalScore
		database.DB.Where("ticker = ?", ticker).Order("kuartal desc").First(&fundScore)

		var sentScore model.DailySentimentScore
		database.DB.Where("ticker = ?", ticker).Order("tanggal desc").First(&sentScore)

		var anomaly model.ForeignFlowAnomaly
		database.DB.Where("ticker = ?", ticker).Order("tanggal desc").First(&anomaly)

		anomalyStatus := anomaly.StatusAnomali
		if anomalyStatus == "" {
			anomalyStatus = "NORMAL"
		}

		var crowd model.DailyCrowdSentiment
		database.DB.Where("ticker = ?", ticker).Order("tanggal desc").First(&crowd)

		alert := composite.GenerateCompositeAlert(composite.AlertInput{
			Ticker:           ticker,
			FundamentalScore: fundScore.SkorAkhir,
			CompanySentiment: sentScore.CompanySentimentScore,
			PolicyExposure:   sentScore.PolicyExposureScore,
			ForeignAnomaly:   anomalyStatus,
			CrowdSentiment:   crowd.SentimentScore,
			BullishPercent:   crowd.BullishPercent,
			DivergenceStatus: crowd.DivergenceStatus,
		})
		summaries = append(summaries, alert)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(summaries)
}

