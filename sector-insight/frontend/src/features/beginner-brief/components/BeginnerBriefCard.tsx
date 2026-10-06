"use client"

import React, { useState } from "react"
import { BeginnerBrief, GlossaryItem } from "../types"
import { GlossaryTooltip } from "./GlossaryTooltip"

interface BeginnerBriefCardProps {
  brief: BeginnerBrief
  glossary?: GlossaryItem[]
}

export function BeginnerBriefCard({ brief, glossary }: BeginnerBriefCardProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const isGreen = brief.health_color === "green"
  const isYellow = brief.health_color === "yellow"

  const badgeColorClass = isGreen
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    : isYellow
    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
    : "bg-rose-500/10 text-rose-400 border-rose-500/30"

  const lightIcon = isGreen ? "🟢" : isYellow ? "🟡" : "🔴"

  return (
    <div className="flex flex-col gap-space-lg">

      <div className="bg-surface-card rounded-xl border border-border-subtle p-space-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-space-md border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="Status Indikator">
              {lightIcon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary">
                  Indikator Kesehatan: {brief.health_badge}
                </h2>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${badgeColorClass}`}
                >
                  Skor: {Math.round(brief.health_score)}/100
                </span>
              </div>
              <p className="text-caption text-text-secondary">
                Dihitung dari kombinasi kinerja keuangan, sentimen berita, dan arus modal investor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-secondary bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-border-subtle/50">
            <span className="material-symbols-outlined text-[16px] text-brand-red">bolt</span>
            <span>Mode Pemula (TL;DR 30 Detik)</span>
          </div>
        </div>

        <div className="mt-space-md p-space-md bg-surface-container-lowest/80 rounded-lg border border-border-subtle/60">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">💡</span>
            <span className="font-semibold text-body-sm text-text-primary tracking-wide">
              Ringkasan Kilat (TL;DR):
            </span>
          </div>
          <p className="font-body text-body-sm text-text-primary/90 leading-relaxed">
            {brief.tldr_summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">

        <div className="bg-surface-card rounded-xl border border-emerald-500/20 p-space-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-space-sm border-b border-border-subtle mb-space-md">
              <span className="text-lg">👍</span>
              <h3 className="font-title-md text-title-md font-bold text-emerald-400">
                3 Hal Bagus (Kelebihan)
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {brief.pros.map((pro, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg border border-border-subtle/50"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-body-sm text-text-primary leading-relaxed font-normal">
                    {pro}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-space-md pt-2 border-t border-border-subtle/40 text-caption text-text-secondary text-right">
            Fakta terverifikasi dari laporan keuangan & data pasar
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-rose-500/20 p-space-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-space-sm border-b border-border-subtle mb-space-md">
              <span className="text-lg">⚠️</span>
              <h3 className="font-title-md text-title-md font-bold text-rose-400">
                3 Hal Perlu Waspada (Risiko)
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {brief.cons.map((con, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg border border-border-subtle/50"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-body-sm text-text-primary leading-relaxed font-normal">
                    {con}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-space-md pt-2 border-t border-border-subtle/40 text-caption text-text-secondary text-right">
            Faktor risiko objektif untuk mencegah FOMO
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">

        <div className="bg-surface-card rounded-xl border border-border-subtle p-space-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-space-sm border-b border-border-subtle mb-space-md">
              <span className="text-lg">🎯</span>
              <h3 className="font-title-md text-title-md font-bold text-text-primary">
                Siapa yang Cocok Beli Saham Ini?
              </h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {brief.investor_fit.map((fit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 bg-surface-container-lowest rounded-lg border border-border-subtle/50"
                >
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                    check_circle
                  </span>
                  <span className="text-body-sm font-medium text-text-primary">{fit}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 p-2.5 bg-surface-container-lowest/60 rounded-lg border border-border-subtle/30 opacity-75">
                <span className="material-symbols-outlined text-rose-400 text-[18px]">cancel</span>
                <span className="text-body-sm text-text-secondary">
                  Trader kilat yang mencari keuntungan instan 1-2 hari (pergerakan cenderung bertahap)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-md border-t border-border-subtle">
            <span className="text-caption text-text-secondary block mb-2 font-medium">
              💡 Sorot istilah ini untuk membaca penjelasan awam:
            </span>
            <div className="flex flex-wrap gap-2">
              {["NIM", "LDR", "ROE", "CASA", "Dividen", "Foreign Flow"].map((term) => (
                <GlossaryTooltip key={term} term={term} glossary={glossary}>
                  <span className="text-xs bg-surface-container-lowest px-2 py-1 rounded border border-border-subtle/60">
                    {term}
                  </span>
                </GlossaryTooltip>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-border-subtle p-space-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-space-sm border-b border-border-subtle mb-space-md">
              <span className="text-lg">❓</span>
              <h3 className="font-title-md text-title-md font-bold text-text-primary">
                Pertanyaan yang Sering Ditanyakan Pemula
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {brief.faq_items.map((item, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={idx}
                    className="border border-border-subtle/60 rounded-lg overflow-hidden bg-surface-container-lowest transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-surface-container-lowest/80 transition-colors"
                    >
                      <span className="font-medium text-body-sm text-text-primary">
                        {item.question}
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-text-secondary shrink-0 transition-transform duration-200">
                        {isOpen ? "expand_less" : "expand_more"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 pt-1 text-body-sm text-text-secondary leading-relaxed border-t border-border-subtle/40 bg-surface-container-lowest/40">
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-space-md pt-2 border-t border-border-subtle/40 text-[11px] text-text-secondary leading-relaxed">
            * <strong>Disclaimer Regulasi</strong>: Informasi ini disajikan semata-mata untuk tujuan
            edukasi finansial dan bukan merupakan anjuran mutlak jual/beli instrumen investasi.
          </div>
        </div>
      </div>
    </div>
  )
}

