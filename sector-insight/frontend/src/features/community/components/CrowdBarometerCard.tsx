"use client"

import React from "react"
import { CrowdSentiment } from "../types"

interface CrowdBarometerCardProps {
  sentiment: CrowdSentiment
}

export function CrowdBarometerCard({ sentiment }: CrowdBarometerCardProps) {
  const css = sentiment.sentiment_score
  let cssLabel = "Netral / Seimbang"
  let cssColor = "text-text-secondary"

  if (css >= 0.5) {
    cssLabel = "Euforia (Sangat Bullish)"
    cssColor = "text-emerald-400"
  } else if (css >= 0.15) {
    cssLabel = "Optimis Moderat"
    cssColor = "text-emerald-400"
  } else if (css <= -0.5) {
    cssLabel = "Kepanikan (Panic Selling)"
    cssColor = "text-rose-400"
  } else if (css <= -0.15) {
    cssLabel = "Waspada / Pesimis"
    cssColor = "text-rose-400"
  }

  const isSurge = sentiment.discussion_velocity_zscore >= 2.0

  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle p-space-lg flex flex-col gap-space-md shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-space-sm border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-red text-[20px]">
            groups
          </span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary">
            Pilar 4: Crowd Barometer & Konsensus Ritel ({sentiment.ticker})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption text-text-secondary font-mono">
            Total {sentiment.total_posts} Thread Aktif
          </span>
          {isSurge && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">bolt</span>
              <span>Buzz {sentiment.discussion_velocity_zscore}x</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3 bg-surface-container-lowest rounded-lg border border-border-subtle/50">
        <div className="flex items-center justify-between text-body-sm">
          <span className="font-semibold text-text-primary">
            Crowd Sentiment Score (CSS):{" "}
            <span className={`font-mono font-bold ${cssColor}`}>
              {css > 0 ? `+${css.toFixed(2)}` : css.toFixed(2)}
            </span>{" "}
            <span className="text-caption text-text-secondary">({cssLabel})</span>
          </span>
          <span className="font-mono text-caption text-text-secondary">
            Rentang: -1.0 s.d +1.0
          </span>
        </div>

        <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex">
          <div
            style={{ width: `${sentiment.bullish_percent}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Bullish ${sentiment.bullish_percent}%`}
          />
          <div
            style={{ width: `${sentiment.bearish_percent}%` }}
            className="bg-rose-500 transition-all duration-500"
            title={`Bearish ${sentiment.bearish_percent}%`}
          />
        </div>

        <div className="flex justify-between items-center text-caption font-semibold">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>{sentiment.bullish_percent.toFixed(0)}% Bullish</span>
          </span>
          <span className="text-rose-400 flex items-center gap-1">
            <span>{sentiment.bearish_percent.toFixed(0)}% Bearish</span>
            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-surface-container-lowest rounded-lg border border-emerald-500/20">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">thumb_up</span>
            <span>Top Bullish Arguments (NLP)</span>
          </span>
          <ul className="flex flex-col gap-1.5 text-caption text-text-primary">
            {sentiment.top_bullish_arguments.map((arg, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{arg}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-lg border border-rose-500/20">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">thumb_down</span>
            <span>Top Bearish Arguments (NLP)</span>
          </span>
          <ul className="flex flex-col gap-1.5 text-caption text-text-primary">
            {sentiment.top_bearish_arguments.map((arg, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-rose-400 font-bold">•</span>
                <span>{arg}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

