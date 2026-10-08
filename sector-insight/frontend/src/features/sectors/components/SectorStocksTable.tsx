"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { SectorStockItem } from "../types"

interface SectorStocksTableProps {
  stocks: SectorStockItem[]
  subsectors: string[]
  sectorName: string
  sectorSlug?: string
}

export function SectorStocksTable({
  stocks,
  subsectors,
  sectorName,
}: SectorStocksTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubsector, setSelectedSubsector] = useState<string>("ALL")
  const [sortBy, setSortBy] = useState<"market_cap" | "change_percent" | "fundamental_score" | "price">("market_cap")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSorted = useMemo(() => {
    let list = [...stocks]

    if (selectedSubsector !== "ALL") {
      list = list.filter((s) =>
        s.subsector.toLowerCase().includes(selectedSubsector.toLowerCase())
      )
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
      const valA = a[sortBy]
      const valB = b[sortBy]
      if (sortOrder === "asc") {
        return valA > valB ? 1 : -1
      }
      return valA < valB ? 1 : -1
    })

    return list
  }, [stocks, selectedSubsector, searchTerm, sortBy, sortOrder])

  const stats = useMemo(() => {
    if (stocks.length === 0) return { avgScore: 0, topGainer: null, topLaggard: null }
    let sumScore = 0
    let best = stocks[0]
    let worst = stocks[0]
    for (const s of stocks) {
      sumScore += s.fundamental_score
      if (s.change_percent > best.change_percent) best = s
      if (s.change_percent < worst.change_percent) worst = s
    }
    return {
      avgScore: Math.round((sumScore / stocks.length) * 10) / 10,
      topGainer: best,
      topLaggard: worst,
    }
  }, [stocks])

  const toggleSort = (col: "market_cap" | "change_percent" | "fundamental_score" | "price") => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
    } else {
      setSortBy(col)
      setSortOrder("desc")
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  const formatMarketCap = (val: number) => {
    if (val >= 1e12) {
      return `Rp ${(val / 1e12).toFixed(1)} T`
    }
    if (val >= 1e9) {
      return `Rp ${(val / 1e9).toFixed(1)} M`
    }
    return `Rp ${(val / 1e6).toFixed(0)} Jt`
  }

  const getHealthBadge = (score: number) => {
    if (score >= 80) {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
    }
    if (score >= 60) {
      return "bg-teal-500/20 text-teal-300 border-teal-500/40"
    }
    if (score >= 40) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/40"
    }
    return "bg-rose-500/20 text-rose-300 border-rose-500/40"
  }

  return (
    <div className="flex flex-col gap-space-lg w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Total Konstituen
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-headline-sm font-bold text-text-primary">
              {stocks.length}
            </span>
            <span className="text-caption text-text-secondary">Emiten</span>
          </div>
        </div>

        <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Rata-rata Skor Fundamental
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-headline-sm font-bold text-emerald-400">
              {stats.avgScore}
            </span>
            <span className="text-caption text-text-secondary">/100</span>
          </div>
        </div>

        <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Top Gainer Sektor
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono font-bold text-title-md text-text-primary">
              {stats.topGainer?.ticker || "-"}
            </span>
            <span className="font-mono font-bold text-caption text-emerald-400">
              {stats.topGainer ? `+${stats.topGainer.change_percent.toFixed(1)}%` : "-"}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Top Laggard Sektor
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono font-bold text-title-md text-text-primary">
              {stats.topLaggard?.ticker || "-"}
            </span>
            <span className="font-mono font-bold text-caption text-rose-400">
              {stats.topLaggard ? `${stats.topLaggard.change_percent.toFixed(1)}%` : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder={`Cari dari ${stocks.length} saham di ${sectorName}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl pl-9 pr-3 py-2 text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedSubsector("ALL")}
            className={`px-3 py-1.5 rounded-lg text-caption font-bold shrink-0 transition-colors ${
              selectedSubsector === "ALL"
                ? "bg-brand-red text-white"
                : "bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            Semua ({stocks.length})
          </button>
          {subsectors.map((sub) => {
            const count = stocks.filter((s) =>
              s.subsector.toLowerCase().includes(sub.toLowerCase())
            ).length
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubsector(sub)}
                className={`px-3 py-1.5 rounded-lg text-caption font-mono font-bold shrink-0 transition-colors ${
                  selectedSubsector === sub
                    ? "bg-brand-red text-white"
                    : "bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle"
                }`}
              >
                {sub} {count > 0 ? `(${count})` : ""}
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-card/60 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                <th className="py-3 px-4">Emiten</th>
                <th className="py-3 px-3">Subsektor</th>
                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-text-primary"
                  onClick={() => toggleSort("price")}
                >
                  Harga {sortBy === "price" && (sortOrder === "desc" ? "▼" : "▲")}
                </th>
                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-text-primary"
                  onClick={() => toggleSort("change_percent")}
                >
                  Perubahan 24H {sortBy === "change_percent" && (sortOrder === "desc" ? "▼" : "▲")}
                </th>
                <th
                  className="py-3 px-3 text-center cursor-pointer hover:text-text-primary"
                  onClick={() => toggleSort("fundamental_score")}
                >
                  Skor Fundamental {sortBy === "fundamental_score" && (sortOrder === "desc" ? "▼" : "▲")}
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-text-primary"
                  onClick={() => toggleSort("market_cap")}
                >
                  Market Cap {sortBy === "market_cap" && (sortOrder === "desc" ? "▼" : "▲")}
                </th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-body-sm font-body">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-secondary font-mono">
                    Tidak ada konstituen yang cocok dengan pencarian &quot;{searchTerm}&quot;
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((stock) => {
                  const isPositive = stock.change_percent >= 0
                  return (
                    <tr
                      key={stock.ticker}
                      className="hover:bg-surface-container-high/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/stock/${stock.ticker}`}
                          className="flex flex-col group"
                        >
                          <span className="font-mono font-bold text-body-sm text-text-primary group-hover:text-brand-red transition-colors">
                            {stock.ticker}
                          </span>
                          <span className="text-caption text-text-secondary line-clamp-1 max-w-[200px]">
                            {stock.name}
                          </span>
                        </Link>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-card border border-border-subtle text-text-secondary">
                          {stock.subsector}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-text-primary">
                        {formatCurrency(stock.price)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-mono font-bold inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-caption ${
                            isPositive
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-rose-500/15 text-rose-400"
                          }`}
                        >
                          {isPositive ? "▲ +" : "▼ "}
                          {stock.change_percent.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-mono font-bold text-body-sm text-text-primary">
                            {stock.fundamental_score}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getHealthBadge(
                              stock.fundamental_score
                            )}`}
                          >
                            {stock.health_status}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-caption text-text-secondary">
                        {formatMarketCap(stock.market_cap)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/stock/${stock.ticker}`}
                            className="px-2.5 py-1 text-caption font-semibold rounded-lg bg-surface-card hover:bg-brand-red hover:text-white border border-border-subtle text-text-primary transition-colors"
                          >
                            Analisis
                          </Link>
                          <Link
                            href={`/compare?stocks=${stock.ticker}`}
                            className="px-2.5 py-1 text-caption font-semibold rounded-lg bg-surface-card hover:bg-surface-container-high border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
                          >
                            Komparasi
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
      </div>
    </div>
  )
}
