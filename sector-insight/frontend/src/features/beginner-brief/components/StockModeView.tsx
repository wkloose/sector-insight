"use client"

import React, { useState } from "react"
import { BeginnerBrief, GlossaryItem } from "../types"
import { BeginnerBriefCard } from "./BeginnerBriefCard"

interface StockModeViewProps {
  ticker: string
  brief: BeginnerBrief
  glossary: GlossaryItem[]
  children: React.ReactNode
}

export function StockModeView({ ticker, brief, glossary, children }: StockModeViewProps) {

  const [activeMode, setActiveMode] = useState<"pemula" | "pro">("pemula")

  return (
    <div className="flex flex-col gap-space-lg w-full">

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-surface-card rounded-xl border border-border-subtle shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-red text-[20px]">
            {activeMode === "pemula" ? "school" : "query_stats"}
          </span>
          <div>
            <span className="text-body-sm font-semibold text-text-primary">
              Tampilan Mode Saat Ini:{" "}
              <span className={activeMode === "pemula" ? "text-emerald-400" : "text-brand-red"}>
                {activeMode === "pemula" ? "Mode Pemula (TL;DR 30 Detik)" : "Mode Pro (Analis Kuantitatif)"}
              </span>
            </span>
            <p className="text-[11px] text-text-secondary">
              {activeMode === "pemula"
                ? "Disederhanakan untuk pemula: tanpa rumus kaku, analogi bahasa awam, & 3 Pros vs 3 Cons."
                : "Akses lengkap 3 pilar: Radar Chart 7-Axis, Z-Score Bandarmology, & Valuasi Saham."}
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-surface-container-lowest rounded-lg border border-border-subtle/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode("pemula")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-caption font-semibold transition-all ${
              activeMode === "pemula"
                ? "bg-brand-red text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">school</span>
            <span>Mode Pemula</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("pro")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-caption font-semibold transition-all ${
              activeMode === "pro"
                ? "bg-brand-red text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">query_stats</span>
            <span>Mode Pro</span>
          </button>
        </div>
      </div>

      {activeMode === "pemula" ? (
        <div className="flex flex-col gap-space-lg animate-in fade-in duration-200">
          <BeginnerBriefCard brief={brief} glossary={glossary} />

          <div className="p-space-md bg-surface-card rounded-xl border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-text-secondary text-[24px]">
                analytics
              </span>
              <div>
                <span className="text-body-sm font-semibold text-text-primary">
                  Ingin analisis mendalam dan angka kuantitatif?
                </span>
                <p className="text-caption text-text-secondary">
                  Buka radar chart 7 dimensi, flow dana asing harian, dan tabel valuasi lengkap {ticker}.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveMode("pro")}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-text-primary border border-border-subtle rounded-lg text-caption font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Buka Mode Pro Analis</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-space-lg animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  )
}

