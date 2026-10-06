"use client"

import React from "react"
import Link from "next/link"
import { SectorItem } from "../types"

interface SectorLeaderboardCardProps {
  sectors: SectorItem[]
}

export function SectorLeaderboardCard({ sectors }: SectorLeaderboardCardProps) {
  const sorted = [...sectors].sort((a, b) => b.smrs_score - a.smrs_score)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LEADING":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
      case "IMPROVING":
        return "bg-teal-500/20 text-teal-400 border-teal-500/40"
      case "NEUTRAL":
        return "bg-slate-700/30 text-slate-300 border-slate-600/40"
      case "WEAKENING":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40"
      default:
        return "bg-rose-500/20 text-rose-400 border-rose-500/40"
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {sorted.map((sector, index) => {
        const flowMiliar = Math.round(sector.net_foreign_flow / 1000000000)

        return (
          <div
            key={sector.sector_slug}
            className="p-space-md bg-surface-card rounded-xl border border-border-subtle hover:border-border-subtle/80 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm"
          >
            <div className="flex items-start md:items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-surface-container-lowest border border-border-subtle flex items-center justify-center font-mono font-bold text-text-primary text-body-sm shrink-0">
                #{index + 1}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/sectors/${sector.sector_slug}`}
                    className="font-title-md text-title-md font-bold text-text-primary hover:text-brand-red transition-colors"
                  >
                    {sector.sector_name}
                  </Link>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                      sector.status
                    )}`}
                  >
                    {sector.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1 font-caption text-caption text-text-secondary">
                  <span>Subsektor: {sector.subsectors.slice(0, 3).join(", ")}</span>
                  {sector.top_movers.length > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        Top Movers:{" "}
                        <strong className="text-text-primary">{sector.top_movers.join(", ")}</strong>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-border-subtle/40">
              <div className="flex flex-col md:items-end">
                <span className="text-[10px] uppercase font-bold text-text-secondary">Skor SMRS</span>
                <span className="font-mono font-bold text-headline-sm text-text-primary">
                  {sector.smrs_score.toFixed(1)}
                  <span className="text-caption text-text-secondary font-normal">/100</span>
                </span>
              </div>

              <div className="flex flex-col md:items-end">
                <span className="text-[10px] uppercase font-bold text-text-secondary">Tren 7H</span>
                <span
                  className={`font-mono font-bold text-body-sm ${
                    sector.price_return_7d >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {sector.price_return_7d >= 0 ? "+" : ""}
                  {sector.price_return_7d.toFixed(1)}%
                </span>
              </div>

              <div className="flex flex-col md:items-end">
                <span className="text-[10px] uppercase font-bold text-text-secondary">Arus Asing</span>
                <span
                  className={`font-mono font-bold text-body-sm ${
                    flowMiliar >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {flowMiliar >= 0 ? "+" : ""}
                  Rp {flowMiliar} M
                </span>
              </div>

              <Link
                href={`/sectors/${sector.sector_slug}`}
                className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-caption font-semibold text-text-primary border border-border-subtle transition-colors flex items-center gap-1 shrink-0"
              >
                <span>Detail</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

