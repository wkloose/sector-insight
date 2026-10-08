import { API_BASE_URL } from "@/src/shared/lib/constants"
import { FundamentalScoreDetail, ScreenerBankItem, FundamentalScoreHistoryItem } from "../types/fundamental"

export const MOCK_FUNDAMENTAL_DETAILS: Record<string, FundamentalScoreDetail> = {
  BBRI: {
    ticker: "BBRI",
    bankName: "PT Bank Rakyat Indonesia (Persero) Tbk",
    quarter: "Q2 2026",
    score: 85,
    status: "Stabil",
    percentile: "Top 12%",
    nimScore: 92,
    ldrScore: 85,
    loanGrowthScore: 72,
    depositGrowthScore: 70,
    roeScore: 89,
    profitConsistencyScore: 88,
    dividendScore: 92,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 92, weight: 20, rawValue: "6.80%", percentileRank: 92, evaluation: "Sangat Kuat" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 85, weight: 15, rawValue: "84.20%", evaluation: "Optimal (Sweet-spot)" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: 72, weight: 15, rawValue: "+11.20%", percentileRank: 72, evaluation: "Sehat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 70, weight: 10, rawValue: "+9.40%", percentileRank: 70, evaluation: "Cukup" },
      { key: "roe", name: "Return on Equity (ROE)", score: 89, weight: 15, rawValue: "19.80%", percentileRank: 89, evaluation: "Sangat Kuat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 88, weight: 15, rawValue: "7/8 Kuartal", evaluation: "Konsisten" },
      { key: "dividend", name: "Keandalan Dividen", score: 92, weight: 10, rawValue: "5.45%", percentileRank: 92, evaluation: "Sangat Tinggi" },
    ],
    financialMetrics: {
      nim: "6.02%",
      ldr: "84.20%",
      roe: "19.80%",
      npl: "3.05%",
      casa: "63.40%",
      loanGrowthYoY: "+11.20%",
      depositGrowthYoY: "+9.40%",
    },
  },
  BBCA: {
    ticker: "BBCA",
    bankName: "PT Bank Central Asia Tbk",
    quarter: "Q2 2026",
    score: 84,
    status: "Stabil",
    percentile: "Top 5%",
    nimScore: 88,
    ldrScore: 76,
    loanGrowthScore: 70,
    depositGrowthScore: 82,
    roeScore: 90,
    profitConsistencyScore: 95,
    dividendScore: 85,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 88, weight: 20, rawValue: "5.82%", percentileRank: 88, evaluation: "Kuat" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 76, weight: 15, rawValue: "81.4% (Ideal)", evaluation: "Sehat" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: 70, weight: 15, rawValue: "+14.3%", percentileRank: 70, evaluation: "Kuat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 82, weight: 10, rawValue: "+8.9%", percentileRank: 82, evaluation: "Kuat" },
      { key: "roe", name: "Return on Equity (ROE)", score: 90, weight: 15, rawValue: "22.4%", percentileRank: 95, evaluation: "Sangat Kuat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 95, weight: 15, rawValue: "8/8 Kuartal", evaluation: "Sangat Konsisten" },
      { key: "dividend", name: "Keandalan Dividen", score: 85, weight: 10, rawValue: "2.8% (5 Thn)", evaluation: "Konsisten" },
    ],
    financialMetrics: {
      nim: "5.82%",
      ldr: "81.40%",
      roe: "22.40%",
      npl: "1.90%",
      casa: "82.40%",
      loanGrowthYoY: "+14.30%",
      depositGrowthYoY: "+8.90%",
    },
  },
  BMRI: {
    ticker: "BMRI",
    bankName: "PT Bank Mandiri (Persero) Tbk",
    quarter: "Q2 2026",
    score: 79,
    status: "Stabil",
    percentile: "Top 14%",
    nimScore: 82,
    ldrScore: 80,
    loanGrowthScore: 65,
    depositGrowthScore: 85,
    roeScore: 85,
    profitConsistencyScore: 88,
    dividendScore: 78,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 82, weight: 20, rawValue: "5.34%", percentileRank: 82, evaluation: "Kuat" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 80, weight: 15, rawValue: "85.2%", evaluation: "Optimal" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: 65, weight: 15, rawValue: "+11.8%", percentileRank: 65, evaluation: "Sehat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 85, weight: 10, rawValue: "+10.6%", percentileRank: 85, evaluation: "Kuat" },
      { key: "roe", name: "Return on Equity (ROE)", score: 85, weight: 15, rawValue: "19.1%", percentileRank: 85, evaluation: "Kuat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 88, weight: 15, rawValue: "7/8 Kuartal", evaluation: "Konsisten" },
      { key: "dividend", name: "Keandalan Dividen", score: 78, weight: 10, rawValue: "4.2%", evaluation: "Baik" },
    ],
    financialMetrics: {
      nim: "5.34%",
      ldr: "85.20%",
      roe: "19.10%",
      npl: "2.10%",
      casa: "78.20%",
      loanGrowthYoY: "+11.80%",
      depositGrowthYoY: "+10.60%",
    },
  },
  BBNI: {
    ticker: "BBNI",
    bankName: "PT Bank Negara Indonesia Tbk",
    quarter: "Q2 2026",
    score: 79,
    status: "Stabil",
    percentile: "Top 21%",
    nimScore: 79,
    ldrScore: 74,
    loanGrowthScore: 68,
    depositGrowthScore: 78,
    roeScore: 80,
    profitConsistencyScore: 80,
    dividendScore: 72,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 79, weight: 20, rawValue: "4.82%", percentileRank: 79, evaluation: "Baik" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 74, weight: 15, rawValue: "84.5%", evaluation: "Sehat" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: 68, weight: 15, rawValue: "+11.5%", percentileRank: 68, evaluation: "Sehat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 78, weight: 10, rawValue: "+9.8%", percentileRank: 78, evaluation: "Sehat" },
      { key: "roe", name: "Return on Equity (ROE)", score: 80, weight: 15, rawValue: "15.8%", percentileRank: 80, evaluation: "Kuat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 80, weight: 15, rawValue: "6/8 Kuartal", evaluation: "Konsisten" },
      { key: "dividend", name: "Keandalan Dividen", score: 72, weight: 10, rawValue: "4.8%", evaluation: "Baik" },
    ],
    financialMetrics: {
      nim: "4.82%",
      ldr: "84.50%",
      roe: "15.80%",
      npl: "2.40%",
      casa: "71.30%",
      loanGrowthYoY: "+11.50%",
      depositGrowthYoY: "+9.80%",
    },
  },
  BRIS: {
    ticker: "BRIS",
    bankName: "PT Bank Syariah Indonesia Tbk",
    quarter: "Q2 2026",
    score: 82,
    status: "Stabil",
    percentile: "Top 15%",
    nimScore: 80,
    ldrScore: 85,
    loanGrowthScore: 82,
    depositGrowthScore: 84,
    roeScore: 84,
    profitConsistencyScore: 88,
    dividendScore: 78,
    dimensions: [
      { key: "nim", name: "Imbal Hasil Pembiayaan (Net Margin)", score: 80, weight: 20, rawValue: "5.50%", percentileRank: 80, evaluation: "Kuat" },
      { key: "ldr", name: "Financing to Deposit Ratio (FDR)", score: 85, weight: 15, rawValue: "83.5%", evaluation: "Optimal (Sweet-spot)" },
      { key: "loanGrowth", name: "Pertumbuhan Pembiayaan YoY", score: 82, weight: 15, rawValue: "+16.8%", percentileRank: 82, evaluation: "Sangat Kuat" },
      { key: "depositGrowth", name: "Pertumbuhan DPK YoY", score: 84, weight: 10, rawValue: "+12.2%", percentileRank: 84, evaluation: "Kuat" },
      { key: "roe", name: "Return on Equity (ROE)", score: 84, weight: 15, rawValue: "17.6%", percentileRank: 84, evaluation: "Kuat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 88, weight: 15, rawValue: "8/8 Kuartal", evaluation: "Sangat Konsisten" },
      { key: "dividend", name: "Keandalan Dividen", score: 78, weight: 10, rawValue: "2.8%", evaluation: "Baik" },
    ],
    financialMetrics: {
      nim: "5.10%",
      ldr: "83.10%",
      roe: "17.40%",
      npl: "1.95%",
      casa: "61.20%",
      loanGrowthYoY: "+16.80%",
      depositGrowthYoY: "+12.20%",
    },
  },
  BBTN: {
    ticker: "BBTN",
    bankName: "PT Bank Tabungan Negara (Persero) Tbk",
    quarter: "Q2 2026",
    score: 58,
    status: "Perhatian Khusus",
    percentile: "Top 58%",
    nimScore: 60,
    ldrScore: 92,
    loanGrowthScore: 62,
    depositGrowthScore: 58,
    roeScore: 64,
    profitConsistencyScore: 65,
    dividendScore: 50,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 60, weight: 20, rawValue: "3.75%", percentileRank: 60, evaluation: "Rendah" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 92, weight: 15, rawValue: "94.8% (Ketat)", evaluation: "Waspada Likuiditas" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit KPR YoY", score: 62, weight: 15, rawValue: "+10.1%", percentileRank: 62, evaluation: "Moderat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 58, weight: 10, rawValue: "+7.4%", percentileRank: 58, evaluation: "Rendah" },
      { key: "roe", name: "Return on Equity (ROE)", score: 64, weight: 15, rawValue: "12.8%", percentileRank: 64, evaluation: "Moderat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 65, weight: 15, rawValue: "5/8 Kuartal", evaluation: "Cukup" },
      { key: "dividend", name: "Keandalan Dividen", score: 50, weight: 10, rawValue: "3.5%", evaluation: "Moderat" },
    ],
    financialMetrics: {
      nim: "3.75%",
      ldr: "94.80%",
      roe: "12.80%",
      npl: "3.20%",
      casa: "52.80%",
      loanGrowthYoY: "+10.10%",
      depositGrowthYoY: "+7.40%",
    },
  },
}

export const MOCK_SCREENER_DATA: ScreenerBankItem[] = [
  { ticker: "BBCA", name: "Bank Central Asia Tbk", category: "KBMI 4", score: 88, nim: 85, ldr: 100, loanGrowth: 75, roe: 95, dividend: 95, status: "Stabil" },
  { ticker: "BMRI", name: "Bank Mandiri (Persero) Tbk", category: "KBMI 4", score: 86, nim: 78, ldr: 100, loanGrowth: 90, roe: 88, dividend: 90, status: "Stabil" },
  { ticker: "BBRI", name: "Bank Rakyat Indonesia Tbk", category: "KBMI 4", score: 85, nim: 92, ldr: 100, loanGrowth: 70, roe: 89, dividend: 92, status: "Stabil" },
  { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk", category: "KBMI 3", score: 82, nim: 80, ldr: 100, loanGrowth: 82, roe: 84, dividend: 78, status: "Stabil" },
  { ticker: "BBNI", name: "Bank Negara Indonesia Tbk", category: "KBMI 4", score: 79, nim: 68, ldr: 100, loanGrowth: 68, roe: 79, dividend: 85, status: "Stabil" },
  { ticker: "BNGA", name: "Bank CIMB Niaga Tbk", category: "KBMI 3", score: 78, nim: 72, ldr: 100, loanGrowth: 64, roe: 80, dividend: 88, status: "Stabil" },
  { ticker: "BDMN", name: "Bank Danamon Indonesia Tbk", category: "KBMI 3", score: 73, nim: 74, ldr: 100, loanGrowth: 66, roe: 72, dividend: 80, status: "Stabil" },
  { ticker: "BJTM", name: "Bank Jatim Tbk", category: "KBMI 2", score: 68, nim: 78, ldr: 100, loanGrowth: 60, roe: 76, dividend: 88, status: "Stabil" },
  { ticker: "BJBR", name: "Bank BJB Tbk", category: "KBMI 2", score: 67, nim: 75, ldr: 100, loanGrowth: 58, roe: 74, dividend: 86, status: "Stabil" },
  { ticker: "PNBN", name: "Bank Panin Tbk", category: "KBMI 3", score: 66, nim: 62, ldr: 100, loanGrowth: 52, roe: 68, dividend: 65, status: "Stabil" },
  { ticker: "ARTO", name: "Bank Jago Tbk", category: "Bank Digital", score: 63, nim: 95, ldr: 100, loanGrowth: 98, roe: 45, dividend: 20, status: "Stabil" },
  { ticker: "AMAR", name: "Bank Amar Indonesia Tbk", category: "Bank Digital", score: 58, nim: 98, ldr: 100, loanGrowth: 88, roe: 58, dividend: 35, status: "Waspada" },
  { ticker: "BBTN", name: "Bank Tabungan Negara Tbk", category: "KBMI 3", score: 56, nim: 55, ldr: 92, loanGrowth: 60, roe: 62, dividend: 68, status: "Waspada" },
  { ticker: "AGRO", name: "Bank Raya Indonesia Tbk", category: "Bank Digital", score: 48, nim: 60, ldr: 100, loanGrowth: 78, roe: 42, dividend: 20, status: "Waspada" },
  { ticker: "AGRS", name: "Bank IBK Indonesia Tbk", category: "KBMI 2", score: 46, nim: 52, ldr: 100, loanGrowth: 70, roe: 48, dividend: 20, status: "Waspada" },
  { ticker: "BABP", name: "Bank MNC Internasional Tbk", category: "KBMI 2", score: 43, nim: 48, ldr: 100, loanGrowth: 62, roe: 38, dividend: 20, status: "Waspada" },
]

function createFallbackFundamental(ticker: string): FundamentalScoreDetail {
  const hash = ticker.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const roeVal = 70 + (hash % 16)
  const konsistensiVal = 65 + ((hash * 2) % 25)
  return {
    ticker,
    bankName: `PT Bank ${ticker} Tbk`,
    quarter: "Q2 2026",
    score: 71,
    status: "Stabil",
    percentile: "Top 30%",
    nimScore: 72,
    ldrScore: 78,
    loanGrowthScore: 70,
    depositGrowthScore: 72,
    roeScore: roeVal,
    profitConsistencyScore: konsistensiVal,
    dividendScore: 65,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 72, weight: 20, rawValue: "5.15%", percentileRank: 72, evaluation: "Baik" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 78, weight: 15, rawValue: "83.50%", evaluation: "Optimal" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: 70, weight: 15, rawValue: "+10.80%", percentileRank: 70, evaluation: "Sehat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 72, weight: 10, rawValue: "+9.20%", percentileRank: 72, evaluation: "Baik" },
      { key: "roe", name: "Return on Equity (ROE)", score: roeVal, weight: 15, rawValue: "16.40%", percentileRank: roeVal, evaluation: "Kuat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: konsistensiVal, weight: 15, rawValue: "6/8 Kuartal", evaluation: "Konsisten" },
      { key: "dividend", name: "Keandalan Dividen", score: 65, weight: 10, rawValue: "3.80%", percentileRank: 65, evaluation: "Cukup" },
    ],
    financialMetrics: {
      nim: "5.15%",
      ldr: "83.50%",
      roe: "16.40%",
      npl: "2.35%",
      casa: "68.20%",
      loanGrowthYoY: "+10.80%",
      depositGrowthYoY: "+9.20%",
    },
  }
}

const BANK_METADATA: Record<string, { name: string; category: string }> = {
  BBCA: { name: "Bank Central Asia Tbk", category: "KBMI 4" },
  BMRI: { name: "Bank Mandiri (Persero) Tbk", category: "KBMI 4" },
  BBNI: { name: "Bank Negara Indonesia Tbk", category: "KBMI 4" },
  BBRI: { name: "Bank Rakyat Indonesia Tbk", category: "KBMI 4" },
  BRIS: { name: "Bank Syariah Indonesia Tbk", category: "KBMI 3" },
  BNGA: { name: "Bank CIMB Niaga Tbk", category: "KBMI 3" },
  BDMN: { name: "Bank Danamon Indonesia Tbk", category: "KBMI 3" },
  BBTN: { name: "Bank Tabungan Negara Tbk", category: "KBMI 3" },
  BJBR: { name: "Bank BJB Tbk", category: "KBMI 2" },
  BJTM: { name: "Bank Jatim Tbk", category: "KBMI 2" },
  ARTO: { name: "Bank Jago Tbk", category: "Bank Digital" },
  PNBN: { name: "Bank Panin Tbk", category: "KBMI 3" },
  AGRO: { name: "Bank Raya Indonesia Tbk", category: "Bank Digital" },
  AMAR: { name: "Bank Amar Indonesia Tbk", category: "Bank Digital" },
  AGRS: { name: "Bank IBK Indonesia Tbk", category: "KBMI 2" },
  BABP: { name: "Bank MNC Internasional Tbk", category: "KBMI 2" },
}

export interface BackendFundamentalScore {
  id?: number
  ticker: string
  kuartal?: string
  nim_score?: number
  ldr_score?: number
  loan_growth_score?: number
  deposit_growth_score?: number
  roe_score?: number
  konsistensi_score?: number
  dividend_score?: number
  skor_akhir?: number
  health_status?: string
  created_at?: string
}

function resolveStatus(status?: string, score = 70): "Stabil" | "Waspada" | "Perhatian Khusus" {
  if (status === "Sangat Sehat" || status === "Sehat" || score >= 70) return "Stabil"
  if (status === "Cukup" || status === "Waspada" || score >= 50) return "Waspada"
  return "Perhatian Khusus"
}

export async function getFundamentalScore(ticker: string): Promise<FundamentalScoreDetail> {
  const upper = (ticker || "BBRI").toUpperCase()
  const fallback = MOCK_FUNDAMENTAL_DETAILS[upper] || createFallbackFundamental(upper)
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/fundamental-score/${upper}`, { cache: "no-store" })
    if (res.ok) {
      const data: BackendFundamentalScore = await res.json()
      if (data && data.ticker) {
        const score = Math.round(data.skor_akhir ?? fallback.score)
        const nimScore = Math.round(data.nim_score ?? fallback.nimScore)
        const ldrScore = Math.round(data.ldr_score ?? fallback.ldrScore)
        const loanGrowthScore = Math.round(data.loan_growth_score ?? fallback.loanGrowthScore)
        const depositGrowthScore = Math.round(data.deposit_growth_score ?? fallback.depositGrowthScore)
        const roeScore = Math.round(data.roe_score ?? fallback.roeScore)
        const profitConsistencyScore = Math.round(data.konsistensi_score ?? fallback.profitConsistencyScore)
        const dividendScore = Math.round(data.dividend_score ?? fallback.dividendScore)
        const status = resolveStatus(data.health_status, score)

        return {
          ...fallback,
          ticker: upper,
          quarter: data.kuartal || fallback.quarter,
          score,
          status,
          percentile: `Top ${Math.max(1, Math.min(99, 100 - score))}%`,
          nimScore,
          ldrScore,
          loanGrowthScore,
          depositGrowthScore,
          roeScore,
          profitConsistencyScore,
          dividendScore,
          dimensions: [
            { key: "nim", name: "Margin Bunga Bersih (NIM)", score: nimScore, weight: 20, rawValue: fallback.financialMetrics.nim, percentileRank: nimScore, evaluation: nimScore >= 80 ? "Kuat" : nimScore >= 60 ? "Baik" : "Rendah" },
            { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: ldrScore, weight: 15, rawValue: fallback.financialMetrics.ldr, evaluation: ldrScore >= 80 ? "Optimal (Sweet-spot)" : ldrScore >= 60 ? "Sehat" : "Waspada Likuiditas" },
            { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: loanGrowthScore, weight: 15, rawValue: fallback.financialMetrics.loanGrowthYoY, percentileRank: loanGrowthScore, evaluation: loanGrowthScore >= 75 ? "Kuat" : loanGrowthScore >= 50 ? "Sehat" : "Moderat" },
            { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: depositGrowthScore, weight: 10, rawValue: fallback.financialMetrics.depositGrowthYoY, percentileRank: depositGrowthScore, evaluation: depositGrowthScore >= 75 ? "Kuat" : "Cukup" },
            { key: "roe", name: "Return on Equity (ROE)", score: roeScore, weight: 15, rawValue: fallback.financialMetrics.roe, percentileRank: roeScore, evaluation: roeScore >= 85 ? "Sangat Kuat" : roeScore >= 70 ? "Kuat" : "Moderat" },
            { key: "profitConsistency", name: "Konsistensi Laba", score: profitConsistencyScore, weight: 15, rawValue: fallback.dimensions.find((d) => d.key === "profitConsistency")?.rawValue || "7/8 Kuartal", evaluation: profitConsistencyScore >= 80 ? "Konsisten" : "Cukup" },
            { key: "dividend", name: "Keandalan Dividen", score: dividendScore, weight: 10, rawValue: fallback.dimensions.find((d) => d.key === "dividend")?.rawValue || "4.5%", percentileRank: dividendScore, evaluation: dividendScore >= 75 ? "Tinggi" : dividendScore >= 55 ? "Baik" : "Moderat" },
          ],
        }
      }
    }
  } catch {
  }
  return fallback
}

export async function getScreenerData(): Promise<ScreenerBankItem[]> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/fundamental-score`, { cache: "no-store" })
    if (res.ok) {
      const json = await res.json()
      const list: BackendFundamentalScore[] = Array.isArray(json) ? json : json.data || []
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item) => {
          const info = BANK_METADATA[item.ticker] || { name: `PT Bank ${item.ticker} Tbk`, category: "KBMI 3" }
          const score = Math.round(item.skor_akhir ?? 70)
          return {
            ticker: item.ticker,
            name: info.name,
            category: info.category,
            score,
            nim: Math.round(item.nim_score ?? 70),
            ldr: Math.round(item.ldr_score ?? 70),
            loanGrowth: Math.round(item.loan_growth_score ?? 70),
            roe: Math.round(item.roe_score ?? 70),
            dividend: Math.round(item.dividend_score ?? 70),
            status: resolveStatus(item.health_status, score),
            quarter: item.kuartal,
          }
        })
      }
    }
  } catch {
  }
  return MOCK_SCREENER_DATA
}

export async function getFundamentalHistory(ticker: string): Promise<FundamentalScoreHistoryItem[]> {
  const upper = (ticker || "BBRI").toUpperCase()
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/fundamental-score/${upper}/history`, { cache: "no-store" })
    if (res.ok) {
      const json = await res.json()
      const list: BackendFundamentalScore[] = Array.isArray(json) ? json : json.data || []
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item) => {
          const score = Math.round(item.skor_akhir ?? 70)
          return {
            id: item.id,
            ticker: item.ticker,
            quarter: item.kuartal || "Q2 2026",
            score,
            status: resolveStatus(item.health_status, score),
            nimScore: Math.round(item.nim_score ?? 70),
            ldrScore: Math.round(item.ldr_score ?? 70),
            loanGrowthScore: Math.round(item.loan_growth_score ?? 70),
            depositGrowthScore: Math.round(item.deposit_growth_score ?? 70),
            roeScore: Math.round(item.roe_score ?? 70),
            profitConsistencyScore: Math.round(item.konsistensi_score ?? 70),
            dividendScore: Math.round(item.dividend_score ?? 70),
            createdAt: item.created_at,
          }
        })
      }
    }
  } catch {
  }
  const fallback = MOCK_FUNDAMENTAL_DETAILS[upper] || createFallbackFundamental(upper)
  return [
    {
      ticker: upper,
      quarter: fallback.quarter,
      score: fallback.score,
      status: fallback.status as "Stabil" | "Waspada" | "Perhatian Khusus",
      nimScore: fallback.nimScore,
      ldrScore: fallback.ldrScore,
      loanGrowthScore: fallback.loanGrowthScore,
      depositGrowthScore: fallback.depositGrowthScore,
      roeScore: fallback.roeScore,
      profitConsistencyScore: fallback.profitConsistencyScore,
      dividendScore: fallback.dividendScore,
    },
  ]
}
