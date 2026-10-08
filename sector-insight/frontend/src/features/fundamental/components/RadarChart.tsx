"use client"

import React from "react"
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { FundamentalDimension } from "../types/fundamental"

export interface RadarChartProps {
  dimensions: FundamentalDimension[]
  className?: string
}

export const RadarChart: React.FC<RadarChartProps> = ({ dimensions, className }) => {
  if (!dimensions || dimensions.length === 0) {
    return (
      <div className={className || "w-full h-64 flex flex-col items-center justify-center text-text-secondary"}>
        <span className="material-symbols-outlined text-[28px] mb-1">
          radar
        </span>
        <span className="font-body-sm text-[13px]">
          Data radar profil belum tersedia
        </span>
      </div>
    )
  }

  const chartData = dimensions.map((d) => ({
    dimension: d.name.split(" (")[0],
    score: d.score,
    fullMark: 100,
  }))

  return (
    <div className={className || "w-full h-64 flex items-center justify-center"}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#2E2A2D" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#9C9498", fontSize: 11, fontFamily: "var(--font-inter)" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            stroke="#2E2A2D"
            tick={{ fill: "#9C9498", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)" }}
          />
          <Radar
            name="Skor"
            dataKey="score"
            stroke="#E8293D"
            fill="#E8293D"
            fillOpacity={0.25}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  )
}
