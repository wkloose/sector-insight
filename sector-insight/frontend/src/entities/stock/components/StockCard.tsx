"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/src/shared/lib/cn"
import { Stock } from "../model"
import { StatusBadge } from "@/src/shared/ui/StatusBadge"
import { PriceDisplay } from "./PriceDisplay"
import { Sparkline } from "@/src/shared/ui/Sparkline"

export interface StockCardProps {
  stock: Stock
  className?: string
}

export const StockCard: React.FC<StockCardProps> = ({ stock, className }) => {
  const isPositiveSentiment =
    (stock.pillarMetrics?.sentimentScore ?? 0) >= 0

  const circumference = 2 * Math.PI * 14
  const strokeDashoffset =
    circumference - (stock.fundamentalScore / 100) * circumference

  const isCritical =
    stock.status === "CRITICAL" ||
    stock.status === "Perhatian Khusus" ||
    stock.isAlertTrigger

  return (
    <div
      className={cn(
        "flex flex-col justify-between bg-surface-card p-space-lg rounded border border-border-subtle hover:bg-surface-container-low transition-all relative overflow-hidden shadow-sm",
        isCritical && "border-brand-red/40",
        className
      )}
    >
      {isCritical && (
        <div className="absolute inset-0 bg-brand-red/5 pointer-events-none" />
      )}

      <div className="flex flex-col gap-space-md relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-ticker text-[20px] font-bold text-text-primary tracking-wide">
                {stock.ticker}
              </span>
              <span className="font-caption text-caption text-text-secondary uppercase">
                {stock.category}
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-text-secondary truncate max-w-[180px]">
              {stock.name}
            </span>
          </div>
          <StatusBadge status={stock.status} size="sm" />
        </div>

        <PriceDisplay price={stock.price} changePercent={stock.priceChange} />

        <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded border border-border-subtle/50">
          <div className="flex flex-col">
            <span className="font-caption text-[11px] text-text-secondary uppercase">
              Skor Fundamental
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-headline-metric-mobile font-bold text-text-primary">
                {stock.fundamentalScore}
              </span>
              <span className="font-caption text-caption text-text-secondary">/100</span>
            </div>
          </div>

          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <circle
                className="stroke-surface-container-high"
                cx="18"
                cy="18"
                fill="none"
                r="14"
                strokeWidth="3"
              />
              <circle
                className={isCritical ? "stroke-data-bearish" : "stroke-data-bullish"}
                cx="18"
                cy="18"
                fill="none"
                r="14"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span
              className={cn(
                "material-symbols-outlined absolute text-[16px]",
                isCritical ? "text-data-bearish" : "text-data-bullish"
              )}
            >
              {isCritical ? "warning" : "verified"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-space-xs">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-text-secondary font-caption">NIM Score (LTM)</span>
            <span className="font-mono text-tabular-sm text-text-primary font-medium">
              {stock.pillarMetrics?.nimScore ?? "--"}/100
            </span>
          </div>

          <div className="flex items-center justify-between text-body-sm">
            <span className="text-text-secondary font-caption">Sentimen Berita</span>
            <div className="flex items-center gap-1.5">
              {stock.pillarMetrics?.sentimentTrend && (
                <Sparkline
                  data={stock.pillarMetrics.sentimentTrend}
                  width={36}
                  height={12}
                  trend={isPositiveSentiment ? "bullish" : "bearish"}
                />
              )}
              <span
                className={cn(
                  "font-mono text-tabular-sm font-medium",
                  isPositiveSentiment ? "text-data-bullish" : "text-data-bearish"
                )}
              >
                {stock.pillarMetrics?.sentimentScore !== undefined
                  ? (stock.pillarMetrics.sentimentScore >= 0 ? "+" : "") +
                    stock.pillarMetrics.sentimentScore.toFixed(2)
                  : "--"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-body-sm">
            <span className="text-text-secondary font-caption">Arus Broker Asing</span>
            <span
              className={cn(
                "font-mono text-tabular-sm font-medium",
                stock.pillarMetrics?.foreignFlowStatus === "inflow"
                  ? "text-data-bullish"
                  : stock.pillarMetrics?.foreignFlowStatus === "outflow"
                  ? "text-data-bearish"
                  : "text-text-secondary"
              )}
            >
              {stock.pillarMetrics?.foreignFlowLabel ?? "Normal"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-space-md pt-space-sm border-t border-border-subtle/50 flex items-center justify-between relative z-10">
        <span className="font-caption text-caption text-text-secondary">
          Coverage Analis: {stock.analystCoverage ?? 24}
        </span>
        <Link
          href={`/stock/${stock.ticker}`}
          aria-label={`Detail sinyal saham ${stock.ticker}`}
          className="font-body-sm text-body-sm text-brand-red font-semibold hover:underline flex items-center gap-0.5 min-h-[36px]"
        >
          <span>Detail Sinyal</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}

