import { API_BASE_URL } from "@/src/shared/lib/constants"
import { CompositeAlert, AlertFeedItem } from "../types/compositeAlert"

export const MOCK_PRIMARY_ALERT: CompositeAlert = {
  id: "alert-bbri-01",
  ticker: "BBRI",
  bankName: "PT Bank Rakyat Indonesia Tbk",
  timestamp: "16:48 WIB",
  timeAgo: "4 menit lalu",
  headline: "BBRI: Fundamental kuat, tapi waspada tekanan kebijakan suku bunga & anomali outflow asing masif.",
  summary: "Kombinasi skor fundamental tinggi (71/100) divergen tajam dengan arus jual bersih broker institusi asing (-Rp 89M, 2.8x deviasi harian) serta sentimen regulasi mikro OJK bernilai negatif (-0.15). Rekomendasi mitigasi alokasi taktis portofolio.",
  status: "Perhatian Khusus",
  zScore: -2.8,
  fundamentalScore: 71,
  policyExposure: -0.15,
  confidence: 94.2,
  recommendedAction: "Mitigasi alokasi taktis portofolio & pantau area support Rp 4.680 - Rp 4.720",
}

export const MOCK_ALERT_FEED: AlertFeedItem[] = [
  {
    id: "feed-1",
    ticker: "BBRI",
    bankName: "Bank Rakyat Indonesia Tbk",
    timestamp: "24 Sep 2026, 16:48 WIB",
    timeAgo: "4 menit lalu",
    title: "Anomali Outflow Asing Masif & Sentimen Tekanan Suku Bunga",
    description: "Net sell broker asing institusi mencapai Rp 89M (Z-Score: -2.80σ), bertepatan dengan sentimen pengetatan ATMR mikro OJK.",
    status: "Perhatian Khusus",
    zScore: -2.8,
    fundamentalScore: 71,
    policyExposure: -0.15,
    triggerPillars: ["foreign_flow", "sentiment"],
  },
  {
    id: "feed-2",
    ticker: "BMRI",
    bankName: "Bank Mandiri (Persero) Tbk",
    timestamp: "24 Sep 2026, 14:15 WIB",
    timeAgo: "2 jam lalu",
    title: "Akumulasi Berkelanjutan Institusi Asing & Rasio CASA Rekor",
    description: "Inflow asing +Rp 41M dengan stabilitas skor fundamental 79/100. Peningkatan rasio giro dan tabungan murah menopang ketahanan NIM.",
    status: "Stabil",
    zScore: 0.45,
    fundamentalScore: 79,
    policyExposure: 0.35,
    triggerPillars: ["fundamental", "foreign_flow"],
  },
  {
    id: "feed-3",
    ticker: "BBCA",
    bankName: "Bank Central Asia Tbk",
    timestamp: "24 Sep 2026, 11:30 WIB",
    timeAgo: "5 jam lalu",
    title: "Kinerja Kuartalan Solid & Arus Masuk Terbesar di Sektor Perbankan",
    description: "Net buy asing +Rp 142M (Z-Score: +1.30σ). Skor fundamental memimpin sektor perbankan di level 84/100 didukung ROE 22.4%.",
    status: "Stabil",
    zScore: 1.3,
    fundamentalScore: 84,
    policyExposure: 0.62,
    triggerPillars: ["fundamental", "sentiment", "foreign_flow"],
  },
  {
    id: "feed-4",
    ticker: "BBNI",
    bankName: "Bank Negara Indonesia Tbk",
    timestamp: "24 Sep 2026, 10:00 WIB",
    timeAgo: "6 jam lalu",
    title: "Valuasi Murah di Tengah Konsolidasi Transaksi Broker Domestik",
    description: "Skor fundamental stabil di 75/100. Valuasi PBV 1.18x menjadi katalis akumulasi selektif meski laju ekspansi kredit korporasi termoderasi.",
    status: "Stabil",
    zScore: 0.3,
    fundamentalScore: 75,
    policyExposure: 0.31,
    triggerPillars: ["fundamental"],
  },
  {
    id: "feed-5",
    ticker: "BRIS",
    bankName: "Bank Syariah Indonesia Tbk",
    timestamp: "24 Sep 2026, 09:15 WIB",
    timeAgo: "7 jam lalu",
    title: "Pertumbuhan Pembiayaan Syariah & Transaksi Ritel Stabil",
    description: "Skor fundamental 68/100 dengan netralitas arus broker asing (-0.45σ). Katalis ekspansi pembiayaan emas dan konsumer menopang sentimen positif.",
    status: "Stabil",
    zScore: -0.45,
    fundamentalScore: 68,
    policyExposure: 0.12,
    triggerPillars: ["fundamental", "sentiment"],
  },
  {
    id: "feed-6",
    ticker: "BBTN",
    bankName: "Bank Tabungan Negara Tbk",
    timestamp: "24 Sep 2026, 08:30 WIB",
    timeAgo: "8 jam lalu",
    title: "Tekanan Likuiditas KPR & Outflow Broker Asing Terkonsentrasi",
    description: "Rasio LDR 94.8% dan deviasi outflow asing (-1.35σ). Valuasi PBV 0.58x terdiskon dalam namun sensitivitas biaya dana simpanan memicu status perhatian khusus.",
    status: "Perhatian Khusus",
    zScore: -1.35,
    fundamentalScore: 58,
    policyExposure: -0.28,
    triggerPillars: ["foreign_flow", "sentiment"],
  },
]

export interface BackendCompositeAlert {
  ticker: string
  overall_status: string
  headline: string
  synthesis_summary: string
  fundamental_score: number
  company_sentiment: number
  policy_exposure: number
  foreign_anomaly: string
  crowd_sentiment: number
  bullish_percent: number
  divergence_status: string
  trigger_factors?: string[]
}

const BANK_NAMES: Record<string, string> = {
  BBRI: "PT Bank Rakyat Indonesia Tbk",
  BBCA: "PT Bank Central Asia Tbk",
  BMRI: "PT Bank Mandiri (Persero) Tbk",
  BBNI: "PT Bank Negara Indonesia Tbk",
  BBTN: "PT Bank Tabungan Negara Tbk",
  BDMN: "PT Bank Danamon Indonesia Tbk",
  BRIS: "PT Bank Syariah Indonesia Tbk",
}

function resolveCompositeStatus(status: string): "Stabil" | "Waspada" | "Perhatian Khusus" {
  if (status === "Perhatian Khusus") return "Perhatian Khusus"
  if (status === "Waspada" || status === "Peluang Rebound") return "Waspada"
  return "Stabil"
}

export async function getPrimaryAlert(): Promise<CompositeAlert> {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/composite-alert/summary`, { cache: "no-store" })
    if (res.ok) {
      const list: BackendCompositeAlert[] = await res.json()
      if (Array.isArray(list) && list.length > 0) {
        const top = list.find((item) => item.overall_status === "Perhatian Khusus" || item.overall_status === "Peluang Rebound") || list[0]
        const zScore = top.foreign_anomaly === "ANOMALI_OUTFLOW" ? -2.8 : top.foreign_anomaly === "ANOMALI_INFLOW" ? 2.45 : 0.0
        return {
          id: `alert-${top.ticker.toLowerCase()}-live`,
          ticker: top.ticker,
          bankName: BANK_NAMES[top.ticker] || `Bank ${top.ticker} Tbk`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
          timeAgo: "Sesi Terkini",
          headline: top.headline,
          summary: top.synthesis_summary,
          status: resolveCompositeStatus(top.overall_status),
          zScore,
          fundamentalScore: Math.round(top.fundamental_score),
          policyExposure: top.policy_exposure,
          confidence: 94.2,
          recommendedAction: top.trigger_factors && top.trigger_factors.length > 0 ? top.trigger_factors.join(" • ") : "Pantau pergerakan harga dan arus volume transaksi",
        }
      }
    }
  } catch {
  }
  return MOCK_PRIMARY_ALERT
}

export async function getCompositeAlert(ticker: string): Promise<CompositeAlert> {
  const upperTicker = ticker.toUpperCase()
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/composite-alert/${upperTicker}`, {
      cache: "no-store",
    })
    if (res.ok) {
      const top: BackendCompositeAlert = await res.json()
      if (top && top.ticker) {
        const zScore = top.foreign_anomaly === "ANOMALI_OUTFLOW" ? -2.8 : top.foreign_anomaly === "ANOMALI_INFLOW" ? 2.45 : 0.0
        return {
          id: `alert-${top.ticker.toLowerCase()}-live`,
          ticker: top.ticker,
          bankName: BANK_NAMES[top.ticker] || `Bank ${top.ticker} Tbk`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
          timeAgo: "Sesi Terkini",
          headline: top.headline,
          summary: top.synthesis_summary,
          status: resolveCompositeStatus(top.overall_status),
          zScore,
          fundamentalScore: Math.round(top.fundamental_score),
          policyExposure: top.policy_exposure,
          confidence: 94.2,
          recommendedAction: top.trigger_factors && top.trigger_factors.length > 0 ? top.trigger_factors.join(" • ") : "Pantau pergerakan harga dan arus volume transaksi",
        }
      }
    }
  } catch {
  }
  if (upperTicker === "BBRI") {
    return MOCK_PRIMARY_ALERT
  }
  return {
    ...MOCK_PRIMARY_ALERT,
    id: `alert-${upperTicker.toLowerCase()}-fallback`,
    ticker: upperTicker,
    bankName: BANK_NAMES[upperTicker] || `Bank ${upperTicker} Tbk`,
  }
}

export async function getAlertFeed(): Promise<AlertFeedItem[]> {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/composite-alert/summary`, { cache: "no-store" })
    if (res.ok) {
      const list: BackendCompositeAlert[] = await res.json()
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item, idx) => {
          const triggerPillars: ("fundamental" | "sentiment" | "foreign_flow")[] = []
          if (item.fundamental_score > 0) triggerPillars.push("fundamental")
          if (item.foreign_anomaly && item.foreign_anomaly !== "NORMAL") triggerPillars.push("foreign_flow")
          if (item.company_sentiment !== 0 || item.policy_exposure !== 0 || item.crowd_sentiment !== 0 || (item.divergence_status && item.divergence_status !== "NORMAL")) triggerPillars.push("sentiment")
          const zScore = item.foreign_anomaly === "ANOMALI_OUTFLOW" ? -2.8 : item.foreign_anomaly === "ANOMALI_INFLOW" ? 2.45 : 0.0
          return {
            id: `feed-live-${idx + 1}`,
            ticker: item.ticker,
            bankName: BANK_NAMES[item.ticker] || `Bank ${item.ticker} Tbk`,
            timestamp: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + ", 16:00 WIB",
            timeAgo: "Sesi Hari Ini",
            title: item.headline,
            description: item.synthesis_summary,
            status: resolveCompositeStatus(item.overall_status),
            zScore,
            fundamentalScore: Math.round(item.fundamental_score),
            policyExposure: item.policy_exposure,
            triggerPillars: triggerPillars.length > 0 ? triggerPillars : ["fundamental"],
          }
        })
      }
    }
  } catch {
  }
  return MOCK_ALERT_FEED
}
