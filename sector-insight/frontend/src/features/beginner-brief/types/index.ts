export interface FaqItem {
  question: string
  answer: string
}

export interface BeginnerBrief {
  ticker: string
  company_name: string
  health_badge: string
  health_color: string
  health_score: number
  tldr_summary: string
  pros: string[]
  cons: string[]
  investor_fit: string[]
  faq_items: FaqItem[]
  last_updated: string
}

export interface GlossaryItem {
  term: string
  simple_name: string
  analogy: string
  category: string
}

export interface GlossaryResponse {
  total: number
  items: GlossaryItem[]
}

