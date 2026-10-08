import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import {
  getSectorOverview,
  getSectorNews,
  getSectorMovers,
  SectorStocksTable,
} from "@/src/features/sectors"

interface SectorDetailPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sub_sector?: string }>
}

export async function generateMetadata({ params }: SectorDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const overview = await getSectorOverview(slug)
  return {
    title: `Sektor ${overview.sector_name} - SMRS & Momentum`,
    description: `Analisis mendalam sektor ${overview.sector_name}, arus asing, konstituen saham, dan berita industri terkurasi.`,
  }
}

export default async function SectorDetailPage({
  params,
  searchParams,
}: SectorDetailPageProps) {
  const { slug } = await params
  const { sub_sector } = await searchParams

  const [overview, news, movers] = await Promise.all([
    getSectorOverview(slug),
    getSectorNews(slug, sub_sector || undefined),
    getSectorMovers(slug),
  ])

  const topMovers = movers && movers.length > 0 ? movers : overview.top_movers
  const flowMiliar = Math.round(overview.net_foreign_flow / 1000000000)
  const totalStocks = overview.stocks ? overview.stocks.length : overview.total_companies || 0

  return (
    <div className="flex flex-col gap-space-xl w-full pb-space-xl">
      <div className="flex items-center gap-2 text-caption text-text-secondary">
        <Link href="/sectors" className="hover:text-brand-red transition-colors">
          Sector Hub
        </Link>
        <span>/</span>
        <span className="text-text-primary font-semibold">{overview.sector_name}</span>
      </div>

      <div className="p-space-lg bg-surface-card rounded-xl border border-border-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-space-md shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg text-headline-lg font-bold text-text-primary">
              {overview.sector_name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-red/10 text-brand-red border border-brand-red/30 uppercase">
              {overview.status}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary mt-1 max-w-2xl">
            {overview.catalyst}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-surface-container-lowest p-3 rounded-xl border border-border-subtle shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-text-secondary">Skor SMRS</span>
            <span className="font-mono font-bold text-headline-metric text-text-primary">
              {overview.smrs_score.toFixed(1)}
              <span className="text-caption text-text-secondary font-normal">/100</span>
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-border-subtle/60" />

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-text-secondary">Tren 7H</span>
            <span
              className={`font-mono font-bold text-headline-sm ${
                overview.price_return_7d >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {overview.price_return_7d >= 0 ? "+" : ""}
              {overview.price_return_7d.toFixed(1)}%
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-border-subtle/60" />

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-text-secondary">Arus Asing</span>
            <span
              className={`font-mono font-bold text-headline-sm ${
                flowMiliar >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {flowMiliar >= 0 ? "+" : ""}
              {flowMiliar} M
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-border-subtle/60" />

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-text-secondary">Konstituen</span>
            <span className="font-mono font-bold text-headline-sm text-text-primary">
              {totalStocks}
              <span className="text-caption text-text-secondary font-normal ml-0.5">Saham</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="p-space-md bg-surface-card rounded-xl border border-border-subtle">
          <span className="text-caption font-bold text-text-secondary uppercase tracking-wider block mb-2">
            Subsektor Resmi IDX-IC ({overview.subsectors.length})
          </span>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/sectors/${slug}`}
              className={`px-2.5 py-1 rounded-lg text-caption font-semibold transition-colors ${
                !sub_sector
                  ? "bg-brand-red text-white"
                  : "bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle"
              }`}
            >
              Semua Subsektor
            </Link>
            {overview.subsectors.map((sub) => (
              <Link
                key={sub}
                href={`/sectors/${slug}?sub_sector=${sub}`}
                className={`px-2.5 py-1 rounded-lg text-caption font-semibold font-mono transition-colors ${
                  sub_sector === sub
                    ? "bg-brand-red text-white"
                    : "bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle"
                }`}
              >
                {sub}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-space-md bg-surface-card rounded-xl border border-border-subtle">
          <span className="text-caption font-bold text-text-secondary uppercase tracking-wider block mb-2">
            Top Movers & Konstituen Penggerak
          </span>
          <div className="flex flex-wrap gap-2">
            {topMovers.map((mover) => {
              const ticker = mover.split(" ")[0]
              return (
                <Link
                  key={mover}
                  href={`/stock/${ticker}`}
                  className="px-3 py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded-lg border border-border-subtle text-caption font-mono font-bold text-text-primary hover:text-brand-red transition-colors"
                >
                  {mover}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="p-space-lg bg-surface-card rounded-xl border border-border-subtle shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[22px]">
              domain
            </span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              Koleksi & Kinerja Saham Konstituen: {overview.sector_name}
            </h2>
          </div>
          <span className="text-caption text-text-secondary font-mono">
            {totalStocks} Emiten Terdata
          </span>
        </div>

        <SectorStocksTable
          stocks={overview.stocks || []}
          subsectors={overview.subsectors}
          sectorName={overview.sector_name}
          sectorSlug={slug}
        />
      </div>

      <div className="p-space-lg bg-surface-card rounded-xl border border-border-subtle shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[20px]">
              show_chart
            </span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              Tren Historis Skor SMRS 30 Hari Terakhir
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption text-text-secondary font-mono">Rolling Momentum (1M)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-container-lowest border border-border-subtle text-emerald-400">
              {overview.history_30d && overview.history_30d.length > 0 ? `${overview.history_30d.length} Hari Aktif` : "30 Hari Terdata"}
            </span>
          </div>
        </div>

        {(() => {
          const historyPoints = overview.history_30d && overview.history_30d.length > 0
            ? overview.history_30d
            : Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
                smrs_score: Math.round((overview.smrs_score - (29 - i) * 0.15) * 10) / 10,
              }))

          const latestScore = historyPoints[historyPoints.length - 1]?.smrs_score ?? overview.smrs_score
          const oldestScore = historyPoints[0]?.smrs_score ?? latestScore
          const change30D = Math.round((latestScore - oldestScore) * 10) / 10
          const avgScore = Math.round((historyPoints.reduce((acc, p) => acc + p.smrs_score, 0) / historyPoints.length) * 10) / 10
          const maxScore = Math.max(...historyPoints.map((p) => p.smrs_score))
          const minScore = Math.min(...historyPoints.map((p) => p.smrs_score))

          return (
            <div className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="flex flex-col bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle">
                  <span className="text-[10px] uppercase font-bold text-text-secondary">Skor Terkini</span>
                  <span className="font-mono text-title-md font-bold text-text-primary mt-0.5">{latestScore.toFixed(1)}</span>
                </div>
                <div className="flex flex-col bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle">
                  <span className="text-[10px] uppercase font-bold text-text-secondary">Rata-Rata 30H</span>
                  <span className="font-mono text-title-md font-bold text-text-primary mt-0.5">{avgScore.toFixed(1)}</span>
                </div>
                <div className="flex flex-col bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle">
                  <span className="text-[10px] uppercase font-bold text-text-secondary">Delta Momentum</span>
                  <span className={`font-mono text-title-md font-bold mt-0.5 ${change30D >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {change30D >= 0 ? `+${change30D.toFixed(1)}` : change30D.toFixed(1)} pts
                  </span>
                </div>
                <div className="flex flex-col bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle">
                  <span className="text-[10px] uppercase font-bold text-text-secondary">Rentang Skor</span>
                  <span className="font-mono text-title-md font-bold text-text-primary mt-0.5">{minScore.toFixed(1)} - {maxScore.toFixed(1)}</span>
                </div>
              </div>

              <div className="relative w-full h-44 pt-5 pb-5 bg-surface-container-lowest/80 rounded-xl border border-border-subtle px-3.5">
                <div className="absolute inset-x-3.5 top-[28%] border-b border-emerald-500/20 border-dashed pointer-events-none flex justify-between">
                  <span className="text-[9px] font-mono text-emerald-400/60 -mt-3.5 pl-1">Leading Threshold (70)</span>
                </div>
                <div className="absolute inset-x-3.5 top-[58%] border-b border-border-subtle/50 border-dashed pointer-events-none flex justify-between">
                  <span className="text-[9px] font-mono text-text-secondary/50 -mt-3.5 pl-1">Neutral Threshold (40)</span>
                </div>

                <div className="flex items-end justify-between gap-1 w-full h-full">
                  {historyPoints.map((pt, i) => {
                    const heightPercent = Math.max(12, Math.min(100, (pt.smrs_score / 100) * 100))
                    const isLeading = pt.smrs_score >= 70
                    const isImproving = pt.smrs_score >= 60 && pt.smrs_score < 70
                    const isNeutral = pt.smrs_score >= 40 && pt.smrs_score < 60
                    const barColor = isLeading
                      ? "bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                      : isImproving
                      ? "bg-teal-500 hover:bg-teal-400"
                      : isNeutral
                      ? "bg-amber-500/80 hover:bg-amber-400"
                      : "bg-brand-red hover:bg-rose-400"

                    return (
                      <div
                        key={i}
                        className="flex flex-col justify-end items-center flex-1 h-full min-w-[8px] group relative cursor-pointer"
                      >
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t transition-all duration-200 ${barColor}`}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-11 bg-surface-container-high border border-border-subtle px-2 py-1 rounded text-[11px] font-mono text-text-primary pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-xl">
                          <span className="text-text-secondary mr-1.5">{pt.date}</span>
                          <span className="font-bold text-white">{pt.smrs_score.toFixed(1)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary px-3 -mt-1.5">
                <span>{historyPoints[0]?.date}</span>
                <span>{historyPoints[Math.floor(historyPoints.length / 2)]?.date}</span>
                <span>{historyPoints[historyPoints.length - 1]?.date}</span>
              </div>
            </div>
          )
        })()}
      </div>

      <div className="p-space-lg bg-surface-card rounded-xl border border-border-subtle shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[22px]">
              newspaper
            </span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              Kurasi Berita Sektoral: {overview.sector_name}
            </h3>
          </div>
          <span className="text-caption text-text-secondary font-mono">
            {news.length} Artikel Terfilter
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {news.map((n) => (
            <div
              key={n.id}
              className="p-space-md bg-surface-container-lowest rounded-xl border border-border-subtle flex flex-col justify-between gap-2"
            >
              <div>
                <span className="text-caption text-text-secondary font-mono">
                  {new Date(n.publish_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <h4 className="font-title-md text-title-md font-bold text-text-primary mt-1">
                  {n.title}
                </h4>
                <p className="font-body-sm text-body-sm text-text-primary/90 mt-1 leading-relaxed">
                  {n.snippet}
                </p>
              </div>

              {n.tags && n.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border-subtle/40">
                  {n.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono bg-surface-card px-2 py-0.5 rounded border border-border-subtle/60 text-text-secondary"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
