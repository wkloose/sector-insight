export interface StockCompareProfile {
  ticker: string
  name: string
  sector: string
  price: number
  change_percent: number
  market_cap: number
  pe: number
  pbv: number
  roe: number
  fundamental_score: number
  health_status: string
  net_foreign_flow: number
  foreign_z_score: number
  foreign_anomaly: string
  sentiment_score: number
  sentiment_label: string
  nim?: string
  ldr?: string
  loanGrowth?: string
  depositGrowth?: string
  dominantBroker?: string
  topBrokers?: string[]
}

export interface StockRankVerdict {
  ticker: string
  rank: number
  title: string
  score: number
  strengths: string[]
  risks: string[]
  investor_fit: string
}

export interface CompareAIResponse {
  executive_summary: string
  verdict_winner: string
  verdict_rationale: string
  rankings: StockRankVerdict[]
  pillar1_fundamental_comparison: string
  pillar2_foreign_flow_comparison: string
  pillar3_sentiment_comparison: string
  actionable_recommendations: string[]
  confidence_score: number
}

export interface SectorPreset {
  label: string
  sectorName: string
  tickers: string[]
  icon: string
}
