import { StatusType } from "@/src/shared/types/common"

export interface WatchedStock {
  ticker: string
  name: string
  subsector: string
  category: string
  addedAt: string
  ingestionStatus: "Lengkap" | "Sinkronisasi" | "Tertunda"
  ingestionDetail?: string
  fundamentalScore: number
  status: StatusType | "STABLE" | "WARNING" | "CRITICAL" | "Stabil" | "Waspada" | "Perhatian Khusus"
  price: number
  priceChange: number
}

export interface SearchStockResult {
  ticker: string
  name: string
  subsector: string
  category: string
  price: number
  priceChange: number
  pbv?: number
  per?: number
  isWatched: boolean
}

export interface IngestionWorkerStatus {
  id: string
  name: string
  title: string
  status: "connected" | "running" | "idle" | "error"
  statusLabel: string
  meta: string
  description: string
  footerLeft: string
  footerRight: string
  icon: string
}

export interface WatchlistAlertConfig {
  zScoreThreshold: number
  fundamentalLowThreshold: number
  fundamentalHighThreshold: number
  policyExposureThreshold: number
}

