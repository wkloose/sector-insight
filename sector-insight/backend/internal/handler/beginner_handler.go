package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"sector-insight/backend/internal/service/beginner"
)

func HandleGetBeginnerBrief(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/api/v1/stocks/")
	parts := strings.Split(path, "/")
	if len(parts) == 0 || parts[0] == "" {
		http.Error(w, "Ticker is required", http.StatusBadRequest)
		return
	}
	ticker := strings.ToUpper(parts[0])

	brief, err := beginner.GenerateOrGetBeginnerBrief(ticker)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(brief)
}

func HandleGetGlossary(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	glossary := beginner.GetGlossaryList()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"total": len(glossary),
		"items": glossary,
	})
}

