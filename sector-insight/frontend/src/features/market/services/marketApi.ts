import { API_BASE_URL } from "@/src/shared/lib/constants"
import { MarketSummary, StockQuote } from "../types/market"

export function getWibTimeAndStatus(date: Date = new Date()) {
  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  const formattedTime = timeFormatter.format(date).replace(/\./g, ":") + " WIB"

  const partsFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  })
  const parts = partsFormatter.formatToParts(date)
  let hour = 0
  let minute = 0
  for (const p of parts) {
    if (p.type === "hour") {
      hour = parseInt(p.value, 10)
      if (hour === 24) hour = 0
    }
    if (p.type === "minute") {
      minute = parseInt(p.value, 10)
    }
  }

  const day = date.getDay()
  const totalMinutes = hour * 60 + minute

  let status = "Pasar Tutup"
  if (day >= 1 && day <= 4) {
    if (totalMinutes >= 540 && totalMinutes < 720) {
      status = "Sesi I Buka"
    } else if (totalMinutes >= 720 && totalMinutes < 810) {
      status = "Istirahat Pasar"
    } else if (totalMinutes >= 810 && totalMinutes < 950) {
      status = "Sesi II Buka"
    } else if (totalMinutes >= 950 && totalMinutes <= 975) {
      status = "Pra-Penutupan"
    } else {
      status = "Pasar Tutup"
    }
  } else if (day === 5) {
    if (totalMinutes >= 540 && totalMinutes < 690) {
      status = "Sesi I Buka"
    } else if (totalMinutes >= 690 && totalMinutes < 840) {
      status = "Istirahat Pasar"
    } else if (totalMinutes >= 840 && totalMinutes < 950) {
      status = "Sesi II Buka"
    } else if (totalMinutes >= 950 && totalMinutes <= 975) {
      status = "Pra-Penutupan"
    } else {
      status = "Pasar Tutup"
    }
  } else {
    status = "Pasar Tutup"
  }

  return {
    formattedTime,
    status,
    isOpen: status.includes("Buka"),
  }
}

export function computeLiveMarketSummary(base?: Partial<MarketSummary>): MarketSummary {
  const { formattedTime, status } = getWibTimeAndStatus()
  return {
    ihsg_index: base?.ihsg_index ?? 6031.28,
    ihsg_change: base?.ihsg_change ?? -115.44,
    ihsg_change_percent: base?.ihsg_change_percent ?? -1.88,
    ihsg_change_points: base?.ihsg_change_points ?? -115.44,
    ihsg_status: base?.ihsg_status ?? "BEARISH",
    total_foreign_flow: base?.total_foreign_flow ?? -194240000000,
    total_foreign_flow_idr: base?.total_foreign_flow_idr ?? -194240000000,
    total_foreign_flow_formatted: base?.total_foreign_flow_formatted || "-Rp 194 M",
    top_sector: base?.top_sector || base?.leading_sector || base?.sector_leader || "Barang Konsumen Primer (+0.37%)",
    sector_leader: base?.sector_leader || base?.leading_sector || "Barang Konsumen Primer (+0.37%)",
    leading_sector: base?.leading_sector || base?.top_sector || "Barang Konsumen Primer (+0.37%)",
    active_sector: base?.active_sector || "Perbankan Big 4",
    market_status: base?.market_status || status,
    market_status_text: base?.market_status_text || base?.market_status || status,
    market_session: base?.market_session || (status.includes("Buka") ? "Aktif" : "Nonaktif"),
    market_time: base?.market_time || formattedTime,
    wib_time: base?.wib_time || formattedTime,
    updated_at: base?.updated_at || new Date().toISOString(),
  }
}

export const DEFAULT_MARKET_SUMMARY: MarketSummary = {
  ihsg_index: 6031.28,
  ihsg_change: -115.44,
  ihsg_change_percent: -1.88,
  ihsg_change_points: -115.44,
  ihsg_status: "BEARISH",
  total_foreign_flow: -194240000000,
  total_foreign_flow_idr: -194240000000,
  total_foreign_flow_formatted: "-Rp 194 M",
  top_sector: "Barang Konsumen Primer (+0.37%)",
  sector_leader: "Barang Konsumen Primer (+0.37%)",
  leading_sector: "Barang Konsumen Primer (+0.37%)",
  active_sector: "Perbankan Big 4",
  market_status: "Sesi Berjalan",
  market_time: "16:00:00 WIB",
}

export const DEFAULT_STOCK_QUOTES: StockQuote[] = [
  {
    ticker: "BBCA",
    name: "PT Bank Central Asia Tbk",
    price: 6000,
    change: -100,
    change_percent: -1.64,
    coverage: 28,
    analyst_coverage: 28,
    analystCoverage: 28,
    volume: 113140000,
    market_cap: 740000000000000,
    pbv: 3.05,
    pe: 18.2,
  },
  {
    ticker: "BBRI",
    name: "PT Bank Rakyat Indonesia Tbk",
    price: 3030,
    change: -50,
    change_percent: -1.62,
    coverage: 28,
    analyst_coverage: 28,
    analystCoverage: 28,
    volume: 142300000,
    market_cap: 459000000000000,
    pbv: 1.82,
    pe: 9.1,
  },
  {
    ticker: "BMRI",
    name: "PT Bank Mandiri (Persero) Tbk",
    price: 4000,
    change: -30,
    change_percent: -0.74,
    coverage: 28,
    analyst_coverage: 28,
    analystCoverage: 28,
    volume: 98200000,
    market_cap: 373000000000000,
    pbv: 1.38,
    pe: 9.6,
  },
  {
    ticker: "BBNI",
    name: "PT Bank Negara Indonesia Tbk",
    price: 3410,
    change: -10,
    change_percent: -0.29,
    coverage: 28,
    analyst_coverage: 28,
    analystCoverage: 28,
    volume: 52100000,
    market_cap: 127000000000000,
    pbv: 0.96,
    pe: 7.4,
  },
  {
    ticker: "BRIS",
    name: "PT Bank Syariah Indonesia Tbk",
    price: 2850,
    change: -30,
    change_percent: -1.04,
    coverage: 18,
    analyst_coverage: 18,
    analystCoverage: 18,
    volume: 34500000,
    market_cap: 131000000000000,
    pbv: 2.65,
    pe: 19.5,
  },
  {
    ticker: "BBTN",
    name: "PT Bank Tabungan Negara (Persero) Tbk",
    price: 1050,
    change: -15,
    change_percent: -1.41,
    coverage: 16,
    analyst_coverage: 16,
    analystCoverage: 16,
    volume: 18200000,
    market_cap: 14800000000000,
    pbv: 0.47,
    pe: 4.7,
  },
  {
    ticker: "BNGA",
    name: "PT Bank CIMB Niaga Tbk",
    price: 1470,
    change: -10,
    change_percent: -0.68,
    coverage: 12,
    analyst_coverage: 12,
    analystCoverage: 12,
    volume: 9100000,
    market_cap: 36800000000000,
    pbv: 0.71,
    pe: 5.5,
  },
  {
    ticker: "BDMN",
    name: "PT Bank Danamon Indonesia Tbk",
    price: 2240,
    change: -10,
    change_percent: -0.44,
    coverage: 14,
    analyst_coverage: 14,
    analystCoverage: 14,
    volume: 8400000,
    market_cap: 21900000000000,
    pbv: 0.54,
    pe: 6.8,
  },
  {
    ticker: "BJBR",
    name: "Bank Pembangunan Daerah Jawa Barat dan Banten Tbk",
    price: 955,
    change: -5,
    change_percent: -0.52,
    coverage: 10,
    analyst_coverage: 10,
    analystCoverage: 10,
    volume: 5200000,
    market_cap: 9800000000000,
    pbv: 0.68,
    pe: 6.0,
  },
  {
    ticker: "BJTM",
    name: "Bank Pembangunan Daerah Jawa Timur Tbk",
    price: 515,
    change: -5,
    change_percent: -0.96,
    coverage: 8,
    analyst_coverage: 8,
    analystCoverage: 8,
    volume: 6100000,
    market_cap: 7700000000000,
    pbv: 0.64,
    pe: 5.7,
  },
]

export async function getMarketSummary(): Promise<MarketSummary> {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/market/summary`, {
      cache: "no-store",
    })
    if (res.ok) {
      const json = await res.json()
      const data = json.data || json
      if (data && (data.ihsg_index !== undefined || data.total_foreign_flow_formatted !== undefined)) {
        const liveInfo = getWibTimeAndStatus()
        return {
          ihsg_index: data.ihsg_index ?? 6031.28,
          ihsg_change: (() => {
            const raw = data.ihsg_change ?? data.ihsg_change_points
            if (typeof raw === "number") return raw
            return -115.44
          })(),
          ihsg_change_percent: (() => {
            const raw = data.ihsg_change_percent_float ?? data.ihsg_change_percent ?? data.ihsg_change
            if (typeof raw === "number") return raw
            if (typeof raw === "string") {
              const cleaned = raw.replace("%", "").replace("+", "").replace(",", ".")
              const parsed = parseFloat(cleaned)
              if (!isNaN(parsed)) return parsed
            }
            return -1.88
          })(),
          ihsg_change_points: data.ihsg_change_points ?? -115.44,
          ihsg_status: data.ihsg_status ?? "BEARISH",
          total_foreign_flow: data.total_foreign_flow ?? data.total_foreign_flow_idr ?? -194240000000,
          total_foreign_flow_idr: data.total_foreign_flow_idr ?? data.total_foreign_flow ?? -194240000000,
          total_foreign_flow_formatted:
            data.total_foreign_flow_formatted ||
            (typeof data.total_foreign_flow === "number"
              ? `${data.total_foreign_flow >= 0 ? "+" : "-"}Rp ${(Math.abs(data.total_foreign_flow) / 1e9).toFixed(0)} M`
              : "-Rp 194 M"),
          top_sector: data.top_sector || data.leading_sector || data.sector_leader || "Perbankan Big 4",
          sector_leader: data.sector_leader || data.leading_sector || "Perbankan Big 4",
          leading_sector: data.leading_sector || data.top_sector || "Perbankan Big 4",
          active_sector: data.active_sector || "Perbankan Big 4",
          market_status: data.market_status_text || data.market_status || liveInfo.status,
          market_status_text: data.market_status_text || data.market_status || liveInfo.status,
          market_session: data.market_session,
          market_time: data.wib_time || data.market_time || liveInfo.formattedTime,
          wib_time: data.wib_time || data.market_time || liveInfo.formattedTime,
          updated_at: data.updated_at || new Date().toISOString(),
        }
      }
    }
  } catch {
  }

  if (typeof window !== "undefined") {
    try {
      const localRes = await fetch("/api/v1/market/summary", { cache: "no-store" })
      if (localRes.ok) {
        const localJson = await localRes.json()
        const localData = localJson.data || localJson
        if (localData) return localData
      }
    } catch {
    }
  }

  return computeLiveMarketSummary()
}

export async function getStockQuotes(): Promise<StockQuote[]> {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/stocks/quotes`, {
      cache: "no-store",
    })
    if (res.ok) {
      const json = await res.json()
      const list = Array.isArray(json) ? json : json.data
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: StockQuote & Record<string, unknown>): StockQuote => {
          const cov = Number(item.coverage ?? item.analyst_coverage ?? item.analystCoverage ?? 28)
          return {
            id: item.id,
            ticker: String(item.ticker || ""),
            name: item.name ? String(item.name) : undefined,
            sector: item.sector ? String(item.sector) : undefined,
            price: Number(item.price ?? item.close ?? 0),
            change: Number(item.change ?? 0),
            change_percent: Number(item.change_percent ?? item.changePercent ?? 0),
            coverage: cov,
            analyst_coverage: cov,
            analystCoverage: cov,
            volume: item.volume !== undefined ? Number(item.volume) : undefined,
            high_52w: item.high_52w !== undefined ? Number(item.high_52w) : undefined,
            low_52w: item.low_52w !== undefined ? Number(item.low_52w) : undefined,
            market_cap: item.market_cap !== undefined ? Number(item.market_cap) : undefined,
            pe: item.pe !== undefined ? Number(item.pe) : undefined,
            pbv: item.pbv !== undefined ? Number(item.pbv) : undefined,
          }
        })
      }
    }
  } catch {
  }

  if (typeof window !== "undefined") {
    try {
      const localRes = await fetch("/api/v1/stocks/quotes", { cache: "no-store" })
      if (localRes.ok) {
        const localJson = await localRes.json()
        const localList = Array.isArray(localJson) ? localJson : localJson.data
        if (Array.isArray(localList) && localList.length > 0) return localList
      }
    } catch {
    }
  }

  return DEFAULT_STOCK_QUOTES
}
