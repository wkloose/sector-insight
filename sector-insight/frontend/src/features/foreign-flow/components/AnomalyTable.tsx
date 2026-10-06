import React from "react"
import { AnomalyRecord } from "../types/foreignFlow"

export interface AnomalyTableProps {
  anomalies: AnomalyRecord[]
  className?: string
}

export const AnomalyTable: React.FC<AnomalyTableProps> = ({
  anomalies,
  className,
}) => {
  return (
    <div
      className={
        className ||
        "bg-surface-card rounded border border-border-subtle overflow-hidden"
      }
    >
      <div className="flex items-center justify-between p-space-md border-b border-border-subtle bg-surface-container-lowest/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-data-bearish">
            warning
          </span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Konfirmasi Broker Dominan (Jendela 14 Hari Terakhir)
          </h3>
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-data-bullish border border-border-subtle">
          Sectors Broker API Terkoneksi
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-body-sm text-[13px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-container-lowest/30 text-caption font-caption text-text-secondary uppercase">
              <th className="px-space-md py-space-sm">Tanggal</th>
              <th className="px-space-md py-space-sm">Net Flow Asing</th>
              <th className="px-space-md py-space-sm">Z-Score</th>
              <th className="px-space-md py-space-sm">Broker Dominan</th>
              <th className="px-space-md py-space-sm">Kategori</th>
              <th className="px-space-md py-space-sm text-right">Aksi Dominan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {anomalies.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-space-md py-space-xl text-center text-text-secondary font-body-sm">
                  Tidak ada anomali transaksi broker yang terdeteksi dalam 14 hari terakhir.
                </td>
              </tr>
            ) : (
              anomalies.map((anom) => {
                const isSell = anom.action === "Net Sell"

                return (
                  <tr
                    key={anom.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                  <td className="px-space-md py-space-sm font-mono text-[12px] text-text-primary font-medium">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSell ? "bg-data-bearish" : "bg-data-bullish"
                        }`}
                      />
                      <span>{anom.displayDate}</span>
                    </div>
                  </td>

                  <td className="px-space-md py-space-sm font-mono text-tabular-sm font-bold">
                    <span
                      className={
                        isSell ? "text-data-bearish" : "text-data-bullish"
                      }
                    >
                      {anom.netFlowFormatted}
                    </span>
                  </td>

                  <td className="px-space-md py-space-sm font-mono text-tabular-sm">
                    <span
                      className={`px-1.5 py-0.5 rounded font-semibold ${
                        isSell
                          ? "bg-data-bearish/15 text-data-bearish"
                          : "bg-data-bullish/15 text-data-bullish"
                      }`}
                    >
                      {anom.zScore >= 0 ? `+${anom.zScore}` : anom.zScore}σ
                    </span>
                  </td>

                  <td className="px-space-md py-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-tabular-sm font-bold px-1.5 py-0.5 rounded bg-surface-container-high text-text-primary">
                        {anom.dominantBroker.code}
                      </span>
                      <span className="text-text-primary">
                        {anom.dominantBroker.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-space-md py-space-sm font-caption text-caption text-text-secondary">
                    {anom.dominantBroker.category}
                  </td>

                  <td className="px-space-md py-space-sm text-right font-mono text-tabular-sm font-bold">
                    <span
                      className={
                        isSell ? "text-data-bearish" : "text-data-bullish"
                      }
                    >
                      {anom.action}
                    </span>
                  </td>
                </tr>
              )
            }))}
          </tbody>
        </table>
      </div>

      <div className="p-space-sm bg-surface-container-lowest/50 border-t border-border-subtle/50 font-caption text-caption text-text-secondary flex items-center gap-2">
        <span className="material-symbols-outlined text-[15px] text-data-neutral">
          info
        </span>
        <span>
          Catatan limitasi: Data transaksi broker orderbook dibatasi periode 14 hari kalender terakhir. Histori 90 hari menyajikan data time-series arus agregat.
        </span>
      </div>
    </div>
  )
}

