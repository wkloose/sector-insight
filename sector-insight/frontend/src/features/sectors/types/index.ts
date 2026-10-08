export type SectorStatus = "LEADING" | "IMPROVING" | "NEUTRAL" | "WEAKENING" | "LAGGING"

export interface SectorStockItem {
  ticker: string
  name: string
  subsector: string
  price: number
  change_percent: number
  change: number
  market_cap: number
  fundamental_score: number
  health_status: string
  volume: number
  status: string
}

export interface SectorItem {
  sector_slug: string
  sector_name: string
  subsectors: string[]
  smrs_score: number
  status: SectorStatus
  sentiment_score: number
  net_foreign_flow: number
  price_return_7d: number
  top_movers: string[]
  top_laggards?: string[]
  total_companies?: number
  avg_fundamental_score?: number
  market_cap_total?: number
}

export interface SectorHistoryPoint {
  date: string
  smrs_score: number
}

export interface SectorOverview extends SectorItem {
  catalyst: string
  history_30d: SectorHistoryPoint[]
  stocks?: SectorStockItem[]
}

export interface SectorNewsItem {
  id: string
  title: string
  snippet: string
  url: string
  publish_date: string
  tags?: string[]
}

export interface SectorRotationAlert {
  alert_type: string
  severity: string
  headline: string
  summary: string
  source_sector?: string
  target_sector?: string
  created_at: string
}
