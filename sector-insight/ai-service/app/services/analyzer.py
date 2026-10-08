import json
import logging
from typing import List
from app.config import settings
from app.models.schemas import (
    ArticleInput,
    ArticleAnalysis,
    StockCompareItem,
    CompareStocksResponse,
    StockRankVerdict,
)
from app.services.prompts import (
    SYSTEM_PROMPT,
    build_user_prompt,
    COMPARE_SYSTEM_PROMPT,
    build_compare_prompt,
)

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

    async def analyze_comparison(self, stocks: List[StockCompareItem]) -> CompareStocksResponse:
        if self.client and len(stocks) >= 2:
            try:
                user_msg = build_compare_prompt(stocks)
                response = self.client.models.generate_content(
                    model=settings.MODEL_NAME,
                    contents=user_msg,
                    config=types.GenerateContentConfig(
                        system_instruction=COMPARE_SYSTEM_PROMPT,
                        response_mime_type="application/json",
                        response_schema=CompareStocksResponse,
                        temperature=0.3,
                    ),
                )
                data = json.loads(response.text)
                return CompareStocksResponse(**data)
            except Exception as e:
                logger.error(f"Error calling LLM for stock comparison: {e}")

        return self._heuristic_compare_fallback(stocks)

    def _heuristic_compare_fallback(self, stocks: List[StockCompareItem]) -> CompareStocksResponse:
        if not stocks:
            return CompareStocksResponse(
                executive_summary="Tidak ada data saham untuk dibandingkan.",
                verdict_winner="-",
                verdict_rationale="Pilih minimal 2 saham.",
                rankings=[],
                pillar1_fundamental_comparison="",
                pillar2_foreign_flow_comparison="",
                pillar3_sentiment_comparison="",
                actionable_recommendations=[],
                confidence_score=0.5,
            )

        scored = []
        for s in stocks:
            score = (s.fundamental_score * 0.40) + \
                    (min(max(s.roe * 2.0, 0), 40) * 0.20) + \
                    ((50.0 + min(max(s.foreign_z_score * 15.0, -40), 40)) * 0.20) + \
                    ((50.0 + (s.sentiment_score * 40.0)) * 0.20)
            scored.append((score, s))

        scored.sort(key=lambda x: x[0], reverse=True)
        winner = scored[0][1]

        rankings = []
        for idx, (tot_score, s) in enumerate(scored):
            strengths = []
            if s.fundamental_score >= 80:
                strengths.append(f"Kesehatan fundamental prima ({s.fundamental_score:.1f}/100)")
            elif s.fundamental_score >= 70:
                strengths.append(f"Fundamental solid ({s.fundamental_score:.1f}/100)")
            if s.roe >= 15:
                strengths.append(f"Profitabilitas tinggi dengan ROE {s.roe:.1f}%")
            if s.net_foreign_flow > 0:
                strengths.append(f"Akumulasi institusi/asing positif (+Rp {s.net_foreign_flow:,.0f})")
            if s.sentiment_score > 0.2:
                strengths.append(f"Sentimen pasar optimis ({s.sentiment_label})")
            if not strengths:
                strengths.append(f"Valuasi wajar di sektor {s.sector}")

            risks = []
            if s.pe > 25:
                risks.append(f"Valuasi PE premium ({s.pe:.1f}x)")
            if s.net_foreign_flow < 0:
                risks.append("Tekanan distribusi asing jangka pendek")
            if s.sentiment_score < -0.1:
                risks.append("Sentimen berita sedang tertekan")
            if s.fundamental_score < 70:
                risks.append("Perlu pemantauan metrik likuiditas dan solvabilitas")
            if not risks:
                risks.append("Volatilitas pasar dan sentimen makro")

            investor_fit = "Core Long-Term Holding" if s.fundamental_score >= 80 and s.roe >= 15 else ("Growth & Momentum" if s.net_foreign_flow > 0 else "Value & Tactical Swing")
            title = "Market Leader" if idx == 0 else ("Challenger" if idx == 1 else "Alternative Play")

            rankings.append(StockRankVerdict(
                ticker=s.ticker,
                rank=idx + 1,
                title=title,
                score=round(tot_score, 1),
                strengths=strengths,
                risks=risks,
                investor_fit=investor_fit
            ))

        tickers_str = ", ".join(s.ticker for s in stocks)
        exec_sum = f"Analisis komparatif head-to-head {tickers_str} menunjukkan {winner.ticker} memimpin dengan skor komposit tertinggi {scored[0][0]:.1f}/100, ditopang oleh fundamental yang kokoh dan dukungan arus dana institusional."
        rationale = f"{winner.ticker} mengungguli kompetitornya berkat kombinasi fundamental health score {winner.fundamental_score:.1f}/100, efisiensi ROE {winner.roe:.1f}%, serta stabilitas arus institusi asing."

        p1 = f"Pada pilar fundamental, {winner.ticker} memiliki profil terkuat dengan ROE {winner.roe:.1f}% dan PE {winner.pe:.1f}x vs rerata sektor. Fundamental Health Score berada di kategori {winner.health_status}."
        p2 = f"Pada pilar foreign flow, {winner.ticker} mencatatkan aliran bersih {winner.net_foreign_flow:+,.0f} IDR dengan Z-Score {winner.foreign_z_score:.2f} ({winner.foreign_anomaly})."
        p3 = f"Pada pilar sentimen, dinamika pasar mencerminkan bias {winner.sentiment_label} (skor {winner.sentiment_score:+.2f})."

        recs = [
            f"Alokasi bobot utama pada {winner.ticker} sebagai core portfolio holding.",
            f"Manfaatkan pullback teknikal untuk akumulasi bertahap pada {winner.ticker}.",
            f"Pantau kelanjutan arus asing dan rilis laporan keuangan kuartalan berikutnya."
        ]

        return CompareStocksResponse(
            executive_summary=exec_sum,
            verdict_winner=winner.ticker,
            verdict_rationale=rationale,
            rankings=rankings,
            pillar1_fundamental_comparison=p1,
            pillar2_foreign_flow_comparison=p2,
            pillar3_sentiment_comparison=p3,
            actionable_recommendations=recs,
            confidence_score=0.90
        )

analyzer_service = ArticleAnalyzer()

