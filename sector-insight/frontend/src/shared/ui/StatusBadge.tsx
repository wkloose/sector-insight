import React from "react"
import { cn } from "@/src/shared/lib/cn"
import { StatusType } from "@/src/shared/types/common"
import { STATUS_LABELS } from "@/src/shared/lib/constants"

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType | "STABLE" | "WARNING" | "CRITICAL" | "Stabil" | "Waspada" | "Perhatian Khusus"
  size?: "sm" | "md"
  showDot?: boolean
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  showDot = true,
  className,
  ...props
}) => {
  const normalizedStatus =
    status === "Stabil"
      ? StatusType.STABLE
      : status === "Waspada"
      ? StatusType.WARNING
      : status === "Perhatian Khusus"
      ? StatusType.CRITICAL
      : (status as StatusType)

  const config = {
    [StatusType.STABLE]: {
      label: STATUS_LABELS.STABLE,
      container: "bg-data-bullish/15 text-data-bullish border-data-bullish/30",
      dot: "bg-data-bullish",
    },
    [StatusType.WARNING]: {
      label: STATUS_LABELS.WARNING,
      container: "bg-data-neutral/15 text-data-neutral border-data-neutral/30",
      dot: "bg-data-neutral",
    },
    [StatusType.CRITICAL]: {
      label: size === "sm" ? "Perhatian" : STATUS_LABELS.CRITICAL,
      container: "bg-data-bearish/15 text-data-bearish border-data-bearish/30",
      dot: "bg-data-bearish",
    },
  }[normalizedStatus] || {
    label: String(status),
    container: "bg-surface-container-high text-text-secondary border-border-subtle",
    dot: "bg-text-secondary",
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1.5",
    md: "px-2.5 py-1 text-caption gap-2",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded border select-none tracking-wide whitespace-nowrap shrink-0",
        config.container,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />}
      <span>{config.label}</span>
    </span>
  )
}
