import React from "react"
import { Metadata } from "next"
import {
  getCommunityPosts,
  getCommunityAlerts,
  CommunityFeed,
  DivergenceAlertBanner,
} from "@/src/features/community"

export const metadata: Metadata = {
  title: "Komunitas Investor & Analisis Crowdsourced",
  description:
    "Ruang diskusi terkurasi investor saham perbankan IDX dengan sistem voting berbobot reputasi dan peringatan divergensi ritel vs institusi asing.",
}

interface CommunityPageProps {
  searchParams: Promise<{ ticker?: string }>
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const { ticker } = await searchParams
  const selectedTicker = ticker ? ticker.toUpperCase() : ""

  const [alerts, posts] = await Promise.all([
    getCommunityAlerts(),
    getCommunityPosts(selectedTicker || undefined),
  ])

  const filteredAlerts = selectedTicker
    ? alerts.filter((a) => a.ticker === selectedTicker)
    : alerts

  return (
    <div className="flex flex-col gap-space-lg w-full pb-space-xl">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[28px]">
              diversity_3
            </span>
            <h1 className="font-headline-lg text-headline-lg font-bold text-text-primary tracking-tight">
              Community Intel & Crowdsourced Sentiment
            </h1>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary mt-1 max-w-3xl">
            Forum analisis independen berbasis saham finansial IDX. Dilengkapi sistem reputasi{" "}
            <strong>Weighted Karma (Anti-PomPom)</strong>, kurasi algoritma <strong>HotRank</strong>,
            dan deteksi dini <strong>Peringatan Divergensi Ritel vs Arus Asing</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-border-subtle text-caption">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-text-primary font-medium">Sistem Voting Berbobot Aktif</span>
        </div>
      </div>

      {filteredAlerts.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-caption text-caption font-bold text-brand-red uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Peringatan Divergensi Aktif Terdeteksi ({filteredAlerts.length})</span>
            </span>
            <span className="text-caption text-text-secondary">
              Tabrakan sentimen ritel vs akumulasi/distribusi asing
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredAlerts.map((alert, idx) => (
              <DivergenceAlertBanner key={idx} alert={alert} />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-caption font-semibold text-text-secondary shrink-0">Filter Saham:</span>
        <a
          href="/community"
          className={`px-3 py-1 rounded-full text-caption font-semibold transition-colors shrink-0 ${
            !selectedTicker
              ? "bg-brand-red text-white"
              : "bg-surface-card hover:bg-surface-container-high text-text-secondary border border-border-subtle"
          }`}
        >
          Semua Saham
        </a>
        {["BBCA", "BBRI", "BMRI", "BBNI", "BBTN", "BRIS"].map((t) => (
          <a
            key={t}
            href={`/community?ticker=${t}`}
            className={`px-3 py-1 rounded-full text-caption font-semibold transition-colors font-mono shrink-0 ${
              selectedTicker === t
                ? "bg-brand-red text-white"
                : "bg-surface-card hover:bg-surface-container-high text-text-secondary border border-border-subtle"
            }`}
          >
            ${t}
          </a>
        ))}
      </div>

      <div className="bg-surface-card rounded-xl border border-border-subtle p-space-lg shadow-sm">
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[20px]">forum</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              Aliran Diskusi Terkurasi {selectedTicker ? `($${selectedTicker})` : "Sektor Finansial"}
            </h2>
          </div>
          <span className="text-caption text-text-secondary font-mono">
            Total {posts.length} Analisis
          </span>
        </div>

        <CommunityFeed initialPosts={posts} ticker={selectedTicker || "BBRI"} />
      </div>
    </div>
  )
}

