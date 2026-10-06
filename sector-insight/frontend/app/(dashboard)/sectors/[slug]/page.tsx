import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { getSectorOverview, getSectorNews } from "@/src/features/sectors"

interface SectorDetailPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sub_sector?: string }>
}

export async function generateMetadata({ params }: SectorDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const overview = await getSectorOverview(slug)
  return {
    title: `Sektor ${overview.sector_name} - SMRS & Momentum`,
    description: `Analisis mendalam sektor ${overview.sector_name}, arus asing, dan berita industri terkurasi.`,
  }
}

export default async function SectorDetailPage({
  params,
  searchParams,
}: SectorDetailPageProps) {
  const { slug } = await params
  const { sub_sector } = await searchParams

  const [overview, news] = await Promise.all([
    getSectorOverview(slug),
    getSectorNews(slug, sub_sector || undefined),
  ])

  const flowMiliar = Math.round(overview.net_foreign_flow / 1000000000)

  return (
    <div className="flex flex-col gap-space-xl w-full pb-space-xl">

      <div className="flex items-center gap-2 text-caption text-text-secondary">
        <Link href="/sectors" className="hover:text-brand-red transition-colors">
          Sector Hub
        </Link>
        <span>/</span>
        <span className="text-text-primary font-semibold">{overview.sector_name}</span>
      </div>

      <div className="p-space-lg bg-surface-card rounded-xl border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-sm">
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

        <div className="flex items-center gap-6 bg-surface-container-lowest p-3 rounded-xl border border-border-subtle shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-text-secondary">Skor SMRS</span>
            <span className="font-mono font-bold text-headline-metric text-text-primary">
              {overview.smrs_score.toFixed(1)}
              <span className="text-caption text-text-secondary font-normal">/100</span>
            </span>
          </div>

          <div className="w-[1px] h-10 bg-border-subtle/60" />

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

          <div className="w-[1px] h-10 bg-border-subtle/60" />

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
            {overview.top_movers.map((mover) => (
              <span
                key={mover}
                className="px-3 py-1 bg-surface-container-lowest rounded-lg border border-border-subtle text-caption font-mono font-bold text-text-primary"
              >
                {mover}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-space-lg bg-surface-card rounded-xl border border-border-subtle shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[20px]">
              show_chart
            </span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              Tren Historis Skor SMRS 30 Hari Terakhir
            </h3>
          </div>
          <span className="text-caption text-text-secondary font-mono">Rolling Momentum</span>
        </div>

        <div className="flex items-end gap-1 h-28 pt-4 overflow-x-auto">
          {overview.history_30d.map((pt, i) => {
            const heightPercent = Math.max(10, Math.min(100, (pt.smrs_score / 100) * 100))
            const isHigh = pt.smrs_score >= 60
            return (
              <div
                key={i}
                className="flex flex-col items-center flex-1 min-w-[20px] group relative"
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t transition-all ${
                    isHigh ? "bg-emerald-500/70 hover:bg-emerald-400" : "bg-brand-red/70 hover:bg-brand-red"
                  }`}
                />
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-surface-container-lowest border border-border-subtle px-1.5 py-0.5 rounded text-[10px] font-mono pointer-events-none transition-opacity whitespace-nowrap z-10">
                  {pt.date}: {pt.smrs_score.toFixed(1)}
                </div>
              </div>
            )
          })}
        </div>
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

