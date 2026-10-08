"use client"

import React from "react"
import Link from "next/link"
import { SectorItem } from "../types"

interface SectorHeatmapProps {
  sectors: SectorItem[]
}

export function SectorHeatmap({ sectors }: SectorHeatmapProps) {

  const sorted = [...sectors].sort((a, b) => b.smrs_score - a.smrs_score)

  const getCardStyle = (score: number) => {
    if (score >= 75) {
      return "bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400 text-emerald-300"
    }
    if (score >= 60) {
      return "bg-teal-950/40 border-teal-500/50 hover:border-teal-400 text-teal-300"
    }
    if (score >= 40) {
      return "bg-slate-900/40 border-slate-700/60 hover:border-slate-500 text-slate-300"
    }
    if (score >= 25) {
      return "bg-amber-950/40 border-amber-600/50 hover:border-amber-400 text-amber-300"
    }
    return "bg-rose-950/40 border-rose-600/50 hover:border-rose-400 text-rose-300"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LEADING":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
      case "IMPROVING":
        return "bg-teal-500/20 text-teal-300 border-teal-500/40"
      case "NEUTRAL":
        return "bg-slate-700/30 text-slate-300 border-slate-600/40"
      case "WEAKENING":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40"
      default:
        return "bg-rose-500/20 text-rose-300 border-rose-500/40"
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-red text-[20px]">
            grid_view
          </span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary">
            IDX-IC 11 Sector Rotation Heatmap
          </h3>
        </div>
        <div className="flex items-center gap-3 text-caption">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-text-secondary">Leading (≥75)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" />
            <span className="text-text-secondary">Improving</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
            <span className="text-text-secondary">Neutral</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span className="text-text-secondary">Lagging (&lt;25)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {sorted.map((item, index) => {
          const isTop = index < 2
          const flowMiliar = Math.round(item.net_foreign_flow / 1000000000)

          return (
            <Link
              key={item.sector_slug}
              href={`/sectors/${item.sector_slug}`}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] shadow-sm ${
                isTop ? "sm:col-span-2 lg:col-span-2 bg-gradient-to-br" : ""
              } ${getCardStyle(item.smrs_score)}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="font-mono text-[11px] font-bold opacity-75">
                    #{index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4 className="font-title-md text-title-md font-bold text-text-primary leading-tight line-clamp-1">
                  {item.sector_name.split("(")[0].trim()}
                </h4>
                <div className="flex items-center justify-between font-mono text-caption text-text-secondary mt-0.5">
                  <span>{item.subsectors.length} Subsektor</span>
                  {item.total_companies ? (
                    <span className="text-[11px] font-semibold text-text-primary/90">
                      {item.total_companies} Saham
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border-subtle/40 flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-text-secondary font-medium">SMRS:</span>
                  <span className="font-mono font-bold text-body-sm text-text-primary">
                    {item.smrs_score.toFixed(1)}/100
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-caption font-mono">
                  <span className="text-[11px] text-text-secondary">Tren 7H:</span>
                  <span
                    className={`font-bold ${
                      item.price_return_7d >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {item.price_return_7d >= 0 ? "▲ +" : "▼ "}
                    {item.price_return_7d.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-caption font-mono text-[11px] text-text-secondary">
                  <span>Asing:</span>
                  <span
                    className={flowMiliar >= 0 ? "text-emerald-400/90" : "text-rose-400/90"}
                  >
                    {flowMiliar >= 0 ? "+" : ""}
                    {flowMiliar} M
                  </span>
                </div>

                {item.top_movers && item.top_movers.length > 0 && (
                  <div className="flex items-baseline justify-between text-caption font-mono text-[10px] text-text-secondary pt-0.5 border-t border-border-subtle/30 mt-0.5">
                    <span>Top:</span>
                    <span className="text-text-primary font-bold truncate max-w-[105px]">
                      {item.top_movers[0]}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

