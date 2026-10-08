import React from "react"
import Link from "next/link"
import { FundamentalScoreDetail } from "../types/fundamental"
import { RadarChart } from "./RadarChart"
import { ScoreBreakdown } from "./ScoreBreakdown"

export interface FundamentalScoreCardProps {
  data: FundamentalScoreDetail
  showDetailsLink?: boolean
}

export const FundamentalScoreCard: React.FC<FundamentalScoreCardProps> = ({
  data,
  showDetailsLink = true,
}) => {
  const isHealthy = data.score >= 70

  return (
    <div className="bg-surface-card p-space-lg rounded border border-border-subtle flex flex-col justify-between shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
          <div className="flex items-center gap-space-xs">
            <span
              className={`w-1.5 h-4 rounded-full ${
                isHealthy ? "bg-data-bullish" : "bg-data-neutral"
              }`}
            />
            <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
              Skor Fundamental
            </h2>
          </div>
          <span className="font-caption text-caption text-text-secondary uppercase">
            7 Dimensi Perbankan
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-space-md bg-surface-container-lowest p-space-md rounded border border-border-subtle/50">
          <div className="flex items-baseline gap-space-xs">
            <span className="font-mono text-headline-metric text-text-primary font-bold">
              {data.score}
            </span>
            <span className="font-mono text-tabular-lg text-text-secondary">/100</span>
          </div>
          <div className="flex flex-col text-right">
            <span
              className={`font-caption text-caption font-semibold ${
                isHealthy ? "text-data-bullish" : "text-data-neutral"
              }`}
            >
              ● Status: {data.status}
            </span>
            <span className="font-caption text-caption text-text-secondary mt-0.5">
              Persentil:{" "}
              <strong className="text-text-primary font-mono text-tabular-sm">
                {data.percentile}
              </strong>{" "}
              Sektor
            </span>
          </div>
        </div>

        <div className="my-space-md">
          <RadarChart dimensions={data.dimensions} />
        </div>

        <ScoreBreakdown
          dimensions={data.dimensions}
          financialMetrics={data.financialMetrics}
        />
      </div>

      {showDetailsLink && (
        <div className="mt-space-lg pt-space-sm border-t border-border-subtle/50 flex items-center justify-between">
          <Link
            href="/methodology"
            className="font-caption text-caption text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">help</span>
            <span>Bagaimana skor ini dihitung?</span>
          </Link>
          <Link
            href={`/stock/${data.ticker}`}
            aria-label={`Lihat audit finansial ${data.ticker}`}
            className="font-body-sm text-body-sm text-brand-red font-semibold hover:underline flex items-center gap-0.5 min-h-[36px]"
          >
            <span>Lihat Audit Finansial</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      )}
    </div>
  )
}
