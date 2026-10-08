import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { getStockQuotes } from "@/src/features/market"

export const metadata: Metadata = {
  title: "Direktori & Pencarian Saham",
  description: "Pilih salah satu emiten untuk melihat analisis mendalam 3 pilar: fundamental, sentimen berita, dan arus broker asing",
}

export default async function StockDirectoryPage() {
  const quotes = await getStockQuotes()

  return (
    <div className="flex flex-col w-full pb-space-xl gap-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              DIREKTORI EMITEN
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              3-PILLAR DEEP-DIVE
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Pencarian & Direktori Analisis Saham
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Pilih emiten di bawah ini untuk membuka halaman analisis menyeluruh yang mencakup skor kesehatan fundamental (PRD), sentimen berita AI, dan anomali arus broker asing 90 hari.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <Link
            href="/screener"
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-text-primary font-caption text-caption font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            <span>Buka Screener Lengkap</span>
          </Link>
          <Link
            href="/compare"
            className="px-3 py-1.5 rounded bg-brand-red text-text-primary font-caption text-caption font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            <span>Komparasi Antar-Saham</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
        {quotes.map((q) => {
          const isPositive = q.change_percent >= 0
          return (
            <Link
              key={q.ticker}
              href={`/stock/${q.ticker}`}
              className="p-space-md bg-surface-card rounded border border-border-subtle hover:border-brand-red/50 hover:bg-surface-container-low transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-ticker text-lg font-bold text-text-primary group-hover:text-brand-red transition-colors">
                      {q.ticker}
                    </span>
                    <span className="font-caption text-[11px] px-1.5 py-0.2 rounded bg-surface-container text-text-secondary">
                      {q.sector || "IDX"}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-text-secondary group-hover:text-brand-red text-[18px] transition-colors">
                    arrow_forward
                  </span>
                </div>
                <div className="font-body-sm text-[12px] text-text-secondary line-clamp-1 mb-3">
                  {q.name}
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between">
                <div>
                  <span className="font-caption text-[11px] text-text-secondary">Harga Terakhir</span>
                  <div className="font-mono text-tabular-md font-bold text-text-primary">
                    Rp {q.price.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-caption text-[11px] text-text-secondary">24H Perubahan</span>
                  <div className={`font-mono text-tabular-sm font-semibold ${
                    isPositive ? "text-data-bullish" : "text-data-bearish"
                  }`}>
                    {isPositive ? "+" : ""}{q.change_percent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
