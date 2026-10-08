"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Stock } from "../model"
import { StockCard } from "./StockCard"
import { SearchInput } from "@/src/shared/ui/SearchInput"

export interface DashboardStockSectionProps {
  initialStocks: Stock[]
}

const SECTOR_FILTERS = [
  { id: "ALL", label: "Semua Sektor" },
  { id: "FINANCIALS", label: "Perbankan & Keuangan" },
  { id: "ENERGY", label: "Energi" },
  { id: "CONSUMER", label: "Konsumer" },
  { id: "INFRASTRUCTURE", label: "Infrastruktur & Telco" },
  { id: "TECHNOLOGY", label: "Teknologi" },
  { id: "BASIC_MATERIALS", label: "Bahan Baku & Tambang" },
  { id: "INDUSTRIALS", label: "Perindustrian" },
  { id: "PROPERTIES", label: "Properti" },
  { id: "HEALTHCARE", label: "Kesehatan" },
]

export const DashboardStockSection: React.FC<DashboardStockSectionProps> = ({
  initialStocks,
}) => {
  const [activeSector, setActiveSector] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStocks = useMemo(() => {
    return initialStocks.filter((s) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.subsector.toLowerCase().includes(q)

      if (!matchesSearch) return false

      if (activeSector === "ALL") return true

      const sub = s.subsector.toLowerCase()
      const sec = (s.sector || "").toLowerCase()

      switch (activeSector) {
        case "FINANCIALS":
          return sec.includes("financial") || sub.includes("bank") || sub.includes("keuangan")
        case "ENERGY":
          return sec.includes("energy") || sub.includes("energi") || sub.includes("tambang")
        case "CONSUMER":
          return sec.includes("consumer") || sub.includes("konsumen")
        case "INFRASTRUCTURE":
          return sec.includes("infrastructure") || sub.includes("infrastruktur") || sub.includes("telco")
        case "TECHNOLOGY":
          return sec.includes("technology") || sub.includes("teknologi")
        case "BASIC_MATERIALS":
          return sec.includes("basic") || sub.includes("baku") || sub.includes("kimia")
        case "INDUSTRIALS":
          return sec.includes("industrial") || sub.includes("industri") || sub.includes("otomotif")
        case "PROPERTIES":
          return sec.includes("propert") || sub.includes("properti") || sub.includes("real")
        case "HEALTHCARE":
          return sec.includes("health") || sub.includes("kesehatan") || sub.includes("farmasi")
        default:
          return true
      }
    })
  }, [initialStocks, activeSector, searchQuery])

  const gainersCount = useMemo(
    () => filteredStocks.filter((s) => s.priceChange > 0).length,
    [filteredStocks]
  )
  const losersCount = useMemo(
    () => filteredStocks.filter((s) => s.priceChange < 0).length,
    [filteredStocks]
  )

  return (
    <div className="flex flex-col w-full mb-space-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-md pb-space-sm border-b border-border-subtle/70">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[20px] text-brand-red">
              candlestick_chart
            </span>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Semesta Emiten & Pergerakan Real-Time IHSG
            </h3>
          </div>
          <p className="font-caption text-caption text-text-secondary mt-0.5">
            Semesta data pasar modal IDX ({initialStocks.length} emiten aktif dipantau terintegrasi)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
          <div className="flex items-center gap-space-sm text-caption font-mono px-3 py-1.5 bg-surface-container-lowest rounded border border-border-subtle">
            <span className="text-text-secondary">{filteredStocks.length} Emiten</span>
            <span className="text-border-subtle">•</span>
            <span className="text-data-bullish font-bold">+{gainersCount} Menguat</span>
            <span className="text-border-subtle">•</span>
            <span className="text-data-bearish font-bold">-{losersCount} Melemah</span>
          </div>
          <div className="w-full sm:w-64">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Cari ticker atau nama..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-space-sm mb-space-md scrollbar-none">
        {SECTOR_FILTERS.map((f) => {
          const isActive = activeSector === f.id
          return (
            <button
              key={f.id}
              onClick={() => setActiveSector(f.id)}
              className={`px-3 py-1.5 rounded text-caption font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-brand-red text-text-primary border-brand-red font-semibold shadow-sm"
                  : "bg-surface-card text-text-secondary border-border-subtle hover:bg-surface-container-high hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-space-md">
        {filteredStocks.length === 0 ? (
          <div className="col-span-full p-space-xl bg-surface-card rounded border border-dashed border-border-subtle flex flex-col items-center justify-center text-center py-12">
            <span className="material-symbols-outlined text-[36px] text-text-secondary mb-2">
              filter_alt_off
            </span>
            <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-1">
              Tidak Ada Emiten Ditemukan
            </h4>
            <p className="font-body-sm text-body-sm text-text-secondary max-w-sm mb-4">
              Tidak ada emiten yang sesuai dengan filter atau kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <div className="flex items-center gap-space-sm">
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveSector("ALL")
                }}
                className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-text-primary text-body-sm font-medium rounded border border-border-subtle"
              >
                Reset Filter
              </button>
              <Link
                href="/watchlist"
                className="px-3 py-1.5 bg-brand-red text-text-primary text-body-sm font-semibold rounded"
              >
                Cari di Watchlist
              </Link>
            </div>
          </div>
        ) : (
          filteredStocks.map((stock) => (
            <StockCard key={stock.ticker} stock={stock} />
          ))
        )}
      </div>
    </div>
  )
}
