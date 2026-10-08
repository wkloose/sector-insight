import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface AnomalyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: "inflow" | "outflow" | "normal" | "warning" | string
  label?: string
  size?: "sm" | "md"
  showPulse?: boolean
}

export const AnomalyBadge: React.FC<AnomalyBadgeProps> = ({
  type,
  label,
  size = "sm",
  showPulse = true,
  className,
  ...props
}) => {
  const normalizedType = type.toLowerCase()
  const isOutflow = normalizedType.includes("outflow")
  const isInflow = normalizedType.includes("inflow")
  const isWarning = normalizedType.includes("warning") || normalizedType.includes("waspada")

  const displayLabel =
    label ??
    (isOutflow
      ? "Anomali Outflow"
      : isInflow
      ? "Anomali Inflow"
      : isWarning
      ? "Anomali Waspada"
      : "Aliran Normal")

  const glowClass = showPulse
    ? isOutflow
      ? "glow-anomaly-outflow"
      : isInflow
      ? "glow-anomaly-inflow"
      : isWarning
      ? "shadow-[0_0_10px_rgba(201,162,39,0.35)] animate-pulse"
      : ""
    : ""

  const styleConfig = isOutflow
    ? {
        container:
          "bg-data-bearish/15 text-data-bearish border-data-bearish/50",
        dotPing: "bg-data-bearish",
        dotBase: "bg-data-bearish",
        icon: "trending_down",
      }
    : isInflow
    ? {
        container:
          "bg-data-bullish/15 text-data-bullish border-data-bullish/50",
        dotPing: "bg-data-bullish",
        dotBase: "bg-data-bullish",
        icon: "trending_up",
      }
    : isWarning
    ? {
        container:
          "bg-data-neutral/15 text-data-neutral border-data-neutral/40",
        dotPing: "bg-data-neutral",
        dotBase: "bg-data-neutral",
        icon: "warning",
      }
    : {
        container: "bg-surface-container-high text-text-secondary border-border-subtle",
        dotPing: "bg-text-secondary",
        dotBase: "bg-text-secondary",
        icon: "check_circle",
      }

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1.5",
    md: "px-2.5 py-1 text-caption gap-2",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono tracking-tight font-semibold rounded border select-none transition-all duration-200 uppercase",
        styleConfig.container,
        glowClass,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showPulse && (isOutflow || isInflow || isWarning) ? (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              styleConfig.dotPing
            )}
          />
          <span
            className={cn("relative inline-flex rounded-full h-2 w-2", styleConfig.dotBase)}
          />
        </span>
      ) : (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", styleConfig.dotBase)} />
      )}
      <span>{displayLabel}</span>
    </span>
  )
}
