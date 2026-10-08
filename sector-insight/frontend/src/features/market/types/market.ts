export interface MarketSummary {
  ihsg_index: number | string
  ihsg_change?: number
  ihsg_change_percent: number | string
  ihsg_change_points?: number | string
  ihsg_status?: string
  total_foreign_flow?: number
  total_foreign_flow_idr?: number
  total_foreign_flow_formatted: string
  top_sector?: string
  sector_leader?: string
  leading_sector?: string
  active_sector?: string
  market_status?: string
  market_status_text?: string
  market_session?: string
  market_time?: string
  wib_time?: string
  updated_at?: string
}

export interface StockQuote {
  id?: number
  ticker: string
  name?: string
  sector?: string
  price: number
  change?: number
  change_percent: number
  coverage?: number
  analyst_coverage?: number
  analystCoverage?: number
  volume?: number
  high_52w?: number
  low_52w?: number
  market_cap?: number
  pe?: number
  pbv?: number
}
