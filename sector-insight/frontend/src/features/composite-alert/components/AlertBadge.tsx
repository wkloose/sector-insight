import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface AlertBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean
  label?: string
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({
  active = true,
  label = "Sintesis Sinyal Aktif",
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-caption text-[11px] font-semibold tracking-wider uppercase select-none",
        active
          ? "bg-brand-red text-text-primary shadow-sm"
          : "bg-surface-container-high text-text-secondary",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "material-symbols-outlined text-[14px]",
          active && "animate-pulse"
        )}
      >
        priority_high
      </span>
      <span>{label}</span>
    </span>
  )
}

