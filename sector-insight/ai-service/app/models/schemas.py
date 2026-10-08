from typing import List, Literal, Optional
from pydantic import BaseModel, Field

class ArticleInput(BaseModel):
    article_id: int = Field(..., description="ID artikel dari database Go")
    title: str = Field(..., description="Judul artikel berita")
    snippet: str = Field(..., description="Cuplikan ringkasan isi berita")
    ticker: Optional[str] = Field(None, description="Ticker emiten jika ada asosiasi awal")

class ArticleAnalysis(BaseModel):
    article_id: int
    category: Literal["company_specific", "macro_policy"] = Field(
        ...,
        description="'company_specific' jika berita spesifik ke satu emiten, 'macro_policy' jika kebijakan makro (BI, OJK, Pemerintah, suku bunga, dsb)"
    )
    affected_entities: List[str] = Field(
        ...,
        description="Daftar ticker jika company_specific (contoh: ['BBCA']), atau daftar subsektor terdampak jika macro_policy (contoh: ['perbankan', 'multifinance'])"
    )
    sentiment_score: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="Skor sentimen numerik dari -1.0 (sangat negatif) sampai 1.0 (sangat positif)"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Tingkat keyakinan model terhadap klasifikasi dan skor dari 0.0 sampai 1.0"
    )
    reasoning: str = Field(
        ...,
        description="Alasan singkat 1 kalimat mengapa skor dan kategori ini diberikan"
    )

class BatchAnalysisRequest(BaseModel):
    articles: List[ArticleInput]

class BatchAnalysisResponse(BaseModel):
    results: List[ArticleAnalysis]

class StockCompareItem(BaseModel):
    ticker: str = Field(..., description="Kode ticker saham")
    name: str = Field(..., description="Nama emiten")
    sector: str = Field(..., description="Sektor industri")
    price: float = Field(..., description="Harga saham terkini")
    change_percent: float = Field(..., description="Perubahan harga 24 jam dalam %")
    market_cap: float = Field(..., description="Kapitalisasi pasar IDR")
    pe: float = Field(..., description="Price to Earnings Ratio")
    pbv: float = Field(..., description="Price to Book Value")
    roe: float = Field(0.0, description="Return on Equity %")
    fundamental_score: float = Field(..., description="Skor kesehatan fundamental PRD 0-100")
    health_status: str = Field(..., description="Status kesehatan fundamental")
    net_foreign_flow: float = Field(..., description="Net foreign flow IDR")
    foreign_z_score: float = Field(..., description="Z-score deviasi arus asing 90 hari")
    foreign_anomaly: str = Field(..., description="Status anomali arus asing")
    sentiment_score: float = Field(..., description="Skor sentimen berita -1.0 s/d 1.0")
    sentiment_label: str = Field(..., description="Label sentimen (Bullish/Netral/Bearish)")
    composite_score: Optional[float] = Field(None, description="Composite Investment Score (CIS) 0-100")
    value_momentum_signal: Optional[str] = Field(None, description="Sinyal konvergensi value vs momentum")
    institutional_conviction: Optional[str] = Field(None, description="Level keyakinan institusi asing (ICL)")
    risk_adjusted_attractiveness: Optional[float] = Field(None, description="Risk-Adjusted Attractiveness Ratio (RAAR)")
    alpha_generation_potential: Optional[float] = Field(None, description="Alpha Generation Potential (AGP)")
    margin_of_safety: Optional[float] = Field(None, description="Margin of Safety %")

class CompareStocksRequest(BaseModel):
    stocks: List[StockCompareItem]

class StockRankVerdict(BaseModel):
    ticker: str
    rank: int
    title: str
    score: float
    strengths: List[str]
    risks: List[str]
    investor_fit: str

class CompareStocksResponse(BaseModel):
    executive_summary: str
    verdict_winner: str
    verdict_rationale: str
    rankings: List[StockRankVerdict]
    pillar1_fundamental_comparison: str
    pillar2_foreign_flow_comparison: str
    pillar3_sentiment_comparison: str
    actionable_recommendations: List[str]
    confidence_score: float

