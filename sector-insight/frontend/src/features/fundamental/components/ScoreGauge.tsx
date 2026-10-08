import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface ScoreGaugeProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
  status?: "Stabil" | "Waspada" | "Perhatian Khusus" | string
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
  className,
  status,
}) => {
  const safeScore = Math.max(0, Math.min(100, isNaN(score) ? 0 : score))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (safeScore / 100) * circumference

  const isCritical = status === "Perhatian Khusus" || safeScore < 60
  const isWarning = status === "Waspada" || (safeScore >= 60 && safeScore < 75)

  const strokeColor = isCritical
    ? "var(--color-data-bearish, #C23B3B)"
    : isWarning
    ? "var(--color-data-neutral, #C9A227)"
    : "var(--color-data-bullish, #3FAE6A)"

  return (
    <div
      style={{ width: size, height: size }}
      className={cn("relative flex items-center justify-center shrink-0", className)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-subtle, #2E2A2D)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-mono text-headline-metric font-bold text-text-primary leading-none">
          {safeScore}
        </span>
        <span className="font-caption text-[11px] text-text-secondary mt-0.5">
          /100
        </span>
      </div>
    </div>
  )
}
