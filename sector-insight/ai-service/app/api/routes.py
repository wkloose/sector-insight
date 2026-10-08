from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    ArticleInput,
    ArticleAnalysis,
    BatchAnalysisRequest,
    BatchAnalysisResponse,
    CompareStocksRequest,
    CompareStocksResponse,
)
from app.services.analyzer import analyzer_service

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "sector-insight-ai",
        "llm_ready": analyzer_service.client is not None
    }

@router.post("/analyze-news", response_model=ArticleAnalysis)
async def analyze_single_article(article: ArticleInput):
    try:
        return await analyzer_service.analyze_article(article)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-batch", response_model=BatchAnalysisResponse)
async def analyze_batch_articles(batch: BatchAnalysisRequest):
    try:
        results = await analyzer_service.analyze_batch(batch.articles)
        return BatchAnalysisResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare-stocks", response_model=CompareStocksResponse)
async def compare_stocks_endpoint(req: CompareStocksRequest):
    try:
        return await analyzer_service.analyze_comparison(req.stocks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


