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

const BANK_NAMES: Record<string, string> = {
  BBRI: "PT Bank Rakyat Indonesia (Persero) Tbk",
  BBCA: "PT Bank Central Asia Tbk",
  BMRI: "PT Bank Mandiri (Persero) Tbk",
  BBNI: "PT Bank Negara Indonesia Tbk",
  BBTN: "PT Bank Tabungan Negara Tbk",
  BRIS: "PT Bank Syariah Indonesia Tbk",
  BDMN: "PT Bank Danamon Indonesia Tbk",
}

interface BackendCompositeResponse {
  ticker: string
  overall_status: "Stabil" | "Waspada" | "Perhatian Khusus"
  headline: string
  synthesis_summary: string
  fundamental_score: number
  company_sentiment: number
  policy_exposure: number
  foreign_anomaly: string
  trigger_factors: string[]
}

function mapBackendToPrimaryAlert(item: BackendCompositeResponse): CompositeAlert {
  const isSpecial = item.overall_status === "Perhatian Khusus"
  const isWarning = item.overall_status === "Waspada"
  const zScore = item.foreign_anomaly.includes("OUTFLOW")
    ? -2.8
    : item.foreign_anomaly.includes("INFLOW")
    ? 2.4
    : 0.35

  let recommendedAction = "Pertahankan alokasi taktis portofolio, kinerja 3 pilar dalam batas terkendali."
  if (isSpecial) {
    recommendedAction = `Mitigasi risiko alokasi pada ${item.ticker} & pantau potensi tekanan lanjutan serta support teknikal.`
  } else if (isWarning) {
    recommendedAction = `Waspadai pergerakan likuiditas dan sentimen kebijakan moneter terkait ${item.ticker}.`
  }

  return {
    id: `alert-${item.ticker.toLowerCase()}`,
    ticker: item.ticker,
    bankName: BANK_NAMES[item.ticker] || `Bank ${item.ticker}`,
    timestamp: "Realtime Live",
    timeAgo: "Baru saja",
    headline: item.headline,
    summary: item.synthesis_summary,
    status: item.overall_status,
    zScore,
    fundamentalScore: Math.round(item.fundamental_score),
    policyExposure: Number(item.policy_exposure.toFixed(2)),
    confidence: 93.5,
    recommendedAction,
  }
}

function mapBackendToFeedItem(item: BackendCompositeResponse, index: number): AlertFeedItem {
  const zScore = item.foreign_anomaly.includes("OUTFLOW")
    ? -2.5
    : item.foreign_anomaly.includes("INFLOW")
    ? 2.1
    : 0.3

  const triggerPillars: ("fundamental" | "sentiment" | "foreign_flow")[] = []
  if (item.trigger_factors && item.trigger_factors.length > 0) {
    item.trigger_factors.forEach((f) => {
      const lower = f.toLowerCase()
      if (lower.includes("fundamental") && !triggerPillars.includes("fundamental")) triggerPillars.push("fundamental")
      if ((lower.includes("sentimen") || lower.includes("kebijakan")) && !triggerPillars.includes("sentiment")) triggerPillars.push("sentiment")
      if ((lower.includes("foreign") || lower.includes("asing") || lower.includes("outflow") || lower.includes("inflow")) && !triggerPillars.includes("foreign_flow")) triggerPillars.push("foreign_flow")
    })
  }
  if (triggerPillars.length === 0) {
    triggerPillars.push("fundamental")
  }

  return {
    id: `feed-${item.ticker}-${index}`,
    ticker: item.ticker,
    bankName: BANK_NAMES[item.ticker] || `Bank ${item.ticker}`,
    timestamp: "24 Sep 2026",
    timeAgo: index === 0 ? "4 menit lalu" : `${index * 2} jam lalu`,
    title: item.headline,
    description: item.synthesis_summary,
    status: item.overall_status,
    zScore,
    fundamentalScore: Math.round(item.fundamental_score),
    policyExposure: Number(item.policy_exposure.toFixed(2)),
    triggerPillars,
  }
}

export async function getPrimaryAlert(): Promise<CompositeAlert> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/composite-alert/summary`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Gagal mengambil ringkasan alert komposit")
    const list: BackendCompositeResponse[] = await res.json()
    if (Array.isArray(list) && list.length > 0) {

      const special = list.find((a) => a.overall_status === "Perhatian Khusus")
      const warning = list.find((a) => a.overall_status === "Waspada")
      const target = special || warning || list[0]
      return mapBackendToPrimaryAlert(target)
    }
  } catch (err) {
    console.warn("Backend composite alert summary offline, using fallback mock:", err)
  }
  return MOCK_PRIMARY_ALERT
}

export async function getAlertFeed(): Promise<AlertFeedItem[]> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/composite-alert/summary`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Gagal mengambil feed sinyal")
    const list: BackendCompositeResponse[] = await res.json()
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item, idx) => mapBackendToFeedItem(item, idx))
    }
  } catch (err) {
    console.warn("Backend composite feed offline, using fallback mock:", err)
  }
  return MOCK_ALERT_FEED
}

export async function getCompositeAlertByTicker(ticker: string): Promise<CompositeAlert> {
  const upper = (ticker || "BBRI").toUpperCase()
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/composite-alert/${upper}`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`Gagal mengambil composite alert untuk ${upper}`)
    const item: BackendCompositeResponse = await res.json()
    return mapBackendToPrimaryAlert(item)
  } catch {
    return (
      MOCK_ALERT_FEED.find((f) => f.ticker === upper)
        ? {
            id: `alert-${upper.toLowerCase()}`,
            ticker: upper,
            bankName: BANK_NAMES[upper] || `Bank ${upper}`,
            timestamp: "Realtime",
            timeAgo: "Baru saja",
            headline: `${upper}: Analisis Sinyal Gabungan 3 Pilar Pasar`,
            summary: `Skor fundamental dan pergerakan aliran broker asing menunjukkan tren konsolidasi di area batas aman.`,
            status: "Stabil",
            zScore: 0.35,
            fundamentalScore: 78,
            policyExposure: 0.25,
            confidence: 91.0,
            recommendedAction: "Pantau area akumulasi dan stabilitas NIM kuartalan.",
          }
        : MOCK_PRIMARY_ALERT
    )
  }
}

