import React from "react"

export interface PolicyExposureCardProps {
  score: number
  label: string
  dominantIssue?: string
  dominantRegulation?: string
  className?: string
}

export const PolicyExposureCard: React.FC<PolicyExposureCardProps> = ({
  score,
  label,
  dominantIssue,
  dominantRegulation,
  className,
}) => {
  const isNegative = score < -0.1
  const isNeutral = score >= -0.1 && score <= 0.1
  const badgeConfig = isNegative
    ? { container: "bg-data-neutral/15 text-data-neutral border-data-neutral/30", dot: "bg-data-neutral", label: "Waspada Regulasi" }
    : isNeutral
    ? { container: "bg-surface-container-high text-text-secondary border-border-subtle", dot: "bg-text-secondary", label: "Netral" }
    : { container: "bg-data-bullish/15 text-data-bullish border-data-bullish/30", dot: "bg-data-bullish", label: "Stabil" }
  const scoreColor = isNegative ? "text-data-bearish" : isNeutral ? "text-data-neutral" : "text-data-bullish"

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
            Policy Exposure Score
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-caption px-1.5 py-0.5 rounded font-medium border ${badgeConfig.container}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot}`} />
            {badgeConfig.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span
            className={`font-mono text-headline-metric font-bold tracking-tight ${scoreColor}`}
          >
            {score >= 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}
          </span>
          <span className="font-mono text-tabular-sm text-text-secondary">/ 1.0</span>
        </div>

        <span className="font-body-sm text-body-sm font-semibold text-text-primary">
          {label}
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex flex-col gap-1.5 font-caption text-caption text-text-secondary">
        {dominantIssue && (
          <div className="flex justify-between items-center">
            <span>Isu Dominan:</span>
            <span className="font-body-sm text-body-sm text-text-primary truncate max-w-[160px]">
              {dominantIssue}
            </span>
          </div>
        )}
        {dominantRegulation && (
          <div className="flex justify-between items-center">
            <span>Regulasi:</span>
            <span className="font-body-sm text-body-sm text-text-primary truncate max-w-[160px]">
              {dominantRegulation}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

