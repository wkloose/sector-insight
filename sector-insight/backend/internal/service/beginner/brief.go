package beginner

import (
	"encoding/json"
	"fmt"
	"time"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"

	"gorm.io/gorm/clause"
)

type FaqItem struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type BeginnerBriefDTO struct {
	Ticker       string    `json:"ticker"`
	CompanyName  string    `json:"company_name"`
	HealthBadge  string    `json:"health_badge"`
	HealthColor  string    `json:"health_color"`
	HealthScore  float64   `json:"health_score"`
	TldrSummary  string    `json:"tldr_summary"`
	Pros         []string  `json:"pros"`
	Cons         []string  `json:"cons"`
	InvestorFit  []string  `json:"investor_fit"`
	FaqItems     []FaqItem `json:"faq_items"`
	LastUpdated  time.Time `json:"last_updated"`
}

type GlossaryItem struct {
	Term       string `json:"term"`
	SimpleName string `json:"simple_name"`
	Analogy    string `json:"analogy"`
	Category   string `json:"category"`
}

func GetGlossaryList() []GlossaryItem {
	return []GlossaryItem{
		{
			Term:       "NIM",
			SimpleName: "Margin Bunga Pinjaman",
			Analogy:    "Keuntungan bersih yang didapat bank dari selisih bunga kredit yang dipinjamkan ke debitur dikurangi bunga tabungan/deposito nasabah.",
			Category:   "Fundamental",
		},
		{
			Term:       "LDR",
			SimpleName: "Tingkat Amannya Simpanan",
			Analogy:    "Perbandingan seberapa banyak uang pinjaman yang disalurkan dibanding total uang tabungan masyarakat. Idealnya 78% - 92%.",
			Category:   "Fundamental",
		},
		{
			Term:       "ROE",
			SimpleName: "Kemampuan Cetak Laba Modal",
			Analogy:    "Ukuran seberapa pintar manajemen perusahaan memutar uang modal investor untuk menghasilkan laba bersih tahunan.",
			Category:   "Fundamental",
		},
		{
			Term:       "CASA",
			SimpleName: "Rasio Dana Tabungan Murah",
			Analogy:    "Porsi uang nasabah yang ada di tabungan dan giro biasa berbunga rendah. Makin tinggi, makin murah biaya modal bank.",
			Category:   "Fundamental",
		},
		{
			Term:       "Foreign Flow",
			SimpleName: "Aliran Uang Investor Asing",
			Analogy:    "Selisih total pembelian dan penjualan saham oleh investor luar negeri atau institusi global besar di bursa.",
			Category:   "Transaksi",
		},
		{
			Term:       "Z-Score",
			SimpleName: "Tingkat Ketidakwajaran Transaksi",
			Analogy:    "Indikator statistik untuk melihat apakah volume transaksi hari ini normal atau melonjak ekstrem di luar kebiasaannya.",
			Category:   "Statistik",
		},
		{
			Term:       "Dividen",
			SimpleName: "Bagi Hasil Tunai Tahunan",
			Analogy:    "Bagian keuntungan bersih perusahaan yang ditransfer langsung secara tunai ke rekening para pemilik saham.",
			Category:   "Imbal Hasil",
		},
		{
			Term:       "PBV",
			SimpleName: "Harga Saham vs Modal Asli",
			Analogy:    "Perbandingan harga saham di bursa dibanding nilai modal bersih perusahaan. Menunjukkan apakah saham tergolong murah atau mahal.",
			Category:   "Valuasi",
		},
	}
}

func GenerateOrGetBeginnerBrief(ticker string) (*BeginnerBriefDTO, error) {

	var fund model.FundamentalScore
	database.DB.Where("ticker = ?", ticker).Order("kuartal desc").First(&fund)

	var sent model.DailySentimentScore
	database.DB.Where("ticker = ?", ticker).Order("tanggal desc").First(&sent)

	var flow model.DailyForeignFlow
	database.DB.Where("ticker = ?", ticker).Order("tanggal desc").First(&flow)

	score := fund.SkorAkhir
	hasFundData := fund.SkorAkhir > 0

	var healthBadge, healthColor string
	if !hasFundData {
		score = 50.0
		healthBadge = "DATA BELUM TERSEDIA"
		healthColor = "gray"
	} else {
		switch {
		case score >= 80:
			healthBadge = "SANGAT SEHAT & STABIL"
			healthColor = "green"
		case score >= 60:
			healthBadge = "SEHAT & BERTUMBUH"
			healthColor = "green"
		case score >= 40:
			healthBadge = "WASPADA / FLUKTUATIF"
			healthColor = "yellow"
		default:
			healthBadge = "PERHATIAN KHUSUS"
			healthColor = "red"
		}
	}

	companyNames := map[string]string{
		"BBCA": "Bank Central Asia Tbk",
		"BBRI": "Bank Rakyat Indonesia (Persero) Tbk",
		"BMRI": "Bank Mandiri (Persero) Tbk",
		"BBNI": "Bank Negara Indonesia (Persero) Tbk",
		"BBTN": "Bank Tabungan Negara (Persero) Tbk",
		"BRIS": "Bank Syariah Indonesia Tbk",
		"BDMN": "Bank Danamon Indonesia Tbk",
	}
	compName := companyNames[ticker]
	if compName == "" {
		compName = fmt.Sprintf("PT %s Tbk", ticker)
	}

	var tldr string
	var pros, cons, investorFit []string
	var faqs []FaqItem

	switch ticker {
	case "BBCA":
		tldr = "BBCA adalah bank swasta terbesar di Indonesia yang terkenal sangat efisien dan paling menguntungkan. Bisnisnya kokoh karena jutaan masyarakat memakai rekeningnya untuk transaksi harian. Secara keuangan sangat sehat dan rajin bagi dividen, tapi harga sahamnya tergolong premium (mahal)."
		pros = []string{
			"Modal Sangat Murah (CASA 82%): Mayoritas dana nasabah ada di tabungan/giro bunga rendah sehingga biaya operasional sangat hemat.",
			"Pembagi Dividen Setia: Rutin membagikan dividen tunai tiap tahun tanpa pernah absen dengan riwayat kenaikan konsisten.",
			"Favorit Investor Institusi Dunia: Menjadi tujuan utama aliran modal asing (net buy) karena tata kelola paling prudent.",
		}
		cons = []string{
			"Harga Saham Relatif Mahal (PBV > 4x): Valuasi premium membuat saham ini jarang sekali terdiskon murah di pasar modal.",
			"Pertumbuhan Normal/Matang: Karena skala asetnya sudah raksasa, laba bersih sulit melonjak 2-3x lipat dalam waktu singkat.",
			"Sensitif Kebijakan Moneter: Jika tren suku bunga acuan BI turun tajam, margin bunga bersih bisa sedikit termoderasi.",
		}
		investorFit = []string{
			"✓ Penabung Rutin Jangka Panjang (DCA > 3 tahun)",
			"✓ Pemburu Dividen Konsisten & Pertumbuhan Aset Stabil",
			"✗ Trader Cepat yang mengharapkan kenaikan harga liar dalam 1-2 hari",
		}
		faqs = []FaqItem{
			{Question: "Berapa modal minimal buat mulai beli BBCA?", Answer: "Minimal pembelian 1 lot (100 lembar). Pada harga saat ini sekitar Rp 1.000.000."},
			{Question: "Apakah bank ini punya risiko bangkrut?", Answer: "Sangat kecil. BBCA masuk kategori Bank Sistemik (D-SIB) yang diawasi sangat ketat oleh Otoritas Jasa Keuangan (OJK)."},
			{Question: "Kapan dividen BBCA biasanya cair?", Answer: "BBCA umumnya membagikan dividen dua kali setahun: dividen interim di akhir tahun (Desember) dan dividen final di awal tahun (Maret/April)."},
		}

	case "BBRI":
		tldr = "BBRI adalah raja pembiayaan kredit mikro dan UMKM terbesar di Indonesia. Memiliki mesin laba yang sangat kuat berkat jaringan cabang hingga pelosok desa (Holding Ultra Mikro), namun sensitif terhadap risiko kredit macet saat daya beli masyarakat bawah tertekan."
		pros = []string{
			"Margin Bunga Sangat Tebal (NIM > 6.0%): Menyalurkan kredit ke segmen mikro memungkinkan penetapan bunga pinjaman yang sangat menguntungkan.",
			"Raja Dividen Jumbo (Yield > 6%): Terkenal sangat loyal membagikan 70-80% dari total laba bersihnya sebagai dividen tunai kepada pemegang saham.",
			"Ekosistem Ultra Mikro Terluas: Bersinergi kuat dengan Pegadaian dan PNM menjangkau puluhan juta nasabah di seluruh Indonesia.",
		}
		cons = []string{
			"Sensitif Daya Beli Wong Cilik: Jika inflasi tinggi atau ekonomi lesu, risiko keterlambatan bayar kredit (NPL) mikro cenderung naik.",
			"Sering Mengalami Outflow Asing: Saat sentimen pasar berkembang negatif, investor asing kerap melepas saham BBRI dalam jumlah besar.",
			"Ketergantungan Subsidi Pemerintah: Beberapa program pinjaman bergantung pada kebijakan bunga subsidi dari pemerintah.",
		}
		investorFit = []string{
			"✓ Pemburu Dividen Tunai Tahunan Berimbal Hasil Tinggi",
			"✓ Investor yang percaya pada ketahanan ekonomi mikro Indonesia",
			"✗ Pemula yang mudah panik saat harga saham berfluktuasi tajam",
		}
		faqs = []FaqItem{
			{Question: "Berapa dividen tahunan BBRI?", Answer: "Secara historis, dividen yield BBRI berada di kisaran 5% - 7% per tahun, jauh di atas rata-rata bunga deposito bank."},
			{Question: "Kenapa harga BBRI kadang turun drastis?", Answer: "Biasanya dipicu oleh aksi jual institusi asing atau kekhawatiran sementara terkait kenaikan kredit macet di segmen mikro."},
		}

	case "BMRI":
		tldr = "Bank Mandiri adalah bank dengan total aset terbesar di Indonesia yang mendominasi pembiayaan korporasi dan perusahaan besar. Kinerjanya melesat pesat berkat transformasi digital aplikasi Livin' by Mandiri yang sukses menjaring dana murah nasabah."
		pros = []string{
			"Juara Aset & Korporasi: Menjadi mitra utama pembiayaan proyek-proyek strategis nasional dan konglomerasi bisnis terbesar.",
			"Pertumbuhan Tabungan Pesat: Aplikasi Livin' sukses mendongkrak porsi tabungan murah (CASA) mendekati 80%.",
			"Kualitas Kredit Sangat Terjaga: Rasio kredit macet (NPL) konsisten rendah karena debiturnya mayoritas korporasi bereputasi prima.",
		}
		cons = []string{
			"Margin Bunga Lebih Tipis: Karena meminjamkan ke korporasi besar, bunga kredit yang dipatok lebih rendah dibanding kredit mikro.",
			"Sensitif Siklus Makro Ekonomi: Kinerja pembiayaan sangat bergantung pada ekspansi bisnis dunia usaha domestik.",
			"Valuasi Sudah Mendekati Wajar: Ruang diskon harga saham sudah tidak sebesar beberapa tahun lalu.",
		}
		investorFit = []string{
			"✓ Investor yang menyukai perbankan beraset raksasa dan modern",
			"✓ Portofolio defensif dengan pertumbuhan laba dua digit stabil",
		}
		faqs = []FaqItem{
			{Question: "Apa keunggulan Bank Mandiri dibanding bank lain?", Answer: "Kekuatan ekosistem korporasi wholesale yang dihubungkan langsung ke rantai pasok ritel melalui digital banking."},
		}

	default:
		tldr = fmt.Sprintf("%s (%s) adalah emiten publik yang tercatat di Bursa Efek Indonesia. Memiliki evaluasi kesehatan finansial %.1f/100 dengan indikator status %s.", ticker, compName, score, healthBadge)
		pros = []string{
			"Tercatat resmi di Bursa Efek Indonesia dan tunduk pada keterbukaan informasi publik.",
			"Memiliki pelaporan keuangan berkala yang diawasi oleh regulator pasar modal.",
			"Memiliki kelangsungan operasional bisnis aktif dan rekam jejak korporasi.",
		}
		cons = []string{
			"Kinerja finansial dan valuasi harga saham dipengaruhi kondisi pasar serta sektor industrinya.",
			"Tingkat likuiditas perdagangan saham bervariasi bergantung pada partisipasi pasar.",
			"Sensitif terhadap dinamika makroekonomi, suku bunga, dan fluktuasi ekonomi domestik.",
		}
		investorFit = []string{
			"✓ Investor yang melakukan riset fundamental sektoral secara mandiri",
			"✓ Alokasi portofolio investasi jangka menengah dan panjang",
		}
		faqs = []FaqItem{
			{Question: fmt.Sprintf("Apakah saham %s cocok untuk pemula?", ticker), Answer: "Dianjurkan untuk mempelajari model bisnis sektor industrinya dan memantau laporan keuangan terbaru sebelum berinvestasi."},
		}
	}

	prosJSON, _ := json.Marshal(pros)
	consJSON, _ := json.Marshal(cons)
	fitJSON, _ := json.Marshal(investorFit)
	faqJSON, _ := json.Marshal(faqs)

	briefRecord := model.StockBeginnerBrief{
		Ticker:      ticker,
		CompanyName: compName,
		TldrSummary: tldr,
		HealthBadge: healthBadge,
		HealthColor: healthColor,
		ProsList:    string(prosJSON),
		ConsList:    string(consJSON),
		InvestorFit: string(fitJSON),
		FaqItems:    string(faqJSON),
		LastUpdated: time.Now(),
	}

	database.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "ticker"}},
		DoUpdates: clause.AssignmentColumns([]string{"company_name", "tldr_summary", "health_badge", "health_color", "pros_list", "cons_list", "investor_fit", "faq_items", "last_updated"}),
	}).Create(&briefRecord)

	return &BeginnerBriefDTO{
		Ticker:      ticker,
		CompanyName: compName,
		HealthBadge: healthBadge,
		HealthColor: healthColor,
		HealthScore: score,
		TldrSummary: tldr,
		Pros:        pros,
		Cons:        cons,
		InvestorFit: investorFit,
		FaqItems:    faqs,
		LastUpdated: briefRecord.LastUpdated,
	}, nil
}

