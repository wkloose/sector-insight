package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

func HandleGetForeignFlowHistory(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/v1/foreign-flow/")
	ticker := strings.ToUpper(strings.Split(path, "/")[0])

	var flows []model.DailyForeignFlow
	err := database.DB.Where("ticker = ?", ticker).Order("tanggal desc").Limit(90).Find(&flows).Error
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(flows)
}

func HandleGetForeignFlowAnomalies(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	ticker := strings.ToUpper(parts[4])

	var anomalies []model.ForeignFlowAnomaly
	err := database.DB.Preload("BrokerDetails").Where("ticker = ? AND status_anomali != 'NORMAL'", ticker).Order("tanggal desc").Limit(30).Find(&anomalies).Error
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(anomalies)
}

func HandleGetForeignFlowSummary(w http.ResponseWriter, r *http.Request) {
	var latestAnomalies []model.ForeignFlowAnomaly

	err := database.DB.Preload("BrokerDetails").Where("status_anomali != 'NORMAL'").Order("tanggal desc").Limit(20).Find(&latestAnomalies).Error
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(latestAnomalies)
}

