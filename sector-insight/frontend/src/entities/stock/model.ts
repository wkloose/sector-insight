import { StatusType } from "@/src/shared/types/common"

export interface StockPillarMetrics {
  nimScore: number
  sentimentScore: number
  sentimentTrend?: number[]
  foreignFlowLabel: string
  foreignFlowStatus?: "inflow" | "outflow" | "normal"
}

export interface Stock {
  ticker: string
  name: string
  subsector: string
  category: string
  sector?: string
  price: number
  priceChange: number
  fundamentalScore: number
  status: StatusType | "STABLE" | "WARNING" | "CRITICAL" | "Stabil" | "Waspada" | "Perhatian Khusus"
  analystCoverage?: number
  pillarMetrics?: StockPillarMetrics
  isAlertTrigger?: boolean
  alertMessage?: string
}
