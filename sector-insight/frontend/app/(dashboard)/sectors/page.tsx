import React from "react"
import { Metadata } from "next"
import {
  getSectorRanking,
  getSectorAlerts,
  SectorHeatmap,
  SectorLeaderboardCard,
  SectorRotationAlertBanner,
} from "@/src/features/sectors"

export const metadata: Metadata = {
  title: "Sector Hub & Rotation Heatmap",
  description:
    "Analisis top-down 11 sektor resmi IDX-IC, visualisasi heatmap rotasi sektor, dan leaderboard Sector Rotation & Momentum Score (SMRS).",
}

export default async function SectorsPage() {
  const [ranking, alerts] = await Promise.all([getSectorRanking(), getSectorAlerts()])

  return (
    <div className="flex flex-col gap-space-xl w-full pb-space-xl">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[28px]">
              hub
            </span>
            <h1 className="font-headline-lg text-headline-lg font-bold text-text-primary tracking-tight">
              Sector Hub & Rotation Momentum Engine
            </h1>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary mt-1 max-w-3xl">
            Sistem analisis top-down makro sektoral berdasarkan taksonomi resmi <strong>11 Sektor IDX-IC</strong>.
            Mengintegrasikan sentimen berita AI, akumulasi arus dana asing institusi, dan momentum harga
            ke dalam <strong>Sector Rotation & Momentum Score (SMRS)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-border-subtle text-caption">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-text-primary font-medium">11 Sektor Terpantau Real-Time</span>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="font-caption text-caption font-bold text-brand-red uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            <span>Deteksi Perpindahan Modal Cerdas (Sector Rotation Alert)</span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((alert, idx) => (
              <SectorRotationAlertBanner key={idx} alert={alert} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface-card rounded-xl border border-border-subtle p-space-lg shadow-sm">
        <SectorHeatmap sectors={ranking} />
      </div>

      <div className="bg-surface-card rounded-xl border border-border-subtle p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-red text-[22px]">
              leaderboard
            </span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              Leaderboard Peringkat 11 Sektor (Berdasarkan SMRS)
            </h2>
          </div>
          <span className="text-caption text-text-secondary font-mono">
            Diperbarui Harian (End-of-Day)
          </span>
        </div>

        <SectorLeaderboardCard sectors={ranking} />
      </div>
    </div>
  )
}

