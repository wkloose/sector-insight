import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { StatusBadge } from "@/src/shared/ui/StatusBadge"
import { getFundamentalScore } from "@/src/features/fundamental"
import { getSentimentData } from "@/src/features/sentiment"
import { getForeignFlowData } from "@/src/features/foreign-flow"

export const metadata: Metadata = {
  title: "Perbandingan Komparatif Antar-Saham",
  description: "Analisis berdampingan metrik 3 pilar untuk emiten perbankan terpilih",
}

export default async function ComparePage() {
  const [bbcaFund, bmriFund, bbriFund, bbcaSent, bmriSent, bbriSent, bbcaFlow, bmriFlow, bbriFlow] = await Promise.all([
    getFundamentalScore("BBCA"),
    getFundamentalScore("BMRI"),
    getFundamentalScore("BBRI"),
    getSentimentData("BBCA"),
    getSentimentData("BMRI"),
    getSentimentData("BBRI"),
    getForeignFlowData("BBCA"),
    getForeignFlowData("BMRI"),
    getForeignFlowData("BBRI"),
  ])
  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              MULTI-ASSET BENCHMARKING
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              SEKTOR FINANSIAL
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Perbandingan Komparatif Antar-Saham
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Analisis berdampingan metrik 3 pilar (Fundamental, Sentimen Berita/Kebijakan, dan Arus Broker Asing) untuk emiten perbankan terpilih.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-border-subtle rounded font-mono text-[12px]">
            <span className="w-2 h-2 rounded-full bg-data-bullish" />
            <span className="font-bold text-text-primary">BBCA</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-border-subtle rounded font-mono text-[12px]">
            <span className="w-2 h-2 rounded-full bg-data-bullish" />
            <span className="font-bold text-text-primary">BMRI</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-brand-red/50 rounded font-mono text-[12px]">
            <span className="w-2 h-2 rounded-full bg-brand-red" />
            <span className="font-bold text-brand-red">BBRI</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        <div className="lg:col-span-7 bg-surface-card p-space-lg rounded border border-border-subtle flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-1">
              Visualisasi Radar Profil Multi-Dimensi
            </h3>
            <span className="font-caption text-caption text-text-secondary">
              Kekuatan Relatif 7 Pilar Finansial (Normalisasi Persentil Sektor)
            </span>

            <div className="w-full flex items-center justify-center my-space-lg relative h-64">
              <svg className="w-64 h-64 overflow-visible" viewBox="0 0 240 240">

                <polygon fill="none" points="120,35 197,72 197,168 120,205 43,168 43,72" stroke="#2E2A2D" strokeWidth="1" />
                <polygon fill="none" points="120,60 174,86 174,154 120,180 66,154 66,86" stroke="#2E2A2D" strokeDasharray="2 2" strokeWidth="1" />
                <polygon fill="none" points="120,85 151,100 151,140 120,155 89,140 89,100" stroke="#2E2A2D" strokeDasharray="2 2" strokeWidth="1" />

                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                  const angle = (2 * Math.PI * i) / 7 - Math.PI / 2
                  const x = 120 + 85 * Math.cos(angle)
                  const y = 120 + 85 * Math.sin(angle)
                  return <line key={i} x1="120" y1="120" x2={x} y2={y} stroke="#2E2A2D" strokeWidth="0.8" />
                })}

                {(() => {
                  const getPoly = (s: number[]) => s.map((val, i) => {
                    const angle = (2 * Math.PI * i) / 7 - Math.PI / 2
                    const r = (Math.max(15, Math.min(100, val)) / 100) * 85
                    return `${Math.round(120 + r * Math.cos(angle))},${Math.round(120 + r * Math.sin(angle))}`
                  }).join(" ")

                  const bbcaPoly = getPoly([bbcaFund.nimScore, bbcaFund.ldrScore, bbcaFund.loanGrowthScore, bbcaFund.depositGrowthScore, bbcaFund.roeScore, bbcaFund.profitConsistencyScore, bbcaFund.dividendScore])
                  const bmriPoly = getPoly([bmriFund.nimScore, bmriFund.ldrScore, bmriFund.loanGrowthScore, bmriFund.depositGrowthScore, bmriFund.roeScore, bmriFund.profitConsistencyScore, bmriFund.dividendScore])
                  const bbriPoly = getPoly([bbriFund.nimScore, bbriFund.ldrScore, bbriFund.loanGrowthScore, bbriFund.depositGrowthScore, bbriFund.roeScore, bbriFund.profitConsistencyScore, bbriFund.dividendScore])

                  return (
                    <>
                      <polygon points={bbcaPoly} fill="#3FAE6A" fillOpacity="0.22" stroke="#3FAE6A" strokeWidth="2" />
                      <polygon points={bmriPoly} fill="#C9A227" fillOpacity="0.22" stroke="#C9A227" strokeWidth="2" />
                      <polygon points={bbriPoly} fill="#E8293D" fillOpacity="0.25" stroke="#E8293D" strokeWidth="2" />
                    </>
                  )
                })()}

                <text x="120" y="24" fill="#999" fontSize="9" textAnchor="middle" fontFamily="monospace">NIM</text>
                <text x="210" y="70" fill="#999" fontSize="9" textAnchor="start" fontFamily="monospace">LDR</text>
                <text x="210" y="175" fill="#999" fontSize="9" textAnchor="start" fontFamily="monospace">LOAN</text>
                <text x="120" y="220" fill="#999" fontSize="9" textAnchor="middle" fontFamily="monospace">DEPOSIT</text>
                <text x="30" y="175" fill="#999" fontSize="9" textAnchor="end" fontFamily="monospace">ROE</text>
                <text x="30" y="70" fill="#999" fontSize="9" textAnchor="end" fontFamily="monospace">KONSISTENSI</text>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-caption font-mono text-text-secondary pt-space-xs border-t border-border-subtle/50">
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-data-bullish" /> BBCA</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-data-neutral" /> BMRI</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-red" /> BBRI</span>
            </div>
            <span>Update: 17:00 WIB</span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="bg-surface-card p-space-md rounded border border-border-subtle">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-ticker text-headline-sm font-bold text-data-bullish">
                BBCA — Keunggulan Kualitas (Premium Defensive)
              </span>
              <span className="font-mono text-tabular-lg font-bold text-text-primary">84</span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
              Memimpin likuiditas ROE (22,4%), Low Growth (14,3%) dan rekor CASA (82,4%). Arus broker asing net-inflow terbesar.
            </p>
          </div>

          <div className="bg-surface-card p-space-md rounded border border-border-subtle">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-ticker text-headline-sm font-bold text-data-neutral">
                BMRI — Pertumbuhan Dana Murah Tercepat
              </span>
              <span className="font-mono text-tabular-lg font-bold text-text-primary">79</span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
              Valuasi PBV paling terdiskon (1,8x) di antara Big-3 dengan pertumbuhan deposit tertinggi (+10,6% YoY) berkat penetrasi Livin.
            </p>
          </div>

          <div className="bg-surface-card p-space-md rounded border border-brand-red/50">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-ticker text-headline-sm font-bold text-brand-red">
                BBRI — Tekanan Outflow & High Yield
              </span>
              <span className="font-mono text-tabular-lg font-bold text-text-primary">71</span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
              NIM tertinggi (6,02%) & dividend yield (6,45%), namun tertekan oleh anomali outflow broker asing (-2.80σ) akibat kekhawatiran kredit mikro.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded border border-border-subtle overflow-hidden">
        <div className="p-space-md bg-surface-container-lowest/60 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Matriks Parameter Komparasi
          </h3>
          <span className="font-caption text-caption text-text-secondary">
            Bandingkan 3 Saham Terpilih
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-sm text-[13px]">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-lowest/30 font-caption text-caption text-text-secondary uppercase">
                <th className="px-space-md py-space-sm w-1/4">Parameter Komparasi</th>
                <th className="px-space-md py-space-sm w-1/4">BBCA (Bank Central Asia)</th>
                <th className="px-space-md py-space-sm w-1/4">BMRI (Bank Mandiri)</th>
                <th className="px-space-md py-space-sm w-1/4">BBRI (Bank Rakyat Indonesia)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-semibold text-text-primary">Status Komposit</td>
                <td className="px-space-md py-space-sm"><StatusBadge status={bbcaFund.status} size="sm" /></td>
                <td className="px-space-md py-space-sm"><StatusBadge status={bmriFund.status} size="sm" /></td>
                <td className="px-space-md py-space-sm"><StatusBadge status={bbriFund.status} size="sm" /></td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-semibold text-text-primary">Skor Fundamental Total</td>
                <td className="px-space-md py-space-sm font-mono text-tabular-md font-bold text-data-bullish">{bbcaFund.score} / 100</td>
                <td className="px-space-md py-space-sm font-mono text-tabular-md font-bold text-data-bullish">{bmriFund.score} / 100</td>
                <td className="px-space-md py-space-sm font-mono text-tabular-md font-bold text-data-neutral">{bbriFund.score} / 100</td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-medium text-text-secondary">NIM (Net Interest Margin)</td>
                <td className="px-space-md py-space-sm font-mono">{bbcaFund.financialMetrics?.nim ?? "5.82%"}</td>
                <td className="px-space-md py-space-sm font-mono">{bmriFund.financialMetrics?.nim ?? "5.34%"}</td>
                <td className="px-space-md py-space-sm font-mono text-data-bullish font-bold">{bbriFund.financialMetrics?.nim ?? "6.02%"} (Tertinggi)</td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-medium text-text-secondary">LDR (Loan to Deposit Ratio)</td>
                <td className="px-space-md py-space-sm font-mono">{bbcaFund.financialMetrics?.ldr ?? "81.4%"} (Ideal)</td>
                <td className="px-space-md py-space-sm font-mono">{bmriFund.financialMetrics?.ldr ?? "85.2%"}</td>
                <td className="px-space-md py-space-sm font-mono">{bbriFund.financialMetrics?.ldr ?? "84.2%"} (Optimal)</td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-medium text-text-secondary">Return on Equity (ROE)</td>
                <td className="px-space-md py-space-sm font-mono text-data-bullish font-bold">{bbcaFund.financialMetrics?.roe ?? "22.4%"} (Tertinggi)</td>
                <td className="px-space-md py-space-sm font-mono">{bmriFund.financialMetrics?.roe ?? "19.1%"}</td>
                <td className="px-space-md py-space-sm font-mono">{bbriFund.financialMetrics?.roe ?? "19.8%"}</td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-semibold text-text-primary">Skor Sentimen Berita NLP</td>
                <td className={`px-space-md py-space-sm font-mono ${bbcaSent.companySentimentScore > 0 ? "text-data-bullish font-bold" : bbcaSent.companySentimentScore < 0 ? "text-data-bearish font-bold" : "text-data-neutral"}`}>{bbcaSent.companySentimentScore > 0 ? "+" : ""}{bbcaSent.companySentimentScore} ({bbcaSent.companySentimentLabel})</td>
                <td className={`px-space-md py-space-sm font-mono ${bmriSent.companySentimentScore > 0 ? "text-data-bullish" : bmriSent.companySentimentScore < 0 ? "text-data-bearish" : "text-data-neutral"}`}>{bmriSent.companySentimentScore > 0 ? "+" : ""}{bmriSent.companySentimentScore} ({bmriSent.companySentimentLabel})</td>
                <td className={`px-space-md py-space-sm font-mono ${bbriSent.companySentimentScore > 0 ? "text-data-bullish" : bbriSent.companySentimentScore < 0 ? "text-data-bearish" : "text-data-neutral"}`}>{bbriSent.companySentimentScore > 0 ? "+" : ""}{bbriSent.companySentimentScore} ({bbriSent.companySentimentLabel})</td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-semibold text-text-primary">Deviasi Arus Asing (Z-Score)</td>
                <td className={`px-space-md py-space-sm font-mono ${Math.abs(bbcaFlow.yesterdayZScore) >= 2.0 ? "text-data-bearish font-bold" : bbcaFlow.yesterdayZScore > 0 ? "text-data-bullish" : "text-text-primary"}`}>{bbcaFlow.yesterdayZScore >= 0 ? "+" : ""}{bbcaFlow.yesterdayZScore}σ ({bbcaFlow.yesterdayAnomalyStatus.split("(")[0].trim()})</td>
                <td className={`px-space-md py-space-sm font-mono ${Math.abs(bmriFlow.yesterdayZScore) >= 2.0 ? "text-data-bearish font-bold" : bmriFlow.yesterdayZScore > 0 ? "text-data-bullish" : "text-text-primary"}`}>{bmriFlow.yesterdayZScore >= 0 ? "+" : ""}{bmriFlow.yesterdayZScore}σ ({bmriFlow.yesterdayAnomalyStatus.split("(")[0].trim()})</td>
                <td className={`px-space-md py-space-sm font-mono ${Math.abs(bbriFlow.yesterdayZScore) >= 2.0 ? "text-data-bearish font-bold" : bbriFlow.yesterdayZScore > 0 ? "text-data-bullish" : "text-text-primary"}`}>{bbriFlow.yesterdayZScore >= 0 ? "+" : ""}{bbriFlow.yesterdayZScore}σ ({bbriFlow.yesterdayAnomalyStatus.split("(")[0].trim()})</td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-medium text-text-secondary">Net Foreign Flow (90 Hari)</td>
                <td className={`px-space-md py-space-sm font-mono font-bold ${bbcaFlow.totalNetFlow90d >= 0 ? "text-data-bullish" : "text-data-bearish"}`}>{bbcaFlow.totalNetFlowFormatted}</td>
                <td className={`px-space-md py-space-sm font-mono ${bmriFlow.totalNetFlow90d >= 0 ? "text-data-bullish" : "text-data-bearish"}`}>{bmriFlow.totalNetFlowFormatted}</td>
                <td className={`px-space-md py-space-sm font-mono font-bold ${bbriFlow.totalNetFlow90d >= 0 ? "text-data-bullish" : "text-data-bearish"}`}>{bbriFlow.totalNetFlowFormatted}</td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-medium text-text-secondary">Price to Book (PBV)</td>
                <td className="px-space-md py-space-sm font-mono">3.10x</td>
                <td className="px-space-md py-space-sm font-mono text-data-bullish font-bold">1.80x (Termurah)</td>
                <td className="px-space-md py-space-sm font-mono">2.38x</td>
              </tr>

              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-medium text-text-secondary">Aksi</td>
                <td className="px-space-md py-space-sm">
                  <Link href="/stock/BBCA" aria-label="Lihat detail saham BBCA" className="text-brand-red hover:underline font-semibold inline-flex items-center gap-0.5 min-h-[36px]">
                    <span>Detail Saham</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </td>
                <td className="px-space-md py-space-sm">
                  <Link href="/stock/BMRI" aria-label="Lihat detail saham BMRI" className="text-brand-red hover:underline font-semibold inline-flex items-center gap-0.5 min-h-[36px]">
                    <span>Detail Saham</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </td>
                <td className="px-space-md py-space-sm">
                  <Link href="/stock/BBRI" aria-label="Lihat detail saham BBRI" className="text-brand-red hover:underline font-semibold inline-flex items-center gap-0.5 min-h-[36px]">
                    <span>Detail Saham</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

