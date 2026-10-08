"use client"

import React from "react"
import Link from "next/link"
import { TopFlowStock } from "../types/foreignFlow"

interface TopForeignMoversCardsProps {
  accumulated: TopFlowStock[]
  distributed: TopFlowStock[]
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

export function TopForeignMoversCards({
  accumulated,
  distributed,
}: TopForeignMoversCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
      <div className="p-space-lg rounded border border-border-subtle bg-surface-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-data-bullish" />
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                Top 5 Akumulasi Asing (Net Buy Terbanyak)
              </h3>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-data-bullish/20 text-data-bullish font-semibold">
              INFLOW MASIF
            </span>
          </div>

          <div className="flex flex-col divide-y divide-border-subtle/50">
            {accumulated.map((item, idx) => (
              <div
                key={item.ticker}
                className="py-3 flex items-center justify-between hover:bg-surface-container-low/50 px-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] font-bold text-text-secondary w-4">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/foreign-activity/${item.ticker}`}
                        className="font-label-ticker text-base font-bold text-text-primary hover:text-brand-red transition-colors"
                      >
                        {item.ticker}
                      </Link>
                      <span className="font-caption text-[11px] px-1.5 py-0.2 rounded bg-surface-container-high text-text-secondary">
                        {item.sector}
                      </span>
                    </div>
                    <div className="font-body-sm text-[12px] text-text-secondary line-clamp-1">
                      {item.name}
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className="font-mono text-tabular-md font-bold text-data-bullish">
                    {formatFlow(item.net_flow)}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-text-secondary">
                    <span>Rp {item.price.toLocaleString("id-ID")}</span>
                    <span className={item.change_percent >= 0 ? "text-data-bullish" : "text-data-bearish"}>
                      ({item.change_percent >= 0 ? "+" : ""}{item.change_percent.toFixed(2)}%)
                    </span>
                    {item.dominant_broker && (
                      <span className="px-1 rounded bg-surface-container-highest text-text-primary font-semibold">
                        {item.dominant_broker}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle/50 mt-2 text-right">
          <span className="font-caption text-[12px] text-text-secondary">
            Klik kode emiten untuk membuka analisis anomali 90 hari & broker book
          </span>
        </div>
      </div>

      <div className="p-space-lg rounded border border-border-subtle bg-surface-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-data-bearish" />
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                Top 5 Distribusi Asing (Net Sell Terbanyak)
              </h3>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-data-bearish/20 text-data-bearish font-semibold">
              OUTFLOW MASIF
            </span>
          </div>

          <div className="flex flex-col divide-y divide-border-subtle/50">
            {distributed.map((item, idx) => (
              <div
                key={item.ticker}
                className="py-3 flex items-center justify-between hover:bg-surface-container-low/50 px-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] font-bold text-text-secondary w-4">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/foreign-activity/${item.ticker}`}
                        className="font-label-ticker text-base font-bold text-text-primary hover:text-brand-red transition-colors"
                      >
                        {item.ticker}
                      </Link>
                      <span className="font-caption text-[11px] px-1.5 py-0.2 rounded bg-surface-container-high text-text-secondary">
                        {item.sector}
                      </span>
                    </div>
                    <div className="font-body-sm text-[12px] text-text-secondary line-clamp-1">
                      {item.name}
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className="font-mono text-tabular-md font-bold text-data-bearish">
                    {formatFlow(item.net_flow)}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-text-secondary">
                    <span>Rp {item.price.toLocaleString("id-ID")}</span>
                    <span className={item.change_percent >= 0 ? "text-data-bullish" : "text-data-bearish"}>
                      ({item.change_percent >= 0 ? "+" : ""}{item.change_percent.toFixed(2)}%)
                    </span>
                    {item.dominant_broker && (
                      <span className="px-1 rounded bg-surface-container-highest text-text-primary font-semibold">
                        {item.dominant_broker}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle/50 mt-2 text-right">
          <span className="font-caption text-[12px] text-text-secondary">
            Klik kode emiten untuk membuka analisis anomali 90 hari & broker book
          </span>
        </div>
      </div>
    </div>
  )
}
