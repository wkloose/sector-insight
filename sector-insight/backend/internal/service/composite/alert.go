package composite

import (
	"fmt"
	"strings"

	"sector-insight/backend/internal/model"
)

type AlertInput struct {
	Ticker           string
	FundamentalScore float64
	CompanySentiment float64
	PolicyExposure   float64
	ForeignAnomaly   string
	CrowdSentiment   float64
	BullishPercent   float64
	DivergenceStatus string
}

func GenerateCompositeAlert(input AlertInput) model.CompositeAlertResponse {
	var overallStatus string
	var headline string
	var summaryParts []string
	var triggers []string

	isNetBuy := strings.Contains(input.ForeignAnomaly, "INFLOW")
	isNetSell := strings.Contains(input.ForeignAnomaly, "OUTFLOW")

	if (input.FundamentalScore > 0 && input.FundamentalScore < 60 && input.CrowdSentiment >= 0.50 && isNetSell) || input.DivergenceStatus == "POM_POM_WARNING" {
		overallStatus = "Perhatian Khusus"
		headline = "Bahaya Pom-Pom: Euforia Komunitas Tanpa Dasar Fundamental"
		summaryParts = append(summaryParts, fmt.Sprintf("Peringatan keras: Euforia komunitas ritel (%.0f%% Bullish) tidak didukung oleh kesehatan fundamental yang rentan (%.1f/100) maupun aliran dana institusional yang sedang keluar.", input.BullishPercent, input.FundamentalScore))
		triggers = append(triggers, "Euforia Ritel Ekstrem (CSS >= +0.50)", "Fundamental Rentan (<60)", "Distribusi Asing Aktif")

	} else if (input.FundamentalScore >= 65 && input.CrowdSentiment >= 0.50 && isNetSell) || input.DivergenceStatus == "EUPHORIA_DIVERGENCE" {
		overallStatus = "Perhatian Khusus"
		headline = "Peringatan Divergensi: Euforia Ritel vs Tekanan Distribusi Asing"
		summaryParts = append(summaryParts, fmt.Sprintf("Fundamental emiten tergolong kuat (%.1f/100), namun terjadi divergensi berisiko di mana antusiasme ritel (%.0f%% Bullish) bertolak belakang dengan distribusi masif broker institusi asing. Waspadai potensi jebakan likuiditas (exit liquidity).", input.FundamentalScore, input.BullishPercent))
		triggers = append(triggers, "Divergensi Ritel vs Asing (Euphoria Trap)", "Sentimen Komunitas Sangat Bullish (>80%)", "Tekanan Jual Institusi Global")

	} else if (input.CrowdSentiment <= -0.40 && isNetBuy) || input.DivergenceStatus == "PANIC_DIVERGENCE" {
		overallStatus = "Peluang Rebound"
		headline = "Sinyal Capitulation: Kepanikan Ritel di Tengah Akumulasi Institusional"
		summaryParts = append(summaryParts, fmt.Sprintf("Kepanikan ritel (%.0f%% Bearish) mereda menjadi titik akumulasi selektif oleh broker institusi asing (Net Buy). Sinyal pembalikan arah potensial didukung ketahanan finansial (Skor: %.1f/100).", 100.0-input.BullishPercent, input.FundamentalScore))
		triggers = append(triggers, "Capitulation Ritel (CSS <= -0.40)", "Akumulasi Beli Smart Money (Inflow Asing)", "Fundamental Solid")

	} else if input.FundamentalScore > 0 && input.FundamentalScore < 60 && input.PolicyExposure < -0.30 {
		overallStatus = "Perhatian Khusus"
		headline = "Perhatian: fundamental rentan dibarengi tekanan kebijakan makro"
		summaryParts = append(summaryParts, fmt.Sprintf("Skor fundamental berada di kuadran bawah (%.1f/100) ditambah sentimen kebijakan suku bunga yang berisiko menaikkan biaya dana dan memperberat kualitas kredit.", input.FundamentalScore))
		triggers = append(triggers, "Fundamental Rentan (<60)", "Tekanan Kebijakan Negatif (<-0.30)")
		if isNetSell {
			triggers = append(triggers, "Arus Keluar Asing Terdeteksi")
		}

	} else if input.FundamentalScore >= 60 && isNetBuy && input.CompanySentiment > 0.20 {
		overallStatus = "Peluang Akumulasi"
		headline = "Sinyal akumulasi kuat, didukung sentimen positif"
		summaryParts = append(summaryParts, fmt.Sprintf("Terdeteksi aktivitas beli asing tidak biasa (net buy) dalam sepekan terakhir, didukung sentimen berita perusahaan yang sangat positif (+%.2f) dan fundamental yang solid (%.1f/100).", input.CompanySentiment, input.FundamentalScore))
		triggers = append(triggers, "Akumulasi Beli Asing Tidak Biasa (Z-Score > +2.0)", "Sentimen Berita Positif (>0.20)", "Fundamental Sehat (>=60)")

	} else if input.FundamentalScore >= 75 && input.PolicyExposure < -0.30 {
		overallStatus = "Waspada"
		headline = "Fundamental kuat, tapi waspada tekanan kebijakan jangka pendek"
		summaryParts = append(summaryParts, fmt.Sprintf("Skor fundamental berada di posisi atas (%.1f/100), namun ada isu kebijakan suku bunga dan pengetatan makroekonomi yang berpotensi menekan margin dalam waktu dekat.", input.FundamentalScore))
		triggers = append(triggers, "Fundamental Tinggi (>=75)", "Tekanan Kebijakan Negatif (<-0.30)")
		if isNetSell {
			triggers = append(triggers, "Distribusi Asing Aktif")
		}

	} else if isNetSell && input.CompanySentiment < -0.20 {
		overallStatus = "Waspada"
		headline = "Waspada: aktivitas jual asing dibarengi sentimen negatif"
		summaryParts = append(summaryParts, fmt.Sprintf("Arus dana keluar asing yang signifikan bersamaan dengan tren pemberitaan negatif (%.2f).", input.CompanySentiment))
		triggers = append(triggers, "Distribusi Asing Ekstrem", "Sentimen Berita Negatif (<-0.20)")

	} else {
		overallStatus = "Stabil"
		headline = "Kondisi stabil, tidak ada sinyal gabungan yang signifikan saat ini"
		summaryParts = append(summaryParts, fmt.Sprintf("Kondisi fundamental emiten sehat (%.1f/100), pergerakan dana asing berada dalam batas wajar historisnya, sentimen berita berimbang, dan opini komunitas stabil.", input.FundamentalScore))
		triggers = append(triggers, "Kondisi Pasar Wajar", "Volatilitas Asing Normal (|Z| < 2.0)")
	}

	return model.CompositeAlertResponse{
		Ticker:           input.Ticker,
		OverallStatus:    overallStatus,
		Headline:         headline,
		SynthesisSummary: strings.Join(summaryParts, " "),
		FundamentalScore: input.FundamentalScore,
		CompanySentiment: input.CompanySentiment,
		PolicyExposure:   input.PolicyExposure,
		ForeignAnomaly:   input.ForeignAnomaly,
		CrowdSentiment:   input.CrowdSentiment,
		BullishPercent:   input.BullishPercent,
		DivergenceStatus: input.DivergenceStatus,
		TriggerFactors:   triggers,
	}
}

