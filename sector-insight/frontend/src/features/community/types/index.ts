export type SentimentTag = "BULLISH" | "BEARISH" | "NEUTRAL"
export type SortOrder = "hot" | "top" | "new" | "controversial"

export interface CommunityPost {
  id: number
  user_id: number
  username: string
  user_badge: string
  user_karma: number
  ticker: string
  title: string
  content: string
  sentiment_tag: SentimentTag
  upvotes: number
  downvotes: number
  weighted_score: number
  hot_rank: number
  comment_count: number
  created_at: string
}

export interface CrowdSentiment {
  ticker: string
  sentiment_score: number
  bullish_percent: number
  bearish_percent: number
  total_posts: number
  discussion_velocity_zscore: number
  divergence_status: string
  top_bullish_arguments: string[]
  top_bearish_arguments: string[]
  updated_at: string
}

export interface CommunityAlert {
  ticker: string
  alert_type: string
  severity: "CRITICAL" | "WARNING" | "OPPORTUNITY"
  headline: string
  crowd_summary: string
  foreign_summary: string
  synthesis: string
  created_at: string
}

