"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  WatchedStock,
  SearchStockResult,
  IngestionWorkerStatus,
} from "../types/watchlist"
import { BackfillStatus } from "./BackfillStatus"
import { TickerSearch } from "./TickerSearch"
import { WatchedStockList } from "./WatchedStockList"
import { Button } from "@/src/shared/ui/Button"

export interface WatchlistManagerProps {
  initialStocks: WatchedStock[]
  initialSearchStocks: SearchStockResult[]
  workers: IngestionWorkerStatus[]
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  initialStocks,
  initialSearchStocks,
  workers,
}) => {
  const [stocks, setStocks] = useState<WatchedStock[]>(initialStocks)
  const [searchResults, setSearchResults] =
    useState<SearchStockResult[]>(initialSearchStocks)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults(initialSearchStocks)
      return
    }
    const q = query.toLowerCase()
    setSearchResults(
      initialSearchStocks.filter(
        (s) =>
          s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      )
    )
  }

  const handleAddStock = (ticker: string) => {
    const found = searchResults.find((s) => s.ticker === ticker)
    if (!found || stocks.some((s) => s.ticker === ticker)) return

    const newStock: WatchedStock = {
      ticker: found.ticker,
      name: found.name,
      subsector: found.subsector,
      category: found.category,
      addedAt: "Hari ini",
      ingestionStatus: "Sinkronisasi",
      ingestionDetail: "Memproses...",
      fundamentalScore: 70,
      status: "Stabil",
      price: found.price,
      priceChange: found.priceChange,
    }

    setStocks((prev) => [newStock, ...prev])
    setSearchResults((prev) =>
      prev.map((s) => (s.ticker === ticker ? { ...s, isWatched: true } : s))
    )
  }

  const handleRemoveStock = (ticker: string) => {
    setStocks((prev) => prev.filter((s) => s.ticker !== ticker))
    setSearchResults((prev) =>
      prev.map((s) => (s.ticker === ticker ? { ...s, isWatched: false } : s))
    )
  }

  const syncTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current)
      }
    }
  }, [])

  const handleSyncAll = () => {
    setIsSyncing(true)
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current)
    }
    syncTimerRef.current = setTimeout(() => {
      setIsSyncing(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-sm">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              TABEL REFERENSI BERSAMA
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              TABLE: watched_tickers
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Kelola Saham yang Dipantau (Watchlist Management)
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-4xl">
            Daftar ticker inti yang dipantau secara otomatis oleh ketiga job ingestion Sectors API (Fundamental, NLP Sentimen Berita, dan Deteksi Anomali Broker Asing).
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSyncAll}
            isLoading={isSyncing}
            leftIcon={
              <span className="material-symbols-outlined text-[16px]">sync</span>
            }
          >
            Sinkronisasi Ulang
          </Button>
        </div>
      </div>

      <BackfillStatus workers={workers} />

      <TickerSearch
        results={searchResults}
        onSearch={handleSearch}
        onAddStock={handleAddStock}
      />

      <WatchedStockList stocks={stocks} onRemove={handleRemoveStock} />

      <div className="bg-surface-card rounded border border-border-subtle p-space-lg">
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-text-secondary">
              tune
            </span>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Konfigurasi Status Alert & Notifikasi Sintesis
            </h3>
          </div>
          <Button variant="secondary" size="sm">
            Simpan Preferensi
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div className="p-space-md bg-surface-container-lowest border border-border-subtle rounded">
            <span className="font-caption text-caption text-text-secondary uppercase">
              Batas Anomali Asing (Z-Score)
            </span>
            <div className="font-mono text-headline-sm font-bold text-data-bearish mt-1">
              |Z| ≥ 2.0σ
            </div>
            <p className="font-caption text-caption text-text-secondary mt-1">
              Deviasi volume distribusi/akumulasi asing di atas standar harian (95% interval kepercayaan).
            </p>
          </div>

          <div className="p-space-md bg-surface-container-lowest border border-border-subtle rounded">
            <span className="font-caption text-caption text-text-secondary uppercase">
              Threshold Skor Fundamental
            </span>
            <div className="font-mono text-headline-sm font-bold text-text-primary mt-1">
              &lt; 60 / ≥ 75
            </div>
            <p className="font-caption text-caption text-text-secondary mt-1">
              Emiten skor &lt; 60 memicu status Waspada/Perhatian Khusus, sedangkan ≥ 75 diklasifikasikan Stabil.
            </p>
          </div>

          <div className="p-space-md bg-surface-container-lowest border border-border-subtle rounded">
            <span className="font-caption text-caption text-text-secondary uppercase">
              Ambang Negatif Policy Exposure
            </span>
            <div className="font-mono text-headline-sm font-bold text-data-neutral mt-1">
              &lt; -0.30
            </div>
            <p className="font-caption text-caption text-text-secondary mt-1">
              Sentimen IndoBERT pada regulasi (BI Rate/OJK) yang melampaui batas toleransi risiko.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

