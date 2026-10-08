"use client"

import React from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { MarketForeignFlowSummary } from "../types/foreignFlow"

interface MarketForeignFlowOverviewProps {
  summary: MarketForeignFlowSummary
}

function formatIDR(val: number): string {
  const abs = Math.abs(val)
  const sign = val >= 0 ? "+" : "-"
  if (abs >= 1e12) {
    return `${sign}Rp ${(abs / 1e12).toFixed(2)} T`
  }
  if (abs >= 1e9) {
    return `${sign}Rp ${(abs / 1e9).toFixed(1)} M`
  }
  return `${sign}Rp ${abs.toLocaleString("id-ID")}`
}

export function MarketForeignFlowOverview({ summary }: MarketForeignFlowOverviewProps) {
  const isNetBuyToday = summary.total_net_flow_today >= 0

  const chartData = (summary.history_30d || []).map((pt) => {
    const d = new Date(pt.date)
    const displayDate = !isNaN(d.getTime())
      ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
      : pt.date
    return {
      date: pt.date,
      displayDate,
      netFlowM: Number((pt.net_flow / 1e9).toFixed(1)),
      rawNetFlow: pt.net_flow,
    }
  })

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className={`p-space-lg rounded border flex flex-col justify-between ${
          isNetBuyToday
            ? "bg-data-bullish/10 border-data-bullish/30"
            : "bg-data-bearish/10 border-data-bearish/30"
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-caption text-caption text-text-secondary uppercase tracking-wider">
                Arus Bersih Asing Hari Ini
              </span>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold ${
                isNetBuyToday
                  ? "bg-data-bullish/20 text-data-bullish"
                  : "bg-data-bearish/20 text-data-bearish"
              }`}>
                {isNetBuyToday ? "NET BUY" : "NET SELL"}
              </span>
            </div>
            <div className={`font-mono text-2xl font-bold tracking-tight my-1 ${
              isNetBuyToday ? "text-data-bullish" : "text-data-bearish"
            }`}>
              {formatIDR(summary.total_net_flow_today)}
            </div>
          </div>
          <p className="font-caption text-caption text-text-secondary mt-2 border-t border-border-subtle/50 pt-2">
            Seluruh transaksi pasar reguler & negosiasi BEI
          </p>
        </div>

        <div className="p-space-lg rounded border border-border-subtle bg-surface-card flex flex-col justify-between">
          <div>
            <span className="font-caption text-caption text-text-secondary uppercase tracking-wider">
              Total Beli & Jual Asing
            </span>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="font-caption text-[11px] text-text-secondary">Foreign Buy</span>
                <div className="font-mono text-tabular-md font-bold text-data-bullish">
                  Rp {(summary.total_foreign_buy / 1e12).toFixed(2)} T
                </div>
              </div>
              <div className="text-right">
                <span className="font-caption text-[11px] text-text-secondary">Foreign Sell</span>
                <div className="font-mono text-tabular-md font-bold text-data-bearish">
                  Rp {(summary.total_foreign_sell / 1e12).toFixed(2)} T
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-3 flex">
            <div
              className="bg-data-bullish h-full"
              style={{
                width: `${(summary.total_foreign_buy / (summary.total_foreign_buy + summary.total_foreign_sell || 1)) * 100}%`,
              }}
            />
            <div
              className="bg-data-bearish h-full flex-1"
            />
          </div>
        </div>

        <div className="p-space-lg rounded border border-border-subtle bg-surface-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-caption text-caption text-text-secondary uppercase tracking-wider">
                Partisipasi Modal Asing
              </span>
              <span className="font-mono text-[11px] text-text-secondary">
                Turnover BEI
              </span>
            </div>
            <div className="font-mono text-2xl font-bold text-text-primary tracking-tight my-1">
              {summary.foreign_participation_percent.toFixed(1)}%
            </div>
          </div>
          <div className="flex items-center justify-between font-caption text-caption text-text-secondary border-t border-border-subtle/50 pt-2 mt-2">
            <span>Asing: <strong className="text-text-primary font-mono">{summary.foreign_participation_percent.toFixed(1)}%</strong></span>
            <span>Domestik: <strong className="text-text-primary font-mono">{(100 - summary.foreign_participation_percent).toFixed(1)}%</strong></span>
          </div>
        </div>

        <div className="p-space-lg rounded border border-border-subtle bg-surface-card flex flex-col justify-between">
          <div>
            <span className="font-caption text-caption text-text-secondary uppercase tracking-wider">
              Kumulatif Aliran Asing
            </span>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <span className="font-caption text-[11px] text-text-secondary">7 Hari</span>
                <div className={`font-mono text-tabular-sm font-bold ${
                  summary.net_flow_7d >= 0 ? "text-data-bullish" : "text-data-bearish"
                }`}>
                  {formatIDR(summary.net_flow_7d)}
                </div>
              </div>
              <div>
                <span className="font-caption text-[11px] text-text-secondary">30 Hari</span>
                <div className={`font-mono text-tabular-sm font-bold ${
                  summary.net_flow_30d >= 0 ? "text-data-bullish" : "text-data-bearish"
                }`}>
                  {formatIDR(summary.net_flow_30d)}
                </div>
              </div>
              <div>
                <span className="font-caption text-[11px] text-text-secondary">90 Hari</span>
                <div className={`font-mono text-tabular-sm font-bold ${
                  summary.net_flow_90d >= 0 ? "text-data-bullish" : "text-data-bearish"
                }`}>
                  {formatIDR(summary.net_flow_90d)}
                </div>
              </div>
            </div>
          </div>
          <p className="font-caption text-caption text-text-secondary border-t border-border-subtle/50 pt-2 mt-2">
            Tren akumulasi kuartal berjalan
          </p>
        </div>
      </div>

      <div className="p-space-lg rounded border border-border-subtle bg-surface-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[20px]">
              stacked_bar_chart
            </span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Tren Arus Bersih Asing Pasar Modal Indonesia (30 Hari)
            </h2>
          </div>
          <div className="flex items-center gap-space-md font-caption text-caption text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-data-bullish" />
              <span>Net Inflow (Akumulasi)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-data-bearish" />
              <span>Net Outflow (Distribusi)</span>
            </div>
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="displayDate"
                stroke="#4E474A"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const item = payload[0].payload
                  return (
                    <div className="bg-surface-container-highest border border-border-subtle p-space-sm rounded shadow-lg text-xs font-mono">
                      <div className="text-text-secondary mb-1">{item.date}</div>
                      <div className={item.rawNetFlow >= 0 ? "text-data-bullish font-bold" : "text-data-bearish font-bold"}>
                        {formatIDR(item.rawNetFlow)}
                      </div>
                    </div>
                  )
                }}
              />
              <Bar dataKey="netFlowM" radius={[2, 2, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.rawNetFlow >= 0 ? "#00D084" : "#FF4D4D"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-space-lg rounded border border-border-subtle bg-surface-card">
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[20px]">
              pie_chart
            </span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Distribusi Aliran Modal Asing Lintas 11 Sektor (IDX-IC)
            </h2>
          </div>
          <span className="font-caption text-caption text-text-secondary">
            Akumulasi vs Distribusi Sektoral
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
          {summary.sector_breakdown.map((sec) => {
            const isPositive = sec.net_flow >= 0
            return (
              <Link
                key={sec.sector_slug}
                href={`/sectors/${sec.sector_slug}`}
                className="p-space-md rounded bg-surface-container-lowest border border-border-subtle hover:border-brand-red/50 hover:bg-surface-container-low transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-body-sm font-semibold text-text-primary text-[13px] group-hover:text-brand-red transition-colors line-clamp-1">
                      {sec.sector_name}
                    </span>
                    <span className="material-symbols-outlined text-text-secondary group-hover:text-brand-red text-[16px] transition-colors shrink-0">
                      arrow_outward
                    </span>
                  </div>
                  <div className={`font-mono text-tabular-md font-bold ${
                    isPositive ? "text-data-bullish" : "text-data-bearish"
                  }`}>
                    {formatIDR(sec.net_flow)}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-border-subtle/50 flex items-center justify-between">
                  <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-medium ${
                    isPositive ? "bg-data-bullish/15 text-data-bullish" : "bg-data-bearish/15 text-data-bearish"
                  }`}>
                    {sec.status}
                  </span>
                  <span className="font-caption text-[11px] text-text-secondary group-hover:underline">
                    Lihat Saham
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
