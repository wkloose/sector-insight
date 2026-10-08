package community

import (
	"fmt"
	"math"
	"strings"
	"time"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

type CommunityAlertDTO struct {
	Ticker         string    `json:"ticker"`
	AlertType      string    `json:"alert_type"`
	Severity       string    `json:"severity"`
	Headline       string    `json:"headline"`
	CrowdSummary   string    `json:"crowd_summary"`
	ForeignSummary string    `json:"foreign_summary"`
	Synthesis      string    `json:"synthesis"`
	CreatedAt      time.Time `json:"created_at"`
}

func DetectDivergenceStatus(ticker string, css float64, zBuzz float64, bullishPercent float64) string {
	upperTicker := strings.ToUpper(ticker)

	var flow model.ForeignFlowAnomaly
	zForeign := 0.0
	if err := database.DB.Where("ticker = ?", upperTicker).Order("tanggal desc").First(&flow).Error; err == nil {
		zForeign = flow.ZScore
	}

	var fund model.FundamentalScore
	fundScore := 50.0
	if err := database.DB.Where("ticker = ?", upperTicker).Order("kuartal desc").First(&fund).Error; err == nil && fund.SkorAkhir > 0 {
		fundScore = fund.SkorAkhir
	}

	if fundScore < 60 && zForeign <= -1.5 && css >= 0.6 {
		return "POM_POM_WARNING"
	}

	if (css >= 0.40 || bullishPercent >= 70.0) && zForeign <= -2.0 {
		return "EUPHORIA_DIVERGENCE"
	}

	if (css <= -0.40 || bullishPercent <= 30.0) && zForeign >= 2.0 {
		return "PANIC_DIVERGENCE"
	}

	if zBuzz >= 2.5 {
		return "BUZZ_SURGE"
	}

	return "NORMAL"
}

func GetAllCommunityAlerts() []CommunityAlertDTO {
	var tickers []string
	database.DB.Model(&model.DailyCrowdSentiment{}).Distinct("ticker").Pluck("ticker", &tickers)
	if len(tickers) == 0 {
		tickers = []string{"BBRI", "BBCA", "BMRI", "BBNI", "BBTN", "BRIS"}
	}
	alerts := []CommunityAlertDTO{}

	for _, t := range tickers {
		var crowd model.DailyCrowdSentiment
		if err := database.DB.Where("ticker = ?", t).Order("tanggal desc").First(&crowd).Error; err != nil {
			continue
		}

		var flow model.ForeignFlowAnomaly
		var zForeign float64 = 0.0
		var netFlowVal float64 = 0.0
		if err := database.DB.Where("ticker = ?", t).Order("tanggal desc").First(&flow).Error; err == nil {
			zForeign = flow.ZScore
			netFlowVal = flow.NetForeignInflow
		}

		netFlowMiliar := math.Round(netFlowVal/1000000000.0*10) / 10

		switch crowd.DivergenceStatus {
		case "EUPHORIA_DIVERGENCE":
			alerts = append(alerts, CommunityAlertDTO{
				Ticker:    t,
				AlertType: "EUPHORIA_DIVERGENCE",
				Severity:  "CRITICAL",
				Headline:  fmt.Sprintf("%s ⚠️ PERINGATAN DIVERGENSI: Euforia Komunitas Ritel vs Tekanan Distribusi Asing", t),
				CrowdSummary: fmt.Sprintf("Konsensus Komunitas: %.0f%% Bullish (Skor Sentimen: +%.2f, Diskusi melonjak %.1fx normal)",
					crowd.BullishPercent, crowd.SentimentScore, crowd.DiscussionZScore),
				ForeignSummary: fmt.Sprintf("Kondisi Asing: Anomali Outflow Ekstrem (Net Outflow Rp %.1f Miliar, Z-Score: %.2fσ)",
					math.Abs(netFlowMiliar), zForeign),
				Synthesis: "Mayoritas investor ritel menyerap tekanan jual broker institusional. Waspadai potensi jebakan likuiditas ritel (exit liquidity) di area support.",
				CreatedAt: crowd.Tanggal,
			})

		case "PANIC_DIVERGENCE":
			alerts = append(alerts, CommunityAlertDTO{
				Ticker:    t,
				AlertType: "PANIC_DIVERGENCE",
				Severity:  "OPPORTUNITY",
				Headline:  fmt.Sprintf("%s 💡 PERINGATAN CAPITULATION: Kepanikan Ritel di Tengah Akumulasi Institusional Asing", t),
				CrowdSummary: fmt.Sprintf("Konsensus Komunitas: %.0f%% Bearish (Sentimen Negatif %.2f akibat kekhawatiran jangka pendek)",
					100.0-crowd.BullishPercent, crowd.SentimentScore),
				ForeignSummary: fmt.Sprintf("Kondisi Asing: Anomali Inflow Institusi Asing (+Rp %.1f Miliar, Z-Score: +%.2fσ)",
					netFlowMiliar, zForeign),
				Synthesis: "Sentimen ritel tertekan kepanikan jangka pendek, namun broker institusi memanfaatkan koreksi harga untuk akumulasi selektif. Fundamental emiten tetap solid.",
				CreatedAt: crowd.Tanggal,
			})

		case "BUZZ_SURGE":
			alerts = append(alerts, CommunityAlertDTO{
				Ticker:    t,
				AlertType: "BUZZ_SURGE",
				Severity:  "WARNING",
				Headline:  fmt.Sprintf("%s ⚡ LONJAKAN DISKUSI: Volume Percakapan Komunitas Melonjak %.1fσ di Atas Normal", t, crowd.DiscussionZScore),
				CrowdSummary: fmt.Sprintf("Perbincangan komunitas meningkat agresif dengan total %d postingan baru dalam 24 jam.", crowd.TotalPosts),
				ForeignSummary: fmt.Sprintf("Arus Asing: Z-Score %.2fσ", zForeign),
				Synthesis: "Periksa keabsahan rumor atau katalis berita sebelum mengambil keputusan transaksi agresif.",
				CreatedAt: crowd.Tanggal,
			})
		}
	}

	return alerts
}

