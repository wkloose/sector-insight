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

export interface SectorFlowItem {
  sector_slug: string
  sector_name: string
  net_flow: number
  status: string
}

export interface MarketHistoryPoint {
  date: string
  net_flow: number
  cumulative_flow: number
}

export interface TopFlowStock {
  ticker: string
  name: string
  sector: string
  price: number
  change_percent: number
  net_flow: number
  dominant_broker: string
}

export interface MarketForeignFlowSummary {
  total_net_flow_today: number
  total_foreign_buy: number
  total_foreign_sell: number
  foreign_participation_percent: number
  net_flow_7d: number
  net_flow_30d: number
  net_flow_90d: number
  sector_breakdown: SectorFlowItem[]
  history_30d: MarketHistoryPoint[]
  top_accumulated: TopFlowStock[]
  top_distributed: TopFlowStock[]
}

export interface StockForeignFlowItem {
  ticker: string
  name: string
  sector: string
  price: number
  change_percent: number
  net_foreign_flow: number
  foreign_buy: number
  foreign_sell: number
  z_score: number
  anomaly_status: string
  accumulation_status: string
  dominant_broker: string
}
