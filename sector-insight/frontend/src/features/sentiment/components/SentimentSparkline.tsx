"use client"

import React from "react"
import { Sparkline } from "@/src/shared/ui/Sparkline"

export interface SentimentSparklineProps {
  data: number[]
  className?: string
}

export const SentimentSparkline: React.FC<SentimentSparklineProps> = ({
  data,
  className,
}) => {
  return (
    <div className={className}>
      <Sparkline data={data} width={80} height={20} />
    </div>
  )
}

