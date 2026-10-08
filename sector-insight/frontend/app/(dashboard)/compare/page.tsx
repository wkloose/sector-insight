import React from "react"
import { Metadata } from "next"
import { StockComparisonHub } from "@/src/features/compare"
import { getFundamentalScore } from "@/src/features/fundamental"
import { getSentimentData } from "@/src/features/sentiment"
import { getForeignFlowData } from "@/src/features/foreign-flow"
import { getStockQuotes } from "@/src/features/market"
import { StockCompareProfile } from "@/src/features/compare/types"

export const metadata: Metadata = {
  title: "Komparasi Saham Head-to-Head Multi-Pilar",
  description: "Bandingkan seluruh saham di Bursa Efek Indonesia secara head-to-head multi-pilar dengan sintesis cerdas.",
}

interface PageProps {
  searchParams?: Promise<{
    stocks?: string
  }>
}

export default async function ComparePage(props: PageProps) {
  const searchParams = props.searchParams ? await props.searchParams : undefined
  const tickersParam = searchParams?.stocks || "BBCA,BMRI,BBRI"
  const tickers = tickersParam.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean).slice(0, 3)

  const defaultTickers = tickers.length >= 2 ? tickers : ["BBCA", "BMRI", "BBRI"]

  const quotes = await getStockQuotes()

  const initialProfiles: StockCompareProfile[] = await Promise.all(
    defaultTickers.map(async (ticker) => {
      const [fund, sent, flow] = await Promise.all([
        getFundamentalScore(ticker),
        getSentimentData(ticker),
        getForeignFlowData(ticker),
      ])
      const quote = quotes.find((q) => q.ticker.toUpperCase() === ticker)

      return {
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
    })
  )

  return <StockComparisonHub initialProfiles={initialProfiles} />
}
