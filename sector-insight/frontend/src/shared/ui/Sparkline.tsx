"use client"

import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  trend?: "bullish" | "bearish" | "neutral"
  className?: string
  strokeWidth?: number
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 60,
  height = 18,
  color,
  trend,
  className,
  strokeWidth = 1.5,
}) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className={cn("inline-block", className)} />
  }

  const determinedTrend =
    trend || (data[data.length - 1] >= data[0] ? "bullish" : "bearish")

  const strokeColor =
    color ||
    (determinedTrend === "bullish"
      ? "#3FAE6A"
      : determinedTrend === "bearish"
      ? "#C23B3B"
      : "#C9A227")

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 4) + 2
      const y = height - 2 - ((val - min) / range) * (height - 4)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("inline-block overflow-visible shrink-0", className)}
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}
