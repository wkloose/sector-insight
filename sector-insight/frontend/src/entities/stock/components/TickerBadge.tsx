import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface TickerBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  ticker: string
  subsector?: string
  size?: "sm" | "md" | "lg"
}

export const TickerBadge: React.FC<TickerBadgeProps> = ({
  ticker,
  subsector,
  size = "md",
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: "text-label-ticker text-[13px]",
    md: "text-label-ticker text-[15px]",
    lg: "text-label-ticker text-[20px]",
  }

  return (
    <div className={cn("inline-flex items-center gap-space-xs", className)} {...props}>
      <span className={cn("font-bold text-text-primary tracking-wide", sizeClasses[size])}>
        {ticker}
      </span>
      {subsector && (
        <span className="font-caption text-caption text-text-secondary uppercase">
          {subsector}
        </span>
      )}
    </div>
  )
}

