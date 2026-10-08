import React from "react"
import { Metadata } from "next"
import {
  WatchlistManager,
  getWatchedStocks,
  searchStocks,
  getIngestionWorkers,
} from "@/src/features/watchlist"

export const metadata: Metadata = {
  title: "Kelola Watchlist",
  description: "Daftar ticker inti yang dipantau secara otomatis oleh Sectors API",
}

export default async function WatchlistPage() {
  const [initialStocks, initialSearchStocks, workers] = await Promise.all([
    getWatchedStocks(),
    searchStocks(""),
    getIngestionWorkers(),
  ])

  return (
    <WatchlistManager
      initialStocks={initialStocks}
      initialSearchStocks={initialSearchStocks}
      workers={workers}
    />
  )
}

