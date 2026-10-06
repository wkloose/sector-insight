package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"time"

	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

func main() {
	fmt.Println("================================================================")
	fmt.Println("  SEEDING COMPLETE 90-DAY TIME SERIES & HACKATHON DEMO SCENARIOS")
	fmt.Println("================================================================")

	cfg := config.LoadConfig()
	db, err := database.InitDB(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	fmt.Println("[1/5] Resetting tables for clean demonstration state...")
	db.Exec("DELETE FROM anomaly_broker_details")
	db.Exec("DELETE FROM foreign_flow_anomalies")
	db.Exec("DELETE FROM daily_foreign_flows")
	db.Exec("DELETE FROM processed_articles")
	db.Exec("DELETE FROM raw_articles")
	db.Exec("DELETE FROM daily_sentiment_scores")
	db.Exec("DELETE FROM fundamental_scores")
	db.Exec("DELETE FROM bank_quarterly_raws")

	now := time.Now()

	fmt.Println("[2/5] Seeding 8 quarters of fundamental history (2024-Q1 to 2025-Q4)...")

	quarters := []string{"2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"}

	bbcaScores := []float64{81.2, 82.5, 83.1, 84.0, 85.2, 86.0, 87.0, 88.5}
	for i, q := range quarters {
		db.Create(&model.FundamentalScore{
			Ticker:             "BBCA",
			Kuartal:            q,
			NIMScore:           85.0 + float64(i)*0.5,
			LDRScore:           86.0,
			LoanGrowthScore:    80.0 + float64(i)*0.4,
			DepositGrowthScore: 84.0,
			ROEScore:           92.0 + float64(i)*0.3,
			KonsistensiScore:   95.0,
			DividendScore:      88.0,
			SkorAkhir:          bbcaScores[i],
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          now.AddDate(0, -((len(quarters)-i)*3), 0),
		})
	}

	bbriScores := []float64{86.0, 86.5, 87.0, 86.8, 86.0, 85.5, 85.1, 84.8}
	for i, q := range quarters {
		db.Create(&model.FundamentalScore{
			Ticker:             "BBRI",
			Kuartal:            q,
			NIMScore:           92.0,
			LDRScore:           84.0,
			LoanGrowthScore:    79.0 - float64(i)*0.3,
			DepositGrowthScore: 81.0,
			ROEScore:           89.0,
			KonsistensiScore:   85.0,
			DividendScore:      90.0,
			SkorAkhir:          bbriScores[i],
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          now.AddDate(0, -((len(quarters)-i)*3), 0),
		})
	}

	bmriScores := []float64{80.0, 81.0, 82.0, 83.0, 83.5, 84.2, 84.9, 85.2}
	for i, q := range quarters {
		db.Create(&model.FundamentalScore{
			Ticker:             "BMRI",
			Kuartal:            q,
			NIMScore:           85.0,
			LDRScore:           88.0,
			LoanGrowthScore:    84.0,
			DepositGrowthScore: 83.0,
			ROEScore:           87.0,
			KonsistensiScore:   88.0,
			DividendScore:      82.0,
			SkorAkhir:          bmriScores[i],
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          now.AddDate(0, -((len(quarters)-i)*3), 0),
		})
	}

	bbniScores := []float64{74.0, 75.0, 76.2, 77.0, 77.5, 78.0, 78.8, 79.5}
	for i, q := range quarters {
		db.Create(&model.FundamentalScore{
			Ticker:             "BBNI",
			Kuartal:            q,
			NIMScore:           76.0,
			LDRScore:           82.0,
			LoanGrowthScore:    75.0,
			DepositGrowthScore: 78.0,
			ROEScore:           80.0,
			KonsistensiScore:   82.0,
			DividendScore:      75.0,
			SkorAkhir:          bbniScores[i],
			HealthStatus:       "Sehat",
			CreatedAt:          now.AddDate(0, -((len(quarters)-i)*3), 0),
		})
	}

	bdmnScores := []float64{65.0, 66.0, 67.2, 67.8, 68.0, 68.5, 69.2, 70.0}
	for i, q := range quarters {
		db.Create(&model.FundamentalScore{
			Ticker:             "BDMN",
			Kuartal:            q,
			NIMScore:           70.0,
			LDRScore:           76.0,
			LoanGrowthScore:    68.0,
			DepositGrowthScore: 70.0,
			ROEScore:           72.0,
			KonsistensiScore:   70.0,
			DividendScore:      68.0,
			SkorAkhir:          bdmnScores[i],
			HealthStatus:       "Sehat",
			CreatedAt:          now.AddDate(0, -((len(quarters)-i)*3), 0),
		})
	}

	bbtnScores := []float64{56.0, 56.5, 57.0, 56.8, 55.5, 55.0, 54.2, 53.8}
	for i, q := range quarters {
		db.Create(&model.FundamentalScore{
			Ticker:             "BBTN",
			Kuartal:            q,
			NIMScore:           52.0,
			LDRScore:           62.0,
			LoanGrowthScore:    58.0,
			DepositGrowthScore: 55.0,
			ROEScore:           56.0,
			KonsistensiScore:   50.0,
			DividendScore:      52.0,
			SkorAkhir:          bbtnScores[i],
			HealthStatus:       "Cukup",
			CreatedAt:          now.AddDate(0, -((len(quarters)-i)*3), 0),
		})
	}

	fmt.Println("[3/5] Seeding 90 days continuous Foreign Flow time-series per bank...")

	r := rand.New(rand.NewSource(42))

	for day := 89; day >= 0; day-- {
		t := now.AddDate(0, 0, -day)

		if t.Weekday() == time.Saturday || t.Weekday() == time.Sunday {
			continue
		}

		bbcaFlow := 25000000000.0 + r.NormFloat64()*30000000000.0
		if day == 2 {

			bbcaFlow = 220000000000.0
		}
		db.Create(&model.DailyForeignFlow{
			Ticker:           "BBCA",
			Tanggal:          t,
			NetForeignInflow: math.Round(bbcaFlow),
			CreatedAt:        t,
		})

		bbriFlow := -5000000000.0 + r.NormFloat64()*35000000000.0
		if day == 1 {

			bbriFlow = -145000000000.0
		}
		db.Create(&model.DailyForeignFlow{
			Ticker:           "BBRI",
			Tanggal:          t,
			NetForeignInflow: math.Round(bbriFlow),
			CreatedAt:        t,
		})

		bmriFlow := 10000000000.0 + r.NormFloat64()*20000000000.0
		db.Create(&model.DailyForeignFlow{
			Ticker:           "BMRI",
			Tanggal:          t,
			NetForeignInflow: math.Round(bmriFlow),
			CreatedAt:        t,
		})

		bbtnFlow := -8000000000.0 + r.NormFloat64()*15000000000.0
		if day == 4 {
			bbtnFlow = -48000000000.0
		}
		db.Create(&model.DailyForeignFlow{
			Ticker:           "BBTN",
			Tanggal:          t,
			NetForeignInflow: math.Round(bbtnFlow),
			CreatedAt:        t,
		})
	}

	anomalyBBCA := model.ForeignFlowAnomaly{
		Ticker:           "BBCA",
		Tanggal:          now.AddDate(0, 0, -2),
		NetForeignInflow: 220000000000,
		ZScore:           2.68,
		StatusAnomali:    "ANOMALI_INFLOW",
		CreatedAt:        now,
	}
	db.Create(&anomalyBBCA)
	db.Create(&model.AnomalyBrokerDetail{
		AnomalyID:  anomalyBBCA.ID,
		KodeBroker: "AK",
		NamaBroker: "UBS Sekuritas",
		Kategori:   "Asing-Institusional",
		NetValue:   135000000000,
		CreatedAt:  now,
	})
	db.Create(&model.AnomalyBrokerDetail{
		AnomalyID:  anomalyBBCA.ID,
		KodeBroker: "ZP",
		NamaBroker: "Maybank Kim Eng",
		Kategori:   "Asing-Institusional",
		NetValue:   55000000000,
		CreatedAt:  now,
	})

	anomalyBBRI := model.ForeignFlowAnomaly{
		Ticker:           "BBRI",
		Tanggal:          now.AddDate(0, 0, -1),
		NetForeignInflow: -145000000000,
		ZScore:           -2.82,
		StatusAnomali:    "ANOMALI_OUTFLOW",
		CreatedAt:        now,
	}
	db.Create(&anomalyBBRI)
	db.Create(&model.AnomalyBrokerDetail{
		AnomalyID:  anomalyBBRI.ID,
		KodeBroker: "CS",
		NamaBroker: "Credit Suisse",
		Kategori:   "Asing-Institusional",
		NetValue:   -89000000000,
		CreatedAt:  now,
	})
	db.Create(&model.AnomalyBrokerDetail{
		AnomalyID:  anomalyBBRI.ID,
		KodeBroker: "MS",
		NamaBroker: "Morgan Stanley",
		Kategori:   "Asing-Institusional",
		NetValue:   -42000000000,
		CreatedAt:  now,
	})

	anomalyBBTN := model.ForeignFlowAnomaly{
		Ticker:           "BBTN",
		Tanggal:          now.AddDate(0, 0, -4),
		NetForeignInflow: -48000000000,
		ZScore:           -2.25,
		StatusAnomali:    "ANOMALI_OUTFLOW",
		CreatedAt:        now,
	}
	db.Create(&anomalyBBTN)
	db.Create(&model.AnomalyBrokerDetail{
		AnomalyID:  anomalyBBTN.ID,
		KodeBroker: "CC",
		NamaBroker: "Mandiri Sekuritas",
		Kategori:   "Domestik-Institusional",
		NetValue:   -28000000000,
		CreatedAt:  now,
	})

	fmt.Println("[4/5] Seeding 30-day sentiment trajectories & evidence articles...")

	for day := 29; day >= 0; day-- {
		t := now.AddDate(0, 0, -day)

		db.Create(&model.DailySentimentScore{
			Ticker:                "BBCA",
			Tanggal:               t,
			CompanySentimentScore: 0.55 + r.Float64()*0.15,
			PolicyExposureScore:   -0.10 + r.Float64()*0.05,
			JumlahArtikelCompany:  12 + r.Intn(5),
			JumlahArtikelPolicy:   6 + r.Intn(3),
			CreatedAt:             t,
		})

		db.Create(&model.DailySentimentScore{
			Ticker:                "BBRI",
			Tanggal:               t,
			CompanySentimentScore: 0.25 + r.Float64()*0.10,
			PolicyExposureScore:   -0.35 - r.Float64()*0.10,
			JumlahArtikelCompany:  10 + r.Intn(4),
			JumlahArtikelPolicy:   14 + r.Intn(6),
			CreatedAt:             t,
		})

		db.Create(&model.DailySentimentScore{
			Ticker:                "BMRI",
			Tanggal:               t,
			CompanySentimentScore: 0.05 + r.Float64()*0.10,
			PolicyExposureScore:   -0.08 + r.Float64()*0.04,
			JumlahArtikelCompany:  8 + r.Intn(3),
			JumlahArtikelPolicy:   5 + r.Intn(3),
			CreatedAt:             t,
		})

		db.Create(&model.DailySentimentScore{
			Ticker:                "BBTN",
			Tanggal:               t,
			CompanySentimentScore: -0.25 - r.Float64()*0.08,
			PolicyExposureScore:   -0.35 - r.Float64()*0.05,
			JumlahArtikelCompany:  6 + r.Intn(2),
			JumlahArtikelPolicy:   9 + r.Intn(3),
			CreatedAt:             t,
		})
	}

	sampleArticles := []struct {
		Ticker     string
		Judul      string
		Snippet    string
		Category   string
		Sentiment  float64
		Confidence float64
		Reason     string
		Entities   []string
		URL        string
	}{
		{
			Ticker:     "BBCA",
			Judul:      "BCA Catatkan Pertumbuhan Kredit 12% YoY, Lampaui Estimasi Konsensus",
			Snippet:    "Kinerja intermediasi BBCA melaju pesat berkat ekspansi kredit korporasi dan konsumer yang solid di kuartal III.",
			Category:   "company_specific",
			Sentiment:  0.72,
			Confidence: 0.92,
			Reason:     "Pertumbuhan kredit 12% YoY melampaui estimasi rata-rata analis pasar modal.",
			Entities:   []string{"BBCA"},
			URL:        "https://finansial.bisnis.com/read/bbca-kredit-tumbuh-pesat",
		},
		{
			Ticker:     "BBCA",
			Judul:      "Rasio CASA BCA Sentuh 82%, Menjaga Beban Bunga Tetap Rendah di Tengah Era Bunga Tinggi",
			Snippet:    "Keunggulan pendanaan murah (CASA) melindungi Net Interest Margin (NIM) BCA dari lonjakan suku bunga acuan.",
			Category:   "company_specific",
			Sentiment:  0.65,
			Confidence: 0.88,
			Reason:     "CASA 82% menjadi bantalan kokoh margin bunga bersih emiten.",
			Entities:   []string{"BBCA"},
			URL:        "https://investor.id/market/bca-casa-tertinggi-perbankan",
		},
		{
			Ticker:     "BBRI",
			Judul:      "Wacana Kenaikan BI-Rate Berpotensi Menekan Margin Bunga dan Daya Beli Debitur UMKM",
			Snippet:    "Analis menilai pengetatan likuiditas dan kenaikan suku bunga Bank Indonesia akan memperlambat ekspansi kredit mikro BRI.",
			Category:   "macro_policy",
			Sentiment:  -0.42,
			Confidence: 0.89,
			Reason:     "Kebijakan pengetatan suku bunga berdampak langsung menekan segmen kredit mikro dan biaya dana.",
			Entities:   []string{"perbankan", "multifinance"},
			URL:        "https://market.bisnis.com/read/bi-rate-tekan-margin-mikro-bri",
		},
		{
			Ticker:     "BBRI",
			Judul:      "BRI Tingkatkan Pencadangan NPL Antisipasi Pelemahan Kualitas Aset Pasca Restrukturisasi",
			Snippet:    "Langkah kehati-hatian manajemen BRI menaikkan pencadangan diperkirakan menahan laju pertumbuhan laba bersih tahun berjalan.",
			Category:   "company_specific",
			Sentiment:  -0.20,
			Confidence: 0.85,
			Reason:     "Peningkatan biaya provisi (cost of credit) menahan profitabilitas kuartalan.",
			Entities:   []string{"BBRI"},
			URL:        "https://cnbcindonesia.com/market/bri-cadangan-npl-naik",
		},
		{
			Ticker:     "BMRI",
			Judul:      "Bank Mandiri Salurkan Pembiayaan Hijau dan Sindikasi Korporasi Rp 125 Triliun",
			Snippet:    "Ekspansi kredit korporasi Bank Mandiri terus tumbuh stabil sejalan dengan proyek strategis nasional.",
			Category:   "company_specific",
			Sentiment:  0.40,
			Confidence: 0.86,
			Reason:     "Portofolio sindikasi korporasi menunjukkan likuiditas dan kepercayaan institusi yang solid.",
			Entities:   []string{"BMRI"},
			URL:        "https://kontan.co.id/news/mandiri-sindikasi-hijau-125t",
		},
		{
			Ticker:     "BBTN",
			Judul:      "Beban Bunga Dana Mahal Tekan Margin BTN, Restrukturisasi KPR Subsidi Berlanjut",
			Snippet:    "Kenaikan suku bunga acuan menaikkan biaya dana BTN sementara yield KPR fixed rate sulit dinaikkan cepat.",
			Category:   "company_specific",
			Sentiment:  -0.45,
			Confidence: 0.90,
			Reason:     "Mismatch durasi pendanaan jangka pendek vs KPR jangka panjang menekan margin laba.",
			Entities:   []string{"BBTN"},
			URL:        "https://katadata.co.id/finansial/btn-margin-tertekan-bunga-tinggi",
		},
	}

	for _, art := range sampleArticles {
		raw := model.RawArticle{
			ExternalID:       art.URL,
			Ticker:           art.Ticker,
			Judul:            art.Judul,
			Snippet:          art.Snippet,
			URL:              art.URL,
			TanggalPublikasi: now.AddDate(0, 0, -r.Intn(7)),
			Tags:             `["Banking", "Earnings", "Monetary Policy"]`,
			StatusDiproses:   true,
			CreatedAt:        now,
		}
		db.Create(&raw)

		entitiesJSON, _ := json.Marshal(art.Entities)
		db.Create(&model.ProcessedArticle{
			ArticleID:        raw.ID,
			Category:         art.Category,
			AffectedEntities: string(entitiesJSON),
			SentimentScore:   art.Sentiment,
			Confidence:       art.Confidence,
			Reasoning:        art.Reason,
			CreatedAt:        now,
		})
	}

	fmt.Println("[5/5] All tables successfully populated with rich 4-bank hackathon scenarios!")
	fmt.Println("================================================================")
	fmt.Println("  DEMO SCENARIOS PREPARED:")
	fmt.Println("  1. BBCA -> [PERHATIAN KHUSUS - PELUANG] Akumulasi Institusional Asing + Sentimen Positif")
	fmt.Println("  2. BBRI -> [WASPADA] Fundamental Kuat vs Tekanan Kebijakan Makro + Net Outflow Asing")
	fmt.Println("  3. BMRI -> [STABIL] Fundamental Sehat + Aliran Dana Normal + Sentimen Seimbang")
	fmt.Println("  4. BBTN -> [PERHATIAN KHUSUS - RISIKO] Fundamental Lemah + Tekanan Kebijakan Ganda")
	fmt.Println("================================================================")
}

