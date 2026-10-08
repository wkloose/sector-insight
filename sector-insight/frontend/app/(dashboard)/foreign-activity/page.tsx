import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import {
  MarketForeignFlowOverview,
  TopForeignMoversCards,
  AllStocksForeignFlowTable,
  ForeignFlowChart,
  AnomalyTable,
  getMarketForeignFlowSummary,
  getAllStockForeignFlows,
  getForeignFlowSummary,
  getForeignFlowData,
} from "@/src/features/foreign-flow"

export const metadata: Metadata = {
  title: "Aktivitas & Akumulasi Arus Asing Indonesia",
  description: "Pemantauan komprehensif arus modal asing di Bursa Efek Indonesia, aliran dana 11 sektor IDX-IC, deteksi anomali statistik Z-Score 90 hari, dan rincian per saham",
}

const FEATURED_TICKERS = [
  "BBCA",
  "BBRI",
  "BMRI",
  "BBNI",
  "BRIS",
  "ADRO",
  "PTBA",
  "TLKM",
  "ANTM",
  "ASII",
  "GOTO",
  "ICBP",
]

export default async function ForeignActivityHubPage() {
  const [marketSummary, allStocks, summaryAnomalies, featuredStockData] = await Promise.all([
    getMarketForeignFlowSummary(),
    getAllStockForeignFlows("", "ALL", "ALL", 100),
    getForeignFlowSummary(),
    getForeignFlowData("BBCA"),
  ])

  return (
    <div className="flex flex-col w-full pb-space-xl gap-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              PILLAR 3: FOREIGN FLOW
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              SELURUH PASAR MODAL INDONESIA (BEI)
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Aktivitas & Akumulasi Arus Asing Indonesia
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-4xl mt-1">
            Pemantauan agregat arus modal asing di Bursa Efek Indonesia (BEI), distribusi aliran dana 11 sektor IDX-IC, deteksi anomali deviasi statistik Z-Score 90 hari, serta rincian akumulasi dan distribusi per saham.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-card border border-border-subtle font-mono text-[12px]">
            <span className="w-2 h-2 rounded-full bg-data-bullish animate-pulse" />
            <span className="text-text-primary font-semibold">Live Pasar BEI</span>
            <span className="text-text-secondary font-mono">90D Statistical Engine</span>
          </div>
        </div>
      </div>

      <MarketForeignFlowOverview summary={marketSummary} />

      <TopForeignMoversCards
        accumulated={marketSummary.top_accumulated}
        distributed={marketSummary.top_distributed}
      />

      <div className="p-space-lg bg-surface-card rounded border border-border-subtle flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-space-sm border-b border-border-subtle/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-data-bullish" />
              <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                Detail Analisis Arus Asing & Anomali Saham: BBCA (Top Akumulasi #1 BEI)
              </h2>
            </div>
            <p className="font-body-sm text-[13px] text-text-secondary">
              Visualisasi time-series deviasi 90 hari saham BBCA dan konfirmasi broker orderbook 14 hari
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/foreign-activity/BBCA"
              className="px-3 py-1.5 rounded bg-brand-red text-text-primary font-caption text-caption font-semibold flex items-center gap-1 hover:bg-brand-red/90 transition-colors"
            >
              <span>Halaman Lengkap BBCA</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-space-xs overflow-x-auto pb-1">
          <span className="font-caption text-caption text-text-secondary mr-2 shrink-0">
            Pilih Detail Emiten:
          </span>
          {FEATURED_TICKERS.map((t) => (
            <Link
              key={t}
              href={`/foreign-activity/${t}`}
              className={`px-3 py-1 rounded font-mono text-tabular-sm font-semibold transition-colors shrink-0 ${
                t === "BBCA"
                  ? "bg-brand-red text-text-primary"
                  : "bg-surface-container text-text-secondary hover:text-text-primary hover:bg-surface-container-high"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        <ForeignFlowChart data={featuredStockData.flowPoints} />

        <div className="pt-2">
          <AnomalyTable anomalies={featuredStockData.anomalies14d} />
        </div>
      </div>

      {summaryAnomalies.length > 0 && (
        <div className="p-space-lg bg-surface-card rounded border border-border-subtle">
          <div className="flex items-center justify-between mb-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
              <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                Anomali Arus Asing Terverifikasi Broker (Live Summary)
              </h2>
            </div>
            <span className="font-caption text-caption text-text-secondary">
              Threshold: |Z| ≥ 2.0σ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
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
                      <span>Lihat Riwayat 90 Hari & Broker Book</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[22px]">
              table_chart
            </span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Tabel Aktivitas Arus Asing Seluruh Saham Tercatat di Indonesia
            </h2>
          </div>
          <span className="font-caption text-caption text-text-secondary">
            Pencarian cepat, filter sektor, filter anomali statistik, dan tautan analisis mendalam
          </span>
        </div>

        <AllStocksForeignFlowTable stocks={allStocks} />
      </div>
    </div>
  )
}
