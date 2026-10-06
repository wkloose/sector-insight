import { StatusType } from "@/src/shared/types/common"

export interface CompositeAlert {
  id: string
  ticker: string
  bankName: string
  timestamp: string
  timeAgo: string
  headline: string
  summary: string
  status: StatusType | "STABLE" | "WARNING" | "CRITICAL" | "Stabil" | "Waspada" | "Perhatian Khusus"
  zScore: number
  fundamentalScore: number
  policyExposure: number
  confidence: number
  recommendedAction?: string
}

export interface AlertFeedItem {
  id: string
  ticker: string
  bankName: string
  timestamp: string
  timeAgo: string
  title: string
  description: string
  status: StatusType | "STABLE" | "WARNING" | "CRITICAL" | "Stabil" | "Waspada" | "Perhatian Khusus"
  zScore: number
  fundamentalScore: number
  policyExposure: number
  triggerPillars: ("fundamental" | "sentiment" | "foreign_flow")[]
}

