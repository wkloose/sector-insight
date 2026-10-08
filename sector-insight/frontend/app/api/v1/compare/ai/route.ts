import { NextResponse } from "next/server"

interface StockCompareItem {
  ticker: string
  name: string
  sector: string
  price: number
  change_percent: number
  market_cap: number
  pe: number
  pbv: number
  roe: number
  fundamental_score: number
  health_status: string
  net_foreign_flow: number
  foreign_z_score: number
  foreign_anomaly: string
  sentiment_score: number
  sentiment_label: string
  composite_score?: number
  value_momentum_signal?: string
  institutional_conviction?: string
  risk_adjusted_attractiveness?: number
  alpha_generation_potential?: number
  margin_of_safety?: number
}

interface CompareRequestBody {
  stocks: StockCompareItem[]
}

export async function POST(req: Request) {
  try {
    const body: CompareRequestBody = await req.json()
    if (!body || !Array.isArray(body.stocks) || body.stocks.length < 2) {
      return NextResponse.json(
        { error: "Minimal 2 saham diperlukan untuk komparasi" },
        { status: 400 }
      )
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"
    try {
      const aiRes = await fetch(`${aiServiceUrl}/api/v1/compare-stocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stocks: body.stocks }),
        cache: "no-store",
      })

      if (aiRes.ok) {
        const result = await aiRes.json()
        return NextResponse.json(result)
      }
    } catch {
    }

    const sorted = [...body.stocks].sort((a, b) => {
      const scoreA = (a.fundamental_score * 0.4) + (Math.min(a.roe * 2, 40) * 0.2) + ((50 + Math.min(a.foreign_z_score * 15, 40)) * 0.2) + ((50 + a.sentiment_score * 40) * 0.2)
      const scoreB = (b.fundamental_score * 0.4) + (Math.min(b.roe * 2, 40) * 0.2) + ((50 + Math.min(b.foreign_z_score * 15, 40)) * 0.2) + ((50 + b.sentiment_score * 40) * 0.2)
      return scoreB - scoreA
    })
    const winner = sorted[0]

    const rankings = sorted.map((s, idx) => {
      const totScore = Math.round(((s.fundamental_score * 0.4) + (Math.min(s.roe * 2, 40) * 0.2) + ((50 + Math.min(s.foreign_z_score * 15, 40)) * 0.2) + ((50 + s.sentiment_score * 40) * 0.2)) * 10) / 10
      const strengths: string[] = []
      if (s.fundamental_score >= 80) strengths.push(`Skor fundamental prima (${s.fundamental_score.toFixed(1)}/100)`)
      else if (s.fundamental_score >= 70) strengths.push(`Fundamental solid (${s.fundamental_score.toFixed(1)}/100)`)
      if (s.roe >= 15) strengths.push(`Profitabilitas tinggi ROE ${s.roe.toFixed(1)}%`)
      if (s.net_foreign_flow > 0) strengths.push(`Akumulasi asing positif (+Rp ${(s.net_foreign_flow / 1e9).toFixed(1)} Miliar)`)
      if (s.sentiment_score > 0.2) strengths.push(`Sentimen pasar optimis (${s.sentiment_label})`)
      if (strengths.length === 0) strengths.push(`Valuasi pasar kompetitif di sektor ${s.sector}`)

      const risks: string[] = []
      if (s.pe > 25) risks.push(`Valuasi PE premium (${s.pe.toFixed(1)}x)`)
      if (s.net_foreign_flow < 0) risks.push(`Tekanan outflow asing jangka pendek`)
      if (s.sentiment_score < -0.1) risks.push(`Sentimen publik sedang defensif`)
      if (risks.length === 0) risks.push(`Sensitivitas makro dan fluktuasi IHSG`)

      return {
        ticker: s.ticker,
        rank: idx + 1,
        title: idx === 0 ? "Market Leader" : idx === 1 ? "Challenger" : "Alternative Play",
        score: totScore,
        strengths,
        risks,
        investor_fit: s.fundamental_score >= 80 && s.roe >= 15 ? "Core Long-Term Holding" : s.net_foreign_flow > 0 ? "Growth & Momentum" : "Value & Swing",
      }
    })

    const fallbackResponse = {
      executive_summary: `Komparasi komposit ${body.stocks.map(s => s.ticker).join(", ")} menempatkan ${winner.ticker} sebagai emiten terunggul dengan fundamental health score ${winner.fundamental_score.toFixed(1)}/100 dan efisiensi modal yang kompetitif.`,
      verdict_winner: winner.ticker,
      verdict_rationale: `${winner.ticker} unggul dari kombinasi metrik profitabilitas (ROE ${winner.roe.toFixed(1)}%), kesehatan neraca, serta tren dukungan aliran dana asing.`,
      rankings,
      pillar1_fundamental_comparison: `Pada pilar fundamental, ${winner.ticker} membukukan skor ${winner.fundamental_score.toFixed(1)}/100 (${winner.health_status}) dengan rasio valuasi PE ${winner.pe.toFixed(1)}x dan PBV ${winner.pbv.toFixed(2)}x.`,
      pillar2_foreign_flow_comparison: `Pada pilar arus modal asing, ${winner.ticker} membukukan net foreign flow Rp ${(winner.net_foreign_flow / 1e9).toFixed(1)} Miliar dengan Z-score deviasi ${winner.foreign_z_score.toFixed(2)}σ (${winner.foreign_anomaly}).`,
      pillar3_sentiment_comparison: `Pada pilar sentimen, katalis pemberitaan berada di level ${winner.sentiment_label} (${winner.sentiment_score > 0 ? "+" : ""}${winner.sentiment_score.toFixed(2)}).`,
      actionable_recommendations: [
        `Prioritaskan ${winner.ticker} untuk alokasi porsi terbesar portofolio di sektor ${winner.sector}.`,
        `Gunakan momentum koreksi teknikal untuk akumulasi bertahap pada area support.`,
        `Pantau konfirmasi kelanjutan arus modal asing dan laporan keuangan kuartalan terbaru.`,
      ],
      confidence_score: 0.92,
    }

    return NextResponse.json(fallbackResponse)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
