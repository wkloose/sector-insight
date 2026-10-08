"use client"

import React from "react"
import { StockCompareProfile } from "../types"

interface ComparativeRadarChartProps {
  stocks: StockCompareProfile[]
}

const AXIS_LABELS = [
  "Kesehatan Fundamental",
  "Profitabilitas (ROE)",
  "Dukungan Foreign Flow",
  "Sentimen Berita",
  "Efisiensi Valuasi",
  "Skala Kapitalisasi",
]

const COLORS = [
  { stroke: "#3FAE6A", fill: "#3FAE6A", bg: "bg-[#3FAE6A]" },
  { stroke: "#E5A93B", fill: "#E5A93B", bg: "bg-[#E5A93B]" },
  { stroke: "#E8293D", fill: "#E8293D", bg: "bg-[#E8293D]" },
]

export const ComparativeRadarChart: React.FC<ComparativeRadarChartProps> = ({ stocks }) => {
  const centerX = 140
  const centerY = 140
  const radius = 100
  const numAxes = 6

  const getCoordinates = (valueNormalized: number, axisIndex: number) => {
    const angle = (Math.PI * 2 / numAxes) * axisIndex - Math.PI / 2
    const r = Math.max(10, Math.min(radius, (valueNormalized / 100) * radius))
    const x = centerX + r * Math.cos(angle)
    const y = centerY + r * Math.sin(angle)
    return { x, y }
  }

  const getStockNormalizedValues = (stock: StockCompareProfile) => {
    const fundNorm = Math.min(100, Math.max(10, stock.fundamental_score))
    const roeNorm = Math.min(100, Math.max(10, (stock.roe / 25) * 100))
    const flowNorm = Math.min(100, Math.max(10, ((stock.foreign_z_score + 3) / 6) * 100))
    const sentNorm = Math.min(100, Math.max(10, ((stock.sentiment_score + 1) / 2) * 100))
    const valNorm = Math.min(100, Math.max(10, Math.max(0, 100 - (stock.pe / 30) * 100)))
    const capNorm = Math.min(100, Math.max(10, (Math.log10(Math.max(1e11, stock.market_cap)) - 11) / 4 * 100))
    return [fundNorm, roeNorm, flowNorm, sentNorm, valNorm, capNorm]
  }

  return (
    <div className="bg-surface-card p-space-lg rounded-xl border border-border-subtle flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Radar Profil 6 Dimensi
          </h3>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-low text-text-secondary">
            NORMALISASI 0-100
          </span>
        </div>
        <p className="font-caption text-caption text-text-secondary">
          Perbandingan proporsional antar-pilar kekuatan emiten terpilih
        </p>

        <div className="w-full flex items-center justify-center my-4 relative h-72">
          <svg className="w-72 h-72 overflow-visible" viewBox="0 0 280 280">
            {[0.25, 0.5, 0.75, 1.0].map((level, i) => {
              const points = Array.from({ length: numAxes }).map((_, aIdx) => {
                const angle = (Math.PI * 2 / numAxes) * aIdx - Math.PI / 2
                const r = radius * level
                return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`
              }).join(" ")
              return (
                <polygon
                  key={i}
                  points={points}
                  fill="none"
                  stroke="#2E2A2D"
                  strokeDasharray={level < 1 ? "3 3" : undefined}
                  strokeWidth="1"
                />
              )
            })}

            {Array.from({ length: numAxes }).map((_, aIdx) => {
              const angle = (Math.PI * 2 / numAxes) * aIdx - Math.PI / 2
              const x2 = centerX + radius * Math.cos(angle)
              const y2 = centerY + radius * Math.sin(angle)
              return (
                <line
                  key={aIdx}
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke="#2E2A2D"
                  strokeWidth="1"
                />
              )
            })}

            {stocks.map((stock, sIdx) => {
              const values = getStockNormalizedValues(stock)
              const pointsStr = values
                .map((val, aIdx) => {
                  const { x, y } = getCoordinates(val, aIdx)
                  return `${x},${y}`
                })
                .join(" ")
              const color = COLORS[sIdx % COLORS.length]
              return (
                <polygon
                  key={stock.ticker}
                  points={pointsStr}
                  fill={color.fill}
                  fillOpacity="0.25"
                  stroke={color.stroke}
                  strokeWidth="2"
                />
              )
            })}

            {AXIS_LABELS.map((lbl, aIdx) => {
              const angle = (Math.PI * 2 / numAxes) * aIdx - Math.PI / 2
              const labelR = radius + 22
              const lx = centerX + labelR * Math.cos(angle)
              const ly = centerY + labelR * Math.sin(angle)
              return (
                <text
                  key={aIdx}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-text-secondary text-[10px] font-mono select-none"
                >
                  {lbl}
                </text>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border-subtle/50 text-caption font-mono">
        <div className="flex items-center gap-3">
          {stocks.map((stock, sIdx) => {
            const color = COLORS[sIdx % COLORS.length]
            return (
              <span key={stock.ticker} className="flex items-center gap-1.5 text-text-primary">
                <span className={`w-2.5 h-2.5 rounded-sm ${color.bg}`} />
                <span className="font-bold">{stock.ticker}</span>
              </span>
            )
          })}
        </div>
        <span className="text-text-tertiary text-[11px]">Skor Multi-Dimensi BEI</span>
      </div>
    </div>
  )
}
