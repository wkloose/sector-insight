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

