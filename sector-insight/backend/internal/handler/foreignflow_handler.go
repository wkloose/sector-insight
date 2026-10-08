package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
	"sector-insight/backend/internal/service/foreignflow"
)

func HandleGetMarketForeignFlow(w http.ResponseWriter, r *http.Request) {
	summary, err := foreignflow.GetMarketForeignFlowSummary()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(summary)
}

func HandleGetAllStockForeignFlows(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	sector := r.URL.Query().Get("sector")
	filter := r.URL.Query().Get("filter")
	limitStr := r.URL.Query().Get("limit")

	limit := 50
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	flows := foreignflow.GetStockForeignFlows(q, sector, filter, limit)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(flows)
}

func HandleGetForeignFlowHistory(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/v1/foreign-flow/")
	ticker := strings.ToUpper(strings.Split(path, "/")[0])
	if ticker == "" || ticker == "MARKET" || ticker == "STOCKS" || ticker == "SUMMARY" {
		http.Error(w, "Invalid ticker", http.StatusBadRequest)
		return
	}

	_ = foreignflow.EnsureStockForeignFlowHistory(ticker)

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
	if ticker == "" || ticker == "MARKET" || ticker == "STOCKS" || ticker == "SUMMARY" {
		http.Error(w, "Invalid ticker", http.StatusBadRequest)
		return
	}

	_ = foreignflow.EnsureStockForeignFlowHistory(ticker)

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
