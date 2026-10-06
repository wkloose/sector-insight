import { API_BASE_URL } from "@/src/shared/lib/constants"
import { SectorItem, SectorNewsItem, SectorOverview, SectorRotationAlert } from "../types"

export const MOCK_SECTORS: SectorItem[] = [
  {
    sector_slug: "energy",
    sector_name: "Energi (Energy)",
    subsectors: ["oil-gas-coal", "alternative-energy"],
    smrs_score: 84.6,
    status: "LEADING",
    sentiment_score: 0.72,
    net_foreign_flow: 480500000000,
    price_return_7d: 12.4,
    top_movers: ["ADRO (+3.8%)", "PTBA (+2.9%)", "MEDC (+2.4%)"],
  },
  {
    sector_slug: "financials",
    sector_name: "Keuangan (Financials)",
    subsectors: [
      "banks",
      "financing-service",
      "insurance",
      "investment-service",
      "holding-investment-companies",
    ],
    smrs_score: 76.2,
    status: "LEADING",
    sentiment_score: 0.45,
    net_foreign_flow: 320000000000,
    price_return_7d: 4.8,
    top_movers: ["BBCA (+1.5%)", "BMRI (+1.2%)", "BBRI (-0.8%)"],
  },
  {
    sector_slug: "basic-materials",
    sector_name: "Barang Baku (Basic Materials)",
    subsectors: ["basic-materials"],
    smrs_score: 68.4,
    status: "IMPROVING",
    sentiment_score: 0.38,
    net_foreign_flow: 110500000000,
    price_return_7d: 3.2,
    top_movers: ["ANTM (+2.1%)", "MDKA (+1.8%)", "INCO (+1.1%)"],
  },
  {
    sector_slug: "infrastructures",
    sector_name: "Infrastruktur (Infrastructures)",
    subsectors: [
      "telecommunication",
      "utilities",
      "heavy-constructions-civil-engineering",
      "transportation-infrastructure",
    ],
    smrs_score: 62.0,
    status: "IMPROVING",
    sentiment_score: 0.25,
    net_foreign_flow: 85000000000,
    price_return_7d: 2.1,
    top_movers: ["TLKM (+1.4%)", "ISAT (+0.9%)", "JSMR (+0.5%)"],
  },
  {
    sector_slug: "consumer-non-cyclicals",
    sector_name: "Konsumer Primer (Consumer Non-Cyclicals)",
    subsectors: [
      "food-beverage",
      "tobacco",
      "nondurable-household-products",
      "food-staples-retailing",
    ],
    smrs_score: 54.5,
    status: "NEUTRAL",
    sentiment_score: 0.1,
    net_foreign_flow: 24000000000,
    price_return_7d: -0.4,
    top_movers: ["ICBP (+0.8%)", "AMRT (+0.2%)", "INDF (-0.5%)"],
  },
  {
    sector_slug: "healthcare",
    sector_name: "Kesehatan (Healthcare)",
    subsectors: ["pharmaceuticals-health-care-research", "healthcare-equipment-providers"],
    smrs_score: 51.8,
    status: "NEUTRAL",
    sentiment_score: 0.05,
    net_foreign_flow: -12000000000,
    price_return_7d: 0.2,
    top_movers: ["KLBF (+0.4%)", "MIKA (-0.2%)", "SILO (-0.6%)"],
  },
  {
    sector_slug: "industrials",
    sector_name: "Perindustrian (Industrials)",
    subsectors: ["industrial-goods", "industrial-services", "multi-sector-holdings"],
    smrs_score: 48.0,
    status: "NEUTRAL",
    sentiment_score: -0.08,
    net_foreign_flow: -40000000000,
    price_return_7d: -1.2,
    top_movers: ["ASII (-0.8%)", "UNTR (-1.1%)"],
  },
  {
    sector_slug: "consumer-cyclicals",
    sector_name: "Konsumer Non-Primer (Consumer Cyclicals)",
    subsectors: [
      "media-entertainment",
      "leisure-goods",
      "household-goods",
      "consumer-services",
      "retailing",
      "automobiles-components",
      "apparel-luxury-goods",
    ],
    smrs_score: 42.1,
    status: "NEUTRAL",
    sentiment_score: -0.15,
    net_foreign_flow: -65000000000,
    price_return_7d: -1.8,
    top_movers: ["MAPI (-1.2%)", "ACES (-1.5%)"],
  },
  {
    sector_slug: "transportation-logistic",
    sector_name: "Transportasi & Logistik (Transportation & Logistics)",
    subsectors: ["transportation", "logistics-deliveries"],
    smrs_score: 38.5,
    status: "WEAKENING",
    sentiment_score: -0.22,
    net_foreign_flow: -80000000000,
    price_return_7d: -3.5,
    top_movers: ["BIRD (-1.4%)", "ASSA (-2.0%)", "SMDR (-2.5%)"],
  },
  {
    sector_slug: "technology",
    sector_name: "Teknologi (Technology)",
    subsectors: ["software-it-services", "technology-hardware-equipment"],
    smrs_score: 32.4,
    status: "WEAKENING",
    sentiment_score: -0.35,
    net_foreign_flow: -110000000000,
    price_return_7d: -5.4,
    top_movers: ["GOTO (-2.4%)", "BUKA (-3.1%)", "BELI (-1.8%)"],
  },
  {
    sector_slug: "properties-real-estate",
    sector_name: "Properti & Real Estat (Properties & Real Estate)",
    subsectors: ["properties-real-estate"],
    smrs_score: 28.2,
    status: "LAGGING",
    sentiment_score: -0.45,
    net_foreign_flow: -142000000000,
    price_return_7d: -8.1,
    top_movers: ["BSDE (-2.1%)", "CTRA (-1.8%)", "PWON (-1.5%)"],
  },
]

export async function getSectorRanking(): Promise<SectorItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/sectors/ranking`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) return data
    }
  } catch (err) {
    console.warn("[getSectorRanking] API call failed, fallback to mock:", err)
  }
  return [...MOCK_SECTORS].sort((a, b) => b.smrs_score - a.smrs_score)
}

export async function getSectorOverview(slug: string): Promise<SectorOverview> {
  const lowerSlug = slug.toLowerCase()
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/sectors/${lowerSlug}/overview`, {
      cache: "no-store",
    })
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn(`[getSectorOverview] API call failed for ${slug}, fallback to mock:`, err)
  }

  const found = MOCK_SECTORS.find((s) => s.sector_slug === lowerSlug) || MOCK_SECTORS[0]
  const history = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
    smrs_score: Math.round((found.smrs_score - (29 - i) * 0.2 + ((i % 5) - 2) * 1.5) * 10) / 10,
  }))

  return {
    ...found,
    catalyst:
      lowerSlug === "energy"
        ? "Lonjakan harga komoditas energi global & rilis pembagian dividen interim jumbo."
        : lowerSlug === "financials"
        ? "Pertumbuhan kredit korporasi dan ketahanan marjin bunga bersih (NIM) bank sistemik."
        : "Sentimen makroekonomi domestik dan rotasi aliran modal institusional.",
    history_30d: history,
  }
}

export async function getSectorNews(
  slug: string,
  subsector?: string,
  limit: number = 10
): Promise<SectorNewsItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/sectors/${slug.toLowerCase()}/news`)
    if (subsector) url.searchParams.set("sub_sector", subsector)
    url.searchParams.set("limit", limit.toString())

    const res = await fetch(url.toString(), { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) return data
    }
  } catch (err) {
    console.warn(`[getSectorNews] API call failed for ${slug}:`, err)
  }

  return [
    {
      id: "news-1",
      title: `Sentimen Rotasi Modal dan Prospek Pertumbuhan Sektor ${slug.toUpperCase()} 2026`,
      snippet: `Analisis mendalam mengenai faktor pendorong fundamental, tren suku bunga Bank Indonesia, dan pengaruhnya terhadap margin operasional konstituen sektor.`,
      url: "https://www.idx.co.id",
      publish_date: new Date().toISOString(),
    },
    {
      id: "news-2",
      title: `Arus Dana Investor Institusi Global Catat Posisi Baru di Sektor ${slug.toUpperCase()}`,
      snippet: `Data transaksi bursa menunjukkan rebalancing portofolio manajer investasi terkemuka memanfaatkan momentum valuasi saham berkapitalisasi besar.`,
      url: "https://www.bi.go.id",
      publish_date: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
  ]
}

export async function getSectorAlerts(): Promise<SectorRotationAlert[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/sectors/alerts`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.alerts)) return data.alerts
    }
  } catch (err) {
    console.warn("[getSectorAlerts] API call failed, fallback:", err)
  }

  return [
    {
      alert_type: "ROTATION_SURGE",
      severity: "HIGH",
      headline: "🚨 Rotasi Modal Masif: Arus Dana Masuk Agresif ke Sektor Energi",
      summary:
        "Terdeteksi lonjakan SMRS Sektor Energi (+21.4 poin dalam sepekan) dengan akumulasi asing Rp 480.5 Miliar, menyerap rotasi modal keluar dari Sektor Properti dan Teknologi.",
      source_sector: "properties-real-estate",
      target_sector: "energy",
      created_at: new Date().toISOString(),
    },
    {
      alert_type: "SMART_MONEY_EXIT",
      severity: "WARNING",
      headline: "⚠️ Peringatan Distribusi Sektoral: Sektor Properti Tertekan Outflow Asing",
      summary:
        "Sektor Properti mencatat Net Foreign Outflow -Rp 142.0 Miliar dengan pelemahan tren 7-hari (-8.1%). Sentimen suku bunga tinggi menekan minat investor institusional.",
      source_sector: "properties-real-estate",
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ]
}

