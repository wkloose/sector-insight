import React from "react"
import Link from "next/link"
import { AnomalyBadge } from "@/src/entities/stock/components/AnomalyBadge"

export interface FlowSummaryCardProps {
  ticker: string
  yesterdayFlowFormatted: string
  zScore: number
  dominantBrokerCode: string
  dominantBrokerName: string
  isAnomaly: boolean
  className?: string
}

export const FlowSummaryCard: React.FC<FlowSummaryCardProps> = ({
  ticker,
  yesterdayFlowFormatted,
  zScore,
  dominantBrokerCode,
  dominantBrokerName,
  isAnomaly,
  className,
}) => {
  const isOutflow = zScore < 0
  return (
    <div
      className={
        className ||
        "bg-surface-card border border-border-subtle p-space-md rounded flex items-center justify-between hover:bg-surface-container-low hover:border-border-subtle/80 transition-all select-none"
      }
    >
      <div className="flex items-center gap-space-md">
        <span
          className={`font-label-ticker text-[16px] font-bold ${
            isAnomaly ? (isOutflow ? "text-data-bearish" : "text-data-bullish") : "text-text-primary"
          }`}
        >
          {ticker}
        </span>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono tracking-tight font-semibold text-[13px] text-text-primary">
              {yesterdayFlowFormatted}
            </span>
            {isAnomaly && (
              <AnomalyBadge
                type={isOutflow ? "outflow" : "inflow"}
                label={`Z: ${zScore > 0 ? "+" : ""}${zScore}σ`}
                size="sm"
              />
            )}
          </div>
          {isAnomaly && (
            <span className="font-caption text-[11px] text-text-secondary">
              Broker dominan: <strong>{dominantBrokerCode}</strong> ({dominantBrokerName})
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/foreign-activity/${ticker}`}
        className="group font-caption text-caption text-brand-red hover:underline font-semibold flex items-center gap-0.5 min-h-[36px]"
      >
        <span>Lihat Grafik</span>
        <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform duration-150">
          arrow_forward
        </span>
      </Link>
    </div>
  )
}
