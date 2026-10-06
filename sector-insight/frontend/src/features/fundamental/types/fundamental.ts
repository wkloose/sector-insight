import { StatusType } from "@/src/shared/types/common"

export interface FundamentalDimension {
  key: string
  name: string
  score: number
  weight: number
  rawValue?: string | number
  percentileRank?: number
  evaluation?: string
}

export interface FundamentalScoreDetail {
  ticker: string
  bankName: string
  quarter: string
  score: number
  status: StatusType | "STABLE" | "WARNING" | "CRITICAL" | "Stabil" | "Waspada" | "Perhatian Khusus"
  percentile: string
  nimScore: number
  ldrScore: number
  loanGrowthScore: number
  depositGrowthScore: number
  roeScore: number
  profitConsistencyScore: number
  dividendScore: number
  dimensions: FundamentalDimension[]
  financialMetrics: {
    nim: string
    ldr: string
    roe: string
    npl: string
    casa: string
    loanGrowthYoY: string
    depositGrowthYoY: string
  }
}

export interface ScreenerBankItem {
  ticker: string
  name: string
  category: string
  score: number
  nim: number
  ldr: number
  loanGrowth: number
  roe: number
  dividend: number
  status: StatusType | "STABLE" | "WARNING" | "CRITICAL" | "Stabil" | "Waspada" | "Perhatian Khusus"
}

