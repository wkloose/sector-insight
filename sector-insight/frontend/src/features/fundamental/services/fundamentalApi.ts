import { API_BASE_URL } from "@/src/shared/lib/constants"
import { FundamentalScoreDetail, ScreenerBankItem } from "../types/fundamental"

export const MOCK_FUNDAMENTAL_DETAILS: Record<string, FundamentalScoreDetail> = {
  BBRI: {
    ticker: "BBRI",
    bankName: "PT Bank Rakyat Indonesia (Persero) Tbk",
    quarter: "Q2 2026",
    score: 71,
    status: "Waspada",
    percentile: "Top 29%",
    nimScore: 75,
    ldrScore: 85,
    loanGrowthScore: 72,
    depositGrowthScore: 70,
    roeScore: 82,
    profitConsistencyScore: 75,
    dividendScore: 70,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 75, weight: 20, rawValue: "6.02%", percentileRank: 88, evaluation: "Kuat" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 85, weight: 15, rawValue: "84.20%", evaluation: "Optimal (Sweet-spot)" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: 72, weight: 15, rawValue: "+11.20%", percentileRank: 72, evaluation: "Sehat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 70, weight: 10, rawValue: "+9.40%", percentileRank: 70, evaluation: "Cukup" },
      { key: "roe", name: "Return on Equity (ROE)", score: 82, weight: 15, rawValue: "19.80%", percentileRank: 91, evaluation: "Sangat Kuat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 75, weight: 15, rawValue: "6/8 Kuartal", evaluation: "Konsisten" },
      { key: "dividend", name: "Keandalan Dividen", score: 70, weight: 10, rawValue: "5.45%", percentileRank: 70, evaluation: "Tinggi" },
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
    score: 75,
    status: "Stabil",
    percentile: "Top 21%",
    nimScore: 79,
    ldrScore: 74,
    loanGrowthScore: 68,
    depositGrowthScore: 75,
    roeScore: 80,
    profitConsistencyScore: 80,
    dividendScore: 72,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 79, weight: 20, rawValue: "4.82%", percentileRank: 79, evaluation: "Baik" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 74, weight: 15, rawValue: "84.5%", evaluation: "Sehat" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: 68, weight: 15, rawValue: "+11.5%", percentileRank: 68, evaluation: "Sehat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 75, weight: 10, rawValue: "+9.8%", percentileRank: 75, evaluation: "Sehat" },
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
    score: 68,
    status: "Stabil",
    percentile: "Top 35%",
    nimScore: 74,
    ldrScore: 78,
    loanGrowthScore: 80,
    depositGrowthScore: 75,
    roeScore: 76,
    profitConsistencyScore: 82,
    dividendScore: 55,
    dimensions: [
      { key: "nim", name: "Imbal Hasil Pembiayaan (Net Margin)", score: 74, weight: 20, rawValue: "5.10%", percentileRank: 74, evaluation: "Baik" },
      { key: "ldr", name: "Financing to Deposit Ratio (FDR)", score: 78, weight: 15, rawValue: "83.1%", evaluation: "Optimal" },
      { key: "loanGrowth", name: "Pertumbuhan Pembiayaan YoY", score: 80, weight: 15, rawValue: "+16.8%", percentileRank: 80, evaluation: "Sangat Kuat" },
      { key: "depositGrowth", name: "Pertumbuhan DPK YoY", score: 75, weight: 10, rawValue: "+12.2%", percentileRank: 75, evaluation: "Kuat" },
      { key: "roe", name: "Return on Equity (ROE)", score: 76, weight: 15, rawValue: "17.4%", percentileRank: 76, evaluation: "Baik" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 82, weight: 15, rawValue: "7/8 Kuartal", evaluation: "Konsisten" },
      { key: "dividend", name: "Keandalan Dividen", score: 55, weight: 10, rawValue: "2.1%", evaluation: "Moderat" },
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
  { ticker: "BBCA", name: "Bank Central Asia Tbk", category: "KBMI 4", score: 84, nim: 88, ldr: 76, loanGrowth: 70, roe: 90, dividend: 85, status: "Stabil" },
  { ticker: "BMRI", name: "Bank Mandiri (Persero) Tbk", category: "KBMI 4", score: 79, nim: 82, ldr: 80, loanGrowth: 65, roe: 85, dividend: 78, status: "Stabil" },
  { ticker: "BBNI", name: "Bank Negara Indonesia Tbk", category: "KBMI 4", score: 75, nim: 79, ldr: 74, loanGrowth: 68, roe: 80, dividend: 72, status: "Stabil" },
  { ticker: "BBRI", name: "Bank Rakyat Indonesia Tbk", category: "KBMI 4", score: 71, nim: 75, ldr: 85, loanGrowth: 72, roe: 82, dividend: 70, status: "Waspada" },
  { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk", category: "KBMI 3", score: 68, nim: 74, ldr: 78, loanGrowth: 80, roe: 76, dividend: 55, status: "Stabil" },
  { ticker: "BBTN", name: "Bank Tabungan Negara Tbk", category: "KBMI 3", score: 58, nim: 60, ldr: 92, loanGrowth: 62, roe: 64, dividend: 50, status: "Perhatian Khusus" },
]

function createFallbackFundamental(ticker: string): FundamentalScoreDetail {
  return {
    ticker,
    bankName: `PT Bank ${ticker} Tbk`,
    quarter: "Q2 2026",
    score: 70,
    status: "Stabil",
    percentile: "Top 30%",
    nimScore: 72,
    ldrScore: 78,
    loanGrowthScore: 70,
    depositGrowthScore: 72,
    roeScore: 75,
    profitConsistencyScore: 75,
    dividendScore: 65,
    dimensions: [
      { key: "nim", name: "Margin Bunga Bersih (NIM)", score: 72, weight: 20, rawValue: "5.15%", percentileRank: 72, evaluation: "Baik" },
      { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: 78, weight: 15, rawValue: "83.50%", evaluation: "Optimal" },
      { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: 70, weight: 15, rawValue: "+10.80%", percentileRank: 70, evaluation: "Sehat" },
      { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: 72, weight: 10, rawValue: "+9.20%", percentileRank: 72, evaluation: "Baik" },
      { key: "roe", name: "Return on Equity (ROE)", score: 75, weight: 15, rawValue: "16.40%", percentileRank: 75, evaluation: "Kuat" },
      { key: "profitConsistency", name: "Konsistensi Laba", score: 75, weight: 15, rawValue: "6/8 Kuartal", evaluation: "Konsisten" },
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

const BANK_METADATA: Record<string, { name: string; category: "KBMI 4" | "KBMI 3" | "KBMI 2" }> = {
  BBCA: { name: "Bank Central Asia Tbk", category: "KBMI 4" },
  BMRI: { name: "Bank Mandiri (Persero) Tbk", category: "KBMI 4" },
  BBRI: { name: "Bank Rakyat Indonesia Tbk", category: "KBMI 4" },
  BBNI: { name: "Bank Negara Indonesia Tbk", category: "KBMI 4" },
  BRIS: { name: "Bank Syariah Indonesia Tbk", category: "KBMI 3" },
  BBTN: { name: "Bank Tabungan Negara Tbk", category: "KBMI 3" },
  BDMN: { name: "Bank Danamon Indonesia Tbk", category: "KBMI 3" },
}

function mapHealthStatusToBadge(status?: string): "Stabil" | "Waspada" | "Perhatian Khusus" {
  if (!status) return "Stabil"
  const s = status.toLowerCase()
  if (s.includes("perlu") || s.includes("perhatian") || s.includes("waspada tinggi")) return "Perhatian Khusus"
  if (s.includes("waspada") || s.includes("cukup") || s.includes("kurang")) return "Waspada"
  return "Stabil"
}

interface BackendFundamentalScore {
  id?: number
  ticker: string
  kuartal: string
  nim_score: number
  ldr_score: number
  loan_growth_score: number
  deposit_growth_score: number
  roe_score: number
  konsistensi_score: number
  dividend_score: number
  skor_akhir: number
  health_status: string
}

export async function getFundamentalScore(ticker: string): Promise<FundamentalScoreDetail> {
  const upper = (ticker || "BBRI").toUpperCase()
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/fundamental-score/${upper}`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Gagal mengambil skor fundamental dari backend")
    const item: BackendFundamentalScore = await res.json()
    if (item && item.ticker) {
      const mockFallback = MOCK_FUNDAMENTAL_DETAILS[upper] || createFallbackFundamental(upper)
      const mappedStatus = mapHealthStatusToBadge(item.health_status)

      return {
        ticker: item.ticker,
        bankName: BANK_METADATA[item.ticker]?.name || mockFallback.bankName,
        quarter: item.kuartal || mockFallback.quarter,
        score: Math.round(item.skor_akhir),
        status: mappedStatus,
        percentile: mockFallback.percentile,
        nimScore: Math.round(item.nim_score),
        ldrScore: Math.round(item.ldr_score),
        loanGrowthScore: Math.round(item.loan_growth_score),
        depositGrowthScore: Math.round(item.deposit_growth_score),
        roeScore: Math.round(item.roe_score),
        profitConsistencyScore: Math.round(item.konsistensi_score),
        dividendScore: Math.round(item.dividend_score),
        dimensions: [
          { key: "nim", name: "Margin Bunga Bersih (NIM)", score: Math.round(item.nim_score), weight: 20, rawValue: mockFallback.dimensions[0]?.rawValue || "5.4%", percentileRank: Math.round(item.nim_score), evaluation: item.nim_score >= 80 ? "Sangat Kuat" : item.nim_score >= 70 ? "Kuat" : "Moderat" },
          { key: "ldr", name: "Rasio Kredit-Simpanan (LDR)", score: Math.round(item.ldr_score), weight: 15, rawValue: mockFallback.dimensions[1]?.rawValue || "84.2%", evaluation: item.ldr_score >= 80 ? "Optimal" : "Waspada" },
          { key: "loanGrowth", name: "Pertumbuhan Kredit YoY", score: Math.round(item.loan_growth_score), weight: 15, rawValue: mockFallback.dimensions[2]?.rawValue || "+11.5%", percentileRank: Math.round(item.loan_growth_score), evaluation: item.loan_growth_score >= 70 ? "Sehat" : "Moderat" },
          { key: "depositGrowth", name: "Pertumbuhan Simpanan YoY", score: Math.round(item.deposit_growth_score), weight: 10, rawValue: mockFallback.dimensions[3]?.rawValue || "+9.8%", percentileRank: Math.round(item.deposit_growth_score), evaluation: item.deposit_growth_score >= 70 ? "Cukup" : "Rendah" },
          { key: "roe", name: "Return on Equity (ROE)", score: Math.round(item.roe_score), weight: 15, rawValue: mockFallback.dimensions[4]?.rawValue || "18.5%", percentileRank: Math.round(item.roe_score), evaluation: item.roe_score >= 80 ? "Sangat Kuat" : "Kuat" },
          { key: "profitConsistency", name: "Konsistensi Laba", score: Math.round(item.konsistensi_score), weight: 15, rawValue: mockFallback.dimensions[5]?.rawValue || "7/8 Kuartal", evaluation: item.konsistensi_score >= 80 ? "Konsisten" : "Cukup" },
          { key: "dividend", name: "Keandalan Dividen", score: Math.round(item.dividend_score), weight: 10, rawValue: mockFallback.dimensions[6]?.rawValue || "4.5%", percentileRank: Math.round(item.dividend_score), evaluation: item.dividend_score >= 70 ? "Tinggi" : "Moderat" },
        ],
        financialMetrics: mockFallback.financialMetrics,
      }
    }
  } catch (err) {
    console.warn(`Backend fundamental score for ${upper} offline, using fallback mock:`, err)
  }
  return MOCK_FUNDAMENTAL_DETAILS[upper] || createFallbackFundamental(upper)
}

export async function getScreenerData(): Promise<ScreenerBankItem[]> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/fundamental-score`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Gagal mengambil data screener dari backend")
    const list: BackendFundamentalScore[] = await res.json()
    if (Array.isArray(list) && list.length > 0) {
      const seen = new Set<string>()
      const uniqueList = list.filter((item) => {
        if (seen.has(item.ticker)) return false
        seen.add(item.ticker)
        return true
      })
      return uniqueList.map((item) => {
        const meta = BANK_METADATA[item.ticker] || {
          name: `PT Bank ${item.ticker} Tbk`,
          category: "KBMI 3" as const,
        }
        return {
          ticker: item.ticker,
          name: meta.name,
          category: meta.category,
          score: Math.round(item.skor_akhir),
          nim: Math.round(item.nim_score),
          ldr: Math.round(item.ldr_score),
          loanGrowth: Math.round(item.loan_growth_score),
          roe: Math.round(item.roe_score),
          dividend: Math.round(item.dividend_score),
          status: mapHealthStatusToBadge(item.health_status),
        }
      })
    }

  } catch (err) {
    console.warn("Backend screener data offline, using fallback mock:", err)
  }
  return MOCK_SCREENER_DATA
}

