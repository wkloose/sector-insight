"use client"

import React, { useState } from "react"
import { SearchStockResult } from "../types/watchlist"
import { SearchInput } from "@/src/shared/ui/SearchInput"
import { Button } from "@/src/shared/ui/Button"
import { formatPercent, formatRupiah } from "@/src/shared/lib/format"

export interface TickerSearchProps {
  results: SearchStockResult[]
  onSearch: (query: string) => void
  onAddStock: (ticker: string) => void
}

export const TickerSearch: React.FC<TickerSearchProps> = ({
  results,
  onSearch,
  onAddStock,
}) => {
  const [query, setQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    onSearch(val)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className="bg-surface-card rounded border border-border-subtle p-space-lg mb-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-md">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-[20px] text-brand-red">
            travel_explore
          </span>
          <div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Pencarian & Penambahan Saham ke Pool Ingestion
            </h3>
            <p className="font-caption text-caption text-text-secondary">
              Ticker baru yang ditambahkan langsung otomatis ditarik datanya via backend worker pipeline.
            </p>
          </div>
        </div>

        <div className="w-full md:w-80">
          <SearchInput
            value={query}
            onChange={handleSearchChange}
            onClear={handleClear}
            placeholder="Cari emiten IHSG (BBCA, TLKM, ASII, GOTO)..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {results.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-space-lg text-center border border-dashed border-border-subtle rounded bg-surface-container-lowest/50 py-8">
            <span className="material-symbols-outlined text-[24px] text-text-secondary mb-1">
              search_off
            </span>
            <span className="font-headline-sm text-[14px] font-semibold text-text-primary">
              Tidak Ditemukan Ticker yang Sesuai
            </span>
            <p className="font-body-sm text-[12px] text-text-secondary mt-0.5">
              Coba gunakan kata kunci atau kode ticker lain (contoh: BBCA, TLKM, ASII, GOTO, ADRO, ICBP).
            </p>
          </div>
        ) : (
          results.map((stock) => (
          <div
            key={stock.ticker}
            className="flex flex-col justify-between p-space-md bg-surface-container-lowest border border-border-subtle rounded hover:border-border-subtle/80 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-ticker text-[16px] font-bold text-text-primary">
                      {stock.ticker}
                    </span>
                    <span className="font-caption text-[11px] px-1.5 py-0.5 rounded bg-surface-container-high text-text-secondary">
                      {stock.category}
                    </span>
                  </div>
                  <span className="font-body-sm text-[12px] text-text-secondary line-clamp-1 mt-0.5">
                    {stock.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-tabular-sm font-bold text-text-primary">
                    {formatRupiah(stock.price)}
                  </span>
                  <div className="text-[11px] font-mono">
                    <span
                      className={
                        stock.priceChange >= 0
                          ? "text-data-bullish"
                          : "text-data-bearish"
                      }
                    >
                      {formatPercent(stock.priceChange)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-space-md font-mono text-[11px] text-text-secondary pt-1 border-t border-border-subtle/40 mb-3">
                {stock.pbv && <span>PBV: {stock.pbv}x</span>}
                {stock.per && <span>PER: {stock.per}x</span>}
              </div>
            </div>

            <div>
              {stock.isWatched ? (
                <div className="w-full py-1.5 px-3 bg-surface-card border border-border-subtle rounded text-center font-caption text-caption text-text-secondary font-medium">
                  Sudah di Pool
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  onClick={() => onAddStock(stock.ticker)}
                  leftIcon={
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  }
                >
                  Tambah
                </Button>
              )}
            </div>
          </div>
        )))}
      </div>
    </div>
  )
}
