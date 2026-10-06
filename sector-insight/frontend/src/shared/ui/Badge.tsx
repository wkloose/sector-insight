import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "brand" | "bullish" | "bearish" | "neutral" | "muted"
  size?: "sm" | "md"
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded select-none uppercase tracking-wider"

  const variantStyles = {
    default: "bg-surface-container-high text-text-primary border border-border-subtle",
    outline: "bg-transparent text-text-secondary border border-border-subtle",
    brand: "bg-brand-red/15 text-brand-red border border-brand-red/30",
    bullish: "bg-data-bullish/15 text-data-bullish border border-data-bullish/30",
    bearish: "bg-data-bearish/15 text-data-bearish border border-data-bearish/30",
    neutral: "bg-data-neutral/15 text-data-neutral border border-data-neutral/30",
    muted: "bg-surface-card text-text-secondary",
  }

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[11px] leading-tight",
    md: "px-2 py-1 text-caption leading-normal",
  }

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  )
}

