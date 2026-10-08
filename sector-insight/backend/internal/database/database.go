package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/model"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})

	if err != nil {
		sqlitePath := "sector_insight.db"
		if p := os.Getenv("SQLITE_PATH"); p != "" {
			sqlitePath = p
		}
		log.Printf("[DATABASE] PostgreSQL connection failed (%v). Falling back to local SQLite (%s)...", err, sqlitePath)

		db, err = gorm.Open(sqlite.Open(sqlitePath), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Warn),
		})
		if err != nil {
			return nil, fmt.Errorf("failed to open sqlite fallback: %w", err)
		}
		log.Printf("[DATABASE] Successfully connected to local SQLite database (%s).\n", sqlitePath)
	} else {
		log.Println("[DATABASE] Successfully connected to PostgreSQL database.")
	}

	err = db.AutoMigrate(
		&model.RawArticle{},
		&model.ProcessedArticle{},
		&model.DailySentimentScore{},
		&model.BankQuarterlyRaw{},
		&model.FundamentalScore{},
		&model.DailyForeignFlow{},
		&model.ForeignFlowAnomaly{},
		&model.AnomalyBrokerDetail{},
		&model.StockBeginnerBrief{},
		&model.CommunityUser{},
		&model.CommunityPost{},
		&model.CommunityVote{},
		&model.DailyCrowdSentiment{},
		&model.SectorMaster{},
		&model.SectorDailyScore{},
		&model.StockQuote{},
	)
	if err != nil {
		return nil, fmt.Errorf("auto-migration failed: %w", err)
	}

	DB = db
	seedInitialDataIfEmpty(db)
	ensureAllBankingData(db)
	return db, nil
}

func seedInitialDataIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&model.FundamentalScore{}).Count(&count)
	if count == 0 {
		log.Println("[DATABASE] Seeding initial demonstration data for financial sector banks...")

		banks := []model.FundamentalScore{
		{
			Ticker:             "BBCA",
			Kuartal:            "2025-Q3",
			NIMScore:           88.0,
			LDRScore:           86.0,
			LoanGrowthScore:    82.0,
			DepositGrowthScore: 85.0,
			ROEScore:           94.0,
			KonsistensiScore:   92.0,
			DividendScore:      88.0,
			SkorAkhir:          87.8,
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BBRI",
			Kuartal:            "2025-Q3",
			NIMScore:           92.0,
			LDRScore:           84.0,
			LoanGrowthScore:    78.0,
			DepositGrowthScore: 80.0,
			ROEScore:           88.0,
			KonsistensiScore:   85.0,
			DividendScore:      90.0,
			SkorAkhir:          85.1,
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BMRI",
			Kuartal:            "2025-Q3",
			NIMScore:           85.0,
			LDRScore:           88.0,
			LoanGrowthScore:    84.0,
			DepositGrowthScore: 82.0,
			ROEScore:           86.0,
			KonsistensiScore:   88.0,
			DividendScore:      82.0,
			SkorAkhir:          84.9,
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BBNI",
			Kuartal:            "2025-Q3",
			NIMScore:           76.0,
			LDRScore:           82.0,
			LoanGrowthScore:    75.0,
			DepositGrowthScore: 78.0,
			ROEScore:           79.0,
			KonsistensiScore:   80.0,
			DividendScore:      75.0,
			SkorAkhir:          77.7,
			HealthStatus:       "Sehat",
			CreatedAt:          time.Now(),
		},
	}
	db.Create(&banks)

	anomalies := []model.ForeignFlowAnomaly{
		{
			Ticker:           "BBRI",
			Tanggal:          time.Now().AddDate(0, 0, -1),
			NetForeignInflow: -145000000000,
			ZScore:           -2.82,
			StatusAnomali:    "ANOMALI_OUTFLOW",
			CreatedAt:        time.Now(),
			BrokerDetails: []model.AnomalyBrokerDetail{
				{
					KodeBroker: "CS",
					NamaBroker: "Credit Suisse",
					Kategori:   "Asing-Institusional",
					NetValue:   -89000000000,
					CreatedAt:  time.Now(),
				},
				{
					KodeBroker: "ZP",
					NamaBroker: "Maybank Kim Eng",
					Kategori:   "Asing-Institusional",
					NetValue:   -34000000000,
					CreatedAt:  time.Now(),
				},
			},
		},
		{
			Ticker:           "BBCA",
			Tanggal:          time.Now().AddDate(0, 0, -2),
			NetForeignInflow: 220000000000,
			ZScore:           2.45,
			StatusAnomali:    "ANOMALI_INFLOW",
			CreatedAt:        time.Now(),
			BrokerDetails: []model.AnomalyBrokerDetail{
				{
					KodeBroker: "AK",
					NamaBroker: "UBS Sekuritas",
					Kategori:   "Asing-Institusional",
					NetValue:   125000000000,
					CreatedAt:  time.Now(),
				},
			},
		},
	}
	db.Create(&anomalies)

	sentiments := []model.DailySentimentScore{
		{
			Ticker:                "BBCA",
			Tanggal:               time.Now(),
			CompanySentimentScore: 0.62,
			PolicyExposureScore:   -0.15,
			JumlahArtikelCompany:  14,
			JumlahArtikelPolicy:   6,
			CreatedAt:             time.Now(),
		},
		{
			Ticker:                "BBRI",
			Tanggal:               time.Now(),
			CompanySentimentScore: 0.18,
			PolicyExposureScore:   -0.35,
			JumlahArtikelCompany:  10,
			JumlahArtikelPolicy:   8,
			CreatedAt:             time.Now(),
		},
	}
	db.Create(&sentiments)
	}

	var userCount int64
	db.Model(&model.CommunityUser{}).Count(&userCount)
	if userCount == 0 {
		u1 := model.CommunityUser{Username: "analis_pasar", Badge: "Top Analyst", KarmaPoints: 850, TotalUpvotes: 142, CredibilityRate: 0.95, CreatedAt: time.Now()}
		u2 := model.CommunityUser{Username: "investor_cerdas", Badge: "Verified Retail", KarmaPoints: 420, TotalUpvotes: 88, CredibilityRate: 0.85, CreatedAt: time.Now()}
		u3 := model.CommunityUser{Username: "trader_santai", Badge: "Member", KarmaPoints: 110, TotalUpvotes: 24, CredibilityRate: 0.60, CreatedAt: time.Now()}
		db.Create(&u1)
		db.Create(&u2)
		db.Create(&u3)

		posts := []model.CommunityPost{
			{
				UserID:        u1.ID,
				Ticker:        "BBRI",
				Title:         "Analisis Margin Bunga & Kualitas Kredit Mikro Pasca Rilis Kuartal III",
				Content:       "Meskipun ada sentimen BI-Rate menahan penurunan suku bunga, CASA BBRI bertahan di 63.4%. Penyaluran Kupedes masih tumbuh dobel digit. Support kuat di 4.700 sangat menarik untuk DCA jangka panjang.",
				SentimentTag:  "BULLISH",
				Upvotes:       142,
				Downvotes:     12,
				WeightedScore: 125.4,
				CommentCount:  34,
				CreatedAt:     time.Now().Add(-3 * time.Hour),
			},
			{
				UserID:        u2.ID,
				Ticker:        "BBRI",
				Title:         "Waspadai Tekanan Jual Broker Asing CS & ZP di BBRI Hari Ini",
				Content:       "Secara teknikal terlihat pantulan, tapi broker summary menunjukkan distribusi masif dari asing. Jangan buru-buru all-in sebelum ada konfirmasi foreign flow net buy.",
				SentimentTag:  "BEARISH",
				Upvotes:       58,
				Downvotes:     6,
				WeightedScore: 49.2,
				CommentCount:  19,
				CreatedAt:     time.Now().Add(-6 * time.Hour),
			},
			{
				UserID:        u1.ID,
				Ticker:        "BBCA",
				Title:         "Koreksi Wajar Saham BBCA Adalah Peluang Akumulasi Emas",
				Content:       "Penurunan tipis BBCA pekan ini lebih karena rebalancing portofolio institusi global, bukan karena pemburukan fundamental. ROE 22% dan LDR 81% adalah jaminan ketahanan krisis.",
				SentimentTag:  "BULLISH",
				Upvotes:       96,
				Downvotes:     4,
				WeightedScore: 89.0,
				CommentCount:  22,
				CreatedAt:     time.Now().Add(-5 * time.Hour),
			},
			{
				UserID:        u3.ID,
				Ticker:        "BBCA",
				Title:         "Kekhawatiran Aturan Likuiditas OJK Bikin Investor Ritel Panik Jual",
				Content:       "Banyak forum ritel heboh rumor pengetatan likuiditas perbankan. Tapi ingat BBCA punya likuiditas paling tebal di kelasnya.",
				SentimentTag:  "BEARISH",
				Upvotes:       31,
				Downvotes:     8,
				WeightedScore: 21.5,
				CommentCount:  11,
				CreatedAt:     time.Now().Add(-12 * time.Hour),
			},
		}
		db.Create(&posts)

		crowds := []model.DailyCrowdSentiment{
			{
				Ticker:           "BBRI",
				Tanggal:          time.Now(),
				SentimentScore:   0.72,
				BullishPercent:   88.0,
				TotalPosts:       48,
				DiscussionZScore: 3.1,
				DivergenceStatus: "EUPHORIA_DIVERGENCE",
				CreatedAt:        time.Now(),
			},
			{
				Ticker:           "BBCA",
				Tanggal:          time.Now(),
				SentimentScore:   -0.65,
				BullishPercent:   26.0,
				TotalPosts:       35,
				DiscussionZScore: 2.1,
				DivergenceStatus: "PANIC_DIVERGENCE",
				CreatedAt:        time.Now(),
			},
		}
		db.Create(&crowds)
	}

	var sectorCount int64
	db.Model(&model.SectorMaster{}).Count(&sectorCount)
	if sectorCount == 0 {
		sectors := []model.SectorMaster{
			{SectorSlug: "energy", SectorName: "Energi (Energy)", Subsectors: `["oil-gas-coal","alternative-energy"]`, CreatedAt: time.Now()},
			{SectorSlug: "financials", SectorName: "Keuangan (Financials)", Subsectors: `["banks","financing-service","insurance","investment-service","holding-investment-companies"]`, CreatedAt: time.Now()},
			{SectorSlug: "basic-materials", SectorName: "Barang Baku (Basic Materials)", Subsectors: `["basic-materials"]`, CreatedAt: time.Now()},
			{SectorSlug: "infrastructures", SectorName: "Infrastruktur (Infrastructures)", Subsectors: `["telecommunication","utilities","heavy-constructions-civil-engineering","transportation-infrastructure"]`, CreatedAt: time.Now()},
			{SectorSlug: "consumer-non-cyclicals", SectorName: "Konsumer Primer (Consumer Non-Cyclicals)", Subsectors: `["food-beverage","tobacco","nondurable-household-products","food-staples-retailing"]`, CreatedAt: time.Now()},
			{SectorSlug: "healthcare", SectorName: "Kesehatan (Healthcare)", Subsectors: `["pharmaceuticals-health-care-research","healthcare-equipment-providers"]`, CreatedAt: time.Now()},
			{SectorSlug: "industrials", SectorName: "Perindustrian (Industrials)", Subsectors: `["industrial-goods","industrial-services","multi-sector-holdings"]`, CreatedAt: time.Now()},
			{SectorSlug: "consumer-cyclicals", SectorName: "Konsumer Non-Primer (Consumer Cyclicals)", Subsectors: `["media-entertainment","leisure-goods","household-goods","consumer-services","retailing","automobiles-components","apparel-luxury-goods"]`, CreatedAt: time.Now()},
			{SectorSlug: "transportation-logistic", SectorName: "Transportasi & Logistik (Transportation & Logistics)", Subsectors: `["transportation","logistics-deliveries"]`, CreatedAt: time.Now()},
			{SectorSlug: "technology", SectorName: "Teknologi (Technology)", Subsectors: `["software-it-services","technology-hardware-equipment"]`, CreatedAt: time.Now()},
			{SectorSlug: "properties-real-estate", SectorName: "Properti & Real Estat (Properties & Real Estate)", Subsectors: `["properties-real-estate"]`, CreatedAt: time.Now()},
		}
		db.Create(&sectors)

		scores := []model.SectorDailyScore{
			{SectorSlug: "energy", Tanggal: time.Now(), SMRSScore: 84.6, SentimentScore: 0.72, NetForeignFlow: 480500000000, PriceReturn7D: 12.4, Status: "LEADING", TopMovers: `["ADRO (+3.8%)","PTBA (+2.9%)","MEDC (+2.4%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "financials", Tanggal: time.Now(), SMRSScore: 76.2, SentimentScore: 0.45, NetForeignFlow: 320000000000, PriceReturn7D: 4.8, Status: "LEADING", TopMovers: `["BBCA (+1.5%)","BMRI (+1.2%)","BBRI (-0.8%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "basic-materials", Tanggal: time.Now(), SMRSScore: 68.4, SentimentScore: 0.38, NetForeignFlow: 110500000000, PriceReturn7D: 3.2, Status: "IMPROVING", TopMovers: `["ANTM (+2.1%)","MDKA (+1.8%)","INCO (+1.1%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "infrastructures", Tanggal: time.Now(), SMRSScore: 62.0, SentimentScore: 0.25, NetForeignFlow: 85000000000, PriceReturn7D: 2.1, Status: "IMPROVING", TopMovers: `["TLKM (+1.4%)","ISAT (+0.9%)","JSMR (+0.5%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "consumer-non-cyclicals", Tanggal: time.Now(), SMRSScore: 54.5, SentimentScore: 0.10, NetForeignFlow: 24000000000, PriceReturn7D: -0.4, Status: "NEUTRAL", TopMovers: `["ICBP (+0.8%)","AMRT (+0.2%)","INDF (-0.5%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "healthcare", Tanggal: time.Now(), SMRSScore: 51.8, SentimentScore: 0.05, NetForeignFlow: -12000000000, PriceReturn7D: 0.2, Status: "NEUTRAL", TopMovers: `["KLBF (+0.4%)","MIKA (-0.2%)","SILO (-0.6%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "industrials", Tanggal: time.Now(), SMRSScore: 48.0, SentimentScore: -0.08, NetForeignFlow: -40000000000, PriceReturn7D: -1.2, Status: "NEUTRAL", TopMovers: `["ASII (-0.8%)","UNTR (-1.1%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "consumer-cyclicals", Tanggal: time.Now(), SMRSScore: 42.1, SentimentScore: -0.15, NetForeignFlow: -65000000000, PriceReturn7D: -1.8, Status: "NEUTRAL", TopMovers: `["MAPI (-1.2%)","ACES (-1.5%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "transportation-logistic", Tanggal: time.Now(), SMRSScore: 38.5, SentimentScore: -0.22, NetForeignFlow: -80000000000, PriceReturn7D: -3.5, Status: "WEAKENING", TopMovers: `["BIRD (-1.4%)","ASSA (-2.0%)","SMDR (-2.5%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "technology", Tanggal: time.Now(), SMRSScore: 32.4, SentimentScore: -0.35, NetForeignFlow: -110000000000, PriceReturn7D: -5.4, Status: "WEAKENING", TopMovers: `["GOTO (-2.4%)","BUKA (-3.1%)","BELI (-1.8%)"]`, CreatedAt: time.Now()},
			{SectorSlug: "properties-real-estate", Tanggal: time.Now(), SMRSScore: 28.2, SentimentScore: -0.45, NetForeignFlow: -142000000000, PriceReturn7D: -8.1, Status: "LAGGING", TopMovers: `["BSDE (-2.1%)","CTRA (-1.8%)","PWON (-1.5%)"]`, CreatedAt: time.Now()},
		}
		db.Create(&scores)
	}

	var quoteCount int64
	db.Model(&model.StockQuote{}).Count(&quoteCount)
	if quoteCount < 10 {
		log.Println("[DATABASE] Seeding or ensuring stock quotes for 10 tracked banks...")
		for _, q := range model.GetDefaultStockQuotes() {
			var existing model.StockQuote
			if err := db.Where("ticker = ?", q.Ticker).First(&existing).Error; err != nil {
				db.Create(&q)
			}
		}
	}

	ensureAllBankingData(db)
}

func ensureAllBankingData(db *gorm.DB) {
	if db == nil {
		return
	}
	log.Println("[DATABASE] Ensuring complete banking data for all 10 tracked stocks...")

	fundamentalScores := []model.FundamentalScore{
		{
			Ticker:             "BBCA",
			Kuartal:            "2025-Q4",
			NIMScore:           78.0,
			LDRScore:           86.0,
			LoanGrowthScore:    82.0,
			DepositGrowthScore: 85.0,
			ROEScore:           94.0,
			KonsistensiScore:   92.0,
			DividendScore:      88.0,
			SkorAkhir:          89.0,
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BBRI",
			Kuartal:            "2025-Q4",
			NIMScore:           93.0,
			LDRScore:           84.0,
			LoanGrowthScore:    78.0,
			DepositGrowthScore: 80.0,
			ROEScore:           88.0,
			KonsistensiScore:   85.0,
			DividendScore:      90.0,
			SkorAkhir:          85.0,
			HealthStatus:       "Perhatian Khusus",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BMRI",
			Kuartal:            "2025-Q4",
			NIMScore:           72.0,
			LDRScore:           88.0,
			LoanGrowthScore:    84.0,
			DepositGrowthScore: 82.0,
			ROEScore:           86.0,
			KonsistensiScore:   88.0,
			DividendScore:      82.0,
			SkorAkhir:          85.0,
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BBNI",
			Kuartal:            "2025-Q4",
			NIMScore:           68.0,
			LDRScore:           82.0,
			LoanGrowthScore:    75.0,
			DepositGrowthScore: 78.0,
			ROEScore:           79.0,
			KonsistensiScore:   80.0,
			DividendScore:      75.0,
			SkorAkhir:          79.0,
			HealthStatus:       "Sehat",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BRIS",
			Kuartal:            "2025-Q4",
			NIMScore:           80.0,
			LDRScore:           85.0,
			LoanGrowthScore:    82.0,
			DepositGrowthScore: 84.0,
			ROEScore:           84.0,
			KonsistensiScore:   88.0,
			DividendScore:      78.0,
			SkorAkhir:          82.0,
			HealthStatus:       "Sangat Sehat",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BNGA",
			Kuartal:            "2025-Q4",
			NIMScore:           65.0,
			LDRScore:           83.0,
			LoanGrowthScore:    76.0,
			DepositGrowthScore: 77.0,
			ROEScore:           78.0,
			KonsistensiScore:   80.0,
			DividendScore:      78.0,
			SkorAkhir:          77.0,
			HealthStatus:       "Stabil",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BDMN",
			Kuartal:            "2025-Q4",
			NIMScore:           84.0,
			LDRScore:           76.0,
			LoanGrowthScore:    68.0,
			DepositGrowthScore: 70.0,
			ROEScore:           72.0,
			KonsistensiScore:   70.0,
			DividendScore:      68.0,
			SkorAkhir:          70.0,
			HealthStatus:       "Sehat",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BBTN",
			Kuartal:            "2025-Q4",
			NIMScore:           42.0,
			LDRScore:           62.0,
			LoanGrowthScore:    58.0,
			DepositGrowthScore: 55.0,
			ROEScore:           56.0,
			KonsistensiScore:   50.0,
			DividendScore:      52.0,
			SkorAkhir:          54.0,
			HealthStatus:       "Perhatian Khusus",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BJBR",
			Kuartal:            "2025-Q4",
			NIMScore:           58.0,
			LDRScore:           75.0,
			LoanGrowthScore:    62.0,
			DepositGrowthScore: 65.0,
			ROEScore:           68.0,
			KonsistensiScore:   65.0,
			DividendScore:      72.0,
			SkorAkhir:          65.0,
			HealthStatus:       "Stabil",
			CreatedAt:          time.Now(),
		},
		{
			Ticker:             "BJTM",
			Kuartal:            "2025-Q4",
			NIMScore:           66.0,
			LDRScore:           74.0,
			LoanGrowthScore:    60.0,
			DepositGrowthScore: 64.0,
			ROEScore:           66.0,
			KonsistensiScore:   65.0,
			DividendScore:      70.0,
			SkorAkhir:          64.0,
			HealthStatus:       "Stabil",
			CreatedAt:          time.Now(),
		},
	}

	for _, fs := range fundamentalScores {
		var existing model.FundamentalScore
		err := db.Where("ticker = ? AND kuartal = ?", fs.Ticker, fs.Kuartal).First(&existing).Error
		if err != nil {
			db.Create(&fs)
		} else {
			db.Model(&existing).Updates(map[string]interface{}{
				"skor_akhir":    fs.SkorAkhir,
				"nim_score":     fs.NIMScore,
				"health_status": fs.HealthStatus,
				"ldr_score":     fs.LDRScore,
				"roe_score":     fs.ROEScore,
			})
		}
	}

	foreignFlows := map[string][]float64{
		"BBCA": {38.5e9, 42.0e9, 29.0e9, 51.2e9, 33.4e9, 45.0e9, 28.5e9, 39.0e9, 48.0e9, 22.0e9, 36.5e9, 41.0e9, 30.5e9, 44.0e9},
		"BMRI": {28.0e9, 34.5e9, 21.0e9, 39.0e9, 25.5e9, 31.0e9, 19.5e9, 33.0e9, 37.0e9, 18.0e9, 27.5e9, 32.0e9, 24.0e9, 35.0e9},
		"BRIS": {6.5e9, 8.2e9, 5.1e9, 9.4e9, 7.0e9, 8.8e9, 4.5e9, 7.8e9, 9.1e9, 5.6e9, 7.2e9, 8.5e9, 6.0e9, 9.0e9},
		"BNGA": {4.2e9, 5.5e9, 3.1e9, 6.0e9, 4.8e9, 5.2e9, 2.9e9, 5.8e9, 6.4e9, 3.5e9, 4.9e9, 5.7e9, 4.0e9, 6.2e9},
		"BBRI": {-28.0e9, -35.5e9, -19.0e9, -42.0e9, -24.5e9, -31.0e9, -18.5e9, -36.0e9, -44.0e9, -22.0e9, -29.5e9, -38.0e9, -25.0e9, -39.0e9},
		"BBTN": {-7.5e9, -9.2e9, -5.0e9, -11.4e9, -6.8e9, -8.5e9, -4.2e9, -9.8e9, -12.1e9, -5.5e9, -7.0e9, -10.2e9, -6.1e9, -11.0e9},
		"BBNI": {12.5e9, -8.2e9, 15.0e9, -5.4e9, 9.8e9, -11.2e9, 14.0e9, -7.5e9, 11.2e9, -4.8e9, 8.5e9, -9.0e9, 13.1e9, -6.2e9},
		"BDMN": {3.8e9, -2.5e9, 4.2e9, -1.8e9, 2.9e9, -3.4e9, 4.5e9, -2.1e9, 3.2e9, -1.5e9, 2.7e9, -3.1e9, 3.9e9, -2.0e9},
		"BJBR": {1.2e9, -0.8e9, 1.5e9, -0.6e9, 0.9e9, -1.1e9, 1.4e9, -0.7e9, 1.1e9, -0.5e9, 0.8e9, -1.0e9, 1.3e9, -0.6e9},
		"BJTM": {0.9e9, -0.6e9, 1.1e9, -0.5e9, 0.8e9, -0.9e9, 1.2e9, -0.4e9, 0.7e9, -0.6e9, 1.0e9, -0.7e9, 0.8e9, -0.5e9},
	}

	nowTruncated := time.Now().Truncate(24 * time.Hour)
	trackedTickers := []string{"BBCA", "BBRI", "BMRI", "BBNI", "BRIS", "BNGA", "BDMN", "BBTN", "BJBR", "BJTM"}
	for _, ticker := range trackedTickers {
		var flowCount int64
		db.Model(&model.DailyForeignFlow{}).Where("ticker = ?", ticker).Count(&flowCount)
		if flowCount < 10 {
			vals, ok := foreignFlows[ticker]
			if !ok {
				continue
			}
			for i, val := range vals {
				t := nowTruncated.AddDate(0, 0, -i)
				flow := model.DailyForeignFlow{
					Ticker:           ticker,
					Tanggal:          t,
					NetForeignInflow: val,
					CreatedAt:        t,
				}
				db.Clauses(clause.OnConflict{
					Columns:   []clause.Column{{Name: "ticker"}, {Name: "tanggal"}},
					DoUpdates: clause.AssignmentColumns([]string{"net_foreign_inflow"}),
				}).Create(&flow)
			}
		}
	}

	defaultSentiments := []model.DailySentimentScore{
		{
			Ticker:                "BBCA",
			CompanySentimentScore: 0.58,
			PolicyExposureScore:   -0.15,
			JumlahArtikelCompany:  14,
			JumlahArtikelPolicy:   6,
		},
		{
			Ticker:                "BBRI",
			CompanySentimentScore: -0.36,
			PolicyExposureScore:   -0.35,
			JumlahArtikelCompany:  12,
			JumlahArtikelPolicy:   8,
		},
		{
			Ticker:                "BMRI",
			CompanySentimentScore: 0.45,
			PolicyExposureScore:   -0.10,
			JumlahArtikelCompany:  11,
			JumlahArtikelPolicy:   5,
		},
		{
			Ticker:                "BBNI",
			CompanySentimentScore: 0.22,
			PolicyExposureScore:   -0.05,
			JumlahArtikelCompany:  9,
			JumlahArtikelPolicy:   5,
		},
		{
			Ticker:                "BRIS",
			CompanySentimentScore: 0.35,
			PolicyExposureScore:   0.10,
			JumlahArtikelCompany:  8,
			JumlahArtikelPolicy:   4,
		},
		{
			Ticker:                "BNGA",
			CompanySentimentScore: 0.18,
			PolicyExposureScore:   -0.05,
			JumlahArtikelCompany:  7,
			JumlahArtikelPolicy:   4,
		},
		{
			Ticker:                "BDMN",
			CompanySentimentScore: 0.05,
			PolicyExposureScore:   -0.10,
			JumlahArtikelCompany:  6,
			JumlahArtikelPolicy:   4,
		},
		{
			Ticker:                "BBTN",
			CompanySentimentScore: -0.28,
			PolicyExposureScore:   -0.40,
			JumlahArtikelCompany:  8,
			JumlahArtikelPolicy:   6,
		},
		{
			Ticker:                "BJBR",
			CompanySentimentScore: 0.12,
			PolicyExposureScore:   -0.05,
			JumlahArtikelCompany:  5,
			JumlahArtikelPolicy:   3,
		},
		{
			Ticker:                "BJTM",
			CompanySentimentScore: 0.10,
			PolicyExposureScore:   -0.05,
			JumlahArtikelCompany:  5,
			JumlahArtikelPolicy:   3,
		},
	}

	for _, sent := range defaultSentiments {
		var count int64
		db.Model(&model.DailySentimentScore{}).Where("ticker = ?", sent.Ticker).Count(&count)
		if count == 0 {
			sent.Tanggal = time.Now()
			sent.CreatedAt = time.Now()
			db.Create(&sent)
		}
	}

	for _, q := range model.GetDefaultStockQuotes() {
		var existing model.StockQuote
		if err := db.Where("ticker = ?", q.Ticker).First(&existing).Error; err != nil {
			db.Create(&q)
		} else {
			if existing.Coverage != q.Coverage || existing.Price == 0 {
				db.Model(&existing).Updates(map[string]interface{}{
					"coverage":       q.Coverage,
					"name":           q.Name,
					"price":          q.Price,
					"change_percent": q.ChangePercent,
					"market_cap":     q.MarketCap,
					"pe":             q.PE,
					"pbv":            q.PBV,
				})
			}
		}
	}
}

