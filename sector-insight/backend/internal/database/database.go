package database

import (
	"fmt"
	"log"
	"time"

	"sector-insight/backend/internal/config"
	"sector-insight/backend/internal/model"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
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
		log.Printf("[DATABASE] PostgreSQL connection failed (%v). Falling back to local SQLite (sector_insight.db)...", err)

		db, err = gorm.Open(sqlite.Open("sector_insight.db"), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Warn),
		})
		if err != nil {
			return nil, fmt.Errorf("failed to open sqlite fallback: %w", err)
		}
		log.Println("[DATABASE] Successfully connected to local SQLite database.")
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
	)
	if err != nil {
		return nil, fmt.Errorf("auto-migration failed: %w", err)
	}

	DB = db
	seedInitialDataIfEmpty(db)
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
}

