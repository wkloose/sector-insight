import React from "react"
import { SentimentSparkline } from "./SentimentSparkline"

export interface SentimentCardProps {
  score: number
  label: string
  sampleCount: number
  trend?: number[]
  className?: string
}

export const SentimentCard: React.FC<SentimentCardProps> = ({
  score,
  label,
  sampleCount,
  trend,
  className,
}) => {
  const isPositive = score >= 0

  return (
    <div
      className={
        className ||
        "bg-surface-card border border-border-subtle p-space-lg rounded flex flex-col justify-between"
      }
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-caption text-caption text-text-secondary uppercase tracking-wider font-semibold">
            Sentimen Perusahaan (NLP)
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-caption px-1.5 py-0.5 rounded font-medium ${
              isPositive
                ? "bg-data-bullish/15 text-data-bullish border border-data-bullish/30"
                : "bg-data-bearish/15 text-data-bearish border border-data-bearish/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPositive ? "bg-data-bullish" : "bg-data-bearish"
              }`}
            />
            {isPositive ? "Positif" : "Negatif"}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span
            className={`font-mono text-headline-metric font-bold tracking-tight ${
              isPositive ? "text-data-bullish" : "text-data-bearish"
            }`}
          >
            {isPositive ? `+${score.toFixed(2)}` : score.toFixed(2)}
          </span>
          <span className="font-mono text-tabular-sm text-text-secondary">/ 1.0</span>
        </div>

        <span className="font-body-sm text-body-sm font-semibold text-text-primary">
          {label}
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex flex-col gap-1.5 font-caption text-caption text-text-secondary">
        <div className="flex justify-between items-center">
          <span>Sampel Artikel (30H):</span>
          <span className="font-mono text-tabular-sm text-text-primary font-medium">
            {sampleCount} Artikel
          </span>
        </div>

        {trend && (
          <div className="flex justify-between items-center">
            <span>Tren 7 Hari:</span>
            <SentimentSparkline data={trend} />
          </div>
        )}
      </div>
    </div>
  )
}

