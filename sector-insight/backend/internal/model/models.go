package model

import (
	"math"
	"time"
)

type RawArticle struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	ExternalID       string    `json:"external_id" gorm:"uniqueIndex"`
	Ticker           string    `json:"ticker" gorm:"index"`
	Judul            string    `json:"judul"`
	Snippet          string    `json:"snippet"`
	URL              string    `json:"url"`
	TanggalPublikasi time.Time `json:"tanggal_publikasi" gorm:"index"`
	Tags             string    `json:"tags"`
	StatusDiproses   bool      `json:"status_diproses" gorm:"default:false;index"`
	CreatedAt        time.Time `json:"created_at"`
}

type ProcessedArticle struct {
	ID               uint       `json:"id" gorm:"primaryKey"`
	ArticleID        uint       `json:"article_id" gorm:"index"`
	RawArticle       RawArticle `json:"raw_article" gorm:"foreignKey:ArticleID"`
	Category         string     `json:"category"`
	AffectedEntities string     `json:"affected_entities"`
	SentimentScore   float64    `json:"sentiment_score"`
	Confidence       float64    `json:"confidence"`
	Reasoning        string     `json:"reasoning"`
	CreatedAt        time.Time  `json:"created_at"`
}

type DailySentimentScore struct {
	ID                    uint      `json:"id" gorm:"primaryKey"`
	Ticker                string    `json:"ticker" gorm:"index:idx_ticker_date,unique"`
	Tanggal               time.Time `json:"tanggal" gorm:"index:idx_ticker_date,unique"`
	CompanySentimentScore float64   `json:"company_sentiment_score"`
	PolicyExposureScore   float64   `json:"policy_exposure_score"`
	JumlahArtikelCompany  int       `json:"jumlah_artikel_company"`
	JumlahArtikelPolicy   int       `json:"jumlah_artikel_policy"`
	CreatedAt             time.Time `json:"created_at"`
}

type BankQuarterlyRaw struct {
	ID                uint      `json:"id" gorm:"primaryKey"`
	Ticker            string    `json:"ticker" gorm:"index:idx_bank_quarter,unique"`
	Kuartal           string    `json:"kuartal" gorm:"index:idx_bank_quarter,unique"`
	NetInterestIncome float64   `json:"net_interest_income"`
	GrossLoan         float64   `json:"gross_loan"`
	TotalDeposit      float64   `json:"total_deposit"`
	LabaBersih        float64   `json:"laba_bersih"`
	TotalAset         float64   `json:"total_aset"`
	Ekuitas           float64   `json:"ekuitas"`
	ROE               float64   `json:"roe"`
	DividenDibayar    float64   `json:"dividen_dibayar"`
	CreatedAt         time.Time `json:"created_at"`
}

type FundamentalScore struct {
	ID                 uint      `json:"id" gorm:"primaryKey"`
	Ticker             string    `json:"ticker" gorm:"index:idx_fund_ticker_quarter,unique"`
	Kuartal            string    `json:"kuartal" gorm:"index:idx_fund_ticker_quarter,unique"`
	NIMScore           float64   `json:"nim_score"`
	LDRScore           float64   `json:"ldr_score"`
	LoanGrowthScore    float64   `json:"loan_growth_score"`
	DepositGrowthScore float64   `json:"deposit_growth_score"`
	ROEScore           float64   `json:"roe_score"`
	KonsistensiScore   float64   `json:"konsistensi_score"`
	DividendScore      float64   `json:"dividend_score"`
	SkorAkhir          float64   `json:"skor_akhir"`
	HealthStatus       string    `json:"health_status"`
	CreatedAt          time.Time `json:"created_at"`
}

type DailyForeignFlow struct {
	ID                uint      `json:"id" gorm:"primaryKey"`
	Ticker            string    `json:"ticker" gorm:"index:idx_ff_ticker_date,unique"`
	Tanggal           time.Time `json:"tanggal" gorm:"index:idx_ff_ticker_date,unique"`
	NetForeignInflow  float64   `json:"net_foreign_inflow"`
	CreatedAt         time.Time `json:"created_at"`
}

type ForeignFlowAnomaly struct {
	ID                uint                 `json:"id" gorm:"primaryKey"`
	Ticker            string               `json:"ticker" gorm:"index"`
	Tanggal           time.Time            `json:"tanggal" gorm:"index"`
	NetForeignInflow  float64              `json:"net_foreign_inflow"`
	ZScore            float64              `json:"z_score"`
	StatusAnomali     string               `json:"status_anomali"`
	BrokerDetails     []AnomalyBrokerDetail `json:"broker_details,omitempty" gorm:"foreignKey:AnomalyID"`
	CreatedAt         time.Time            `json:"created_at"`
}

type AnomalyBrokerDetail struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	AnomalyID  uint      `json:"anomaly_id" gorm:"index"`
	KodeBroker string    `json:"kode_broker"`
	NamaBroker string    `json:"nama_broker"`
	Kategori   string    `json:"kategori"`
	NetValue   float64   `json:"net_value"`
	CreatedAt  time.Time `json:"created_at"`
}

type CompositeAlertResponse struct {
	Ticker           string   `json:"ticker"`
	OverallStatus    string   `json:"overall_status"`
	Headline         string   `json:"headline"`
	SynthesisSummary string   `json:"synthesis_summary"`
	FundamentalScore float64  `json:"fundamental_score"`
	CompanySentiment float64  `json:"company_sentiment"`
	PolicyExposure   float64  `json:"policy_exposure"`
	ForeignAnomaly   string   `json:"foreign_anomaly"`
	CrowdSentiment   float64  `json:"crowd_sentiment"`
	BullishPercent   float64  `json:"bullish_percent"`
	DivergenceStatus string   `json:"divergence_status"`
	TriggerFactors   []string `json:"trigger_factors"`
}

type StockBeginnerBrief struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Ticker      string    `json:"ticker" gorm:"uniqueIndex;size:10"`
	CompanyName string    `json:"company_name" gorm:"size:100"`
	TldrSummary string    `json:"tldr_summary" gorm:"type:text"`
	HealthBadge string    `json:"health_badge" gorm:"size:50"`
	HealthColor string    `json:"health_color" gorm:"size:20"`
	ProsList    string    `json:"pros_list" gorm:"type:text"`
	ConsList    string    `json:"cons_list" gorm:"type:text"`
	InvestorFit string    `json:"investor_fit" gorm:"type:text"`
	FaqItems    string    `json:"faq_items" gorm:"type:text"`
	LastUpdated time.Time `json:"last_updated"`
}

type CommunityUser struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	Username        string    `json:"username" gorm:"uniqueIndex;size:50"`
	Badge           string    `json:"badge" gorm:"size:50"`
	KarmaPoints     int       `json:"karma_points" gorm:"default:0"`
	TotalUpvotes    int       `json:"total_upvotes" gorm:"default:0"`
	CredibilityRate float64   `json:"credibility_rate" gorm:"default:0.5"`
	CreatedAt       time.Time `json:"created_at"`
}

type CommunityPost struct {
	ID            uint          `json:"id" gorm:"primaryKey"`
	UserID        uint          `json:"user_id" gorm:"index"`
	User          CommunityUser `json:"user" gorm:"foreignKey:UserID"`
	Ticker        string        `json:"ticker" gorm:"index;size:10"`
	Title         string        `json:"title" gorm:"size:255"`
	Content       string        `json:"content" gorm:"type:text"`
	SentimentTag  string        `json:"sentiment_tag" gorm:"size:20"`
	Upvotes       int           `json:"upvotes" gorm:"default:0"`
	Downvotes     int           `json:"downvotes" gorm:"default:0"`
	WeightedScore float64       `json:"weighted_score" gorm:"default:0;index"`
	CommentCount  int           `json:"comment_count" gorm:"default:0"`
	CreatedAt     time.Time     `json:"created_at" gorm:"index"`
}

type CommunityVote struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	PostID     uint      `json:"post_id" gorm:"uniqueIndex:idx_user_post_vote"`
	UserID     uint      `json:"user_id" gorm:"uniqueIndex:idx_user_post_vote"`
	Direction  int       `json:"direction"`
	VoteWeight float64   `json:"vote_weight"`
	CreatedAt  time.Time `json:"created_at"`
}

type DailyCrowdSentiment struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	Ticker           string    `json:"ticker" gorm:"uniqueIndex:idx_crowd_ticker_date;size:10"`
	Tanggal          time.Time `json:"tanggal" gorm:"uniqueIndex:idx_crowd_ticker_date"`
	SentimentScore   float64   `json:"sentiment_score"`
	BullishPercent   float64   `json:"bullish_percent"`
	TotalPosts       int       `json:"total_posts"`
	DiscussionZScore float64   `json:"discussion_zscore"`
	DivergenceStatus string    `json:"divergence_status" gorm:"size:50"`
	CreatedAt        time.Time `json:"created_at"`
}

type SectorMaster struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	SectorSlug string    `gorm:"uniqueIndex;size:50" json:"sector_slug"`
	SectorName string    `gorm:"size:100" json:"sector_name"`
	Subsectors string    `gorm:"type:text" json:"subsectors"`
	CreatedAt  time.Time `json:"created_at"`
}

type SectorDailyScore struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	SectorSlug     string    `gorm:"index:idx_sector_date,unique;size:50" json:"sector_slug"`
	Tanggal        time.Time `gorm:"index:idx_sector_date,unique" json:"tanggal"`
	SMRSScore      float64   `json:"smrs_score"`
	SentimentScore float64   `json:"sentiment_score"`
	NetForeignFlow float64   `json:"net_foreign_flow"`
	PriceReturn7D  float64   `json:"price_return_7d" gorm:"column:price_return7_d"`
	Status         string    `json:"status" gorm:"size:50"`
	TopMovers      string    `gorm:"type:text" json:"top_movers"`
	CreatedAt      time.Time `json:"created_at"`
}

type StockQuote struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Ticker          string    `gorm:"uniqueIndex;size:10" json:"ticker"`
	Name            string    `gorm:"size:100" json:"name,omitempty"`
	Sector          string    `gorm:"size:100" json:"sector,omitempty"`
	Price           float64   `json:"price"`
	Change          float64   `gorm:"-" json:"change"`
	ChangePercent   float64   `json:"change_percent"`
	Coverage        int       `json:"coverage"`
	AnalystCoverage int       `gorm:"-" json:"analyst_coverage"`
	Volume          float64   `json:"volume,omitempty"`
	High52w         float64   `json:"high_52w,omitempty"`
	Low52w          float64   `json:"low_52w,omitempty"`
	MarketCap       float64   `json:"market_cap"`
	PE              float64   `json:"pe"`
	PBV             float64   `json:"pbv"`
	Status          string    `json:"status,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func (StockQuote) TableName() string {
	return "stock_quotes"
}

func (s *StockQuote) PopulateComputedFields() {
	if s.AnalystCoverage == 0 && s.Coverage > 0 {
		s.AnalystCoverage = s.Coverage
	}
	if s.Change == 0 && s.Price > 0 && s.ChangePercent != 0 {
		prevPrice := s.Price / (1.0 + s.ChangePercent/100.0)
		s.Change = math.Round(s.Price - prevPrice)
	}
	if s.Status == "" {
		if s.ChangePercent > 0.5 {
			s.Status = "Stabil"
		} else if s.ChangePercent < -1.0 {
			s.Status = "Perhatian"
		} else {
			s.Status = "Netral"
		}
	}
}

type MarketSummaryResponse struct {
	IHSGIndex                 float64 `json:"ihsg_index"`
	IHSGChange                float64 `json:"ihsg_change"`
	IHSGChangePercent         string  `json:"ihsg_change_percent"`
	IHSGChangePoints          float64 `json:"ihsg_change_points,omitempty"`
	IHSGChangePercentFloat    float64 `json:"ihsg_change_percent_float"`
	IHSGStatus                string  `json:"ihsg_status"`
	TotalForeignFlowIDR       float64 `json:"total_foreign_flow_idr"`
	TotalForeignFlow          float64 `json:"total_foreign_flow,omitempty"`
	TotalForeignFlowFormatted string  `json:"total_foreign_flow_formatted"`
	MarketSession             string  `json:"market_session"`
	MarketStatusText          string  `json:"market_status_text"`
	MarketStatus              string  `json:"market_status,omitempty"`
	WIBTime                   string  `json:"wib_time"`
	MarketTime                string  `json:"market_time,omitempty"`
	LeadingSector             string  `json:"leading_sector"`
	SectorLeader              string  `json:"sector_leader,omitempty"`
	TopSector                 string  `json:"top_sector,omitempty"`
	ActiveSector              string  `json:"active_sector"`
}

func GetDefaultStockQuotes() []StockQuote {
	now := time.Now()
	quotes := []StockQuote{
		{
			Ticker:          "BBCA",
			Name:            "PT Bank Central Asia Tbk",
			Price:           6000,
			Change:          -100,
			ChangePercent:   -1.64,
			Coverage:        28,
			AnalystCoverage: 28,
			MarketCap:       740000000000000,
			PE:              18.2,
			PBV:             3.05,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BBRI",
			Name:            "PT Bank Rakyat Indonesia Tbk",
			Price:           3030,
			Change:          -50,
			ChangePercent:   -1.62,
			Coverage:        28,
			AnalystCoverage: 28,
			MarketCap:       459000000000000,
			PE:              9.1,
			PBV:             1.82,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BMRI",
			Name:            "PT Bank Mandiri (Persero) Tbk",
			Price:           4000,
			Change:          -30,
			ChangePercent:   -0.74,
			Coverage:        28,
			AnalystCoverage: 28,
			MarketCap:       373000000000000,
			PE:              9.6,
			PBV:             1.38,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BBNI",
			Name:            "PT Bank Negara Indonesia Tbk",
			Price:           3410,
			Change:          -10,
			ChangePercent:   -0.29,
			Coverage:        28,
			AnalystCoverage: 28,
			MarketCap:       127000000000000,
			PE:              7.4,
			PBV:             0.96,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BRIS",
			Name:            "PT Bank Syariah Indonesia Tbk",
			Price:           2850,
			Change:          -30,
			ChangePercent:   -1.04,
			Coverage:        18,
			AnalystCoverage: 18,
			MarketCap:       131000000000000,
			PE:              19.5,
			PBV:             2.65,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BBTN",
			Name:            "PT Bank Tabungan Negara Tbk",
			Price:           1050,
			Change:          -15,
			ChangePercent:   -1.41,
			Coverage:        16,
			AnalystCoverage: 16,
			MarketCap:       14800000000000,
			PE:              4.7,
			PBV:             0.47,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BDMN",
			Name:            "PT Bank Danamon Indonesia Tbk",
			Price:           2240,
			Change:          -10,
			ChangePercent:   -0.44,
			Coverage:        14,
			AnalystCoverage: 14,
			MarketCap:       21900000000000,
			PE:              6.8,
			PBV:             0.54,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BJBR",
			Name:            "PT Bank Pembangunan Daerah Jawa Barat dan Banten Tbk",
			Price:           955,
			Change:          -5,
			ChangePercent:   -0.52,
			Coverage:        10,
			AnalystCoverage: 10,
			MarketCap:       9800000000000,
			PE:              6.0,
			PBV:             0.68,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BJTM",
			Name:            "PT Bank Pembangunan Daerah Jawa Timur Tbk",
			Price:           515,
			Change:          -5,
			ChangePercent:   -0.96,
			Coverage:        8,
			AnalystCoverage: 8,
			MarketCap:       7700000000000,
			PE:              5.7,
			PBV:             0.64,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			Ticker:          "BNGA",
			Name:            "PT Bank CIMB Niaga Tbk",
			Price:           1470,
			Change:          -10,
			ChangePercent:   -0.68,
			Coverage:        12,
			AnalystCoverage: 12,
			MarketCap:       36800000000000,
			PE:              5.5,
			PBV:             0.71,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
	}
	for i := range quotes {
		quotes[i].PopulateComputedFields()
	}
	return quotes
}


