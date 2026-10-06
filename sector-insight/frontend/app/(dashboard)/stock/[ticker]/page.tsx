import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FundamentalScoreCard, getFundamentalScore } from "@/src/features/fundamental"
import { SentimentCard, PolicyExposureCard, getSentimentData } from "@/src/features/sentiment"
import { ForeignFlowChart, getForeignFlowData } from "@/src/features/foreign-flow"
import { getCompositeAlertByTicker } from "@/src/features/composite-alert"
import { StatusBadge } from "@/src/shared/ui/StatusBadge"
import { isValidTicker } from "@/src/shared/lib"
import { getBeginnerBrief, getGlossary, StockModeView } from "@/src/features/beginner-brief"
import {
  getCrowdSentiment,
  getCommunityPosts,
  CrowdBarometerCard,
  CommunityFeed,
  DivergenceAlertBanner,
} from "@/src/features/community"

interface Props {
  params: Promise<{ ticker: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params
  if (!isValidTicker(ticker)) {
    return {
      title: "Saham Tidak Ditemukan",
      description: "Kode ticker yang diminta tidak valid.",
    }
  }
  const upperTicker = ticker.toUpperCase()
  return {
    title: `Detail Saham ${upperTicker}`,
    description: `Sintesis analisis 3 pilar data fundamental, sentimen berita, dan anomali broker ${upperTicker}`,
  }
}

interface StockProfile {
  name: string
  kbmi: string
  subsector: string
  marketCap: string
  rank: string
  lastPrice: string
  priceChange: string
  priceChangePercent: string
  isBullish: boolean
  volume: string
  peRatio: string
  peComparison: string
  pbvRatio: string
  pbvComparison: string
  divYield: string
  divPayout: string
  targetPrice: string
  targetUpside: string
  analystConsensus: string
  analystRating: string
  beta: string
  betaNote: string
}

const STOCK_PROFILES: Record<string, StockProfile> = {
  BBRI: {
    name: "PT Bank Rakyat Indonesia (Persero) Tbk",
    kbmi: "KBMI 4",
    subsector: "Bank BUMN / Mikro",
    marketCap: "Rp 795,65 T",
    rank: "#2 IDX",
    lastPrice: "Rp 5.250",
    priceChange: "-125",
    priceChangePercent: "-2,33%",
    isBullish: false,
    volume: "142,88 M Lbr • Rp 753,2 M",
    peRatio: "11,42x",
    peComparison: "Vs 5Y Avg: 14.2x (-19%)",
    pbvRatio: "2,38x",
    pbvComparison: "Sektor KBMI 4: 2.12x",
    divYield: "6,45%",
    divPayout: "Payout: 80% Laba Bersih",
    targetPrice: "Rp 6.150",
    targetUpside: "+17.1% Potensi Upside",
    analystConsensus: "28 Buy / 4 Hold",
    analystRating: "84.8% Akumulasi",
    beta: "1,12",
    betaNote: "Volatilitas Moderat",
  },
  BBCA: {
    name: "PT Bank Central Asia Tbk",
    kbmi: "KBMI 4",
    subsector: "Bank Swasta / Transaksional",
    marketCap: "Rp 1.285,40 T",
    rank: "#1 IDX",
    lastPrice: "Rp 10.450",
    priceChange: "+150",
    priceChangePercent: "+1,46%",
    isBullish: true,
    volume: "88,40 M Lbr • Rp 924,1 M",
    peRatio: "22,80x",
    peComparison: "Premium Kualitas Aset Prima",
    pbvRatio: "4,65x",
    pbvComparison: "Highest In Class ROE 22%",
    divYield: "2,85%",
    divPayout: "Payout: 62% Pertumbuhan Konsisten",
    targetPrice: "Rp 11.800",
    targetUpside: "+12.9% Potensi Upside",
    analystConsensus: "31 Buy / 2 Hold",
    analystRating: "93.9% Strong Buy",
    beta: "0,88",
    betaNote: "Defensif / Rendah Risiko",
  },
  BMRI: {
    name: "PT Bank Mandiri (Persero) Tbk",
    kbmi: "KBMI 4",
    subsector: "Bank BUMN / Wholesale & Korporasi",
    marketCap: "Rp 672,10 T",
    rank: "#3 IDX",
    lastPrice: "Rp 7.200",
    priceChange: "+75",
    priceChangePercent: "+1,05%",
    isBullish: true,
    volume: "95,60 M Lbr • Rp 688,5 M",
    peRatio: "11,85x",
    peComparison: "Vs 5Y Avg: 12.4x (-4.4%)",
    pbvRatio: "2,15x",
    pbvComparison: "Sektor KBMI 4: 2.12x",
    divYield: "5,20%",
    divPayout: "Payout: 60% Laba Bersih",
    targetPrice: "Rp 8.100",
    targetUpside: "+12.5% Potensi Upside",
    analystConsensus: "29 Buy / 3 Hold",
    analystRating: "90.6% Akumulasi",
    beta: "1,05",
    betaNote: "Mengikuti IHSG",
  },
  BBNI: {
    name: "PT Bank Negara Indonesia Tbk",
    kbmi: "KBMI 4",
    subsector: "Bank BUMN / Internasional & Konsumer",
    marketCap: "Rp 210,50 T",
    rank: "#4 IDX Bank",
    lastPrice: "Rp 5.650",
    priceChange: "+25",
    priceChangePercent: "+0,44%",
    isBullish: true,
    volume: "42,10 M Lbr • Rp 237,8 M",
    peRatio: "9,60x",
    peComparison: "Terdiskon Relatif Terhadap Sektor",
    pbvRatio: "1,18x",
    pbvComparison: "Diskon 44% vs KBMI 4 Avg",
    divYield: "5,80%",
    divPayout: "Payout: 50% Laba Bersih",
    targetPrice: "Rp 6.600",
    targetUpside: "+16.8% Potensi Upside",
    analystConsensus: "24 Buy / 6 Hold",
    analystRating: "80.0% Akumulasi",
    beta: "1,18",
    betaNote: "Volatilitas Beta Lebih Tinggi",
  },
  BRIS: {
    name: "PT Bank Syariah Indonesia Tbk",
    kbmi: "KBMI 3",
    subsector: "Bank Syariah Terbesar",
    marketCap: "Rp 126,80 T",
    rank: "#5 IDX Bank",
    lastPrice: "Rp 2.740",
    priceChange: "-20",
    priceChangePercent: "-0,72%",
    isBullish: false,
    volume: "38,50 M Lbr • Rp 105,4 M",
    peRatio: "18,40x",
    peComparison: "Valuasi Pertumbuhan Syariah",
    pbvRatio: "2,65x",
    pbvComparison: "ROE Syariah 17.4%",
    divYield: "2,10%",
    divPayout: "Payout: 25% Laba Ditahan Ekspansi",
    targetPrice: "Rp 3.200",
    targetUpside: "+16.8% Potensi Upside",
    analystConsensus: "18 Buy / 5 Hold",
    analystRating: "78.2% Akumulasi",
    beta: "1,24",
    betaNote: "Sensitif Likuiditas Ritel",
  },
  BBTN: {
    name: "PT Bank Tabungan Negara (Persero) Tbk",
    kbmi: "KBMI 3",
    subsector: "Bank KPR Spesialis",
    marketCap: "Rp 18,90 T",
    rank: "#6 IDX Bank",
    lastPrice: "Rp 1.340",
    priceChange: "-30",
    priceChangePercent: "-2,19%",
    isBullish: false,
    volume: "24,80 M Lbr • Rp 33,2 M",
    peRatio: "6,20x",
    peComparison: "Terdiskon Sangat Dalam",
    pbvRatio: "0,58x",
    pbvComparison: "Diskon 72% dari Nilai Buku",
    divYield: "4,90%",
    divPayout: "Payout: 30% Laba Bersih",
    targetPrice: "Rp 1.650",
    targetUpside: "+23.1% Potensi Rebound",
    analystConsensus: "12 Buy / 8 Hold / 2 Sell",
    analystRating: "54.5% Netral-Akumulasi",
    beta: "1,35",
    betaNote: "Tinggi Sensitivitas BI Rate",
  },
}

function getStockProfile(ticker: string, defaultName: string): StockProfile {
  return (
    STOCK_PROFILES[ticker] || {
      name: defaultName || `PT Bank ${ticker} Tbk`,
      kbmi: "KBMI 3",
      subsector: "Perbankan Nasional",
      marketCap: "Rp 150,00 T",
      rank: "IDX Finansial",
      lastPrice: "Rp 3.500",
      priceChange: "0",
      priceChangePercent: "0,00%",
      isBullish: true,
      volume: "50,00 M Lbr • Rp 175,0 M",
      peRatio: "12,00x",
      peComparison: "Rata-rata Industri Perbankan",
      pbvRatio: "1,80x",
      pbvComparison: "Valuasi Wajar Sektor",
      divYield: "4,50%",
      divPayout: "Payout: 50% Laba Bersih",
      targetPrice: "Rp 4.000",
      targetUpside: "+14.3% Potensi Upside",
      analystConsensus: "15 Buy / 5 Hold",
      analystRating: "75.0% Akumulasi",
      beta: "1,00",
      betaNote: "Volatilitas Normal",
    }
  )
}

export default async function StockDetailPage({ params }: Props) {
  const { ticker } = await params
  if (!isValidTicker(ticker)) {
    notFound()
  }
  const upperTicker = ticker.toUpperCase()

  const [
    fundamentalData,
    sentimentData,
    foreignFlowData,
    compositeAlert,
    beginnerBrief,
    glossary,
    crowdSentiment,
    communityPosts,
  ] = await Promise.all([
    getFundamentalScore(upperTicker),
    getSentimentData(upperTicker),
    getForeignFlowData(upperTicker),
    getCompositeAlertByTicker(upperTicker),
    getBeginnerBrief(upperTicker),
    getGlossary(),
    getCrowdSentiment(upperTicker),
    getCommunityPosts(upperTicker),
  ])

  const profile = getStockProfile(upperTicker, fundamentalData.bankName)

  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div className="flex items-start gap-space-md">
          <div className="w-12 h-12 rounded bg-surface-container-high border border-border-subtle flex items-center justify-center font-mono font-bold text-text-primary text-[18px]">
            {upperTicker.slice(0, 2)}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-space-xs">
              <h1 className="font-label-ticker text-2xl font-bold text-text-primary tracking-wide">
                {upperTicker}
              </h1>
              <span className="font-body-sm text-body-sm text-text-secondary">
                {profile.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1.5 font-caption text-caption text-text-secondary">
              <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-text-primary font-medium">
                {profile.kbmi}
              </span>
              <span>{profile.subsector}</span>
              <span>•</span>
              <span>Kapitalisasi Pasar: <strong className="text-text-primary font-mono">{profile.marketCap}</strong> ({profile.rank})</span>
            </div>

            <div className="mt-2">
              <StatusBadge status={fundamentalData.status} size="sm" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1">
          <div className="flex items-baseline gap-2">
            <span className="font-caption text-caption text-text-secondary uppercase">
              Harga Terakhir
            </span>
            <span className="font-mono text-headline-metric font-bold text-text-primary">
              {profile.lastPrice}
            </span>
            <span
              className={`font-mono text-tabular-md font-bold ${
                profile.isBullish ? "text-data-bullish" : "text-data-bearish"
              }`}
            >
              {profile.priceChange} ({profile.priceChangePercent})
            </span>
          </div>

          <div className="font-mono text-[12px] text-text-secondary">
            Volume: {profile.volume}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Link
              href={`/articles/${upperTicker}`}
              className="px-3 py-1.5 min-h-[36px] bg-surface-card hover:bg-surface-container-high rounded text-caption font-medium text-text-primary border border-border-subtle transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">feed</span>
              <span>Audit Berita</span>
            </Link>
            <Link
              href={`/foreign-activity/${upperTicker}`}
              className="px-3 py-1.5 min-h-[36px] bg-surface-card hover:bg-surface-container-high rounded text-caption font-medium text-text-primary border border-border-subtle transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>Arus Asing</span>
            </Link>
          </div>
        </div>
      </div>

      <StockModeView ticker={upperTicker} brief={beginnerBrief} glossary={glossary}>
        {crowdSentiment.divergence_status !== "NORMAL" && (
          <DivergenceAlertBanner
            alert={{
              ticker: upperTicker,
              alert_type: crowdSentiment.divergence_status,
              severity: crowdSentiment.divergence_status === "EUPHORIA_DIVERGENCE" ? "CRITICAL" : "OPPORTUNITY",
              headline:
                crowdSentiment.divergence_status === "EUPHORIA_DIVERGENCE"
                  ? `${upperTicker} ⚠️ PERINGATAN DIVERGENSI: Euforia Komunitas Ritel vs Tekanan Distribusi Asing`
                  : `${upperTicker} 💡 PERINGATAN CAPITULATION: Kepanikan Ritel di Tengah Akumulasi Institusional Asing`,
              crowd_summary: `Konsensus Komunitas: ${crowdSentiment.bullish_percent.toFixed(0)}% Bullish (Skor Sentimen: ${crowdSentiment.sentiment_score > 0 ? "+" : ""}${crowdSentiment.sentiment_score.toFixed(2)}, Buzz: ${crowdSentiment.discussion_velocity_zscore}x)`,
              foreign_summary: `Kondisi Arus Asing: ${foreignFlowData.yesterdayAnomalyStatus} (${foreignFlowData.yesterdayFlow < 0 ? "-" : "+"}Rp ${(Math.abs(foreignFlowData.yesterdayFlow) / 1000000000).toFixed(1)} Miliar, Z-Score: ${foreignFlowData.yesterdayZScore}σ)`,
              synthesis:
                crowdSentiment.divergence_status === "EUPHORIA_DIVERGENCE"
                  ? "Mayoritas investor ritel menyerap tekanan jual broker institusional. Waspadai potensi jebakan likuiditas ritel (exit liquidity) di area support."
                  : "Sentimen ritel tertekan kepanikan jangka pendek, namun broker institusi memanfaatkan koreksi harga untuk akumulasi selektif. Fundamental emiten tetap solid.",
              created_at: new Date().toISOString(),
            }}
          />
        )}

        <div className="w-full bg-brand-red-soft p-space-lg rounded border border-brand-red/50 flex flex-col md:flex-row md:items-center justify-between gap-space-md relative overflow-hidden mb-space-xl">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-brand-red/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-space-md z-10">
          <div className="w-10 h-10 rounded bg-brand-red/20 flex items-center justify-center shrink-0 mt-0.5 text-brand-red">
            <span className="material-symbols-outlined text-[22px]">psychology</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-caption text-caption font-bold tracking-widest text-brand-red uppercase">
                Sintesis 4 Pilar Composite Intelligence System ({upperTicker})
              </span>
              <span className="px-1.5 py-0.2 bg-brand-red/30 rounded text-[10px] font-mono text-text-primary">
                STATUS: {compositeAlert.status}
              </span>
            </div>
            <p className="font-headline-sm text-headline-sm text-text-primary font-bold mt-1 leading-snug">
              {compositeAlert.headline || foreignFlowData.synthesisSentence}
            </p>
            {compositeAlert.summary && (
              <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                {compositeAlert.summary}
              </p>
            )}
            {compositeAlert.recommendedAction && (
              <div className="flex items-center gap-2 mt-2 font-body-sm text-text-primary">
                <span className="material-symbols-outlined text-[16px] text-brand-red">lightbulb</span>
                <span className="italic text-xs text-text-secondary">Aksi Rekomendasi: <strong className="text-text-primary not-italic">{compositeAlert.recommendedAction}</strong></span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest/80 rounded border border-border-subtle/40 text-text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-data-bullish" />
                <span>Fundamental: <strong className="text-data-bullish">{fundamentalData.score}/100</strong> ({fundamentalData.status})</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest/80 rounded border border-border-subtle/40 text-text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-data-neutral" />
                <span>Policy Exposure: <strong className="text-data-neutral">{sentimentData.policyExposureScore > 0 ? "+" : ""}{sentimentData.policyExposureScore}</strong> ({sentimentData.policyExposureLabel})</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest/80 rounded border border-border-subtle/40 text-text-primary">
                <span className={`w-1.5 h-1.5 rounded-full ${Math.abs(foreignFlowData.yesterdayZScore) >= 2.0 ? "bg-data-bearish" : "bg-data-bullish"}`} />
                <span>Broker Asing: <strong className={Math.abs(foreignFlowData.yesterdayZScore) >= 2.0 ? "text-data-bearish" : "text-data-bullish"}>{foreignFlowData.yesterdayAnomalyStatus}</strong></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        <div className="lg:col-span-4">
          <FundamentalScoreCard data={fundamentalData} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="bg-surface-card p-space-lg rounded border border-border-subtle flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="w-1.5 h-4 bg-data-neutral rounded-full" />
                  <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                    2. Sentimen & Kebijakan
                  </h2>
                </div>
                <span className="font-caption text-caption text-text-secondary uppercase">
                  NLP Macro Stream
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md">
                <SentimentCard
                  score={sentimentData.companySentimentScore}
                  label={sentimentData.companySentimentLabel}
                  sampleCount={sentimentData.companyArticlesCount}
                />
                <PolicyExposureCard
                  score={sentimentData.policyExposureScore}
                  label={sentimentData.policyExposureLabel}
                  dominantIssue={sentimentData.dominantIssue}
                />
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle/40">
                <span className="font-caption text-caption text-text-secondary uppercase">
                  Artikel Kunci Terakhir
                </span>
                {sentimentData.articles.slice(0, 2).map((art) => (
                  <div
                    key={art.id}
                    className="p-2 bg-surface-container-lowest rounded border border-border-subtle/40 text-[12px]"
                  >
                    <span className="font-medium text-text-primary line-clamp-1">
                      {art.title}
                    </span>
                    <span className="text-text-secondary text-[11px]">
                      {art.source} • {art.publishedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-space-md pt-space-sm border-t border-border-subtle/50 flex justify-end">
              <Link
                href={`/articles/${upperTicker}`}
                className="font-body-sm text-body-sm text-brand-red font-semibold hover:underline flex items-center gap-0.5 min-h-[36px]"
              >
                <span>Lihat Semua {sentimentData.articles.length} Artikel Pendukung</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="bg-surface-card p-space-lg rounded border border-border-subtle flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="w-1.5 h-4 bg-data-bearish rounded-full" />
                  <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                    3. Aktivitas Broker Asing
                  </h2>
                </div>
                <span className="font-caption text-caption text-text-secondary uppercase">
                  IDX Bandarmology
                </span>
              </div>

              <div
                className={`p-space-md border rounded mb-space-md ${
                  Math.abs(foreignFlowData.yesterdayZScore) >= 2.0
                    ? "bg-brand-red-soft/30 border-brand-red/40"
                    : "bg-surface-container-lowest border-border-subtle/40"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 font-semibold text-caption mb-1 ${
                    Math.abs(foreignFlowData.yesterdayZScore) >= 2.0
                      ? "text-data-bearish"
                      : "text-data-bullish"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {Math.abs(foreignFlowData.yesterdayZScore) >= 2.0 ? "warning" : "check_circle"}
                  </span>
                  <span>
                    {Math.abs(foreignFlowData.yesterdayZScore) >= 2.0
                      ? "ANOMALI TERDETEKSI (KEMARIN)"
                      : "POLA ARUS NORMAL (KEMARIN)"}
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-text-primary leading-relaxed">
                  Net Flow Asing{" "}
                  <strong>
                    {foreignFlowData.yesterdayFlow < 0 ? "-" : "+"}Rp{" "}
                    {(Math.abs(foreignFlowData.yesterdayFlow) / 1000000000).toFixed(1)} Miliar
                  </strong>{" "}
                  — deviasi Z-Score{" "}
                  <strong
                    className={
                      Math.abs(foreignFlowData.yesterdayZScore) >= 2.0
                        ? "text-data-bearish"
                        : "text-data-bullish"
                    }
                  >
                    {foreignFlowData.yesterdayZScore > 0 ? "+" : ""}
                    {foreignFlowData.yesterdayZScore}σ
                  </strong>{" "}
                  ({foreignFlowData.yesterdayAnomalyStatus}).
                </p>
              </div>

              <ForeignFlowChart data={foreignFlowData.flowPoints.slice(-8)} className="w-full h-44 mb-space-md" />

              <div className="flex flex-col gap-1.5 text-[12px]">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Broker Dominan (Window 14H):</span>
                  <span>Net Value</span>
                </div>
                {foreignFlowData.anomalies14d.length > 0 ? (
                  foreignFlowData.anomalies14d.slice(0, 3).map((anom) => (
                    <div
                      key={anom.id}
                      className="flex justify-between items-center font-mono p-1 bg-surface-container-lowest rounded"
                    >
                      <span className="font-bold text-text-primary">
                        {anom.dominantBroker.code} - {anom.dominantBroker.name}
                      </span>
                      <span
                        className={
                          anom.action === "Net Sell"
                            ? "text-data-bearish"
                            : "text-data-bullish"
                        }
                      >
                        {anom.netFlowFormatted}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center text-text-secondary font-body-sm text-[11px] bg-surface-container-lowest rounded">
                    Tidak ada anomali transaksi ekstrem dalam 14 hari
                  </div>
                )}
              </div>
            </div>

            <div className="mt-space-md pt-space-sm border-t border-border-subtle/50 flex justify-end">
              <Link
                href={`/foreign-activity/${upperTicker}`}
                className="font-body-sm text-body-sm text-brand-red font-semibold hover:underline flex items-center gap-0.5 min-h-[36px]"
              >
                <span>Buka Grafik Lengkap 90 Hari</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-space-lg">
        <CrowdBarometerCard sentiment={crowdSentiment} />
        <div className="bg-surface-card p-space-lg rounded-xl border border-border-subtle shadow-sm">
          <div className="flex items-center gap-2 mb-space-md pb-space-sm border-b border-border-subtle">
            <span className="material-symbols-outlined text-brand-red text-[22px]">forum</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              Diskusi Komunitas & Analisis Independen ({upperTicker})
            </h3>
          </div>
          <CommunityFeed initialPosts={communityPosts} ticker={upperTicker} />
        </div>
      </div>

      <div className="p-space-lg bg-surface-card rounded border border-border-subtle">
        <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-space-md">
          Valuasi Pasar & Target Konsensus Analis
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-md">
          <div className="flex flex-col p-space-sm bg-surface-container-lowest rounded border border-border-subtle/40">
            <span className="font-caption text-[11px] text-text-secondary uppercase">P/E Ratio (TTM)</span>
            <span className="font-mono text-tabular-lg font-bold text-text-primary mt-1">{profile.peRatio}</span>
            <span className="font-caption text-[10px] text-data-bullish mt-0.5">{profile.peComparison}</span>
          </div>

          <div className="flex flex-col p-space-sm bg-surface-container-lowest rounded border border-border-subtle/40">
            <span className="font-caption text-[11px] text-text-secondary uppercase">Price to Book (PBV)</span>
            <span className="font-mono text-tabular-lg font-bold text-text-primary mt-1">{profile.pbvRatio}</span>
            <span className="font-caption text-[10px] text-text-secondary mt-0.5">{profile.pbvComparison}</span>
          </div>

          <div className="flex flex-col p-space-sm bg-surface-container-lowest rounded border border-border-subtle/40">
            <span className="font-caption text-[11px] text-text-secondary uppercase">Dividend Yield (Est)</span>
            <span className="font-mono text-tabular-lg font-bold text-data-bullish mt-1">{profile.divYield}</span>
            <span className="font-caption text-[10px] text-text-secondary mt-0.5">{profile.divPayout}</span>
          </div>

          <div className="flex flex-col p-space-sm bg-surface-container-lowest rounded border border-border-subtle/40">
            <span className="font-caption text-[11px] text-text-secondary uppercase">Konsensus Target</span>
            <span className="font-mono text-tabular-lg font-bold text-text-primary mt-1">{profile.targetPrice}</span>
            <span className="font-caption text-[10px] text-data-bullish mt-0.5">{profile.targetUpside}</span>
          </div>

          <div className="flex flex-col p-space-sm bg-surface-container-lowest rounded border border-border-subtle/40">
            <span className="font-caption text-[11px] text-text-secondary uppercase">Rekomendasi Analis</span>
            <span className="font-mono text-tabular-lg font-bold text-text-primary mt-1">{profile.analystConsensus}</span>
            <span className="font-caption text-[10px] text-data-bullish mt-0.5">{profile.analystRating}</span>
          </div>

          <div className="flex flex-col p-space-sm bg-surface-container-lowest rounded border border-border-subtle/40">
            <span className="font-caption text-[11px] text-text-secondary uppercase">Beta (1-Year)</span>
            <span className="font-mono text-tabular-lg font-bold text-text-primary mt-1">{profile.beta}</span>
            <span className="font-caption text-[10px] text-text-secondary mt-0.5">{profile.betaNote}</span>
          </div>
        </div>
      </div>
      </StockModeView>
    </div>
  )
}

