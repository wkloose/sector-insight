package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"sector-insight/backend/internal/service/sector"
)

func HandleGetSectors(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	sectors, err := sector.GetAllSectors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"total":   len(sectors),
		"sectors": sectors,
	})
}

func HandleGetSectorRanking(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	ranking, err := sector.GetSectorRanking()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(ranking)
}

func HandleGetSectorAlerts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	alerts := sector.GetSectorRotationAlerts()
	json.NewEncoder(w).Encode(map[string]interface{}{
		"total":  len(alerts),
		"alerts": alerts,
	})
}

func HandleSectorDetailRouter(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	path := strings.TrimPrefix(r.URL.Path, "/api/v1/sectors/")
	parts := strings.Split(path, "/")
	if len(parts) == 0 || parts[0] == "" {
		http.Error(w, "Invalid sector path", http.StatusBadRequest)
		return
	}

	slug := strings.ToLower(parts[0])
	action := "overview"
	if len(parts) > 1 && parts[1] != "" {
		action = parts[1]
	}

	switch action {
	case "news":
		subsector := r.URL.Query().Get("sub_sector")
		limit := 20
		if lStr := r.URL.Query().Get("limit"); lStr != "" {
			if l, err := strconv.Atoi(lStr); err == nil {
				limit = l
			}
		}
		news, err := sector.GetSectorNews(slug, subsector, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(news)

	case "stocks":
		subsector := r.URL.Query().Get("sub_sector")
		stocks, err := sector.GetSectorStocks(slug, subsector)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{
			"sector_slug": slug,
			"total":       len(stocks),
			"stocks":      stocks,
		})

	case "movers":
		overview, err := sector.GetSectorOverview(slug)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{
			"sector_slug":  slug,
			"top_movers":   overview.TopMovers,
			"top_laggards": overview.TopLaggards,
		})

	default:
		overview, err := sector.GetSectorOverview(slug)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(overview)
	}
}

