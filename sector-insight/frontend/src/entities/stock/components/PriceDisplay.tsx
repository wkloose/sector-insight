import React from "react"
import { cn } from "@/src/shared/lib/cn"
import { formatPercent } from "@/src/shared/lib/format"

export interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number
  changePercent: number
  size?: "sm" | "md" | "lg"
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  changePercent,
  size = "md",
  className,
  ...props
}) => {
  const isPositive = changePercent >= 0
  const formattedPrice = new Intl.NumberFormat("id-ID").format(price)

  const sizeClasses = {
    sm: "text-[18px]",
    md: "text-[22px]",
    lg: "text-[28px]",
  }

  return (
    <div className={cn("flex items-baseline justify-between", className)} {...props}>
      <span className={cn("font-mono font-bold text-text-primary", sizeClasses[size])}>
        {formattedPrice}
      </span>
      <div
        className={cn(
          "flex items-center font-mono text-tabular-sm font-medium",
          isPositive ? "text-data-bullish" : "text-data-bearish"
        )}
      >
        <span className="material-symbols-outlined text-[14px]">
          {isPositive ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
        <span>{formatPercent(changePercent)}</span>
      </div>
    </div>
  )
}

