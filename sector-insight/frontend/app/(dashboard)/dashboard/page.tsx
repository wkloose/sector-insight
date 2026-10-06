import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { StockCard } from "@/src/entities/stock"
import { CompositeAlertHero, getPrimaryAlert } from "@/src/features/composite-alert"
import { getWatchedStocks } from "@/src/features/watchlist"
import { getForeignFlowSummary } from "@/src/features/foreign-flow"

export const metadata: Metadata = {
  title: "Dashboard Utama",
  description: "Terminal intelijen sektor finansial Indonesia dan deteksi anomali 3 pilar pasar",
}

export default async function DashboardPage() {
  const [primaryAlert, stocks, foreignSummary] = await Promise.all([
    getPrimaryAlert(),
    getWatchedStocks(),
    getForeignFlowSummary(),
  ])

  const enrichedStocks = stocks.map((s) => {
    if (s.ticker === "BBRI") {
      return {
        ...s,
        analystCoverage: 32,
        isAlertTrigger: true,
        pillarMetrics: {
          nimScore: 75,
          sentimentScore: -0.15,
          sentimentTrend: [0.1, 0.05, -0.05, -0.1, -0.15],
          foreignFlowLabel: "Outflow -Rp 89M",
          foreignFlowStatus: "outflow" as const,
        },
      }
    }
    if (s.ticker === "BBCA") {
      return {
        ...s,
        analystCoverage: 32,
        pillarMetrics: {
          nimScore: 88,
          sentimentScore: 0.62,
          sentimentTrend: [0.4, 0.45, 0.5, 0.58, 0.62],
          foreignFlowLabel: "Inflow (+Rp 142M)",
          foreignFlowStatus: "inflow" as const,
        },
      }
    }
    if (s.ticker === "BMRI") {
      return {
        ...s,
        analystCoverage: 28,
        pillarMetrics: {
          nimScore: 82,
          sentimentScore: 0.45,
          sentimentTrend: [0.35, 0.38, 0.4, 0.42, 0.45],
          foreignFlowLabel: "Inflow (+Rp 41M)",
          foreignFlowStatus: "inflow" as const,
        },
      }
    }
    return {
      ...s,
      analystCoverage: 24,
      pillarMetrics: {
        nimScore: 79,
        sentimentScore: 0.31,
        sentimentTrend: [0.25, 0.28, 0.3, 0.31, 0.31],
        foreignFlowLabel: "Normal (+Rp 18M)",
        foreignFlowStatus: "normal" as const,
      },
    }
  })

  return (
    <div className="flex flex-col w-full pb-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md py-space-sm mb-space-md">
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="font-mono text-tabular-sm text-text-secondary tracking-widest uppercase">
              INTEL / IDX:FINANCE
            </span>
            <span className="text-border-subtle">/</span>
            <h1 className="font-headline-md text-headline-md text-text-primary tracking-tight font-semibold">
              Ringkasan Sektor Finansial
            </h1>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-card rounded border border-border-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
            <span className="font-body-sm text-body-sm text-text-primary font-medium">
              Perbankan Big-4 (KBMI 4)
            </span>
            <span className="material-symbols-outlined text-[14px] text-text-secondary">
              expand_more
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-card rounded border border-border-subtle">
            <span className="w-2 h-2 rounded-full bg-data-neutral" />
            <span className="font-caption text-caption text-text-secondary">Sesi II Berakhir</span>
            <span className="text-border-subtle">•</span>
            <span className="font-mono text-tabular-sm text-text-primary font-medium">
              17:00:00 WIB
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-lowest px-space-sm py-space-xs rounded border border-border-subtle">
            <span className="font-caption text-caption text-text-secondary">Benchmark:</span>
            <span className="font-mono text-tabular-sm text-data-bullish">+0,42%</span>
          </div>
        </div>
      </div>

      <CompositeAlertHero alert={primaryAlert} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
        {enrichedStocks.length === 0 ? (
          <div className="col-span-full p-space-xl bg-surface-card rounded border border-dashed border-border-subtle flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[32px] text-text-secondary mb-2">
              account_balance
            </span>
            <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-1">
              Belum Ada Emiten Terpilih
            </h4>
            <p className="font-body-sm text-body-sm text-text-secondary max-w-sm mb-3">
              Daftar saham yang dipantau belum tersedia. Buka halaman Watchlist untuk memilih emiten perbankan.
            </p>
            <Link
              href="/watchlist"
              className="px-3 py-1.5 bg-brand-red text-text-primary text-body-sm font-semibold rounded"
            >
              Kelola Watchlist
            </Link>
          </div>
        ) : (
          enrichedStocks.map((stock) => (
            <StockCard key={stock.ticker} stock={stock} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-7 flex flex-col bg-surface-card p-space-lg rounded border border-border-subtle shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md pb-space-sm border-b border-border-subtle/60">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-brand-red">
                  radar
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Aktivitas Asing & Deteksi Anomali Broker
                </h3>
              </div>
              <span className="font-caption text-caption text-text-secondary mt-0.5">
                Analisis statistical deviation (z-score) terhadap volume rata-rata 20 hari
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-red/15 text-brand-red border border-brand-red/30">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="font-caption text-[11px] font-semibold">
                1 Anomali Masif (BBRI: -2.8σ)
              </span>
            </div>
          </div>

          <div className="p-space-md bg-surface-container-lowest rounded mb-space-md border border-border-subtle/40">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-caption text-[11px] text-text-secondary uppercase">
                Distribusi Net Flow Asing (5 Sesi Terakhir - KBMI 4)
              </span>
              <div className="flex items-center gap-space-md font-mono text-[11px]">
                <span className="flex items-center gap-1 text-data-bullish">
                  <span className="w-2 h-2 bg-data-bullish rounded-xs" /> Net Buy
                </span>
                <span className="flex items-center gap-1 text-data-bearish">
                  <span className="w-2 h-2 bg-data-bearish rounded-xs" /> Net Sell
                </span>
              </div>
            </div>

            <div className="w-full h-20 flex items-end justify-between pt-2 px-space-xs">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex items-center justify-center gap-1 h-12">
                  <div className="w-3 bg-data-bullish/70 h-8 rounded-t-xs" />
                  <div className="w-3 bg-data-bearish/70 h-4 rounded-t-xs" />
                  <div className="w-3 bg-data-bullish/70 h-6 rounded-t-xs" />
                  <div className="w-3 bg-data-bullish/70 h-3 rounded-t-xs" />
                </div>
                <span className="font-mono text-[10px] text-text-secondary">Senin</span>
              </div>

              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex items-center justify-center gap-1 h-12">
                  <div className="w-3 bg-data-bullish/70 h-10 rounded-t-xs" />
                  <div className="w-3 bg-data-bearish/70 h-8 rounded-t-xs" />
                  <div className="w-3 bg-data-bullish/70 h-7 rounded-t-xs" />
                  <div className="w-3 bg-data-bearish/70 h-2 rounded-t-xs" />
                </div>
                <span className="font-mono text-[10px] text-text-secondary">Selasa</span>
              </div>

              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex items-center justify-center gap-1 h-12">
                  <div className="w-3 bg-data-bullish/70 h-11 rounded-t-xs" />
                  <div className="w-3 bg-data-bearish/70 h-9 rounded-t-xs" />
                  <div className="w-3 bg-data-bullish/70 h-5 rounded-t-xs" />
                  <div className="w-3 bg-data-bullish/70 h-4 rounded-t-xs" />
                </div>
                <span className="font-mono text-[10px] text-text-secondary">Rabu</span>
              </div>

              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex items-center justify-center gap-1 h-12">
                  <div className="w-3 bg-data-bullish/70 h-7 rounded-t-xs" />
                  <div className="w-3 bg-data-bearish/80 h-12 rounded-t-xs" />
                  <div className="w-3 bg-data-bullish/70 h-9 rounded-t-xs" />
                  <div className="w-3 bg-data-bullish/70 h-5 rounded-t-xs" />
                </div>
                <span className="font-mono text-[10px] text-text-secondary">Kamis</span>
              </div>

              <div className="flex flex-col items-center gap-1 flex-1 bg-brand-red-soft/20 rounded py-0.5 border border-brand-red/30">
                <div className="w-full flex items-center justify-center gap-1 h-12">
                  <div className="w-3 bg-data-bullish h-11 rounded-t-xs" />
                  <div className="w-3 bg-data-bearish h-full rounded-t-xs animate-pulse" />
                  <div className="w-3 bg-data-bullish h-6 rounded-t-xs" />
                  <div className="w-3 bg-data-bullish h-3 rounded-t-xs" />
                </div>
                <span className="font-mono text-[10px] text-brand-red font-bold">Hari Ini</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-body-sm text-[13px]">
              <thead>
                <tr className="bg-surface-container-lowest text-text-secondary font-caption text-caption h-8">
                  <th className="px-space-sm font-medium">EMITEN</th>
                  <th className="px-space-sm text-right font-medium">NET ASING (1D)</th>
                  <th className="px-space-sm text-right font-medium">NET ASING (5D)</th>
                  <th className="px-space-sm text-right font-medium">Z-SCORE</th>
                  <th className="px-space-sm font-medium">BROKER DOMINAN</th>
                  <th className="px-space-sm text-center font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50">
                {(foreignSummary && foreignSummary.length > 0 ? foreignSummary.slice(0, 5) : [
                  { id: 1, ticker: "BBCA", net_foreign_inflow: 142000000000, z_score: 1.1, status_anomali: "NORMAL", broker_details: [{ kode_broker: "ZP", nama_broker: "Maybank Sekuritas" }] },
                  { id: 2, ticker: "BBRI", net_foreign_inflow: -89000000000, z_score: -2.8, status_anomali: "ANOMALI_OUTFLOW", broker_details: [{ kode_broker: "CS", nama_broker: "Credit Suisse" }] },
                  { id: 3, ticker: "BMRI", net_foreign_inflow: 41000000000, z_score: 0.4, status_anomali: "NORMAL", broker_details: [{ kode_broker: "AK", nama_broker: "UBS Sekuritas" }] },
                  { id: 4, ticker: "BBNI", net_foreign_inflow: 18000000000, z_score: 0.1, status_anomali: "NORMAL", broker_details: [{ kode_broker: "BK", nama_broker: "J.P. Morgan" }] },
                ]).map((row: any) => {
                  const isOutflow = row.net_foreign_inflow < 0
                  const isAnomaly = Math.abs(row.z_score) >= 2.0
                  const netM = (Math.abs(row.net_foreign_inflow) / 1e9).toFixed(0)
                  const broker = row.broker_details && row.broker_details.length > 0 ? row.broker_details[0] : null
                  return (
                    <tr key={row.id || row.ticker} className={`h-10 hover:bg-surface-container-high transition-colors ${isAnomaly && isOutflow ? "bg-brand-red-soft/30 hover:bg-brand-red-soft/50" : ""}`}>
                      <td className="px-space-sm font-label-ticker font-semibold text-text-primary flex items-center gap-1 pt-2.5">
                        <Link href={`/foreign-activity/${row.ticker}`} className="hover:underline hover:text-brand-red">
                          {row.ticker}
                        </Link>
                        {isAnomaly && <span className="material-symbols-outlined text-[14px] text-brand-red">warning</span>}
                      </td>
                      <td className={`px-space-sm text-right font-mono text-tabular-md font-bold ${isOutflow ? "text-data-bearish" : "text-data-bullish"}`}>
                        {isOutflow ? "-" : "+"}Rp {netM} M
                      </td>
                      <td className={`px-space-sm text-right font-mono text-tabular-md ${isOutflow ? "text-data-bearish" : "text-data-bullish"}`}>
                        {isOutflow ? "-" : "+"}Rp {(Number(netM) * 3.5).toFixed(0)} M
                      </td>
                      <td className={`px-space-sm text-right font-mono text-tabular-md ${isAnomaly ? (isOutflow ? "text-data-bearish font-bold" : "text-data-bullish font-bold") : "text-text-primary"}`}>
                        {row.z_score >= 0 ? "+" : ""}{row.z_score.toFixed(1)}σ
                      </td>
                      <td className="px-space-sm text-text-secondary">
                        <span className="font-mono text-tabular-sm font-medium text-text-primary">{broker?.kode_broker || "-"}</span> ({broker?.nama_broker || "Pasar Reguler"})
                      </td>
                      <td className="px-space-sm text-center">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-caption text-[11px] font-medium ${
                          isAnomaly ? "bg-data-bearish/20 text-data-bearish font-bold border border-data-bearish/30" : (isOutflow ? "bg-surface-container-high text-text-secondary" : "bg-data-bullish/10 text-data-bullish")
                        }`}>
                          {isAnomaly ? (isOutflow ? "Anomali Outflow" : "Anomali Inflow") : (isOutflow ? "Netral" : "Normal Buy")}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-space-md pt-space-xs flex items-center justify-between text-text-secondary font-caption text-caption border-t border-border-subtle/40">
            <span>Ambang batas anomali diset otomatis pada |Z| &gt; 2.0σ</span>
            <Link
              href="/foreign-activity/BBRI"
              className="text-text-primary hover:text-brand-red flex items-center gap-1 font-medium transition-colors"
            >
              <span>Buka Matrix Broker Komplit</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="flex flex-col bg-surface-card p-space-lg rounded border border-border-subtle shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-data-neutral">
                  gavel
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Paparan Regulasi & BI Rate
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-data-neutral/15 text-data-neutral font-caption text-[11px] font-semibold border border-data-neutral/30">
                Netral-Negatif
              </span>
            </div>

            <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded mb-space-sm border border-border-subtle/50">
              <div className="flex flex-col">
                <span className="font-caption text-[11px] text-text-secondary uppercase">
                  Indeks Tekanan Makro
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-tabular-lg font-bold text-data-neutral">
                    -0.15
                  </span>
                  <span className="font-caption text-caption text-data-neutral font-medium">
                    Waspada
                  </span>
                </div>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-caption text-[11px] text-text-secondary uppercase">
                  Subsektor Terdampak
                </span>
                <span className="font-body-sm text-body-sm text-brand-red font-semibold mt-0.5">
                  Kredit Mikro & UMKM
                </span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
              Sinyal &lsquo;Higher-for-Longer&rsquo; Bank Indonesia memperketat likuiditas simpanan dana murah (CASA). Segmen mikro memiliki sensitivitas CoF tertinggi di KBMI 4.
            </p>
          </div>

          <div className="flex flex-col flex-1 bg-surface-card p-space-lg rounded border border-border-subtle shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-brand-red">
                  feed
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Intelijen Berita Terkini
                </h3>
              </div>
              <span className="font-mono text-[11px] text-text-secondary">
                NLP Engine Real-Time
              </span>
            </div>

            <div className="flex flex-col gap-space-sm divide-y divide-border-subtle/40">
              <div className="flex flex-col gap-1 pt-space-xs first:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-data-bearish/15 text-data-bearish font-caption text-[10px] font-bold">
                      BEARISH
                    </span>
                    <span className="font-label-ticker text-[11px] font-bold text-text-primary">
                      BBRI
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-text-secondary">
                    15:42 WIB • Kontan
                  </span>
                </div>
                <Link
                  href="/articles/BBRI"
                  className="font-body-sm text-[13px] text-text-primary font-medium hover:text-brand-red transition-colors line-clamp-2"
                >
                  OJK Evaluasi Penyaluran Kredit Sektor Usaha Mikro Akibat Kenaikan NPL Non-Performing Loan ke Level 3,1%.
                </Link>
              </div>

              <div className="flex flex-col gap-1 pt-space-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-data-bullish/15 text-data-bullish font-caption text-[10px] font-bold">
                      BULLISH
                    </span>
                    <span className="font-label-ticker text-[11px] font-bold text-text-primary">
                      BBCA
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-text-secondary">
                    14:15 WIB • Bisnis.com
                  </span>
                </div>
                <Link
                  href="/articles/BBCA"
                  className="font-body-sm text-[13px] text-text-primary font-medium hover:text-brand-red transition-colors line-clamp-2"
                >
                  Rasio CASA Sentuh Rekor 82,4%, Beban Dana Bunga Terjaga Efisien Sepanjang Kuartal Berjalan.
                </Link>
              </div>

              <div className="flex flex-col gap-1 pt-space-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-text-secondary font-caption text-[10px] font-bold">
                      NETRAL
                    </span>
                    <span className="font-label-ticker text-[11px] font-bold text-text-primary">
                      BMRI
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-text-secondary">
                    12:30 WIB • CNBC Indonesia
                  </span>
                </div>
                <Link
                  href="/articles/BMRI"
                  className="font-body-sm text-[13px] text-text-primary font-medium hover:text-brand-red transition-colors line-clamp-2"
                >
                  Ekspansi Kredit Korporasi Melaju Sesuai Target RBB 2026, Pertumbuhan Laba Diproyeksi Stabil 11% YoY.
                </Link>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm border-t border-border-subtle/50">
              <Link
                href="/signals"
                className="text-brand-red hover:underline text-body-sm font-semibold flex items-center justify-center gap-1"
              >
                <span>Buka Seluruh Feed Berita (42 Sinyal)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

