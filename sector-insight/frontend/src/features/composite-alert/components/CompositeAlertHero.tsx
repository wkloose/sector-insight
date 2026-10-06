"use client"

import React from "react"
import Link from "next/link"
import { CompositeAlert } from "../types/compositeAlert"
import { AlertBadge } from "./AlertBadge"

export interface CompositeAlertHeroProps {
  alert: CompositeAlert
  className?: string
}

export const CompositeAlertHero: React.FC<CompositeAlertHeroProps> = ({
  alert,
  className,
}) => {
  return (
    <div
      className={
        className ||
        "relative w-full rounded bg-brand-red-soft p-space-lg mb-space-lg overflow-hidden border border-brand-red/50 shadow-md"
      }
    >
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-brand-red/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10">
        <div className="flex flex-col gap-space-xs max-w-4xl">
          <div className="flex flex-wrap items-center gap-space-sm">
            <AlertBadge label="Sintesis Sinyal Aktif" />
            <span className="font-caption text-caption text-text-secondary">
              Terdeteksi: {alert.timestamp}
            </span>
            <span className="text-border-subtle">•</span>
            <span className="font-mono text-[11px] text-data-bearish bg-surface-container-lowest/80 px-2 py-0.5 rounded border border-border-subtle/40">
              Z-Score: {alert.zScore}σ
            </span>
            <span className="text-border-subtle">•</span>
            <span className="font-mono text-[11px] text-data-bullish bg-surface-container-lowest/80 px-2 py-0.5 rounded border border-border-subtle/40">
              Fundamental: {alert.fundamentalScore}/100
            </span>
          </div>

          <h2 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight mt-1 leading-tight">
            {alert.headline}
          </h2>

          <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
            {alert.summary}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-space-sm shrink-0">
          <Link
            href={`/stock/${alert.ticker}`}
            className="flex items-center gap-space-xs px-space-lg py-2.5 bg-brand-red hover:bg-brand-red/90 text-text-primary font-body-sm font-semibold rounded transition-all shadow-md min-h-[44px]"
          >
            <span>Buka Analisis Detail {alert.ticker}</span>
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
          <span className="font-caption text-caption text-text-secondary">
            Pembaruan kalkulasi algoritma {alert.timeAgo}
          </span>
        </div>
      </div>
    </div>
  )
}

