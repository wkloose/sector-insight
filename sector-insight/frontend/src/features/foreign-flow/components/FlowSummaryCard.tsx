import React from "react"
import Link from "next/link"

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
  return (
    <div
      className={
        className ||
        "bg-surface-card border border-border-subtle p-space-md rounded flex items-center justify-between hover:bg-surface-container-low transition-colors"
      }
    >
      <div className="flex items-center gap-space-md">
        <span
          className={`font-label-ticker text-[16px] font-bold ${
            isAnomaly ? "text-brand-red" : "text-text-primary"
          }`}
        >
          {ticker}
        </span>
        <div className="flex flex-col">
          <span className="font-body-sm text-[13px] text-text-primary font-medium">
            {yesterdayFlowFormatted} {isAnomaly ? `(Z: ${zScore}σ)` : "Normal"}
          </span>
          {isAnomaly && (
            <span className="font-caption text-[11px] text-text-secondary">
              Broker dominan: <strong>{dominantBrokerCode}</strong> ({dominantBrokerName})
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/foreign-activity/${ticker}`}
        className="font-caption text-caption text-brand-red hover:underline font-semibold flex items-center gap-0.5"
      >
        <span>Lihat Grafik</span>
        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </Link>
    </div>
  )
}

