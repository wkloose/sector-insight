"use client"

import React from "react"
import { CommunityAlert } from "../types"

interface DivergenceAlertBannerProps {
  alert: CommunityAlert
}

export function DivergenceAlertBanner({ alert }: DivergenceAlertBannerProps) {
  const isCritical = alert.severity === "CRITICAL" || alert.alert_type === "EUPHORIA_DIVERGENCE"
  const isOpportunity = alert.severity === "OPPORTUNITY" || alert.alert_type === "PANIC_DIVERGENCE"

  const containerClasses = isCritical
    ? "bg-rose-950/40 border-rose-500/60 text-text-primary"
    : isOpportunity
    ? "bg-emerald-950/40 border-emerald-500/60 text-text-primary"
    : "bg-amber-950/40 border-amber-500/60 text-text-primary"

  const badgeClasses = isCritical
    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
    : isOpportunity
    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
    : "bg-amber-500/20 text-amber-300 border-amber-500/40"

  const iconName = isCritical ? "warning" : isOpportunity ? "psychology" : "bolt"

  return (
    <div
      role="alert"
      className={`p-space-lg rounded-xl border relative overflow-hidden transition-all shadow-md ${containerClasses}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-border-subtle/50">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${badgeClasses}`}
          >
            <span className="material-symbols-outlined text-[20px]">{iconName}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded uppercase border tracking-wider bg-surface-container-lowest">
                {alert.ticker}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeClasses}`}>
                {alert.alert_type.replace("_", " ")}
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary mt-1">
              {alert.headline}
            </h3>
          </div>
        </div>

        <span className="font-caption text-caption text-text-secondary font-mono shrink-0">
          Cross-Pillar Divergence Engine (PRD-3)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
        <div className="p-3 bg-surface-card/60 rounded-lg border border-border-subtle/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block mb-1">
            👥 Konsensus Komunitas Ritel
          </span>
          <p className="text-body-sm text-text-primary font-medium">{alert.crowd_summary}</p>
        </div>

        <div className="p-3 bg-surface-card/60 rounded-lg border border-border-subtle/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block mb-1">
            🏦 Realitas Arus Modal Asing (Smart Money)
          </span>
          <p className="text-body-sm text-text-primary font-medium">{alert.foreign_summary}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-border-subtle/40 flex items-start gap-2">
        <span className="material-symbols-outlined text-brand-red text-[18px] shrink-0 mt-0.5">
          lightbulb
        </span>
        <p className="text-body-sm text-text-primary/90 leading-relaxed">
          <strong>Sintesis Aksi:</strong> {alert.synthesis}
        </p>
      </div>
    </div>
  )
}

