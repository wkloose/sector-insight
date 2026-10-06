package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

func HandleGetFundamentalScores(w http.ResponseWriter, r *http.Request) {
	var scores []model.FundamentalScore

	err := database.DB.Order("skor_akhir desc").Find(&scores).Error
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}

func HandleGetFundamentalDetail(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/v1/fundamental-score/")
	ticker := strings.ToUpper(strings.Split(path, "/")[0])

	var score model.FundamentalScore
	err := database.DB.Where("ticker = ?", ticker).Order("created_at desc").First(&score).Error
	if err != nil {
		http.Error(w, "Bank ticker not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(score)
}

func HandleGetFundamentalHistory(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")

	if len(parts) < 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	ticker := strings.ToUpper(parts[4])

	var history []model.FundamentalScore
	err := database.DB.Where("ticker = ?", ticker).Order("kuartal asc").Find(&history).Error
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(history)
}

