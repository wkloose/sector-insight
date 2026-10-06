import json
import logging
from typing import List
from app.config import settings
from app.models.schemas import ArticleInput, ArticleAnalysis
from app.services.prompts import SYSTEM_PROMPT, build_user_prompt

logger = logging.getLogger(__name__)

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

class ArticleAnalyzer:
    def __init__(self):
        self.client = None
        if GENAI_AVAILABLE and settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
                logger.info("Gemini client initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini client: {e}")

    async def analyze_article(self, article: ArticleInput) -> ArticleAnalysis:

        if self.client:
            try:
                user_msg = build_user_prompt(article.title, article.snippet, article.ticker)
                response = self.client.models.generate_content(
                    model=settings.MODEL_NAME,
                    contents=user_msg,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_PROMPT,
                        response_mime_type="application/json",
                        response_schema=ArticleAnalysis,
                        temperature=0.2,
                    ),
                )
                data = json.loads(response.text)
                data["article_id"] = article.article_id
                return ArticleAnalysis(**data)
            except Exception as e:
                logger.error(f"Error calling LLM for article {article.article_id}: {e}")

        return self._heuristic_fallback(article)

    async def analyze_batch(self, articles: List[ArticleInput]) -> List[ArticleAnalysis]:
        results = []
        for art in articles:
            analysis = await self.analyze_article(art)
            results.append(analysis)
        return results

    def _heuristic_fallback(self, article: ArticleInput) -> ArticleAnalysis:
        text = f"{article.title} {article.snippet}".lower()

        macro_keywords = ["bank indonesia", "bi rate", "suku bunga", "ojk", "inflasi", "kebijakan moneter", "rupiah", "fiskal", "pajak", "subsidi", "ekspor", "impor"]
        is_macro = any(k in text for k in macro_keywords)

        category = "macro_policy" if is_macro else "company_specific"

        if is_macro:
            if any(k in text for k in ["bank", "bunga", "ojk", "kredit", "likuiditas"]):
                affected = ["keuangan"]
            elif any(k in text for k in ["minyak", "batu bara", "esdm", "energi"]):
                affected = ["energi"]
            else:
                affected = ["makroekonomi"]
        else:
            affected = [article.ticker.upper()] if article.ticker else ["PASAR_MODAL"]

        strong_negatives = ["laba anjlok", "laba turun", "laba tertekan", "rugi bersih", "kredit macet", "npl naik", "kinerja merosot", "dividen absen", "kasus korupsi", "sanksi"]
        strong_positives = ["rekor laba", "laba melonjak", "laba melesat", "pertumbuhan rekor", "dividen jumbo", "kinerja cemerlang", "kredit tumbuh pesat", "npl turun"]

        has_strong_neg = any(p in text for p in strong_negatives)
        has_strong_pos = any(p in text for p in strong_positives)

        positive_keywords = ["naik", "tumbuh", "laba", "rekor", "menguat", "positif", "kinerja", "dividen", "ekspansi", "akuisisi"]
        negative_keywords = ["turun", "anjlok", "rugi", "tekanan", "npl", "waspada", "pelemahan", "memburuk", "defisit"]

        pos_count = sum(1 for w in positive_keywords if w in text)
        neg_count = sum(1 for w in negative_keywords if w in text)

        if has_strong_neg and not has_strong_pos:
            score = -0.70
            reason = "Terdeteksi sentimen negatif signifikan pada indikator kinerja finansial."
        elif has_strong_pos and not has_strong_neg:
            score = 0.75
            reason = "Terdeteksi sentimen positif kuat dari rilis kinerja dan pertumbuhan."
        elif pos_count > neg_count + 1:
            score = 0.50
            reason = "Didominasi oleh pemberitaan bernada positif dan perkembangan positif."
        elif neg_count > pos_count + 1:
            score = -0.50
            reason = "Didominasi oleh faktor risiko atau indikasi koreksi kinerja."
        else:
            score = 0.0
            reason = "Informasi berimbang tanpa tendensi sentimen dominan."

        return ArticleAnalysis(
            article_id=article.article_id,
            category=category,
            affected_entities=affected,
            sentiment_score=score,
            confidence=0.85,
            reasoning=reason
        )

analyzer_service = ArticleAnalyzer()

