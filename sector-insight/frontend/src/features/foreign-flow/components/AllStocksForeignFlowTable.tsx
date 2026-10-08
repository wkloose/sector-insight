"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { StockForeignFlowItem } from "../types/foreignFlow"

interface AllStocksForeignFlowTableProps {
  stocks: StockForeignFlowItem[]
}

function formatFlow(val: number): string {
  const abs = Math.abs(val)
  const sign = val >= 0 ? "+" : "-"
  if (abs >= 1e12) {
    return `${sign}Rp ${(abs / 1e12).toFixed(2)} T`
  }
  if (abs >= 1e9) {
    return `${sign}Rp ${(abs / 1e9).toFixed(1)} M`
  }
  return `${sign}Rp ${abs.toLocaleString("id-ID")}`
}

function formatVol(val: number): string {
  if (val >= 1e12) {
    return `Rp ${(val / 1e12).toFixed(2)} T`
  }
  if (val >= 1e9) {
    return `Rp ${(val / 1e9).toFixed(1)} M`
  }
  return `Rp ${val.toLocaleString("id-ID")}`
}

const SECTOR_OPTIONS = [
  "ALL",
  "Keuangan",
  "Energi",
  "Barang Baku",
  "Infrastruktur",
  "Konsumen Primer",
  "Konsumen Non-Primer",
  "Kesehatan",
  "Perindustrian",
  "Teknologi",
  "Properti",
  "Transportasi",
]

export function AllStocksForeignFlowTable({
  stocks,
}: AllStocksForeignFlowTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("ALL")
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "inflow" | "outflow" | "anomaly">("ALL")
  const [sortBy, setSortBy] = useState<"net_flow" | "z_score" | "price" | "change_percent">("net_flow")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSorted = useMemo(() => {
    let list = [...stocks]

    if (selectedSector !== "ALL") {
      list = list.filter((s) =>
        s.sector.toLowerCase().includes(selectedSector.toLowerCase())
      )
    }

    if (selectedFilter === "inflow") {
      list = list.filter((s) => s.net_foreign_flow > 0)
    } else if (selectedFilter === "outflow") {
      list = list.filter((s) => s.net_foreign_flow < 0)
    } else if (selectedFilter === "anomaly") {
      list = list.filter((s) => Math.abs(s.z_score) >= 2.0 || s.anomaly_status !== "NORMAL")
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      list = list.filter(
        (s) =>
          s.ticker.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      let valA = a.net_foreign_flow
      let valB = b.net_foreign_flow

      if (sortBy === "net_flow") {
        valA = a.net_foreign_flow
        valB = b.net_foreign_flow
      } else if (sortBy === "z_score") {
        valA = Math.abs(a.z_score)
        valB = Math.abs(b.z_score)
      } else if (sortBy === "price") {
        valA = a.price
        valB = b.price
      } else if (sortBy === "change_percent") {
        valA = a.change_percent
        valB = b.change_percent
      }

      if (sortOrder === "asc") {
        return valA > valB ? 1 : -1
      }
      return valA < valB ? 1 : -1
    })

    return list
  }, [stocks, selectedSector, selectedFilter, searchTerm, sortBy, sortOrder])

  const stats = useMemo(() => {
    let inflowCount = 0
    let outflowCount = 0
    let anomalyCount = 0
    let totalNet = 0

    for (const s of stocks) {
      totalNet += s.net_foreign_flow
      if (s.net_foreign_flow > 0) inflowCount++
      if (s.net_foreign_flow < 0) outflowCount++
      if (Math.abs(s.z_score) >= 2.0 || s.anomaly_status !== "NORMAL") anomalyCount++
    }

    return {
      total: stocks.length,
      inflowCount,
      outflowCount,
      anomalyCount,
      totalNet,
    }
  }, [stocks])

  return (
    <div className="flex flex-col gap-space-md">
      <div className="p-space-lg rounded border border-border-subtle bg-surface-card flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode saham atau nama emiten (misal: BBCA, Telkom, ADRO)..."
              className="w-full bg-surface-container-lowest border border-border-subtle rounded pl-10 pr-4 py-2 font-body-sm text-[13px] text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`px-3 py-1.5 rounded font-caption text-caption font-semibold transition-colors ${
                selectedFilter === "ALL"
                  ? "bg-brand-red text-text-primary"
                  : "bg-surface-container text-text-secondary hover:text-text-primary"
              }`}
            >
              Semua Arus ({stats.total})
            </button>
            <button
              onClick={() => setSelectedFilter("inflow")}
              className={`px-3 py-1.5 rounded font-caption text-caption font-semibold transition-colors ${
                selectedFilter === "inflow"
                  ? "bg-data-bullish text-surface-container-lowest"
                  : "bg-surface-container text-text-secondary hover:text-text-primary"
              }`}
            >
              Akumulasi / Inflow ({stats.inflowCount})
            </button>
            <button
              onClick={() => setSelectedFilter("outflow")}
              className={`px-3 py-1.5 rounded font-caption text-caption font-semibold transition-colors ${
                selectedFilter === "outflow"
                  ? "bg-data-bearish text-text-primary"
                  : "bg-surface-container text-text-secondary hover:text-text-primary"
              }`}
            >
              Distribusi / Outflow ({stats.outflowCount})
            </button>
            <button
              onClick={() => setSelectedFilter("anomaly")}
              className={`px-3 py-1.5 rounded font-caption text-caption font-semibold transition-colors flex items-center gap-1 ${
                selectedFilter === "anomaly"
                  ? "bg-brand-red-soft text-brand-red border border-brand-red/40"
                  : "bg-surface-container text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              <span>Anomali Terdeteksi ({stats.anomalyCount})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 border-t border-border-subtle/50 pt-space-sm">
          <span className="font-caption text-caption text-text-secondary mr-2 shrink-0">
            Sektor:
          </span>
          {SECTOR_OPTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded font-caption text-[11px] whitespace-nowrap transition-colors ${
                selectedSector === sec
                  ? "bg-surface-container-high text-text-primary font-bold border border-border-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-container-lowest"
              }`}
            >
              {sec === "ALL" ? "Semua Sektor" : sec}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded border border-border-subtle bg-surface-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-sm text-[13px]">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-lowest/60 text-caption font-caption text-text-secondary uppercase">
                <th className="px-space-md py-space-sm">Emiten</th>
                <th className="px-space-md py-space-sm">Sektor</th>
                <th
                  className="px-space-md py-space-sm cursor-pointer hover:text-text-primary select-none text-right"
                  onClick={() => {
                    if (sortBy === "price") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    } else {
                      setSortBy("price")
                      setSortOrder("desc")
                    }
                  }}
                >
                  Harga (24h)
                </th>
                <th
                  className="px-space-md py-space-sm cursor-pointer hover:text-text-primary select-none text-right"
                  onClick={() => {
                    if (sortBy === "net_flow") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    } else {
                      setSortBy("net_flow")
                      setSortOrder("desc")
                    }
                  }}
                >
                  Arus Bersih Asing (Net Flow)
                </th>
                <th className="px-space-md py-space-sm text-right">
                  Foreign Buy / Sell
                </th>
                <th
                  className="px-space-md py-space-sm cursor-pointer hover:text-text-primary select-none text-center"
                  onClick={() => {
                    if (sortBy === "z_score") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    } else {
                      setSortBy("z_score")
                      setSortOrder("desc")
                    }
                  }}
                >
                  Z-Score 90H
                </th>
                <th className="px-space-md py-space-sm text-center">
                  Status Akumulasi
                </th>
                <th className="px-space-md py-space-sm text-center">
                  Broker Asing
                </th>
                <th className="px-space-md py-space-sm text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-space-md py-space-xl text-center text-text-secondary font-body-sm">
                    Tidak ada saham yang sesuai dengan filter pencarian arus asing.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((item) => {
                  const isPositive = item.net_foreign_flow >= 0
                  const isAnomaly = Math.abs(item.z_score) >= 2.0 || item.anomaly_status !== "NORMAL"

                  return (
                    <tr
                      key={item.ticker}
                      className="hover:bg-surface-container-low/60 transition-colors"
                    >
                      <td className="px-space-md py-space-md">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/foreign-activity/${item.ticker}`}
                              className="font-label-ticker text-[15px] font-bold text-text-primary hover:text-brand-red transition-colors"
                            >
                              {item.ticker}
                            </Link>
                            {isAnomaly && (
                              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                            )}
                          </div>
                          <span className="font-body-sm text-[12px] text-text-secondary line-clamp-1 max-w-[200px]">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-space-md py-space-md">
                        <span className="font-caption text-[11px] px-2 py-0.5 rounded bg-surface-container text-text-secondary">
                          {item.sector}
                        </span>
                      </td>

                      <td className="px-space-md py-space-md text-right">
                        <div className="font-mono text-tabular-sm font-semibold text-text-primary">
                          Rp {item.price.toLocaleString("id-ID")}
                        </div>
                        <div className={`font-mono text-[11px] ${
                          item.change_percent >= 0 ? "text-data-bullish" : "text-data-bearish"
                        }`}>
                          {item.change_percent >= 0 ? "+" : ""}{item.change_percent.toFixed(2)}%
                        </div>
                      </td>

                      <td className="px-space-md py-space-md text-right">
                        <div className={`font-mono text-tabular-md font-bold ${
                          isPositive ? "text-data-bullish" : "text-data-bearish"
                        }`}>
                          {formatFlow(item.net_foreign_flow)}
                        </div>
                      </td>

                      <td className="px-space-md py-space-md text-right font-mono text-[11px]">
                        <div className="text-data-bullish font-medium">
                          B: {formatVol(item.foreign_buy)}
                        </div>
                        <div className="text-data-bearish font-medium">
                          S: {formatVol(item.foreign_sell)}
                        </div>
                      </td>

                      <td className="px-space-md py-space-md text-center">
                        <span className={`font-mono text-[12px] px-2 py-0.5 rounded font-bold ${
                          isAnomaly
                            ? item.z_score >= 0
                              ? "bg-data-bullish/20 text-data-bullish"
                              : "bg-data-bearish/20 text-data-bearish"
                            : "bg-surface-container text-text-secondary"
                        }`}>
                          {item.z_score >= 0 ? `+${item.z_score.toFixed(2)}` : item.z_score.toFixed(2)}σ
                        </span>
                      </td>

                      <td className="px-space-md py-space-md text-center">
                        <span className={`font-caption text-[11px] px-2 py-0.5 rounded font-semibold ${
                          isPositive
                            ? "bg-data-bullish/15 text-data-bullish"
                            : "bg-data-bearish/15 text-data-bearish"
                        }`}>
                          {item.accumulation_status}
                        </span>
                      </td>

                      <td className="px-space-md py-space-md text-center">
                        {item.dominant_broker ? (
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container-highest text-text-primary font-bold">
                            {item.dominant_broker}
                          </span>
                        ) : (
                          <span className="text-text-secondary text-xs">-</span>
                        )}
                      </td>

                      <td className="px-space-md py-space-md text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/foreign-activity/${item.ticker}`}
                            className="px-2 py-1 rounded bg-brand-red-soft text-brand-red hover:bg-brand-red hover:text-text-primary font-caption text-[11px] font-semibold transition-colors"
                          >
                            Arus 90H
                          </Link>
                          <Link
                            href={`/stock/${item.ticker}`}
                            className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-text-secondary hover:text-text-primary font-caption text-[11px] transition-colors"
                          >
                            Saham
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-space-md bg-surface-container-lowest/50 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-secondary font-caption">
          <span>Menampilkan {filteredAndSorted.length} dari {stocks.length} saham tercatat di BEI</span>
          <span>Threshold Anomali Statistik Asing: |Z| ≥ 2.0σ terhadap baseline 90 hari</span>
        </div>
      </div>
    </div>
  )
}
