"use client"

import React, { useState } from "react"
import { StockCompareProfile, CompareAIResponse, SectorPreset } from "../types"
import { ComparativeRadarChart } from "./ComparativeRadarChart"
import { ComparativeMetricsTable } from "./ComparativeMetricsTable"
import { ComparisonVerdictReport } from "./ComparisonVerdictReport"
import { StockSelectorModal } from "./StockSelectorModal"
import { InsightDashboard, MethodologySection } from "./InsightDashboard"
import { computeStockInsight } from "../lib/insightEngine"

interface StockComparisonHubProps {
  initialProfiles: StockCompareProfile[]
}

const SECTOR_PRESETS: SectorPreset[] = [
  { label: "Big Banks", sectorName: "Keuangan", tickers: ["BBCA", "BMRI", "BBRI"], icon: "account_balance" },
  { label: "Energi & Batu Bara", sectorName: "Energi", tickers: ["ADRO", "PTBA", "MEDC"], icon: "bolt" },
  { label: "Telekomunikasi", sectorName: "Infrastruktur", tickers: ["TLKM", "ISAT", "EXCL"], icon: "cell_tower" },
  { label: "Mineral & Tambang", sectorName: "Barang Baku", tickers: ["ANTM", "MDKA", "INCO"], icon: "diamond" },
  { label: "Konsumen Primer", sectorName: "Konsumer", tickers: ["ICBP", "INDF", "UNVR"], icon: "shopping_cart" },
  { label: "Properti", sectorName: "Properti", tickers: ["CTRA", "BSDE", "PWON"], icon: "domain" },
  { label: "Otomotif & Industri", sectorName: "Industri", tickers: ["ASII", "UNTR"], icon: "precision_manufacturing" },
]

export const StockComparisonHub: React.FC<StockComparisonHubProps> = ({ initialProfiles }) => {
  const [stocks, setStocks] = useState<StockCompareProfile[]>(initialProfiles)
  const [modalOpen, setModalOpen] = useState(false)
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null)
  const [isFetchingStock, setIsFetchingStock] = useState(false)

  const [aiReport, setAiReport] = useState<CompareAIResponse | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const handleOpenSelector = (index: number | null) => {
    setReplacingIndex(index)
    setModalOpen(true)
  }

  const handleSelectStock = async (ticker: string) => {
    setIsFetchingStock(true)
    setAiReport(null)
    setAiError(null)

    try {
      const res = await fetch(`/api/v1/compare/profile?ticker=${ticker}`)
      if (res.ok) {
        const newProfile: StockCompareProfile = await res.json()
        setStocks((prev) => {
          if (replacingIndex !== null && replacingIndex < prev.length) {
            const next = [...prev]
            next[replacingIndex] = newProfile
            return next
          }
          if (prev.length < 3) {
            return [...prev, newProfile]
          }
          return prev
        })
      }
    } catch {
    } finally {
      setIsFetchingStock(false)
    }
  }

  const handleRemoveStock = (index: number) => {
    if (stocks.length <= 2) return
    setAiReport(null)
    setStocks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleApplyPreset = async (preset: SectorPreset) => {
    setIsFetchingStock(true)
    setAiReport(null)
    setAiError(null)

    try {
      const profiles = await Promise.all(
        preset.tickers.map(async (t) => {
          const res = await fetch(`/api/v1/compare/profile?ticker=${t}`)
          if (res.ok) {
            return (await res.json()) as StockCompareProfile
          }
          return null
        })
      )
      const valid = profiles.filter((p): p is StockCompareProfile => p !== null)
      if (valid.length >= 2) {
        setStocks(valid)
      }
    } catch {
    } finally {
      setIsFetchingStock(false)
    }
  }

  const handleAnalyzeWithAI = async () => {
    if (stocks.length < 2) return
    setIsAiLoading(true)
    setAiError(null)

    try {
      const payload = {
        stocks: stocks.map((s) => {
          const insight = computeStockInsight(s)
          return {
            ticker: s.ticker,
            name: s.name,
            sector: s.sector,
            price: s.price,
            change_percent: s.change_percent,
            market_cap: s.market_cap,
            pe: s.pe,
            pbv: s.pbv,
            roe: s.roe,
            fundamental_score: s.fundamental_score,
            health_status: s.health_status,
            net_foreign_flow: s.net_foreign_flow,
            foreign_z_score: s.foreign_z_score,
            foreign_anomaly: s.foreign_anomaly,
            sentiment_score: s.sentiment_score,
            sentiment_label: s.sentiment_label,
            composite_score: insight.compositeScore,
            value_momentum_signal: insight.valueMomentumSignal,
            institutional_conviction: insight.institutionalConviction,
            risk_adjusted_attractiveness: insight.riskAdjustedAttractiveness,
            alpha_generation_potential: insight.alphaGenerationPotential,
            margin_of_safety: insight.marginOfSafety,
          }
        }),
      }

      const res = await fetch("/api/v1/compare/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Gagal memproses sintesis komparasi komprehensif")
      }

      const data: CompareAIResponse = await res.json()
      setAiReport(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan dalam pemrosesan komparasi"
      setAiError(msg)
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full pb-space-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              MULTI-ASSET BENCHMARKING
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              SEMUA SAHAM BEI (941 EMITEN)
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Komparasi Saham Head-to-Head
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Bandingkan 2 hingga 3 saham dari seluruh sektor pasar modal Indonesia berdasarkan 3 Pilar (Fundamental, Sentimen Berita NLP, dan Arus Bandar Asing), dilengkapi sintesis komparasi cerdas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {stocks.map((s, idx) => (
            <div
              key={s.ticker}
              className="flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-border-subtle rounded-lg font-mono text-[12px] shadow-sm"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  idx === 0 ? "bg-[#3FAE6A]" : idx === 1 ? "bg-[#E5A93B]" : "bg-[#E8293D]"
                }`}
              />
              <span className="font-bold text-text-primary">{s.ticker}</span>
              <button
                onClick={() => handleOpenSelector(idx)}
                className="text-text-tertiary hover:text-text-primary ml-1"
                title="Ganti saham ini"
              >
                <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
              </button>
            </div>
          ))}

          {stocks.length < 3 && (
            <button
              onClick={() => handleOpenSelector(null)}
              className="flex items-center gap-1 px-3 py-1 bg-surface-container-low hover:bg-surface-container border border-dashed border-border-subtle rounded-lg font-mono text-[12px] text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Tambah Saham</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface-card p-3 rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-text-secondary font-body-sm text-[12px]">
          <span className="material-symbols-outlined text-brand-red text-[18px]">tune</span>
          <span className="font-semibold text-text-primary">Preset Cepat Sektor:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SECTOR_PRESETS.map((p) => {
            const isActive =
              p.tickers.length === stocks.length &&
              p.tickers.every((t) => stocks.some((s) => s.ticker === t))
            return (
              <button
                key={p.label}
                onClick={() => handleApplyPreset(p)}
                disabled={isFetchingStock}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1 transition-all ${
                  isActive
                    ? "bg-brand-red text-white font-bold shadow-sm"
                    : "bg-surface-container-lowest hover:bg-surface-container-low text-text-secondary hover:text-text-primary border border-border-subtle/70"
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">{p.icon}</span>
                <span>{p.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {isFetchingStock && (
        <div className="w-full p-4 rounded-xl bg-surface-card border border-border-subtle flex items-center justify-center gap-3 animate-pulse">
          <div className="w-4 h-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          <span className="font-body-sm text-text-secondary">
            Memuat profil multi-pilar saham terpilih...
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-7">
          <ComparativeRadarChart stocks={stocks} />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
                Emiten yang Dibandingkan ({stocks.length} Saham)
              </span>
              {stocks.length < 3 && (
                <button
                  type="button"
                  onClick={() => handleOpenSelector(null)}
                  className="font-mono text-[11px] text-brand-red hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">add</span>
                  <span>+ Tambah Saham</span>
                </button>
              )}
            </div>

            {stocks.map((stock, idx) => {
              const borderCol =
                idx === 0
                  ? "border-l-4 border-l-[#3FAE6A]"
                  : idx === 1
                  ? "border-l-4 border-l-[#E5A93B]"
                  : "border-l-4 border-l-[#E8293D]"

              return (
                <div
                  key={stock.ticker}
                  className={`bg-surface-card p-space-md rounded-xl border border-border-subtle shadow-sm ${borderCol}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-label-ticker text-headline-sm font-bold text-text-primary">
                        {stock.ticker}
                      </span>
                      <span className="font-caption text-caption text-text-secondary truncate max-w-[140px]">
                        {stock.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-data-bullish">
                        {stock.fundamental_score}/100
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenSelector(idx)}
                        title="Ganti saham ini dengan emiten lain"
                        className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-[11px] font-mono text-text-primary hover:text-brand-red border border-border-subtle flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                        <span>Ganti</span>
                      </button>
                      {stocks.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStock(idx)}
                          title="Hapus saham dari komparasi"
                          className="p-1 rounded text-text-tertiary hover:text-brand-red hover:bg-brand-red-soft/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[15px]">close</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border-subtle/50 text-[11px] font-mono">
                    <div>
                      <span className="text-text-tertiary">ROE:</span>{" "}
                      <strong className="text-text-primary">{stock.roe.toFixed(1)}%</strong>
                    </div>
                    <div>
                      <span className="text-text-tertiary">PER:</span>{" "}
                      <strong className="text-text-primary">{stock.pe.toFixed(1)}x</strong>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Foreign:</span>{" "}
                      <strong
                        className={
                          stock.net_foreign_flow >= 0 ? "text-data-bullish" : "text-data-bearish"
                        }
                      >
                        {stock.net_foreign_flow >= 0 ? "+" : ""}
                        {(stock.net_foreign_flow / 1e9).toFixed(0)}M
                      </strong>
                    </div>
                  </div>
                </div>
              )
            })}

            {stocks.length < 3 && (
              <button
                type="button"
                onClick={() => handleOpenSelector(null)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-border-subtle hover:border-brand-red/50 bg-surface-card/30 hover:bg-surface-card flex items-center justify-center gap-2 text-[12px] font-mono text-text-secondary hover:text-brand-red transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[17px]">add_circle</span>
                <span>+ Tambah Saham untuk Komparasi ({stocks.length}/3)</span>
              </button>
            )}
          </div>

          <div className="bg-gradient-to-br from-surface-card to-surface-container-lowest p-4 rounded-xl border border-brand-red/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-brand-red text-[20px]">
                  neurology
                </span>
                <h4 className="font-headline-sm text-[14px] font-bold text-text-primary">
                  Sintesis Komparasi Cerdas
                </h4>
              </div>
              <p className="font-body-sm text-[12px] text-text-secondary leading-relaxed mb-2">
                Jalankan komparasi head-to-head untuk menimbang seluruh dimensi (Fundamental, Arus Asing & Sentimen Berita) secara objektif dan instan.
              </p>

              <div className="my-2.5 pt-2.5 border-t border-border-subtle/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider">
                    Pilihan Saham untuk Dikomparasi:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenSelector(null)}
                    className="text-[11px] font-mono text-brand-red hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">search</span>
                    <span>Cari 941 Saham BEI</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {stocks.map((s, idx) => (
                    <div
                      key={s.ticker}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-border-subtle font-mono text-[12px] shadow-sm"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          idx === 0 ? "bg-[#3FAE6A]" : idx === 1 ? "bg-[#E5A93B]" : "bg-[#E8293D]"
                        }`}
                      />
                      <span className="font-bold text-text-primary">{s.ticker}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenSelector(idx)}
                        title="Ganti saham ini"
                        className="text-text-tertiary hover:text-text-primary ml-0.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                      </button>
                      {stocks.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStock(idx)}
                          title="Hapus saham"
                          className="text-text-tertiary hover:text-brand-red ml-0.5"
                        >
                          <span className="material-symbols-outlined text-[13px]">close</span>
                        </button>
                      )}
                    </div>
                  ))}

                  {stocks.length < 3 && (
                    <button
                      type="button"
                      onClick={() => handleOpenSelector(null)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container border border-dashed border-border-subtle font-mono text-[11px] text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[13px]">add</span>
                      <span>Tambah Saham</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleAnalyzeWithAI}
              disabled={isAiLoading || stocks.length < 2}
              className="w-full py-2.5 px-4 rounded-lg bg-brand-red hover:bg-brand-red-hover active:bg-brand-red-active text-white font-semibold font-body-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sedang Menganalisis Komparasi...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>Bandingkan Saham Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {aiError && (
        <div className="p-4 rounded-xl bg-brand-red/10 border border-brand-red/30 text-brand-red font-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{aiError}</span>
        </div>
      )}

      {aiReport && <ComparisonVerdictReport report={aiReport} />}

      <InsightDashboard stocks={stocks} />

      <ComparativeMetricsTable
        stocks={stocks}
        onOpenSelector={handleOpenSelector}
        onRemoveStock={handleRemoveStock}
      />

      <MethodologySection />

      <StockSelectorModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setReplacingIndex(null)
        }}
        onSelect={handleSelectStock}
        currentTickers={stocks.map((s) => s.ticker)}
      />
    </div>
  )
}
