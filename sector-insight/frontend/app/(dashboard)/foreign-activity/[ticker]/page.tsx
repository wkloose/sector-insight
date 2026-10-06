import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ForeignFlowChart,
  AnomalyTable,
  getForeignFlowData,
} from "@/src/features/foreign-flow"
import { isValidTicker } from "@/src/shared/lib"

interface Props {
  params: Promise<{ ticker: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params
  if (!isValidTicker(ticker)) {
    return {
      title: "Saham Tidak Ditemukan",
      description: "Kode ticker yang diminta tidak valid.",
    }
  }
  const upperTicker = ticker.toUpperCase()
  return {
    title: `Aktivitas Asing 90 Hari ${upperTicker}`,
    description: `Deteksi anomali statistik arus dana broker asing dan visualisasi 90 hari ${upperTicker}`,
  }
}

export default async function ForeignActivityPage({ params }: Props) {
  const { ticker } = await params
  if (!isValidTicker(ticker)) {
    notFound()
  }
  const upperTicker = ticker.toUpperCase()
  const data = await getForeignFlowData(upperTicker)

  const isAnomaly = Math.abs(data.yesterdayZScore) >= 2.0
  const yesterdayFlowFormatted = `${data.yesterdayFlow < 0 ? "-" : "+"}Rp ${(Math.abs(data.yesterdayFlow) / 1000000000).toFixed(1)} M`
  const baselineFormatted = `${data.baselineMean90d < 0 ? "-" : "+"}Rp ${(Math.abs(data.baselineMean90d) / 1000000000).toFixed(1)} M`
  const stdDevFormatted = `Rp ${(data.standardDeviation / 1000000000).toFixed(1)} M / hari`
  const isNetInflow = data.totalNetFlow90d >= 0
  const synthesisTitle = isAnomaly
    ? data.yesterdayFlow >= 0
      ? "Sintesis Algoritma: Lonjakan Arus Masuk Ekstrem"
      : "Sintesis Algoritma: Tekanan Jual Masif"
    : data.yesterdayFlow >= 0
      ? "Sintesis Algoritma: Akumulasi Arus Masuk Teratur"
      : "Sintesis Algoritma: Distribusi Arus Normal"

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <Link
              href={`/stock/${upperTicker}`}
              className="text-text-secondary hover:text-text-primary flex items-center gap-1 font-caption text-caption"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>Kembali ke Detail {upperTicker}</span>
            </Link>
            <span className="text-border-subtle">•</span>
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium">
              FOREIGN FLOW
            </span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Arus Asing & Deteksi Anomali Broker: {upperTicker}
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Analisis deviasi statistik (Z-Score) terhadap baseline histori 90 hari saham {upperTicker}, dilengkapi konfirmasi broker orderbook 14 hari terakhir.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-card border border-border-subtle font-mono text-[12px]">
            <span
              className={`w-2 h-2 rounded-full ${
                isAnomaly ? "bg-data-bearish animate-pulse" : "bg-data-bullish"
              }`}
            />
            <span className="text-text-primary font-semibold">
              {isAnomaly ? "Anomali Terdeteksi" : "Normal"}
            </span>
            <span className="text-text-secondary">
              (Z: {data.yesterdayZScore >= 0 ? `+${data.yesterdayZScore}` : data.yesterdayZScore}σ)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
        <div className={`p-space-lg rounded border flex flex-col justify-between shadow-sm relative overflow-hidden ${
          isAnomaly ? "bg-brand-red-soft border-brand-red/40" : "bg-surface-card border-border-subtle"
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption uppercase tracking-wider text-text-secondary">
                Net Flow Kemarin
              </span>
              <span className={`font-mono text-headline-metric font-bold tracking-tight mt-1 ${
                data.yesterdayFlow >= 0 ? "text-data-bullish" : "text-data-bearish"
              }`}>
                {yesterdayFlowFormatted}
              </span>
            </div>
            <span className={`px-2 py-1 rounded font-mono text-[11px] font-bold ${
              data.yesterdayFlow >= 0 ? "bg-data-bullish/20 text-data-bullish" : "bg-data-bearish/20 text-data-bearish"
            }`}>
              Z: {data.yesterdayZScore >= 0 ? `+${data.yesterdayZScore}` : data.yesterdayZScore}σ
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/50 flex items-center justify-between text-caption text-text-secondary">
            <span>Status:</span>
            <span className={`font-medium ${data.yesterdayFlow >= 0 ? "text-data-bullish" : "text-data-bearish"}`}>
              {data.yesterdayAnomalyStatus}
            </span>
          </div>
        </div>

        <div className="p-space-lg bg-surface-card rounded border border-border-subtle flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption uppercase tracking-wider text-text-secondary">
                Baseline Rerata 90 Hari
              </span>
              <span className={`font-mono text-headline-metric font-bold tracking-tight mt-1 ${
                data.baselineMean90d >= 0 ? "text-data-bullish" : "text-data-bearish"
              }`}>
                {baselineFormatted}
              </span>
            </div>
            <span className="material-symbols-outlined text-[20px] text-text-secondary">
              stacked_line_chart
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/50 flex items-center justify-between text-caption text-text-secondary">
            <span>Deviasi Standar (σ):</span>
            <span className="font-mono text-[11px] text-text-primary font-medium">{stdDevFormatted}</span>
          </div>
        </div>

        <div className="p-space-lg bg-surface-card rounded border border-border-subtle flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption uppercase tracking-wider text-text-secondary">
                Total Net Flow 90 Hari
              </span>
              <span className={`font-mono text-headline-metric font-bold tracking-tight mt-1 ${
                isNetInflow ? "text-data-bullish" : "text-data-bearish"
              }`}>
                {data.totalNetFlowFormatted}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded font-mono text-[11px] font-medium ${
                isNetInflow
                  ? "bg-data-bullish/10 text-data-bullish"
                  : "bg-data-bearish/10 text-data-bearish"
              }`}
            >
              {isNetInflow ? "+Inflow 90H" : "-Outflow 90H"}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/50 flex items-center justify-between text-caption text-text-secondary">
            <span>Karakter Arus:</span>
            <span
              className={`font-medium ${
                isNetInflow ? "text-data-bullish" : "text-data-bearish"
              }`}
            >
              {isNetInflow ? "Akumulasi Bersih Kuartalan" : "Distribusi Bersih Kuartalan"}
            </span>
          </div>
        </div>

        <div className="p-space-lg bg-surface-card rounded border border-border-subtle flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption uppercase tracking-wider text-text-secondary">
                Frekuensi Anomali 90 Hari
              </span>
              <span className="font-mono text-headline-metric font-bold text-text-primary tracking-tight mt-1">
                {data.anomalyCount90d}{" "}
                <span className="font-headline-sm text-headline-sm text-text-secondary font-normal">
                  Kejadian
                </span>
              </span>
            </div>
            <span className="material-symbols-outlined text-[20px] text-text-secondary">
              notifications_active
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/50 flex items-center justify-between text-caption text-text-secondary">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-data-bullish" />
              <span>{data.inflowAnomalyCount} Inflow</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-data-bearish" />
              <span>{data.outflowAnomalyCount} Outflow</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-space-xl">
        <ForeignFlowChart data={data.flowPoints} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        <div className="lg:col-span-8">
          <AnomalyTable anomalies={data.anomalies14d} />
        </div>

        <div className="lg:col-span-4 bg-surface-card p-space-lg rounded border border-border-subtle flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-1">
              Komposisi Transaksi (14 Hari)
            </h3>
            <p className="font-caption text-caption text-text-secondary mb-space-md">
              Rasio kepemilikan dan partisipasi order flow pada periode anomali terakhir.
            </p>

            <div className="p-space-md bg-surface-container-lowest rounded border border-border-subtle mb-space-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-caption text-caption text-text-secondary">
                  Institusi Asing
                </span>
                <span className="font-mono text-tabular-sm font-bold text-data-bearish">
                  {data.composition14d.institutionalForeignPercent}%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden mb-space-md">
                <div
                  className="bg-data-bearish h-full rounded-full"
                  style={{ width: `${data.composition14d.institutionalForeignPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="font-caption text-caption text-text-secondary">
                  Ritel & Domestik
                </span>
                <span className="font-mono text-tabular-sm font-bold text-data-bullish">
                  {data.composition14d.retailDomesticPercent}%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                <div
                  className="bg-data-bullish h-full rounded-full"
                  style={{ width: `${data.composition14d.retailDomesticPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-caption font-caption text-text-secondary">
              <div className="flex justify-between">
                <span>Konsentrasi Top 3 Broker:</span>
                <strong className="text-text-primary font-mono text-tabular-sm">
                  {data.composition14d.top3Concentration}%
                </strong>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.composition14d.top3Brokers.map((b) => (
                  <span
                    key={b}
                    className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-text-primary border border-border-subtle"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-space-lg pt-space-sm border-t border-border-subtle/50 text-caption text-text-secondary">
            <span>Metode: Statistical Z-Score 90 Hari</span>
          </div>
        </div>
      </div>

      <div className="p-space-lg bg-surface-card rounded border border-border-subtle flex items-start gap-space-md">
        <div className="w-10 h-10 rounded bg-brand-red/15 flex items-center justify-center shrink-0 text-brand-red mt-0.5">
          <span className="material-symbols-outlined text-[22px]">psychology</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-1">
            <span className="font-caption text-caption font-bold text-brand-red uppercase tracking-wider">
              {synthesisTitle}
            </span>
            <span className="font-mono text-[11px] px-2 py-0.2 rounded bg-surface-container-high text-text-secondary">
              Confidence: {data.synthesisConfidence}%
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
            {data.synthesisSentence}
          </p>
        </div>
      </div>
    </div>
  )
}

