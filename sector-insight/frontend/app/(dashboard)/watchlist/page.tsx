import React from "react"
import { Metadata } from "next"
import {
  WatchlistManager,
  getWatchedStocks,
  searchStocks,
  MOCK_INGESTION_WORKERS,
} from "@/src/features/watchlist"

export const metadata: Metadata = {
  title: "Kelola Watchlist",
  description: "Daftar ticker inti yang dipantau secara otomatis oleh Sectors API",
}

export default async function WatchlistPage() {
  const [initialStocks, initialSearchStocks] = await Promise.all([
    getWatchedStocks(),
    searchStocks(""),
  ])

  return (
    <WatchlistManager
      initialStocks={initialStocks}
      initialSearchStocks={initialSearchStocks}
      workers={MOCK_INGESTION_WORKERS}
    />
  )
}

