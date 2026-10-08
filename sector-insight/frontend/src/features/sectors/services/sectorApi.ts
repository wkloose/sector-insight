import { API_BASE_URL } from "@/src/shared/lib/constants"
import { SectorItem, SectorNewsItem, SectorOverview, SectorRotationAlert, SectorStockItem } from "../types"

export const MOCK_SECTOR_STOCKS: Record<string, SectorStockItem[]> = {
  energy: [
    { ticker: "ADRO", name: "PT Alamtri Resources Indonesia Tbk", subsector: "oil-gas-coal", price: 2600, change_percent: 3.8, change: 95, market_cap: 83000000000000, fundamental_score: 80.0, health_status: "Sangat Sehat", volume: 26192100, status: "Stabil" },
    { ticker: "PTBA", name: "PT Bukit Asam Tbk", subsector: "oil-gas-coal", price: 3380, change_percent: 2.9, change: 95, market_cap: 38900000000000, fundamental_score: 78.5, health_status: "Sehat", volume: 34327600, status: "Stabil" },
    { ticker: "MEDC", name: "PT Medco Energi Internasional Tbk", subsector: "oil-gas-coal", price: 1460, change_percent: 2.4, change: 35, market_cap: 36700000000000, fundamental_score: 71.5, health_status: "Sehat", volume: 27624300, status: "Stabil" },
    { ticker: "PGAS", name: "PT Perusahaan Gas Negara Tbk", subsector: "oil-gas-coal", price: 1420, change_percent: 1.1, change: 15, market_cap: 34400000000000, fundamental_score: 80.5, health_status: "Sangat Sehat", volume: 11822100, status: "Stabil" },
    { ticker: "AKRA", name: "PT AKR Corporindo Tbk", subsector: "alternative-energy", price: 1500, change_percent: 0.7, change: 10, market_cap: 30100000000000, fundamental_score: 74.5, health_status: "Sehat", volume: 6235500, status: "Stabil" },
    { ticker: "ELSA", name: "PT Elnusa Tbk", subsector: "alternative-energy", price: 470, change_percent: -0.8, change: -4, market_cap: 3400000000000, fundamental_score: 77.5, health_status: "Sehat", volume: 9800000, status: "Netral" },
  ],
  financials: [
    { ticker: "BBCA", name: "PT Bank Central Asia Tbk", subsector: "banks", price: 6050, change_percent: 1.5, change: 90, market_cap: 1263000000000000, fundamental_score: 84.8, health_status: "Sangat Sehat", volume: 85200000, status: "Stabil" },
    { ticker: "BMRI", name: "PT Bank Mandiri (Persero) Tbk", subsector: "banks", price: 5400, change_percent: 1.2, change: 65, market_cap: 504000000000000, fundamental_score: 85.0, health_status: "Sangat Sehat", volume: 62100000, status: "Stabil" },
    { ticker: "BBRI", name: "PT Bank Rakyat Indonesia Tbk", subsector: "banks", price: 3820, change_percent: -0.8, change: -30, market_cap: 578000000000000, fundamental_score: 81.7, health_status: "Sangat Sehat", volume: 94000000, status: "Netral" },
    { ticker: "BBNI", name: "PT Bank Negara Indonesia Tbk", subsector: "banks", price: 4400, change_percent: 0.5, change: 20, market_cap: 164000000000000, fundamental_score: 63.2, health_status: "Sehat", volume: 31200000, status: "Stabil" },
    { ticker: "BRIS", name: "PT Bank Syariah Indonesia Tbk", subsector: "banks", price: 1415, change_percent: 2.1, change: 30, market_cap: 65200000000000, fundamental_score: 81.9, health_status: "Sangat Sehat", volume: 22400000, status: "Stabil" },
    { ticker: "BDMN", name: "PT Bank Danamon Indonesia Tbk", subsector: "banks", price: 2710, change_percent: 0.4, change: 10, market_cap: 26500000000000, fundamental_score: 70.0, health_status: "Sehat", volume: 5400000, status: "Stabil" },
  ],
  "basic-materials": [
    { ticker: "ANTM", name: "PT Aneka Tambang Tbk", subsector: "basic-materials", price: 1530, change_percent: 2.1, change: 30, market_cap: 36700000000000, fundamental_score: 73.8, health_status: "Sehat", volume: 45000000, status: "Stabil" },
    { ticker: "MDKA", name: "PT Merdeka Copper Gold Tbk", subsector: "basic-materials", price: 2340, change_percent: 1.8, change: 40, market_cap: 56400000000000, fundamental_score: 68.5, health_status: "Sehat", volume: 28000000, status: "Stabil" },
    { ticker: "INCO", name: "PT Vale Indonesia Tbk", subsector: "basic-materials", price: 3890, change_percent: 1.1, change: 40, market_cap: 38600000000000, fundamental_score: 75.0, health_status: "Sehat", volume: 14000000, status: "Stabil" },
  ],
  infrastructures: [
    { ticker: "TLKM", name: "PT Telkom Indonesia Tbk", subsector: "telecommunication", price: 2320, change_percent: 1.4, change: 30, market_cap: 229000000000000, fundamental_score: 83.7, health_status: "Sangat Sehat", volume: 88000000, status: "Stabil" },
    { ticker: "ISAT", name: "PT Indosat Tbk", subsector: "telecommunication", price: 2280, change_percent: 0.9, change: 20, market_cap: 73000000000000, fundamental_score: 78.0, health_status: "Sehat", volume: 18000000, status: "Stabil" },
    { ticker: "JSMR", name: "PT Jasa Marga Tbk", subsector: "transportation-infrastructure", price: 4720, change_percent: 0.5, change: 20, market_cap: 34200000000000, fundamental_score: 72.0, health_status: "Sehat", volume: 11000000, status: "Stabil" },
  ],
  "consumer-non-cyclicals": [
    { ticker: "ICBP", name: "PT Indofood CBP Sukses Makmur Tbk", subsector: "food-beverage", price: 11800, change_percent: 0.8, change: 100, market_cap: 137000000000000, fundamental_score: 86.1, health_status: "Sangat Sehat", volume: 9200000, status: "Stabil" },
    { ticker: "AMRT", name: "PT Sumber Alfaria Trijaya Tbk", subsector: "food-staples-retailing", price: 3120, change_percent: 0.2, change: 10, market_cap: 129000000000000, fundamental_score: 82.0, health_status: "Sangat Sehat", volume: 14500000, status: "Stabil" },
    { ticker: "INDF", name: "PT Indofood Sukses Makmur Tbk", subsector: "food-beverage", price: 7300, change_percent: -0.5, change: -40, market_cap: 64100000000000, fundamental_score: 80.0, health_status: "Sangat Sehat", volume: 8900000, status: "Netral" },
  ],
  technology: [
    { ticker: "GOTO", name: "PT GoTo Gojek Tokopedia Tbk", subsector: "software-it-services", price: 72, change_percent: -2.4, change: -2, market_cap: 86000000000000, fundamental_score: 46.8, health_status: "Cukup", volume: 450000000, status: "Perhatian" },
    { ticker: "BUKA", name: "PT Bukalapak.com Tbk", subsector: "software-it-services", price: 118, change_percent: -3.1, change: -4, market_cap: 12100000000000, fundamental_score: 52.0, health_status: "Cukup", volume: 82000000, status: "Perhatian" },
    { ticker: "BELI", name: "PT Global Digital Niaga Tbk", subsector: "software-it-services", price: 440, change_percent: -1.8, change: -8, market_cap: 52000000000000, fundamental_score: 55.0, health_status: "Cukup", volume: 12000000, status: "Perhatian" },
  ],
  "properties-real-estate": [
    { ticker: "BSDE", name: "PT Bumi Serpong Damai Tbk", subsector: "properties-real-estate", price: 1060, change_percent: -2.1, change: -25, market_cap: 22400000000000, fundamental_score: 64.0, health_status: "Sehat", volume: 19000000, status: "Perhatian" },
    { ticker: "CTRA", name: "PT Ciputra Development Tbk", subsector: "properties-real-estate", price: 1120, change_percent: -1.8, change: -20, market_cap: 20700000000000, fundamental_score: 71.3, health_status: "Sehat", volume: 15000000, status: "Perhatian" },
    { ticker: "PWON", name: "PT Pakuwon Jati Tbk", subsector: "properties-real-estate", price: 420, change_percent: -1.5, change: -6, market_cap: 20200000000000, fundamental_score: 66.0, health_status: "Sehat", volume: 24000000, status: "Perhatian" },
  ],
}

export const FALLBACK_SECTOR_STOCKS = MOCK_SECTOR_STOCKS

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
    total_companies: 82,
    avg_fundamental_score: 80.5,
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
    total_companies: 104,
    avg_fundamental_score: 78.0,
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
    total_companies: 96,
    avg_fundamental_score: 72.5,
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
    total_companies: 65,
    avg_fundamental_score: 76.0,
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
    total_companies: 112,
    avg_fundamental_score: 82.0,
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
    total_companies: 32,
    avg_fundamental_score: 74.0,
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
    total_companies: 58,
    avg_fundamental_score: 70.0,
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
    total_companies: 135,
    avg_fundamental_score: 66.0,
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
    total_companies: 42,
    avg_fundamental_score: 64.0,
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
    total_companies: 41,
    avg_fundamental_score: 54.0,
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
    total_companies: 90,
    avg_fundamental_score: 58.0,
  },
]

export interface SectorMoversResponse {
  sector_slug: string
  top_movers: string[]
}

export async function getSectors(): Promise<SectorItem[]> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/sectors`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.sectors
      if (Array.isArray(list) && list.length > 0) return list
    }
  } catch {
  }
  return MOCK_SECTORS
}

export const getAllSectors = getSectors

export async function getSectorRanking(): Promise<SectorItem[]> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/sectors/ranking`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.sectors
      if (Array.isArray(list) && list.length > 0) return list
    }
  } catch {
  }
  return [...MOCK_SECTORS].sort((a, b) => b.smrs_score - a.smrs_score)
}

export async function getSectorOverview(slug: string): Promise<SectorOverview> {
  const lowerSlug = slug.toLowerCase()
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/sectors/${lowerSlug}`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      if (!data.stocks || data.stocks.length === 0) {
        data.stocks = FALLBACK_SECTOR_STOCKS[lowerSlug] || []
      }
      return data
    }
  } catch {
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
    stocks: FALLBACK_SECTOR_STOCKS[lowerSlug] || [],
  }
}

export async function getSectorStocks(
  slug: string,
  subsector?: string
): Promise<SectorStockItem[]> {
  const lowerSlug = slug.toLowerCase()
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const url = new URL(`${baseUrl}/api/v1/sectors/${lowerSlug}/stocks`)
    if (subsector) {
      url.searchParams.set("sub_sector", subsector)
    }
    const res = await fetch(url.toString(), { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.stocks) && data.stocks.length > 0) {
        return data.stocks
      }
    }
  } catch {
  }
  const fallback = FALLBACK_SECTOR_STOCKS[lowerSlug] || []
  if (subsector) {
    return fallback.filter((s) => s.subsector.toLowerCase().includes(subsector.toLowerCase()))
  }
  return fallback
}

export async function getSectorMovers(slug: string): Promise<string[]> {
  const lowerSlug = slug.toLowerCase()
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/sectors/${lowerSlug}/movers`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.top_movers)) return data.top_movers
    }
  } catch {
  }

  const found = MOCK_SECTORS.find((s) => s.sector_slug === lowerSlug)
  return found ? found.top_movers : []
}

export async function getSectorNews(
  slug: string,
  subsector?: string,
  limit: number = 10
): Promise<SectorNewsItem[]> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const url = new URL(`${baseUrl}/api/v1/sectors/${slug.toLowerCase()}/news`)
    if (subsector) url.searchParams.set("sub_sector", subsector)
    url.searchParams.set("limit", limit.toString())

    const res = await fetch(url.toString(), { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) return data
    }
  } catch {
  }

  return [
    {
      id: "news-fallback-1",
      title: `Kajian Terkini Rotasi Modal Sektoral: ${slug.toUpperCase()}`,
      snippet: `Dinamika transaksi investor institusional domestik dan global menunjukkan sinyal konsolidasi pada konstituen unggulan sektor ${slug}.`,
      url: "https://idx.co.id",
      publish_date: new Date().toISOString(),
      tags: [slug, "momentum", "rotasi"],
    },
  ]
}

export async function getSectorAlerts(): Promise<SectorRotationAlert[]> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/sectors/alerts`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.alerts
      if (Array.isArray(list) && list.length > 0) return list
    }
  } catch {
  }

  return [
    {
      alert_type: "ROTATION_SURGE",
      severity: "HIGH",
      headline: "Rotasi Modal Masif: Arus Dana Masuk Agresif ke Sektor Energi",
      summary:
        "Terdeteksi lonjakan SMRS Sektor Energi (+21.4 poin dalam sepekan) dengan akumulasi asing Rp 480.5 Miliar, menyerap rotasi modal keluar dari Sektor Properti dan Teknologi.",
      source_sector: "properties-real-estate",
      target_sector: "energy",
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      alert_type: "SMART_MONEY_EXIT",
      severity: "WARNING",
      headline: "Peringatan Distribusi Sektoral: Sektor Properti Tertekan Outflow Asing",
      summary:
        "Sektor Properti mencatat Net Foreign Outflow -Rp 142.0 Miliar dengan pelemahan tren 7-hari (-8.1%). Sentimen suku bunga tinggi menekan minat investor institusional.",
      source_sector: "properties-real-estate",
      created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
  ]
}
