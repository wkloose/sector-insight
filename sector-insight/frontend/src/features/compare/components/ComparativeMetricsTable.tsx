"use client"

import React from "react"
import Link from "next/link"
import { StockCompareProfile } from "../types"
import { StatusBadge } from "@/src/shared/ui/StatusBadge"

interface ComparativeMetricsTableProps {
  stocks: StockCompareProfile[]
  onOpenSelector: (replaceIndex: number) => void
  onRemoveStock: (index: number) => void
}

export const ComparativeMetricsTable: React.FC<ComparativeMetricsTableProps> = ({
  stocks,
  onOpenSelector,
  onRemoveStock,
}) => {
  const formatIDR = (val: number) => {
    if (Math.abs(val) >= 1e12) return `Rp ${(val / 1e12).toFixed(2)} T`
    if (Math.abs(val) >= 1e9) return `Rp ${(val / 1e9).toFixed(1)} M`
    if (Math.abs(val) >= 1e6) return `Rp ${(val / 1e6).toFixed(1)} Jt`
    return `Rp ${val.toLocaleString("id-ID")}`
  }

  const normalizeStatus = (status: string): "Stabil" | "Waspada" | "Perhatian Khusus" => {
    if (status.includes("Sehat") || status === "Stabil" || status === "STABLE") return "Stabil"
    if (status.includes("Waspada") || status === "WARNING") return "Waspada"
    return "Perhatian Khusus"
  }

  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden shadow-sm">
      <div className="p-space-md bg-surface-container-lowest/60 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Matriks Parameter Komparasi Head-to-Head
          </h3>
          <p className="font-caption text-caption text-text-secondary">
            Perbandingan metrik finansial terperinci lintas pilar untuk {stocks.length} emiten
          </p>
        </div>
        <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-surface-container-low text-text-secondary">
          {stocks.length} Saham Terpilih
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-body-sm text-[13px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-container-lowest/40 font-caption text-caption text-text-secondary uppercase">
              <th className="px-space-md py-space-sm w-1/4">Parameter Komparasi</th>
              {stocks.map((stock, idx) => (
                <th key={stock.ticker} className="px-space-md py-space-sm min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-headline-sm text-text-primary">
                          {stock.ticker}
                        </span>
                        <span className="font-caption text-[11px] text-text-tertiary">
                          ({stock.sector})
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary line-clamp-1 font-normal lowercase capitalize">
                        {stock.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenSelector(idx)}
                        title="Ganti Saham"
                        className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-container-low"
                      >
                        <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                      </button>
                      {stocks.length > 2 && (
                        <button
                          onClick={() => onRemoveStock(idx)}
                          title="Hapus Saham"
                          className="p-1 rounded text-brand-red/80 hover:text-brand-red hover:bg-brand-red-soft/20"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-semibold text-text-primary">
                Status Kesehatan
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm">
                  <StatusBadge status={normalizeStatus(s.health_status)} size="sm" />
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-semibold text-text-primary">
                Skor Fundamental (PRD)
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm font-mono text-tabular-md font-bold text-data-bullish">
                  {s.fundamental_score} / 100
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-medium text-text-secondary">
                Harga Terakhir & Return
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm font-mono font-bold">
                  Rp {s.price.toLocaleString("id-ID")}{" "}
                  <span className={`text-[11px] ${s.change_percent >= 0 ? "text-data-bullish" : "text-data-bearish"}`}>
                    ({s.change_percent >= 0 ? "+" : ""}{s.change_percent.toFixed(2)}%)
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-medium text-text-secondary">
                Return on Equity (ROE)
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm font-mono font-semibold">
                  {s.roe.toFixed(1)}%
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-medium text-text-secondary">
                Price to Earnings (PER)
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm font-mono">
                  {s.pe.toFixed(1)}x
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-medium text-text-secondary">
                Price to Book (PBV)
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm font-mono">
                  {s.pbv.toFixed(2)}x
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-medium text-text-secondary">
                Kapitalisasi Pasar (Market Cap)
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm font-mono text-text-secondary">
                  {formatIDR(s.market_cap)}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-semibold text-text-primary">
                Net Foreign Flow
              </td>
              {stocks.map((s) => (
                <td
                  key={s.ticker}
                  className={`px-space-md py-space-sm font-mono font-bold ${
                    s.net_foreign_flow >= 0 ? "text-data-bullish" : "text-data-bearish"
                  }`}
                >
                  {s.net_foreign_flow >= 0 ? "+" : ""}{formatIDR(s.net_foreign_flow)}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-semibold text-text-primary">
                Deviasi Arus Asing (Z-Score)
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm font-mono">
                  <span
                    className={
                      Math.abs(s.foreign_z_score) >= 2.0
                        ? "text-brand-red font-bold"
                        : s.foreign_z_score > 0
                        ? "text-data-bullish"
                        : "text-text-primary"
                    }
                  >
                    {s.foreign_z_score >= 0 ? "+" : ""}{s.foreign_z_score.toFixed(2)}σ
                  </span>{" "}
                  <span className="text-[11px] text-text-tertiary">
                    ({s.foreign_anomaly.split("(")[0].trim()})
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-semibold text-text-primary">
                Sentimen Berita Pasar (NLP)
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm font-mono">
                  <span
                    className={
                      s.sentiment_score > 0.1
                        ? "text-data-bullish font-bold"
                        : s.sentiment_score < -0.1
                        ? "text-data-bearish font-bold"
                        : "text-text-primary"
                    }
                  >
                    {s.sentiment_score > 0 ? "+" : ""}{s.sentiment_score.toFixed(2)}
                  </span>{" "}
                  <span className="text-[11px] text-text-secondary">
                    ({s.sentiment_label})
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-surface-container-low/50">
              <td className="px-space-md py-space-sm font-medium text-text-secondary">
                Aksi & Eksplorasi
              </td>
              {stocks.map((s) => (
                <td key={s.ticker} className="px-space-md py-space-sm">
                  <Link
                    href={`/stock/${s.ticker}`}
                    className="text-brand-red hover:underline font-semibold inline-flex items-center gap-1 text-[12px]"
                  >
                    <span>Detail Saham</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
