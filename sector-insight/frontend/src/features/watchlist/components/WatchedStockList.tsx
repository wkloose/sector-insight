"use client"

import React from "react"
import Link from "next/link"
import { WatchedStock } from "../types/watchlist"
import { StatusBadge } from "@/src/shared/ui/StatusBadge"

export interface WatchedStockListProps {
  stocks: WatchedStock[]
  onRemove: (ticker: string) => void
}

export const WatchedStockList: React.FC<WatchedStockListProps> = ({
  stocks,
  onRemove,
}) => {
  return (
    <div className="bg-surface-card rounded border border-border-subtle overflow-hidden mb-space-xl">
      <div className="flex items-center justify-between p-space-md border-b border-border-subtle bg-surface-container-lowest/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-data-bullish">
            table_chart
          </span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Tabel Watchlist Aktif (Sedang Dipantau)
          </h3>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-text-secondary">
            {stocks.length} Saham Terpilih
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-container-lowest/30 text-caption font-caption text-text-secondary uppercase font-semibold">
              <th className="px-space-md py-space-sm">Ticker & Nama Emiten</th>
              <th className="px-space-md py-space-sm">Subsektor / KBMI</th>
              <th className="px-space-md py-space-sm">Ditambahkan</th>
              <th className="px-space-md py-space-sm">Status Data Ingestion</th>
              <th className="px-space-md py-space-sm">Skor Fundamental</th>
              <th className="px-space-md py-space-sm">Status Alert</th>
              <th className="px-space-md py-space-sm text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50 text-body-sm">
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-space-md py-space-xl text-center text-text-secondary font-body-sm">
                  Belum ada saham dalam watchlist. Gunakan pencarian di atas untuk menambahkan emiten perbankan.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr
                  key={stock.ticker}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="px-space-md py-space-sm">
                    <Link
                      href={`/stock/${stock.ticker}`}
                      className="flex flex-col group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-ticker text-[15px] font-bold text-text-primary group-hover:text-brand-red transition-colors">
                          {stock.ticker}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                          arrow_outward
                        </span>
                      </div>
                      <span className="font-body-sm text-[12px] text-text-secondary">
                        {stock.name}
                      </span>
                    </Link>
                  </td>

                  <td className="px-space-md py-space-sm text-text-secondary font-body-sm text-[13px]">
                    {stock.subsector}
                  </td>

                  <td className="px-space-md py-space-sm font-mono text-[12px] text-text-secondary">
                    {stock.addedAt}
                  </td>

                  <td className="px-space-md py-space-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-data-bullish" />
                      <span className="font-caption text-caption text-text-primary font-medium">
                        {stock.ingestionStatus}
                      </span>
                      {stock.ingestionDetail && (
                        <span className="font-mono text-[10px] text-text-secondary px-1 bg-surface-container-lowest rounded">
                          {stock.ingestionDetail}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-space-md py-space-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            stock.fundamentalScore >= 75
                              ? "bg-data-bullish"
                              : stock.fundamentalScore >= 60
                              ? "bg-data-neutral"
                              : "bg-brand-red"
                          }`}
                          style={{ width: `${stock.fundamentalScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-tabular-sm font-bold text-text-primary">
                        {stock.fundamentalScore}
                        <span className="text-text-secondary font-normal text-[11px]">/100</span>
                      </span>
                    </div>
                  </td>

                  <td className="px-space-md py-space-sm">
                    <StatusBadge status={stock.status} size="sm" />
                  </td>

                  <td className="px-space-md py-space-sm text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Hapus ${stock.ticker} dari watchlist`}
                        onClick={() => onRemove(stock.ticker)}
                        className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-text-secondary hover:text-data-bearish rounded transition-colors cursor-pointer hover:bg-surface-card focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-red"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

