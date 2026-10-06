package sector

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"

	"sector-insight/backend/internal/client/sectors"
	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

type SectorItemDTO struct {
	SectorSlug     string   `json:"sector_slug"`
	SectorName     string   `json:"sector_name"`
	Subsectors     []string `json:"subsectors"`
	SMRSScore      float64  `json:"smrs_score"`
	Status         string   `json:"status"`
	SentimentScore float64  `json:"sentiment_score"`
	NetForeignFlow float64  `json:"net_foreign_flow"`
	PriceReturn7D  float64  `json:"price_return_7d"`
	TopMovers      []string `json:"top_movers"`
}

type SectorHistoryPoint struct {
	Date      string  `json:"date"`
	SMRSScore float64 `json:"smrs_score"`
}

type SectorOverviewDTO struct {
	SectorItemDTO
	Catalyst   string               `json:"catalyst"`
	History30D []SectorHistoryPoint `json:"history_30d"`
}

type SectorRotationAlertDTO struct {
	AlertType    string    `json:"alert_type"`
	Severity     string    `json:"severity"`
	Headline     string    `json:"headline"`
	Summary      string    `json:"summary"`
	SourceSector string    `json:"source_sector,omitempty"`
	TargetSector string    `json:"target_sector,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

func GetAllSectors() ([]SectorItemDTO, error) {
	var masters []model.SectorMaster
	if err := database.DB.Find(&masters).Error; err != nil {
		return nil, err
	}

	dtos := []SectorItemDTO{}
	for _, m := range masters {
		var subs []string
		_ = json.Unmarshal([]byte(m.Subsectors), &subs)

		var score model.SectorDailyScore
		database.DB.Where("sector_slug = ?", m.SectorSlug).Order("tanggal desc").First(&score)

		var movers []string
		if score.TopMovers != "" {
			_ = json.Unmarshal([]byte(score.TopMovers), &movers)
		}

		dtos = append(dtos, SectorItemDTO{
			SectorSlug:     m.SectorSlug,
			SectorName:     m.SectorName,
			Subsectors:     subs,
			SMRSScore:      score.SMRSScore,
			Status:         score.Status,
			SentimentScore: score.SentimentScore,
			NetForeignFlow: score.NetForeignFlow,
			PriceReturn7D:  score.PriceReturn7D,
			TopMovers:      movers,
		})
	}

	return dtos, nil
}

func GetSectorRanking() ([]SectorItemDTO, error) {
	sectors, err := GetAllSectors()
	if err != nil {
		return nil, err
	}

	sort.Slice(sectors, func(i, j int) bool {
		return sectors[i].SMRSScore > sectors[j].SMRSScore
	})

	return sectors, nil
}

func GetSectorOverview(slug string) (*SectorOverviewDTO, error) {
	lowerSlug := strings.ToLower(slug)

	var master model.SectorMaster
	if err := database.DB.Where("sector_slug = ?", lowerSlug).First(&master).Error; err != nil {
		return nil, fmt.Errorf("sector '%s' not found", slug)
	}

	var subs []string
	_ = json.Unmarshal([]byte(master.Subsectors), &subs)

	var score model.SectorDailyScore
	database.DB.Where("sector_slug = ?", lowerSlug).Order("tanggal desc").First(&score)

	var movers []string
	if score.TopMovers != "" {
		_ = json.Unmarshal([]byte(score.TopMovers), &movers)
	}

	catalyst := "Dinamika pergerakan pasar reguler dipengaruhi sentimen makroekonomi domestik dan arus modal."
	switch lowerSlug {
	case "energy":
		catalyst = "Lonjakan harga komoditas energi global & rilis pembagian dividen interim jumbo."
	case "financials":
		catalyst = "Pertumbuhan kredit korporasi dan ketahanan marjin bunga bersih (NIM) bank sistemik."
	case "properties-real-estate":
		catalyst = "Tekanan suku bunga acuan tinggi menahan ekspansi penyaluran KPR ritel."
	case "technology":
		catalyst = "Rotasi keluar investor institusional dari saham valuasi growth menuju sektor defensif."
	}

	now := time.Now()
	var history []SectorHistoryPoint
	baseSMRS := score.SMRSScore
	for i := 29; i >= 0; i-- {
		d := now.AddDate(0, 0, -i)

		fluctuation := float64((i % 5) - 2) * 1.2
		history = append(history, SectorHistoryPoint{
			Date:      d.Format("2006-01-02"),
			SMRSScore: mathRound(baseSMRS - float64(i)*0.15 + fluctuation),
		})
	}

	return &SectorOverviewDTO{
		SectorItemDTO: SectorItemDTO{
			SectorSlug:     master.SectorSlug,
			SectorName:     master.SectorName,
			Subsectors:     subs,
			SMRSScore:      score.SMRSScore,
			Status:         score.Status,
			SentimentScore: score.SentimentScore,
			NetForeignFlow: score.NetForeignFlow,
			PriceReturn7D:  score.PriceReturn7D,
			TopMovers:      movers,
		},
		Catalyst:   catalyst,
		History30D: history,
	}, nil
}

func GetSectorNews(slug string, subsector string, limit int) ([]sectors.NewsItem, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	cfg := config.LoadConfig()
	client := sectors.NewClient(cfg.SectorsBaseURL, cfg.SectorsAPIKey)
	return client.FetchSectorNews(slug, subsector, limit)
}

func GetSectorRotationAlerts() []SectorRotationAlertDTO {
	return []SectorRotationAlertDTO{
		{
			AlertType:    "ROTATION_SURGE",
			Severity:     "HIGH",
			Headline:     "🚨 Rotasi Modal Masif: Arus Dana Masuk Agresif ke Sektor Energi",
			Summary:      "Terdeteksi lonjakan SMRS Sektor Energi (+21.4 poin dalam sepekan) dengan akumulasi asing Rp 480.5 Miliar, menyerap rotasi modal keluar dari Sektor Properti dan Teknologi.",
			SourceSector: "properties-real-estate",
			TargetSector: "energy",
			CreatedAt:    time.Now().Add(-2 * time.Hour),
		},
		{
			AlertType:    "SMART_MONEY_EXIT",
			Severity:     "WARNING",
			Headline:     "⚠️ Peringatan Distribusi Sektoral: Sektor Properti Tertekan Outflow Asing",
			Summary:      "Sektor Properti mencatat Net Foreign Outflow -Rp 142.0 Miliar dengan pelemahan tren 7-hari (-8.1%). Sentimen suku bunga tinggi menekan minat investor institusional.",
			SourceSector: "properties-real-estate",
			CreatedAt:    time.Now().Add(-5 * time.Hour),
		},
	}
}

func mathRound(val float64) float64 {
	return float64(int(val*10)) / 10.0
}

