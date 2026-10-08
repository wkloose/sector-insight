import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { AnomalyBadge, DashboardStockSection } from "@/src/entities/stock"
import { CompositeAlertHero, getPrimaryAlert, getAlertFeed } from "@/src/features/composite-alert"
import { getWatchedStocks } from "@/src/features/watchlist"
import { getForeignFlowSummary, getForeignFlowData } from "@/src/features/foreign-flow"
import { getArticlesFeed } from "@/src/features/sentiment"
import { getMarketSummary, getStockQuotes, StockQuote } from "@/src/features/market"
import { getSectorRanking, getSectorAlerts, SectorRotationAlertBanner } from "@/src/features/sectors"

export const metadata: Metadata = {
  title: "Dashboard Utama",
  description: "Terminal intelijen seluruh emiten IHSG dan deteksi anomali 3 pilar pasar modal Indonesia",
}

const BANK_TICKERS = [
  "BBCA",
  "BBRI",
  "BMRI",
  "BBNI",
  "BRIS",
  "BNGA",
  "BDMN",
  "BBTN",
  "BJBR",
  "BJTM",
]

const COMPANY_SENTIMENT_MAP: Record<string, number> = {
  BBCA: 0.58,
  BBRI: -0.36,
  BMRI: 0.45,
  BBNI: 0.22,
  BRIS: 0.35,
  BNGA: 0.18,
  BDMN: 0.05,
  BBTN: -0.28,
  BJBR: 0.12,
  BJTM: 0.10,
}

export default async function DashboardPage() {
  const [
    primaryAlert,
    stocks,
    feedItems,
    flowAnomalies,
    liveArticles,
    marketSummary,
    quotes,
    sectorRanking,
    sectorAlerts,
    flowDataList,
  ] = await Promise.all([
    getPrimaryAlert(),
    getWatchedStocks(),
    getAlertFeed(),
    getForeignFlowSummary(),
    getArticlesFeed("BBRI"),
    getMarketSummary(),
    getStockQuotes(),
    getSectorRanking(),
    getSectorAlerts(),
    Promise.all(BANK_TICKERS.map((t) => getForeignFlowData(t))),
  ])

  const quoteMap = new Map<string, StockQuote>()
  for (const q of quotes) {
    if (q && q.ticker) {
      quoteMap.set(q.ticker.toUpperCase(), q)
    }
  }

  const anomalyCount = flowAnomalies.filter((a) => Math.abs(a.z_score) >= 2.0).length || 1
  const topAnomaly = flowAnomalies.find((a) => Math.abs(a.z_score) >= 2.0)
  const anomalyHeadline = topAnomaly
    ? `${anomalyCount} Anomali Masif (${topAnomaly.ticker}: ${topAnomaly.z_score.toFixed(1)}σ)`
    : "Kondisi Aliran Normal"

  const bankFlowMap: Record<string, (typeof flowDataList)[number]> = {}
  BANK_TICKERS.forEach((ticker, idx) => {
    bankFlowMap[ticker] = flowDataList[idx]
  })

  const activityRows = BANK_TICKERS.map((ticker) => {
    const flowData = bankFlowMap[ticker]
    const anomaly = flowAnomalies.find((a) => a.ticker.toUpperCase() === ticker)

    const net1dVal = anomaly?.net_foreign_inflow !== undefined
      ? anomaly.net_foreign_inflow
      : flowData.yesterdayFlow

    const points5 = (flowData.flowPoints || []).slice(-5)
    const sum5d = points5.reduce((acc, p) => acc + (p.netFlow || 0), 0)

    const zScoreVal = anomaly?.z_score !== undefined
      ? anomaly.z_score
      : flowData.yesterdayZScore

    const dominantBrokerObj =
      anomaly?.broker_details && anomaly.broker_details.length > 0
        ? anomaly.broker_details[0]
        : flowData.anomalies14d?.[0]?.dominantBroker

    const dominantBroker = dominantBrokerObj
      ? ("kode_broker" in dominantBrokerObj
        ? `${dominantBrokerObj.kode_broker} (${dominantBrokerObj.nama_broker.split(" ")[0]})`
        : `${dominantBrokerObj.code} (${dominantBrokerObj.name.split(" ")[0]})`)
      : flowData.composition14d?.top3Brokers?.[0]
      ? flowData.composition14d.top3Brokers[0]
      : "- (Normal)"

    const isOutflowAnomaly = (anomaly && anomaly.status_anomali === "ANOMALI_OUTFLOW") || zScoreVal <= -2.0
    const isInflowAnomaly = (anomaly && anomaly.status_anomali === "ANOMALI_INFLOW") || zScoreVal >= 2.0

    const statusText = isOutflowAnomaly
      ? "Anomali Outflow"
      : isInflowAnomaly
      ? "Anomali Inflow"
      : zScoreVal > 0
      ? "Normal Buy"
      : "Netral"

    const formattedNet1d = Math.abs(net1dVal) >= 1e9
      ? `${net1dVal >= 0 ? "+" : "-"}Rp ${(Math.abs(net1dVal) / 1e9).toFixed(0)} M`
      : `${net1dVal >= 0 ? "+" : "-"}Rp ${(Math.abs(net1dVal) / 1e6).toFixed(0)} Jt`

    return {
      ticker,
      net1d: formattedNet1d,
      net5d: `${sum5d >= 0 ? "+" : "-"}Rp ${Math.abs(Math.round(sum5d))} M`,
      zScore: `${zScoreVal >= 0 ? "+" : ""}${zScoreVal.toFixed(1)}σ`,
      broker: dominantBroker,
      status: statusText,
      isAlert: isOutflowAnomaly,
      isPositive: net1dVal >= 0,
    }
  })

  const bankFlows = [bankFlowMap["BBCA"], bankFlowMap["BBRI"], bankFlowMap["BMRI"], bankFlowMap["BBNI"]].filter(Boolean)
  const allFlowDates = Array.from(
    new Set(bankFlows.flatMap((b) => (b.flowPoints || []).map((p) => p.date)))
  ).sort()
  const recent5Dates = allFlowDates.slice(-5)

  const fiveDayData = recent5Dates.length > 0
    ? recent5Dates.map((dateStr, idx) => {
        let buy = 0
        let sell = 0
        for (const b of bankFlows) {
          const pt = (b.flowPoints || []).find((p) => p.date === dateStr)
          if (pt) {
            if (pt.netFlow > 0) buy += pt.netFlow
            else if (pt.netFlow < 0) sell += Math.abs(pt.netFlow)
          }
        }
        const d = new Date(dateStr)
        const dayName = !isNaN(d.getTime())
          ? d.toLocaleDateString("id-ID", { weekday: "short" })
          : dateStr
        const isLatest = idx === recent5Dates.length - 1
        return {
          date: dateStr,
          label: isLatest ? "Hari Ini" : dayName,
          buy: Math.round(buy),
          sell: Math.round(sell),
          isLatest,
        }
      })
    : [
        { date: "1", label: "Senin", buy: 250, sell: 120, isLatest: false },
        { date: "2", label: "Selasa", buy: 310, sell: 180, isLatest: false },
        { date: "3", label: "Rabu", buy: 280, sell: 210, isLatest: false },
        { date: "4", label: "Kamis", buy: 190, sell: 260, isLatest: false },
        { date: "5", label: "Hari Ini", buy: 240, sell: 350, isLatest: true },
      ]

  const maxFlow = Math.max(1, ...fiveDayData.map((d) => Math.max(d.buy, d.sell)))

  const enrichedStocks = stocks.map((s) => {
    const alert = feedItems.find((f) => f.ticker === s.ticker)
    const quote = quoteMap.get(s.ticker.toUpperCase())
    const anomaly = flowAnomalies.find((a) => a.ticker.toUpperCase() === s.ticker.toUpperCase())
    const bankFlow = bankFlowMap[s.ticker.toUpperCase()]

    const isAlertTrigger = s.ticker === primaryAlert.ticker || alert?.status === "Perhatian Khusus" || anomaly?.status_anomali === "ANOMALI_OUTFLOW"

    const zScore = anomaly?.z_score !== undefined
      ? anomaly.z_score
      : bankFlow?.yesterdayZScore !== undefined
      ? bankFlow.yesterdayZScore
      : alert?.zScore ?? 0

    const isAnomalyOutflow = (anomaly && anomaly.status_anomali === "ANOMALI_OUTFLOW") || zScore <= -2.0
    const isAnomalyInflow = (anomaly && anomaly.status_anomali === "ANOMALI_INFLOW") || zScore >= 2.0

    const livePrice = quote?.price ?? s.price
    const livePriceChange = quote?.change_percent ?? quote?.change ?? s.priceChange
    const liveCoverage = quote?.coverage ?? quote?.analyst_coverage ?? quote?.analystCoverage ?? s.analystCoverage ?? 28

    let foreignFlowLabel = ""
    let foreignFlowStatus: "inflow" | "outflow" | "normal" = "normal"

    if (isAnomalyOutflow) {
      foreignFlowLabel = `Outflow (${zScore.toFixed(1)}σ)`
      foreignFlowStatus = "outflow"
    } else if (isAnomalyInflow) {
      foreignFlowLabel = `Inflow (+${zScore.toFixed(1)}σ)`
      foreignFlowStatus = "inflow"
    } else if (livePriceChange >= 0) {
      foreignFlowLabel = `Normal (+Rp ${(livePrice * 1500000 / 1e9).toFixed(0)}M)`
      foreignFlowStatus = "normal"
    } else {
      foreignFlowLabel = `Normal (-Rp ${(livePrice * 1200000 / 1e9).toFixed(0)}M)`
      foreignFlowStatus = "normal"
    }

    const sentimentScore =
      COMPANY_SENTIMENT_MAP[s.ticker.toUpperCase()] ?? (alert?.policyExposure ?? 0.15)

    const base = sentimentScore >= 0 ? 0.2 : -0.2
    const sentimentTrend = [
      Number((base * 0.5).toFixed(2)),
      Number((base * 0.7).toFixed(2)),
      Number((base * 0.8).toFixed(2)),
      Number((base * 0.9).toFixed(2)),
      sentimentScore,
    ]

    return {
      ...s,
      price: livePrice,
      priceChange: livePriceChange,
      analystCoverage: liveCoverage,
      isAlertTrigger,
      alertMessage: alert?.title,
      pillarMetrics: {
        nimScore: s.nimScore ?? 75,
        sentimentScore,
        sentimentTrend,
        foreignFlowLabel,
        foreignFlowStatus,
      },
    }
  })

  const benchmarkPercent =
    typeof marketSummary.ihsg_change_percent === "number"
      ? `${marketSummary.ihsg_change_percent >= 0 ? "+" : ""}${marketSummary.ihsg_change_percent.toFixed(2).replace(".", ",")}%`
      : String(marketSummary.ihsg_change_percent || "+0,42%")
  const isBenchmarkPositive = !benchmarkPercent.startsWith("-")
  const marketStatusLabel = marketSummary.market_status || marketSummary.market_status_text || "Pasar Tutup"
  const marketTimeLabel = marketSummary.market_time || marketSummary.wib_time || "17:00:00 WIB"
  const sectorLabel = sectorRanking[0]?.sector_name || marketSummary.leading_sector || "Perbankan Big 4"

  return (
    <div className="flex flex-col w-full pb-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md py-space-sm mb-space-md">
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="font-mono text-tabular-sm text-text-secondary tracking-widest uppercase">
              INTEL / IDX:COMPOSITE
            </span>
            <span className="text-border-subtle">/</span>
            <h1 className="font-headline-md text-headline-md text-text-primary tracking-tight font-semibold">
              Terminal Pasar Modal Indonesia (IHSG)
            </h1>
          </div>
          <Link
            href="/sectors"
            className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-card hover:bg-surface-container-high rounded border border-border-subtle transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
            <span className="font-body-sm text-body-sm text-text-primary font-medium">
              {sectorLabel}
            </span>
            <span className="material-symbols-outlined text-[14px] text-text-secondary">
              chevron_right
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-card rounded border border-border-subtle">
            <span className={`w-2 h-2 rounded-full ${marketStatusLabel.includes("Berjalan") || marketStatusLabel.includes("Buka") ? "bg-data-bullish animate-pulse" : "bg-data-neutral"}`} />
            <span className="font-caption text-caption text-text-secondary">{marketStatusLabel}</span>
            <span className="text-border-subtle">•</span>
            <span className="font-mono text-tabular-sm text-text-primary font-medium">
              {marketTimeLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-lowest px-space-sm py-space-xs rounded border border-border-subtle">
            <span className="font-caption text-caption text-text-secondary">Benchmark:</span>
            <span className={`font-mono text-tabular-sm ${isBenchmarkPositive ? "text-data-bullish" : "text-data-bearish"}`}>
              {benchmarkPercent}
            </span>
          </div>
        </div>
      </div>

      <CompositeAlertHero alert={primaryAlert} />

      {sectorAlerts.length > 0 && (
        <div className="mb-space-md">
          <SectorRotationAlertBanner alert={sectorAlerts[0]} />
        </div>
      )}

      <DashboardStockSection initialStocks={enrichedStocks} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-7 flex flex-col bg-surface-card p-space-lg rounded border border-border-subtle shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md pb-space-sm border-b border-border-subtle/60">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-brand-red">
                  radar
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Aktivitas Asing & Deteksi Anomali Broker
                </h3>
              </div>
              <span className="font-caption text-caption text-text-secondary mt-0.5">
                Analisis statistical deviation (z-score) terhadap volume rata-rata 20 hari
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-red/15 text-brand-red border border-brand-red/30">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="font-caption text-[11px] font-semibold">
                {anomalyHeadline}
              </span>
            </div>
          </div>

          <div className="p-space-md bg-surface-container-lowest rounded mb-space-md border border-border-subtle/40">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-caption text-[11px] text-text-secondary uppercase">
                Distribusi Net Flow Asing (5 Sesi Terakhir - KBMI 4)
              </span>
              <div className="flex items-center gap-space-md font-mono text-[11px]">
                <span className="flex items-center gap-1 text-data-bullish">
                  <span className="w-2 h-2 bg-data-bullish rounded-xs" /> Net Buy
                </span>
                <span className="flex items-center gap-1 text-data-bearish">
                  <span className="w-2 h-2 bg-data-bearish rounded-xs" /> Net Sell
                </span>
              </div>
            </div>

            <div className="w-full h-20 flex items-end justify-between pt-2 px-space-xs">
              {fiveDayData.map((day) => {
                const buyHeight = day.buy > 0 ? Math.min(100, Math.max(12, Math.round((day.buy / maxFlow) * 100))) : 0
                const sellHeight = day.sell > 0 ? Math.min(100, Math.max(12, Math.round((day.sell / maxFlow) * 100))) : 0
                return (
                  <div
                    key={day.date}
                    className={`flex flex-col items-center gap-1 flex-1 ${
                      day.isLatest
                        ? "bg-brand-red-soft/20 rounded py-0.5 border border-brand-red/30"
                        : ""
                    }`}
                  >
                    <div className="w-full flex items-end justify-center gap-1.5 h-12">
                      <div
                        className="w-3 bg-data-bullish rounded-t-xs transition-all"
                        style={{ height: `${buyHeight}%` }}
                        title={`Net Buy: Rp ${day.buy} M`}
                      />
                      <div
                        className={`w-3 bg-data-bearish rounded-t-xs transition-all ${
                          day.isLatest ? "animate-pulse" : ""
                        }`}
                        style={{ height: `${sellHeight}%` }}
                        title={`Net Sell: Rp ${day.sell} M`}
                      />
                    </div>
                    <span
                      className={`font-mono text-[10px] ${
                        day.isLatest ? "text-brand-red font-bold" : "text-text-secondary"
                      }`}
                    >
                      {day.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-body-sm text-[13px]">
              <thead>
                <tr className="bg-surface-container-lowest text-text-secondary font-caption text-caption h-8">
                  <th className="px-space-sm font-medium">EMITEN</th>
                  <th className="px-space-sm text-right font-medium">NET ASING (1D)</th>
                  <th className="px-space-sm text-right font-medium">NET ASING (5D)</th>
                  <th className="px-space-sm text-right font-medium">Z-SCORE</th>
                  <th className="px-space-sm font-medium">BROKER DOMINAN</th>
                  <th className="px-space-sm text-center font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50">
                {activityRows.map((row) => (
                  <tr
                    key={row.ticker}
                    className={`h-10 hover:bg-surface-container-high transition-colors ${
                      row.isAlert ? "bg-brand-red-soft/30 hover:bg-brand-red-soft/50" : ""
                    }`}
                  >
                    <td className={`px-space-sm font-label-ticker font-semibold ${row.isAlert ? "text-brand-red font-bold flex items-center gap-1 pt-2.5" : "text-text-primary"}`}>
                      <span>{row.ticker}</span>
                      {row.isAlert && <span className="material-symbols-outlined text-[14px]">warning</span>}
                    </td>
                    <td className={`px-space-sm text-right font-mono text-tabular-md font-bold ${row.isPositive ? "text-data-bullish" : "text-data-bearish"}`}>
                      {row.net1d}
                    </td>
                    <td className={`px-space-sm text-right font-mono text-tabular-md ${row.isPositive ? "text-data-bullish" : "text-data-bearish"}`}>
                      {row.net5d}
                    </td>
                    <td className={`px-space-sm text-right font-mono text-tabular-md font-bold ${row.isAlert ? "text-data-bearish" : "text-text-primary"}`}>
                      {row.zScore}
                    </td>
                    <td className="px-space-sm text-text-secondary">
                      <span className={`font-mono text-tabular-sm font-medium ${row.isAlert ? "text-data-bearish font-bold" : "text-text-primary"}`}>
                        {row.broker.split(" ")[0]}
                      </span>{" "}
                      {row.broker.includes(" ") ? row.broker.substring(row.broker.indexOf(" ") + 1) : ""}
                    </td>
                    <td className="px-space-sm text-center">
                      {row.status === "Anomali Outflow" ? (
                        <AnomalyBadge type="outflow" label="Anomali Outflow" size="sm" />
                      ) : row.status === "Anomali Inflow" ? (
                        <AnomalyBadge type="inflow" label="Anomali Inflow" size="sm" />
                      ) : (
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono tracking-tight text-[11px] font-medium ${
                            row.isAlert
                              ? "bg-data-bearish/20 text-data-bearish font-bold border border-data-bearish/30"
                              : row.isPositive
                              ? "bg-data-bullish/10 text-data-bullish"
                              : "bg-surface-container-high text-text-secondary"
                          }`}
                        >
                          {row.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-space-md pt-space-xs flex items-center justify-between text-text-secondary font-caption text-caption border-t border-border-subtle/40">
            <span>Ambang batas anomali diset otomatis pada |Z| &gt; 2.0σ</span>
            <Link
              href="/foreign-activity"
              className="text-text-primary hover:text-brand-red flex items-center gap-1 font-medium transition-colors"
            >
              <span>Buka Arus Asing & Matrix Broker</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="flex flex-col bg-surface-card p-space-lg rounded border border-border-subtle shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-brand-red">
                  autorenew
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Rotasi Sektor IDX Teratas (SMRS Engine)
                </h3>
              </div>
              <Link
                href="/sectors"
                className="text-brand-red hover:underline font-mono text-[11px] font-semibold flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </Link>
            </div>

            <div className="flex flex-col gap-space-xs divide-y divide-border-subtle/40">
              {sectorRanking.slice(0, 3).map((sec, idx) => {
                const isLeading = sec.status === "LEADING"
                const isImproving = sec.status === "IMPROVING"
                const statusBadgeClass = isLeading
                  ? "bg-data-bullish/15 text-data-bullish border border-data-bullish/30"
                  : isImproving
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  : "bg-surface-container-high text-text-secondary"
                return (
                  <div key={sec.sector_slug} className="flex items-center justify-between pt-space-xs first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-text-secondary w-4">
                        #{idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <Link
                          href={`/sectors/${sec.sector_slug}`}
                          className="font-body-sm text-[13px] text-text-primary font-medium hover:text-brand-red transition-colors"
                        >
                          {sec.sector_name.split("(")[0].trim()}
                        </Link>
                        <span className="font-mono text-[10px] text-text-secondary">
                          Net Flow: {sec.net_foreign_flow >= 0 ? "+" : "-"}Rp {(Math.abs(sec.net_foreign_flow) / 1e9).toFixed(0)} M
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${statusBadgeClass}`}>
                        {sec.status}
                      </span>
                      <span className="font-mono text-tabular-sm font-bold text-text-primary min-w-[36px] text-right">
                        {sec.smrs_score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col bg-surface-card p-space-lg rounded border border-border-subtle shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-data-neutral">
                  gavel
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Paparan Regulasi & BI Rate
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-data-neutral/15 text-data-neutral font-caption text-[11px] font-semibold border border-data-neutral/30">
                {primaryAlert.policyExposure <= -0.1 ? "Netral-Negatif" : primaryAlert.policyExposure >= 0.1 ? "Positif" : "Netral"}
              </span>
            </div>

            <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded mb-space-sm border border-border-subtle/50">
              <div className="flex flex-col">
                <span className="font-caption text-[11px] text-text-secondary uppercase">
                  Indeks Tekanan Makro
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-tabular-lg font-bold text-data-neutral">
                    {primaryAlert.policyExposure >= 0 ? "+" : ""}{primaryAlert.policyExposure.toFixed(2)}
                  </span>
                  <span className="font-caption text-caption text-data-neutral font-medium">
                    {primaryAlert.policyExposure <= -0.2 ? "Waspada Tinggi" : primaryAlert.policyExposure <= -0.1 ? "Waspada" : "Stabil"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-caption text-[11px] text-text-secondary uppercase">
                  Subsektor Terdampak
                </span>
                <span className="font-body-sm text-body-sm text-brand-red font-semibold mt-0.5">
                  Kredit Mikro & UMKM
                </span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
              {primaryAlert.summary || "Sinyal higher-for-longer dan kebijakan makroprudensial Bank Indonesia dipantau aktif terhadap margin bunga kredit dan stabilitas rasio simpanan perbankan."}
            </p>
          </div>

          <div className="flex flex-col flex-1 bg-surface-card p-space-lg rounded border border-border-subtle shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-brand-red">
                  feed
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Intelijen Berita Terkini
                </h3>
              </div>
              <span className="font-mono text-[11px] text-text-secondary">
                NLP Engine Real-Time
              </span>
            </div>

            <div className="flex flex-col gap-space-sm divide-y border-subtle/40">
              {liveArticles.slice(0, 3).map((art, idx) => {
                const isBullish = art.sentimentScore >= 0.2
                const isBearish = art.sentimentScore <= -0.2
                const tag = isBullish ? "BULLISH" : isBearish ? "BEARISH" : "NETRAL"
                const tagColor = isBullish
                  ? "bg-data-bullish/15 text-data-bullish"
                  : isBearish
                  ? "bg-data-bearish/15 text-data-bearish"
                  : "bg-surface-container-high text-text-secondary"
                const tickerCode = art.affectedEntities || "BBRI"
                return (
                  <div key={art.id || idx} className="flex flex-col gap-1 pt-space-xs first:pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.2 rounded font-caption text-[10px] font-bold ${tagColor}`}>
                          {tag}
                        </span>
                        <span className="font-label-ticker text-[11px] font-bold text-text-primary">
                          {tickerCode}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-text-secondary">
                        {art.timeDecayLabel || art.source}
                      </span>
                    </div>
                    <Link
                      href={`/articles/${tickerCode}`}
                      className="font-body-sm text-[13px] text-text-primary font-medium hover:text-brand-red transition-colors line-clamp-2"
                    >
                      {art.title}
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className="mt-space-md pt-space-sm border-t border-border-subtle/50">
              <Link
                href="/signals"
                className="text-brand-red hover:underline text-body-sm font-semibold flex items-center justify-center gap-1"
              >
                <span>Buka Seluruh Feed Berita ({feedItems.length} Sinyal)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
