export interface SentimentArticle {
  id: string
  title: string
  source: string
  publishedAt: string
  author?: string
  url: string
  category: "company_specific" | "macro_policy"
  categoryLabel: string
  sentimentScore: number
  sentimentLabel: string
  confidence: number
  decayWeight: number
  affectedEntities: string
  reasoning: string
  quote: string
  timeDecayLabel: string
  ticker?: string
}

export interface SentimentData {
  ticker: string
  companySentimentScore: number
  companySentimentLabel: string
  policyExposureScore: number
  policyExposureLabel: string
  totalArticles: number
  companyArticlesCount: number
  policyArticlesCount: number
  averageConfidence: number
  sampleTrend7d?: number[]
  dominantIssue?: string
  dominantRegulation?: string
  articles: SentimentArticle[]
}
