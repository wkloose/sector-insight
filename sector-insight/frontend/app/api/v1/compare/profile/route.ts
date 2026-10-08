import { NextResponse } from "next/server"
import { getFundamentalScore } from "@/src/features/fundamental"
import { getSentimentData } from "@/src/features/sentiment"
import { getForeignFlowData } from "@/src/features/foreign-flow"
import { getStockQuotes } from "@/src/features/market"
import { StockCompareProfile } from "@/src/features/compare/types"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ticker = (searchParams.get("ticker") || "BBCA").toUpperCase()

  try {
    const [fund, sent, flow, quotes] = await Promise.all([
      getFundamentalScore(ticker),
      getSentimentData(ticker),
      getForeignFlowData(ticker),
      getStockQuotes(),
    ])

    const quote = quotes.find((q) => q.ticker.toUpperCase() === ticker)

    const profile: StockCompareProfile = {
      ticker,
      name: quote?.name || fund.bankName || `${ticker} Tbk.`,
      sector: quote?.sector || "Keuangan",
      price: quote?.price || 1000,
      change_percent: quote?.change_percent || 0,
      market_cap: quote?.market_cap || 10000000000000,
      pe: quote?.pe || 14.5,
      pbv: quote?.pbv || 2.1,
      roe: parseFloat((fund.financialMetrics?.roe || "15").replace("%", "")) || 15,
      fundamental_score: fund.score || 75,
      health_status: fund.status || "Stabil",
      net_foreign_flow: flow.yesterdayFlow || 0,
      foreign_z_score: flow.yesterdayZScore || 0,
      foreign_anomaly: flow.yesterdayAnomalyStatus || "Normal",
      sentiment_score: sent.companySentimentScore || 0,
      sentiment_label: sent.companySentimentLabel || "Netral",
      nim: fund.financialMetrics?.nim,
      ldr: fund.financialMetrics?.ldr,
      loanGrowth: fund.financialMetrics?.loanGrowthYoY,
      depositGrowth: fund.financialMetrics?.depositGrowthYoY,
      dominantBroker: flow.anomalies14d?.[0]?.dominantBroker?.code || "AK",
      topBrokers: flow.composition14d?.top3Brokers || ["AK", "YU", "CS"],
    }

    return NextResponse.json(profile)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memuat profil saham"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
