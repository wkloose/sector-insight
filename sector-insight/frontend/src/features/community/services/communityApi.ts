import { API_BASE_URL } from "@/src/shared/lib/constants"
import { sanitizeTicker, sanitizeTextInput } from "@/src/shared/lib/security"
import { CommunityAlert, CommunityPost, CrowdSentiment, SortOrder } from "../types"

export const MOCK_COMMUNITY_POSTS: Record<string, CommunityPost[]> = {
  BBRI: [
    {
      id: 1,
      user_id: 1,
      username: "analis_pasar",
      user_badge: "Top Analyst",
      user_karma: 850,
      ticker: "BBRI",
      title: "Analisis Margin Bunga & Kualitas Kredit Mikro Pasca Rilis Kuartal III",
      content:
        "Meskipun ada sentimen BI-Rate menahan penurunan suku bunga, CASA BBRI bertahan di 63.4%. Penyaluran Kupedes masih tumbuh dobel digit. Support kuat di 4.700 sangat menarik untuk DCA jangka panjang.",
      sentiment_tag: "BULLISH",
      upvotes: 142,
      downvotes: 12,
      weighted_score: 125.4,
      hot_rank: 24.8,
      comment_count: 34,
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
    {
      id: 2,
      user_id: 2,
      username: "investor_cerdas",
      user_badge: "Verified Retail",
      user_karma: 420,
      ticker: "BBRI",
      title: "Waspadai Tekanan Jual Broker Asing CS & ZP di BBRI Hari Ini",
      content:
        "Secara teknikal terlihat pantulan, tapi broker summary menunjukkan distribusi masif dari asing. Jangan buru-buru all-in sebelum ada konfirmasi foreign flow net buy.",
      sentiment_tag: "BEARISH",
      upvotes: 58,
      downvotes: 6,
      weighted_score: 49.2,
      hot_rank: 9.4,
      comment_count: 19,
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
    {
      id: 3,
      user_id: 3,
      username: "trader_santai",
      user_badge: "Member",
      user_karma: 110,
      ticker: "BBRI",
      title: "Dividen yield BBRI tahun ini berpotensi tembus 7% pada harga sekarang",
      content:
        "Dengan dividend payout ratio konsisten di atas 80% laba bersih dan valuasi PBV yang terkoreksi, ini kesempatan bagus untuk dividend hunter.",
      sentiment_tag: "BULLISH",
      upvotes: 89,
      downvotes: 5,
      weighted_score: 78.5,
      hot_rank: 12.1,
      comment_count: 15,
      created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
  ],
  BBCA: [
    {
      id: 4,
      user_id: 1,
      username: "analis_pasar",
      user_badge: "Top Analyst",
      user_karma: 850,
      ticker: "BBCA",
      title: "Koreksi Wajar Saham BBCA Adalah Peluang Akumulasi Emas",
      content:
        "Penurunan tipis BBCA pekan ini lebih karena rebalancing portofolio institusi global, bukan karena pemburukan fundamental. ROE 22% dan LDR 81% adalah jaminan ketahanan krisis.",
      sentiment_tag: "BULLISH",
      upvotes: 96,
      downvotes: 4,
      weighted_score: 89.0,
      hot_rank: 18.5,
      comment_count: 22,
      created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    {
      id: 5,
      user_id: 3,
      username: "trader_santai",
      user_badge: "Member",
      user_karma: 110,
      ticker: "BBCA",
      title: "Kekhawatiran Aturan Likuiditas OJK Bikin Sebagian Ritel Panik Jual",
      content:
        "Banyak forum ritel heboh rumor pengetatan likuiditas perbankan. Padahal BBCA punya likuiditas paling tebal di kelasnya, justru asing terdeteksi akumulasi diam-diam.",
      sentiment_tag: "BEARISH",
      upvotes: 31,
      downvotes: 8,
      weighted_score: 21.5,
      hot_rank: 3.8,
      comment_count: 11,
      created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
  ],
}

export const MOCK_CROWD_SENTIMENTS: Record<string, CrowdSentiment> = {
  BBRI: {
    ticker: "BBRI",
    sentiment_score: 0.72,
    bullish_percent: 88.0,
    bearish_percent: 12.0,
    total_posts: 48,
    discussion_velocity_zscore: 3.1,
    divergence_status: "EUPHORIA_DIVERGENCE",
    top_bullish_arguments: [
      "Dividen payout ratio konsisten di atas 80% dengan yield sangat tinggi",
      "Penyaluran kredit mikro & Kupedes masih tumbuh kuat di atas 10%",
      "Valuasi PBV mendekati standar deviasi minus satu historis",
    ],
    top_bearish_arguments: [
      "Distribusi penjualan masif oleh broker institusi asing CS & ZP",
      "Kekhawatiran pemburukan kredit UMKM pasca normalisasi restrukturisasi",
      "Suku bunga BI-Rate yang lama bertahan di level tinggi",
    ],
    updated_at: new Date().toISOString(),
  },
  BBCA: {
    ticker: "BBCA",
    sentiment_score: -0.65,
    bullish_percent: 26.0,
    bearish_percent: 74.0,
    total_posts: 35,
    discussion_velocity_zscore: 2.1,
    divergence_status: "PANIC_DIVERGENCE",
    top_bullish_arguments: [
      "Mesin laba teruji paling efisien di Asia Tenggara dengan ROE > 22%",
      "Akumulasi agresif oleh institusi asing memanfaatkan diskon harga",
      "CASA murah 81% membuat biaya modal hampir tidak terpengaruh suku bunga",
    ],
    top_bearish_arguments: [
      "Kepanikan ritel terhadap rumor pengetatan rasio likuiditas OJK",
      "Valuasi PBV premium yang dianggap sebagian ritel sudah mahal",
      "Potensi perlambatan pertumbuhan kredit korporasi",
    ],
    updated_at: new Date().toISOString(),
  },
}

export async function getCommunityPosts(
  ticker?: string,
  sort: SortOrder = "hot",
  limit: number = 20
): Promise<CommunityPost[]> {
  const cleanTicker = ticker ? sanitizeTicker(ticker) : null
  const validSorts: SortOrder[] = ["hot", "top", "new", "controversial"]
  const safeSort = validSorts.includes(sort) ? sort : "hot"
  const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 100)
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"

  try {
    const url = new URL(`${baseUrl}/api/v1/community/posts`)
    if (cleanTicker) url.searchParams.set("ticker", cleanTicker)
    url.searchParams.set("sort", safeSort)
    url.searchParams.set("limit", safeLimit.toString())

    const res = await fetch(url.toString(), { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        if (data.length > 0) return data
        if (cleanTicker && MOCK_COMMUNITY_POSTS[cleanTicker]) {
          return MOCK_COMMUNITY_POSTS[cleanTicker]
        }
        return []
      }
    }
  } catch {
  }

  if (cleanTicker && MOCK_COMMUNITY_POSTS[cleanTicker]) {
    return MOCK_COMMUNITY_POSTS[cleanTicker]
  }
  return [...(MOCK_COMMUNITY_POSTS.BBRI || []), ...(MOCK_COMMUNITY_POSTS.BBCA || [])]
}

export async function getCrowdSentiment(ticker: string): Promise<CrowdSentiment> {
  const cleanTicker = sanitizeTicker(ticker) || "BBRI"
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"

  try {
    const res = await fetch(`${baseUrl}/api/v1/community/${encodeURIComponent(cleanTicker)}/sentiment`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data.sentiment_score === "number") {
        return data
      }
    }
  } catch {
  }

  if (MOCK_CROWD_SENTIMENTS[cleanTicker]) {
    return MOCK_CROWD_SENTIMENTS[cleanTicker]
  }

  return {
    ticker: cleanTicker,
    sentiment_score: 0.15,
    bullish_percent: 55.0,
    bearish_percent: 45.0,
    total_posts: 18,
    discussion_velocity_zscore: 0.8,
    divergence_status: "NORMAL",
    top_bullish_arguments: [
      "Fundamental keuangan solid dan stabil",
      "Likuiditas perbankan terjaga dalam batas aman",
    ],
    top_bearish_arguments: [
      "Volatilitas pasar modal global mempengaruhi pergerakan harga",
      "Suku bunga acuan menuntut pengelolaan marjin ketat",
    ],
    updated_at: new Date().toISOString(),
  }
}

export async function getCommunityAlerts(): Promise<CommunityAlert[]> {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/community/alerts`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      if (data && Array.isArray(data.alerts) && data.alerts.length > 0) return data.alerts
    }
  } catch {
  }

  return [
    {
      ticker: "BBRI",
      alert_type: "EUPHORIA_DIVERGENCE",
      severity: "CRITICAL",
      headline: "BBRI ⚠️ PERINGATAN DIVERGENSI: Euforia Komunitas Ritel vs Tekanan Distribusi Asing",
      crowd_summary: "Konsensus Komunitas: 88% Bullish (Skor Sentimen: +0.72, Diskusi melonjak 3.1x di atas normal)",
      foreign_summary: "Kondisi Asing: Anomali Outflow Ekstrem (-Rp 145 Miliar, Z-Score: -2.82σ) dipimpin broker asing CS & ZP",
      synthesis:
        "Mayoritas investor ritel menyerap tekanan jual broker institusional. Waspadai potensi jebakan likuiditas ritel (exit liquidity) di area support Rp 4.650.",
      created_at: new Date().toISOString(),
    },
    {
      ticker: "BBCA",
      alert_type: "PANIC_DIVERGENCE",
      severity: "OPPORTUNITY",
      headline: "BBCA 💡 PERINGATAN CAPITULATION: Kepanikan Ritel di Tengah Akumulasi Institusional Asing",
      crowd_summary: "Konsensus Komunitas: 74% Bearish (Sentimen Negatif -0.65 akibat kekhawatiran aturan likuiditas)",
      foreign_summary: "Kondisi Asing: Anomali Inflow Institusi Asing (+Rp 220 Miliar, Z-Score: +2.45σ) dipimpin broker AK",
      synthesis:
        "Sentimen ritel tertekan kepanikan jangka pendek, namun broker institusi memanfaatkan koreksi harga untuk akumulasi selektif. Fundamental emiten tetap solid (Skor: 88/100).",
      created_at: new Date().toISOString(),
    },
  ]
}

export async function createCommunityPost(data: {
  ticker: string
  title: string
  content: string
  sentiment_tag: "BULLISH" | "BEARISH" | "NEUTRAL"
  username?: string
}): Promise<CommunityPost> {
  const cleanTicker = sanitizeTicker(data.ticker) || "BBRI"
  const cleanTitle = sanitizeTextInput(data.title, 150)
  const cleanContent = sanitizeTextInput(data.content, 2000)
  const cleanUsername = sanitizeTextInput(data.username || "investor_ritel", 50)
  const validTags = ["BULLISH", "BEARISH", "NEUTRAL"]
  const cleanSentiment = validTags.includes(data.sentiment_tag) ? data.sentiment_tag : "NEUTRAL"

  const payload = {
    ticker: cleanTicker,
    title: cleanTitle,
    content: cleanContent,
    sentiment_tag: cleanSentiment,
    username: cleanUsername,
  }

  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/community/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
  }

  return {
    id: Date.now(),
    user_id: 999,
    username: cleanUsername,
    user_badge: "Member",
    user_karma: 10,
    ticker: cleanTicker,
    title: cleanTitle,
    content: cleanContent,
    sentiment_tag: cleanSentiment,
    upvotes: 1,
    downvotes: 0,
    weighted_score: 1.0,
    hot_rank: 0.1,
    comment_count: 0,
    created_at: new Date().toISOString(),
  }
}

export async function voteCommunityPost(
  postId: number,
  direction: 1 | -1 | 0,
  username?: string
): Promise<{ success: boolean; effective_score: number }> {
  const safePostId = Math.floor(Math.abs(Number(postId))) || 0
  const safeDirection: 1 | -1 | 0 = direction === 1 ? 1 : direction === -1 ? -1 : 0
  const safeUsername = sanitizeTextInput(username || "ritel_voter", 50)

  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/community/posts/${safePostId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction: safeDirection, username: safeUsername }),
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
  }
  return { success: true, effective_score: safeDirection * 1.5 }
}
