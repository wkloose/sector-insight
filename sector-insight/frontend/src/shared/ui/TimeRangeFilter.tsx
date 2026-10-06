import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface TimeRangeOption {
  label: string
  value: string
}

export interface TimeRangeFilterProps {
  options?: TimeRangeOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  size?: "sm" | "md"
}

const DEFAULT_OPTIONS: TimeRangeOption[] = [
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "90 Hari", value: "90d" },
]

export const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  options = DEFAULT_OPTIONS,
  value,
  onChange,
  className,
  size = "sm",
}) => {
  return (
    <div
      role="group"
      aria-label="Filter rentang waktu"
      className={cn(
        "inline-flex items-center p-0.5 bg-surface-container-lowest border border-border-subtle rounded",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "font-medium rounded transition-all select-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-red",
              size === "sm" ? "px-2.5 py-1 text-caption" : "px-3 py-1.5 text-body-sm",
              isActive
                ? "bg-brand-red text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-card"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

