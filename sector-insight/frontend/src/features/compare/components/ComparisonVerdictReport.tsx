"use client"

import React from "react"
import { CompareAIResponse } from "../types"

interface ComparisonVerdictReportProps {
  report: CompareAIResponse
}

export const ComparisonVerdictReport: React.FC<ComparisonVerdictReportProps> = ({ report }) => {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-xl p-space-lg shadow-md space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-400 text-[28px]">
              emoji_events
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-brand-red/10 text-brand-red font-bold uppercase tracking-wider">
                VERDICT KOMPARASI
              </span>
              <span className="font-mono text-[11px] text-text-tertiary">
                Confidence: {(report.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold text-text-primary">
              Pemenang Komparasi: <span className="text-amber-400">{report.verdict_winner}</span>
            </h3>
            <p className="font-body-sm text-body-sm text-text-secondary mt-1 max-w-3xl">
              {report.verdict_rationale}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-surface-container-lowest px-3 py-2 rounded-lg border border-border-subtle font-mono text-caption text-text-secondary">
          <span className="material-symbols-outlined text-brand-red text-[18px]">
            auto_awesome
          </span>
          <span>Analisis Head-to-Head Multi-Pilar</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest/70 border border-border-subtle/80 rounded-lg p-4">
        <h4 className="font-headline-sm text-[14px] font-bold text-text-primary flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-brand-red text-[18px]">article</span>
          Ringkasan Eksekutif
        </h4>
        <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
          {report.executive_summary}
        </p>
      </div>

      <div>
        <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-red text-[20px]">leaderboard</span>
          Peringkat Saham & Profil Risiko
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.rankings.map((r) => {
            const isWinner = r.ticker === report.verdict_winner
            return (
              <div
                key={r.ticker}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                  isWinner
                    ? "bg-amber-500/5 border-amber-500/40 shadow-sm"
                    : "bg-surface-container-lowest/50 border-border-subtle"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[12px] ${
                          r.rank === 1
                            ? "bg-amber-400 text-black"
                            : r.rank === 2
                            ? "bg-slate-300 text-black"
                            : "bg-amber-700 text-white"
                        }`}
                      >
                        {r.rank}
                      </span>
                      <span className="font-mono font-bold text-headline-sm text-text-primary">
                        {r.ticker}
                      </span>
                    </div>
                    <span className="font-mono text-tabular-md font-bold text-data-bullish">
                      {r.score}/100
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-text-secondary">
                      {r.title}
                    </span>
                    <p className="font-caption text-caption text-text-tertiary mt-1">
                      Kecocokan: <strong className="text-text-primary">{r.investor_fit}</strong>
                    </p>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                      Keunggulan Utama:
                    </p>
                    {r.strengths.map((str, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[12px] text-text-secondary">
                        <span className="material-symbols-outlined text-data-bullish text-[14px] mt-0.5 shrink-0">
                          check_circle
                        </span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>

                  {r.risks.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                        Faktor Risiko:
                      </p>
                      {r.risks.map((risk, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[12px] text-text-secondary">
                          <span className="material-symbols-outlined text-brand-red text-[14px] mt-0.5 shrink-0">
                            warning
                          </span>
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest/50 border border-border-subtle rounded-lg p-4">
          <h5 className="font-headline-sm text-[13px] font-bold text-text-primary flex items-center gap-1.5 mb-2">
            <span className="material-symbols-outlined text-data-bullish text-[18px]">account_balance</span>
            Pilar Fundamental & Valuasi
          </h5>
          <p className="font-body-sm text-[12px] text-text-secondary leading-relaxed">
            {report.pillar1_fundamental_comparison}
          </p>
        </div>

        <div className="bg-surface-container-lowest/50 border border-border-subtle rounded-lg p-4">
          <h5 className="font-headline-sm text-[13px] font-bold text-text-primary flex items-center gap-1.5 mb-2">
            <span className="material-symbols-outlined text-brand-red text-[18px]">currency_exchange</span>
            Pilar Arus Asing (Foreign Flow)
          </h5>
          <p className="font-body-sm text-[12px] text-text-secondary leading-relaxed">
            {report.pillar2_foreign_flow_comparison}
          </p>
        </div>

        <div className="bg-surface-container-lowest/50 border border-border-subtle rounded-lg p-4">
          <h5 className="font-headline-sm text-[13px] font-bold text-text-primary flex items-center gap-1.5 mb-2">
            <span className="material-symbols-outlined text-amber-400 text-[18px]">newspaper</span>
            Pilar Sentimen & Berita NLP
          </h5>
          <p className="font-body-sm text-[12px] text-text-secondary leading-relaxed">
            {report.pillar3_sentiment_comparison}
          </p>
        </div>
      </div>

      {report.actionable_recommendations.length > 0 && (
        <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl p-4">
          <h4 className="font-headline-sm text-[14px] font-bold text-text-primary flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-brand-red text-[20px]">psychology</span>
            Rekomendasi Taktis Portofolio
          </h4>
          <div className="space-y-2">
            {report.actionable_recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 text-body-sm text-[13px] text-text-secondary">
                <span className="font-mono text-brand-red font-bold text-[13px] shrink-0">
                  {idx + 1}.
                </span>
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
