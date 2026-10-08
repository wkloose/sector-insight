"use client"

import React, { useMemo, useState } from "react"
import { StockCompareProfile } from "../types"
import {
  computeComparativeInsights,
  StockInsight,
  ComparativeInsightSummary,
} from "../lib/insightEngine"

interface InsightDashboardProps {
  stocks: StockCompareProfile[]
}

const METHODOLOGY_DOCS = [
  {
    name: "1. Composite Investment Score (CIS)",
    badge: "Multi-Factor",
    desc: "Model komposit tertimbang yang mengukur skor daya tarik komprehensif dari 4 dimensi utama: fundamental, valuasi relatif, momentum pergerakan modal asing, dan sentimen publik.",
    formula: "CIS = (Fundamental × 0.35) + (Valuasi × 0.25) + (Momentum × 0.25) + (Sentimen × 0.15)",
    interpretation: "Skala 0–100. >70: Kandidat investasi prima; 50–70: Peluang moderat; <50: Kualitas dan momentum berada di bawah rata-rata sektor.",
  },
  {
    name: "2. Value-Momentum Convergence Index",
    badge: "Convergence",
    desc: "Mendeteksi keselarasan antara status diskon valuasi fundamental (Value) dan akselerasi akumulasi likuiditas institusi (Momentum).",
    formula: "Convergence = ValueSignal × MomentumSignal / 100",
    interpretation: "Konvergensi Bullish (keduanya >60), Divergensi Positif (diskon tinggi tanpa momentum), Divergensi Negatif (valuasi mahal dipacu momentum spekulatif), Konvergensi Bearish (keduanya <40).",
  },
  {
    name: "3. Institutional Conviction Level (ICL)",
    badge: "Smart Money",
    desc: "Mengukur intensitas dan kepastian akumulasi institusi asing berdasarkan z-score anomali arus kas dan arah net foreign flow harian.",
    formula: "ICL = Clamp(0, 100, 50 + (Z-Score × 20) + FlowAdjustment + SentimentAdjustment)",
    interpretation: ">=80: Sangat Tinggi (akumulasi institusional kuat); 65–79: Tinggi; 45–64: Moderat; 25–44: Rendah; <25: Sangat Rendah (tekanan distribusi).",
  },
  {
    name: "4. Risk-Adjusted Attractiveness Ratio (RAAR)",
    badge: "Risk-Reward",
    desc: "Menimbang imbal hasil berbanding risiko dengan menggabungkan kesehatan neraca, diskon valuasi harga, serta risiko pembalikan modal asing.",
    formula: "RAAR = FundamentalScore × 0.5 + (50 + ValuationDiscount) × 0.3 + (50 + FlowRisk + SentimentRisk) × 0.2",
    interpretation: "Semakin tinggi skor, semakin tebal margin perlindungan terhadap volatilitas pasar jangka pendek.",
  },
  {
    name: "5. Alpha Generation Potential (AGP)",
    badge: "Excess Return",
    desc: "Probabilitas perolehan imbal hasil di atas rata-rata pasar didorong katalis sentimen publik, backing institusional, dan keunggulan kompetitif fundamental.",
    formula: "AGP = (Valuation × 0.30) + (Catalyst × 0.20) + (ICL × 0.25) + (FundamentalMoat × 0.25)",
    interpretation: ">=75: Sangat Tinggi; 55–74: Tinggi; 35–54: Moderat; <35: Rendah. Menunjukkan kapasitas menghasilkan alpha terukur.",
  },
  {
    name: "6. Margin of Safety Estimator (MoS)",
    badge: "Valuation Moat",
    desc: "Estimasi persentase diskon harga pasar terhadap PBV wajar emiten yang telah disesuaikan dengan profitabilitas ROE dan pengali kualitas fundamental.",
    formula: "MoS = ((FairPBV - PBV_Aktual) / FairPBV) × 100%",
    interpretation: ">+10%: Undervalued (terdapat batas pengaman harga); -10% s/d +10%: Fair Value; <-10%: Overvalued (premi risiko tinggi).",
  },
]

export const InsightDashboard: React.FC<InsightDashboardProps> = ({ stocks }) => {
  const summary: ComparativeInsightSummary = useMemo(() => {
    return computeComparativeInsights(stocks)
  }, [stocks])

  const insightMap = useMemo(() => {
    const map = new Map<string, StockInsight>()
    for (const item of summary.insights) {
      map.set(item.ticker, item)
    }
    return map
  }, [summary.insights])

  if (!stocks || stocks.length === 0) {
    return null
  }

  const bestOverallInsight = insightMap.get(summary.bestOverall)
  const bestValueInsight = insightMap.get(summary.bestValue)
  const lowestRiskInsight = insightMap.get(summary.lowestRisk)
  const highestAlphaInsight = insightMap.get(summary.highestAlpha)

  const renderSignalBadge = (signal: string) => {
    switch (signal) {
      case "KONVERGENSI_BULLISH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-data-bullish/15 text-data-bullish border border-data-bullish/30">
            <span className="material-symbols-outlined text-[13px]">trending_up</span>
            Konvergensi Bullish
          </span>
        )
      case "DIVERGENSI_POSITIF":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-400/15 text-amber-400 border border-amber-400/30">
            <span className="material-symbols-outlined text-[13px]">moving</span>
            Divergensi Positif
          </span>
        )
      case "DIVERGENSI_NEGATIF":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-data-bearish/15 text-data-bearish border border-data-bearish/30">
            <span className="material-symbols-outlined text-[13px]">warning</span>
            Divergensi Negatif
          </span>
        )
      case "KONVERGENSI_BEARISH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-data-bearish/15 text-data-bearish border border-data-bearish/30">
            <span className="material-symbols-outlined text-[13px]">trending_down</span>
            Konvergensi Bearish
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-surface-container-high text-text-secondary border border-border-subtle">
            <span className="material-symbols-outlined text-[13px]">horizontal_rule</span>
            Netral
          </span>
        )
    }
  }

  const renderConvictionBadge = (conviction: string) => {
    switch (conviction) {
      case "SANGAT_TINGGI":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-data-bullish/15 text-data-bullish border border-data-bullish/30">
            Sangat Tinggi
          </span>
        )
      case "TINGGI":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-data-bullish/10 text-data-bullish border border-data-bullish/25">
            Tinggi
          </span>
        )
      case "MODERAT":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-data-neutral/15 text-data-neutral border border-data-neutral/30">
            Moderat
          </span>
        )
      case "RENDAH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-data-bearish/10 text-data-bearish border border-data-bearish/25">
            Rendah
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-data-bearish/15 text-data-bearish border border-data-bearish/30">
            Sangat Rendah
          </span>
        )
    }
  }

  return (
    <div className="space-y-space-md w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-surface-card p-3.5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="font-caption text-[11px] uppercase tracking-wider text-text-secondary">
              Best Overall
            </span>
            <span className="material-symbols-outlined text-[#E5A93B] text-[18px]">
              emoji_events
            </span>
          </div>
          <div>
            <div className="font-mono font-bold text-headline-sm text-text-primary">
              {summary.bestOverall || "-"}
            </div>
            <div className="font-mono text-[11px] text-text-secondary mt-0.5">
              CIS {bestOverallInsight?.compositeScore ?? 0}/100
            </div>
          </div>
        </div>

        <div className="bg-surface-card p-3.5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="font-caption text-[11px] uppercase tracking-wider text-text-secondary">
              Best Value
            </span>
            <span className="material-symbols-outlined text-data-bullish text-[18px]">
              diamond
            </span>
          </div>
          <div>
            <div className="font-mono font-bold text-headline-sm text-text-primary">
              {summary.bestValue || "-"}
            </div>
            <div className="font-mono text-[11px] text-text-secondary mt-0.5">
              RAAR {bestValueInsight?.riskAdjustedAttractiveness ?? 0}/100
            </div>
          </div>
        </div>

        <div className="bg-surface-card p-3.5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="font-caption text-[11px] uppercase tracking-wider text-text-secondary">
              Best Momentum
            </span>
            <span className="material-symbols-outlined text-brand-red text-[18px]">
              rocket_launch
            </span>
          </div>
          <div>
            <div className="font-mono font-bold text-headline-sm text-text-primary">
              {summary.bestMomentum || "-"}
            </div>
            <div className="font-mono text-[11px] text-text-secondary mt-0.5">
              Foreign Flow Terkuat
            </div>
          </div>
        </div>

        <div className="bg-surface-card p-3.5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="font-caption text-[11px] uppercase tracking-wider text-text-secondary">
              Lowest Risk
            </span>
            <span className="material-symbols-outlined text-[#3FAE6A] text-[18px]">
              shield
            </span>
          </div>
          <div>
            <div className="font-mono font-bold text-headline-sm text-text-primary">
              {summary.lowestRisk || "-"}
            </div>
            <div className="font-mono text-[11px] text-text-secondary mt-0.5">
              Fund {lowestRiskInsight?.riskAdjustedAttractiveness ?? 0}/100
            </div>
          </div>
        </div>

        <div className="bg-surface-card p-3.5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="font-caption text-[11px] uppercase tracking-wider text-text-secondary">
              Highest Alpha
            </span>
            <span className="material-symbols-outlined text-brand-red text-[18px]">
              bolt
            </span>
          </div>
          <div>
            <div className="font-mono font-bold text-headline-sm text-text-primary">
              {summary.highestAlpha || "-"}
            </div>
            <div className="font-mono text-[11px] text-text-secondary mt-0.5">
              AGP {highestAlphaInsight?.alphaGenerationPotential ?? 0}/100
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden shadow-sm">
        <div className="p-space-md bg-surface-container-lowest/60 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-red text-[20px]">
                monitoring
              </span>
              <h3 className="font-headline-sm text-[15px] font-semibold text-text-primary">
                Skor Analitis Komparatif
              </h3>
            </div>
            <p className="font-caption text-caption text-text-secondary mt-0.5">
              Metrik turunan kuantitatif multi-faktor untuk mendeteksi keunggulan kompetitif
            </p>
          </div>
          <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-surface-container-low text-text-secondary self-start sm:self-auto border border-border-subtle/50">
            Insight Engine Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-sm text-[13px]">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-lowest/40 font-caption text-caption text-text-secondary uppercase">
                <th className="px-space-md py-space-sm w-1/3 min-w-[220px]">
                  Parameter Analitis
                </th>
                {stocks.map((stock) => (
                  <th key={stock.ticker} className="px-space-md py-space-sm min-w-[180px]">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[14px] text-text-primary">
                        {stock.ticker}
                      </span>
                      <span className="font-caption text-[11px] text-text-secondary truncate max-w-[100px]">
                        {stock.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              <tr className="hover:bg-surface-container-lowest/30 transition-colors">
                <td className="px-space-md py-3">
                  <div className="font-medium text-text-primary">Composite Investment Score (CIS)</div>
                  <div className="font-caption text-[11px] text-text-secondary">
                    Skor gabungan terbobot 4 pilar
                  </div>
                </td>
                {stocks.map((stock) => {
                  const ins = insightMap.get(stock.ticker)
                  const isTop = stock.ticker === summary.bestOverall
                  return (
                    <td key={stock.ticker} className="px-space-md py-3 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-text-primary">
                          {ins?.compositeScore ?? "-"}
                        </span>
                        <span className="text-text-secondary text-[11px]">/ 100</span>
                        {isTop && (
                          <span className="px-1.5 py-0.5 rounded bg-[#E5A93B]/20 text-[#E5A93B] text-[10px] font-bold">
                            TOP
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>

              <tr className="hover:bg-surface-container-lowest/30 transition-colors">
                <td className="px-space-md py-3">
                  <div className="font-medium text-text-primary">Value-Momentum Signal</div>
                  <div className="font-caption text-[11px] text-text-secondary">
                    Arah keselarasan harga & volume asing
                  </div>
                </td>
                {stocks.map((stock) => {
                  const ins = insightMap.get(stock.ticker)
                  return (
                    <td key={stock.ticker} className="px-space-md py-3">
                      <div className="space-y-1">
                        {ins ? renderSignalBadge(ins.valueMomentumSignal) : "-"}
                        <div className="font-mono text-[11px] text-text-secondary">
                          Index: {ins && ins.valueMomentumValue > 0 ? "+" : ""}{ins?.valueMomentumValue ?? 0}
                        </div>
                      </div>
                    </td>
                  )
                })}
              </tr>

              <tr className="hover:bg-surface-container-lowest/30 transition-colors">
                <td className="px-space-md py-3">
                  <div className="font-medium text-text-primary">Institutional Conviction (ICL)</div>
                  <div className="font-caption text-[11px] text-text-secondary">
                    Intensitas akumulasi pemodal institusi
                  </div>
                </td>
                {stocks.map((stock) => {
                  const ins = insightMap.get(stock.ticker)
                  return (
                    <td key={stock.ticker} className="px-space-md py-3">
                      <div className="space-y-1">
                        <div className="font-mono font-bold text-text-primary text-[14px]">
                          {ins?.institutionalConvictionScore ?? "-"}{" "}
                          <span className="text-[11px] font-normal text-text-secondary">/ 100</span>
                        </div>
                        {ins ? renderConvictionBadge(ins.institutionalConviction) : null}
                      </div>
                    </td>
                  )
                })}
              </tr>

              <tr className="hover:bg-surface-container-lowest/30 transition-colors">
                <td className="px-space-md py-3">
                  <div className="font-medium text-text-primary">Risk-Adjusted Attractiveness (RAAR)</div>
                  <div className="font-caption text-[11px] text-text-secondary">
                    Kualitas fundamental berbanding risiko
                  </div>
                </td>
                {stocks.map((stock) => {
                  const ins = insightMap.get(stock.ticker)
                  const isTop = stock.ticker === summary.bestValue
                  return (
                    <td key={stock.ticker} className="px-space-md py-3 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-text-primary">
                          {ins?.riskAdjustedAttractiveness ?? "-"}
                        </span>
                        <span className="text-text-secondary text-[11px]">/ 100</span>
                        {isTop && (
                          <span className="px-1.5 py-0.5 rounded bg-data-bullish/20 text-data-bullish text-[10px] font-bold">
                            BEST
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>

              <tr className="hover:bg-surface-container-lowest/30 transition-colors">
                <td className="px-space-md py-3">
                  <div className="font-medium text-text-primary">Alpha Generation Potential (AGP)</div>
                  <div className="font-caption text-[11px] text-text-secondary">
                    Peluang imbal hasil di atas rata-rata pasar
                  </div>
                </td>
                {stocks.map((stock) => {
                  const ins = insightMap.get(stock.ticker)
                  const agp = ins?.alphaGenerationPotential ?? 0
                  return (
                    <td key={stock.ticker} className="px-space-md py-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-mono text-[12px]">
                          <span className="font-bold text-text-primary">{agp}%</span>
                          <span className="text-[11px] text-text-secondary">{ins?.alphaLabel}</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              agp >= 75
                                ? "bg-data-bullish"
                                : agp >= 55
                                ? "bg-brand-red"
                                : "bg-text-secondary"
                            }`}
                            style={{ width: `${agp}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  )
                })}
              </tr>

              <tr className="hover:bg-surface-container-lowest/30 transition-colors">
                <td className="px-space-md py-3">
                  <div className="font-medium text-text-primary">Margin of Safety (MoS)</div>
                  <div className="font-caption text-[11px] text-text-secondary">
                    Batas diskon valuasi terhadap PBV wajar
                  </div>
                </td>
                {stocks.map((stock) => {
                  const ins = insightMap.get(stock.ticker)
                  const mos = ins?.marginOfSafety ?? 0
                  const isPositive = mos > 0
                  const isDeepNegative = mos < -10
                  const textColor = isPositive
                    ? "text-data-bullish"
                    : isDeepNegative
                    ? "text-data-bearish"
                    : "text-data-neutral"

                  return (
                    <td key={stock.ticker} className="px-space-md py-3">
                      <div className="space-y-1">
                        <div className={`font-mono font-bold text-[14px] ${textColor}`}>
                          {isPositive ? "+" : ""}
                          {mos.toFixed(1)}%
                        </div>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container-high text-text-secondary border border-border-subtle">
                          {ins?.marginOfSafetyLabel ?? "-"}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {summary.narrativeInsights.length > 0 && (
        <div className="bg-surface-card rounded-xl border border-border-subtle p-space-md shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-brand-red text-[20px]">
              lightbulb
            </span>
            <h4 className="font-headline-sm text-[15px] font-bold text-text-primary">
              Narasi Insight Komparatif
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {summary.narrativeInsights.map((narrative, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest/60 border border-border-subtle/60"
              >
                <span className="material-symbols-outlined text-brand-red text-[18px] shrink-0 mt-0.5">
                  insights
                </span>
                <p className="font-body-sm text-[13px] text-text-primary leading-relaxed">
                  {narrative}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const MethodologySection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-space-md bg-surface-container-lowest/60 hover:bg-surface-container-lowest transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-red text-[20px]">
            menu_book
          </span>
          <span className="font-headline-sm text-[14px] font-bold text-text-primary">
            Metodologi & Formula Analitis
          </span>
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-surface-container-high text-text-secondary border border-border-subtle">
            6 Model Kuantitatif
          </span>
        </div>
        <span
          className={`material-symbols-outlined text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="p-space-md border-t border-border-subtle/60 bg-surface-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {METHODOLOGY_DOCS.map((doc) => (
              <div
                key={doc.name}
                className="p-3.5 rounded-lg bg-surface-container-lowest/50 border border-border-subtle/60 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-body-sm text-[13px] font-bold text-text-primary">
                    {doc.name}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-text-secondary border border-border-subtle">
                    {doc.badge}
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-text-secondary leading-relaxed">
                  {doc.desc}
                </p>
                <div className="p-2 rounded bg-surface-container-lowest font-mono text-[11px] text-brand-red/90 border border-border-subtle/50 break-all">
                  {doc.formula}
                </div>
                <div className="font-caption text-[11px] text-text-secondary leading-snug">
                  <strong className="text-text-primary">Interpretasi: </strong>
                  {doc.interpretation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

