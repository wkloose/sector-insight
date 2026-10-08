import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text"
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangle",
  ...props
}) => {
  const variantStyles = {
    rectangle: "rounded",
    circle: "rounded-full shrink-0",
    text: "rounded h-4 w-full",
  }

  return (
    <div
      className={cn(
        "bg-surface-container-high/60 animate-pulse",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}
