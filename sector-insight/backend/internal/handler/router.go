package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"sector-insight/backend/internal/client/ai"
	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/service/sentiment"
)

func SetupRouter(cfg *config.Config, sectorsClient *sectors.Client, aiClient *ai.Client) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","service":"sector-insight-backend"}`))
	})

	mux.HandleFunc("/api/v1/sync/news", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		summary, err := sentiment.SyncLiveNewsFromSectors(cfg, sectorsClient, aiClient)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(summary)
	})

	mux.HandleFunc("/api/v1/fundamental-score", func(w http.ResponseWriter, r *http.Request) {
		HandleGetFundamentalScores(w, r)
	})
	mux.HandleFunc("/api/v1/fundamental-score/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/history") {
			HandleGetFundamentalHistory(w, r)
		} else {
			HandleGetFundamentalDetail(w, r)
		}
	})

	mux.HandleFunc("/api/v1/foreign-flow/summary", func(w http.ResponseWriter, r *http.Request) {
		HandleGetForeignFlowSummary(w, r)
	})
	mux.HandleFunc("/api/v1/foreign-flow/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/anomalies") {
			HandleGetForeignFlowAnomalies(w, r)
		} else {
			HandleGetForeignFlowHistory(w, r)
		}
	})

	mux.HandleFunc("/api/v1/sentiment/sector/", func(w http.ResponseWriter, r *http.Request) {
		HandleGetSectorSentiment(w, r)
	})
	mux.HandleFunc("/api/v1/sentiment/", func(w http.ResponseWriter, r *http.Request) {
		if strings.Contains(r.URL.Path, "/articles") {
			HandleGetSentimentArticles(w, r)
		} else {
			HandleGetSentimentByTicker(w, r)
		}
	})

	mux.HandleFunc("/api/v1/composite-alert/summary", func(w http.ResponseWriter, r *http.Request) {
		HandleGetCompositeSummary(w, r)
	})
	mux.HandleFunc("/api/v1/composite-alert/", func(w http.ResponseWriter, r *http.Request) {
		HandleGetCompositeAlert(w, r)
	})

	mux.HandleFunc("/api/v1/stocks/", func(w http.ResponseWriter, r *http.Request) {
		if strings.Contains(r.URL.Path, "/beginner-brief") {
			HandleGetBeginnerBrief(w, r)
		} else {
			http.NotFound(w, r)
		}
	})
	mux.HandleFunc("/api/v1/glossary", func(w http.ResponseWriter, r *http.Request) {
		HandleGetGlossary(w, r)
	})

	mux.HandleFunc("/api/v1/community/posts", func(w http.ResponseWriter, r *http.Request) {
		HandleCommunityPosts(w, r)
	})
	mux.HandleFunc("/api/v1/community/posts/", func(w http.ResponseWriter, r *http.Request) {
		if strings.Contains(r.URL.Path, "/vote") {
			HandleCommunityVote(w, r)
		} else {
			HandleCommunityPosts(w, r)
		}
	})
	mux.HandleFunc("/api/v1/community/alerts", func(w http.ResponseWriter, r *http.Request) {
		HandleCommunityAlerts(w, r)
	})
	mux.HandleFunc("/api/v1/community/", func(w http.ResponseWriter, r *http.Request) {
		if strings.Contains(r.URL.Path, "/sentiment") {
			HandleCommunitySentiment(w, r)
		} else {
			http.NotFound(w, r)
		}
	})

	mux.HandleFunc("/api/v1/sectors", func(w http.ResponseWriter, r *http.Request) {
		HandleGetSectors(w, r)
	})
	mux.HandleFunc("/api/v1/sectors/ranking", func(w http.ResponseWriter, r *http.Request) {
		HandleGetSectorRanking(w, r)
	})
	mux.HandleFunc("/api/v1/sectors/alerts", func(w http.ResponseWriter, r *http.Request) {
		HandleGetSectorAlerts(w, r)
	})
	mux.HandleFunc("/api/v1/sectors/", func(w http.ResponseWriter, r *http.Request) {
		HandleSectorDetailRouter(w, r)
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{
			"service": "sector-insight-backend",
			"status": "online",
			"frontend_url": "http://localhost:3000",
			"endpoints": {
				"health": "/health",
				"composite_alert": "/api/v1/composite-alert/summary",
				"fundamental_score": "/api/v1/fundamental-score",
				"foreign_flow": "/api/v1/foreign-flow/summary",
				"sentiment": "/api/v1/sentiment/BBRI",
				"sync_news": "/api/v1/sync/news"
			}
		}`))
	})

	return enableCORS(mux)
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

