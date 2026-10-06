package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"sector-insight/backend/internal/service/community"
)

func HandleCommunityPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodGet {
		ticker := r.URL.Query().Get("ticker")
		sortOrder := r.URL.Query().Get("sort")
		if sortOrder == "" {
			sortOrder = "hot"
		}
		limitStr := r.URL.Query().Get("limit")
		limit := 20
		if limitStr != "" {
			if parsed, err := strconv.Atoi(limitStr); err == nil && parsed > 0 {
				limit = parsed
			}
		}

		posts, err := community.GetPosts(ticker, sortOrder, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(posts)
		return
	}

	if r.Method == http.MethodPost {
		var body struct {
			Username     string `json:"username"`
			Ticker       string `json:"ticker"`
			Title        string `json:"title"`
			Content      string `json:"content"`
			SentimentTag string `json:"sentiment_tag"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid JSON request body", http.StatusBadRequest)
			return
		}
		if body.Username == "" {
			body.Username = "ritel_analis"
		}

		post, err := community.CreatePost(body.Username, body.Ticker, body.Title, body.Content, body.SentimentTag)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(post)
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func HandleCommunityVote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	path := strings.TrimPrefix(r.URL.Path, "/api/v1/community/posts/")
	parts := strings.Split(path, "/")
	if len(parts) < 2 || parts[1] != "vote" {
		http.Error(w, "Invalid URL path", http.StatusBadRequest)
		return
	}

	postID, err := strconv.ParseUint(parts[0], 10, 64)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	var body struct {
		Username  string `json:"username"`
		Direction int    `json:"direction"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	if body.Username == "" {
		body.Username = "ritel_voter"
	}

	newEffectiveScore, err := community.VotePost(uint(postID), body.Username, body.Direction)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":         true,
		"post_id":         postID,
		"effective_score": newEffectiveScore,
	})
}

func HandleCommunitySentiment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	path := strings.TrimPrefix(r.URL.Path, "/api/v1/community/")
	parts := strings.Split(path, "/")
	if len(parts) < 2 || parts[1] != "sentiment" {
		http.Error(w, "Invalid URL path", http.StatusBadRequest)
		return
	}
	ticker := strings.ToUpper(parts[0])

	sentiment, err := community.GetTickerSentiment(ticker)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(sentiment)
}

func HandleCommunityAlerts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	alerts := community.GetAllCommunityAlerts()
	json.NewEncoder(w).Encode(map[string]interface{}{
		"total":  len(alerts),
		"alerts": alerts,
	})
}

