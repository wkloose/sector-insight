import React from "react"
import { FundamentalDimension } from "../types/fundamental"

export interface ScoreBreakdownProps {
  dimensions: FundamentalDimension[]
  financialMetrics?: {
    nim: string
    ldr: string
    roe: string
    npl: string
    casa: string
  }
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  dimensions,
  financialMetrics,
}) => {
  return (
    <div className="flex flex-col gap-space-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-body-sm text-[13px]">
          <thead>
            <tr className="border-b border-border-subtle text-caption font-caption text-text-secondary uppercase">
              <th className="py-2 pr-2">Komponen</th>
              <th className="py-2 px-2 text-center">Bobot</th>
              <th className="py-2 px-2 text-right">Nilai / Rasio</th>
              <th className="py-2 pl-2 text-right">Skor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {dimensions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-space-md text-center text-text-secondary font-body-sm">
                  Data rincian dimensi skor belum tersedia.
                </td>
              </tr>
            ) : (
              dimensions.map((dim) => (
                <tr key={dim.key} className="hover:bg-surface-container-low transition-colors">
                <td className="py-2 pr-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-text-primary">{dim.name}</span>
                    {dim.evaluation && (
                      <span className="text-[11px] text-text-secondary">
                        {dim.evaluation}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-2 text-center font-mono text-[12px] text-text-secondary">
                  {dim.weight}%
                </td>
                <td className="py-2 px-2 text-right font-mono text-[12px] text-text-primary">
                  {dim.rawValue ?? "--"}
                </td>
                <td className={`py-2 pl-2 text-right font-mono text-tabular-sm font-bold ${
                  dim.score < 60 ? "text-data-bearish" : dim.score < 75 ? "text-data-neutral" : "text-data-bullish"
                }`}>
                  {dim.score}
                  <span className="text-text-secondary text-[10px] font-normal">/100</span>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {financialMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-space-sm bg-surface-container-lowest rounded border border-border-subtle">
          <div className="flex flex-col">
            <span className="font-caption text-[10px] text-text-secondary uppercase">NIM</span>
            <span className="font-mono text-tabular-sm font-semibold text-text-primary">{financialMetrics.nim}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-caption text-[10px] text-text-secondary uppercase">LDR</span>
            <span className="font-mono text-tabular-sm font-semibold text-text-primary">{financialMetrics.ldr}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-caption text-[10px] text-text-secondary uppercase">ROE</span>
            <span className="font-mono text-tabular-sm font-semibold text-text-primary">{financialMetrics.roe}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-caption text-[10px] text-text-secondary uppercase">Gross NPL</span>
            <span className="font-mono text-tabular-sm font-semibold text-text-primary">{financialMetrics.npl}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-caption text-[10px] text-text-secondary uppercase">CASA</span>
            <span className="font-mono text-tabular-sm font-semibold text-text-primary">{financialMetrics.casa}</span>
          </div>
        </div>
      )}
    </div>
  )
}
