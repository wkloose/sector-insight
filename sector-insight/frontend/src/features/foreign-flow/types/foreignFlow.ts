import { Broker } from "@/src/entities/broker"

export interface DailyFlowPoint {
  date: string
  displayDate: string
  netFlow: number
  zScore: number
  isAnomaly: boolean
  anomalyType?: "inflow" | "outflow"
  dominantBroker?: string
}

export interface AnomalyRecord {
  id: string
  date: string
  displayDate: string
  netFlow: number
  netFlowFormatted: string
  zScore: number
  dominantBroker: Broker
  action: "Net Buy" | "Net Sell"
  isExtreme?: boolean
}

export interface BrokerComposition {
  institutionalForeignPercent: number
  retailDomesticPercent: number
  top3Concentration: number
  top3Brokers: string[]
}

export interface ForeignFlowDetail {
  ticker: string
  bankName: string
  yesterdayFlow: number
  yesterdayZScore: number
  yesterdayAnomalyStatus: string
  baselineMean90d: number
  standardDeviation: number
  totalNetFlow90d: number
  totalNetFlowFormatted: string
  anomalyCount90d: number
  inflowAnomalyCount: number
  outflowAnomalyCount: number
  flowPoints: DailyFlowPoint[]
  anomalies14d: AnomalyRecord[]
  composition14d: BrokerComposition
  synthesisSentence: string
  synthesisConfidence: number
}

