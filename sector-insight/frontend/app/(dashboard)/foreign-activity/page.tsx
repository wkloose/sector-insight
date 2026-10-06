import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import {
  ForeignFlowChart,
  AnomalyTable,
  getForeignFlowData,
  getForeignFlowSummary,
} from "@/src/features/foreign-flow"

export const metadata: Metadata = {
  title: "Aktivitas & Anomali Asing Lintas Sektor",
  description: "Deteksi anomali statistik arus dana broker asing dan visualisasi 90 hari saham perbankan",
}

const TRACKED_BANKS = [
  { ticker: "BBCA", name: "Bank Central Asia Tbk" },
  { ticker: "BBRI", name: "Bank Rakyat Indonesia Tbk" },
  { ticker: "BMRI", name: "Bank Mandiri (Persero) Tbk" },
  { ticker: "BBNI", name: "Bank Negara Indonesia Tbk" },
  { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk" },
  { ticker: "BBTN", name: "Bank Tabungan Negara Tbk" },
]

export default async function ForeignActivityHubPage() {
  const [summaryAnomalies, primaryData] = await Promise.all([
    getForeignFlowSummary(),
    getForeignFlowData("BBRI"),
  ])

  return (
    <div className="flex flex-col w-full pb-space-lg">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              PILLAR 3: FOREIGN FLOW
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              90-DAY STATISTICAL ENGINE
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Aktivitas & Deteksi Anomali Asing
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Pemantauan deviasi arus dana institusi asing (Z-score 90 hari) dan pelacakan konsentrasi broker 14 hari untuk mendeteksi divergensi akumulasi/distribusi di sektor finansial.
          </p>
        </div>

        <div className="flex items-center gap-space-xs p-1 bg-surface-card rounded border border-border-subtle overflow-x-auto">
          {TRACKED_BANKS.map((b) => (
            <Link
              key={b.ticker}
              href={`/foreign-activity/${b.ticker}`}
              className={`px-3 py-1.5 rounded font-mono text-tabular-sm font-semibold transition-colors ${
                b.ticker === "BBRI"
                  ? "bg-brand-red text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-container"
              }`}
            >
              {b.ticker}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-space-lg bg-surface-card rounded border border-border-subtle mb-space-lg">
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-space-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
            <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Ringkasan Anomali Arus Asing Terdeteksi (Live Summary)
            </h2>
          </div>
          <span className="font-caption text-caption text-text-secondary">
            {summaryAnomalies.length} Kejadian Terkonfirmasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md mb-space-md">
          {summaryAnomalies.map((anom) => {
            const isOutflow = anom.status_anomali.includes("OUTFLOW") || anom.z_score < 0
            const flowFormatted = `${anom.net_foreign_inflow >= 0 ? "+" : "-"}Rp ${(Math.abs(anom.net_foreign_inflow) / 1000000000).toFixed(1)} M`
            const dominant = anom.broker_details && anom.broker_details.length > 0 ? anom.broker_details[0] : null

            return (
              <div
                key={`${anom.ticker}-${anom.tanggal}`}
                className="p-space-md bg-surface-container-lowest border border-border-subtle rounded flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-label-ticker text-base font-bold text-text-primary">
                      {anom.ticker}
                    </span>
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-semibold ${
                        isOutflow
                          ? "bg-data-bearish/20 text-data-bearish"
                          : "bg-data-bullish/20 text-data-bullish"
                      }`}
                    >
                      {anom.status_anomali}
                    </span>
                  </div>
                  <span className="font-mono text-tabular-sm text-text-secondary">
                    {new Date(anom.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-caption text-caption text-text-secondary">Net Inflow</span>
                  <span
                    className={`font-mono text-tabular-md font-bold ${
                      isOutflow ? "text-data-bearish" : "text-data-bullish"
                    }`}
                  >
                    {flowFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border-subtle/60 text-xs">
                  <span className="font-caption text-caption text-text-secondary">
                    Z-Score: <strong className="font-mono text-text-primary">{anom.z_score.toFixed(2)}σ</strong>
                  </span>
                  {dominant && (
                    <span className="font-mono text-[11px] text-text-secondary">
                      Broker: <strong className="text-text-primary">{dominant.kode_broker}</strong> ({dominant.nama_broker.split(" ")[0]})
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <Link
                    href={`/foreign-activity/${anom.ticker}`}
                    className="text-[12px] text-brand-red hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Lihat Riwayat 90 Hari</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-space-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-brand-red">
              show_chart
            </span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Grafik Arus 90 Hari & Riwayat Broker Dominan: BBRI
            </h2>
          </div>
          <Link
            href="/foreign-activity/BBRI"
            className="text-body-sm text-brand-red hover:underline flex items-center gap-1 font-medium"
          >
            <span>Buka Halaman Penuh BBRI</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </Link>
        </div>

        <ForeignFlowChart data={primaryData.flowPoints} />

        <div className="p-space-lg bg-surface-card rounded border border-border-subtle">
          <div className="flex items-center justify-between mb-space-md">
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Tabel Anomali Transaksi Broker 14 Hari Terakhir
            </h3>
            <span className="font-caption text-caption text-text-secondary">
              Threshold Anomali: |Z| ≥ 2.0σ
            </span>
          </div>
          <AnomalyTable anomalies={primaryData.anomalies14d} />
        </div>
      </div>
    </div>
  )
}

