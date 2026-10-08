"use client"

import React from "react"
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import { DailyFlowPoint } from "../types/foreignFlow"

export interface ForeignFlowChartProps {
  data: DailyFlowPoint[]
  className?: string
}

export const ForeignFlowChart: React.FC<ForeignFlowChartProps> = ({
  data,
  className,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={className || "w-full h-72 bg-surface-card p-space-md rounded border border-border-subtle flex flex-col items-center justify-center text-center text-text-secondary"}>
        <span className="material-symbols-outlined text-[28px] mb-1">
          bar_chart
        </span>
        <span className="font-body-sm text-[13px]">
          Data arus foreign flow belum tersedia
        </span>
      </div>
    )
  }

  return (
    <div className={className || "w-full h-72 bg-surface-card p-space-md rounded border border-border-subtle"}>
      <div className="flex items-center justify-between mb-space-sm font-caption text-caption text-text-secondary">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-data-bullish" />
            <span>Inflow Harian</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-data-bearish" />
            <span>Outflow Harian</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <span>-- Ambang Batas Anomali (|Z| ≥ 2.0σ)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="displayDate"
            stroke="#2E2A2D"
            tick={{ fill: "#9C9498", fontSize: 11, fontFamily: "var(--font-jetbrains-mono)" }}
          />
          <YAxis
            stroke="#2E2A2D"
            tick={{ fill: "#9C9498", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)" }}
            tickFormatter={(val) => `${val}M`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null
              const item = payload[0].payload as DailyFlowPoint
              return (
                <div className="bg-surface-card border border-border-subtle p-2 rounded shadow-md font-mono text-[12px] text-text-primary">
                  <div className="text-text-secondary text-[10px] mb-1">{item.displayDate}</div>
                  <div className="font-bold">
                    {item.netFlow < 0 ? "-" : "+"}Rp {Math.abs(item.netFlow)} Miliar (Z: {item.zScore >= 0 ? `+${item.zScore}` : item.zScore}σ)
                  </div>
                  {item.isAnomaly && (
                    <div className="text-data-bearish text-[11px] font-semibold mt-0.5">
                      ANOMALI TERDETEKSI
                    </div>
                  )}
                </div>
              )
            }}
          />
          <ReferenceLine y={0} stroke="#2E2A2D" />
          <ReferenceLine y={150} stroke="#3FAE6A" strokeDasharray="3 3" />
          <ReferenceLine y={-100} stroke="#C23B3B" strokeDasharray="3 3" />
          <Bar dataKey="netFlow">
            {data.map((entry, index) => {
              const isPositive = entry.netFlow >= 0
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isPositive ? "#3FAE6A" : "#C23B3B"}
                  fillOpacity={entry.isAnomaly ? 1 : 0.65}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
