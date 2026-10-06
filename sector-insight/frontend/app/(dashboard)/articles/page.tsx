import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import {
  SentimentCard,
  PolicyExposureCard,
  ArticleList,
  SyncNewsButton,
  getSentimentData,
} from "@/src/features/sentiment"

export const metadata: Metadata = {
  title: "Transparansi Berita & Sentimen Makro",
  description: "Audit komprehensif artikel sumber dan verifikasi klasifikasi NLP sentimen perbankan serta regulasi BI & OJK",
}

const TRACKED_BANKS = [
  { ticker: "BBRI", name: "Bank Rakyat Indonesia Tbk" },
  { ticker: "BBCA", name: "Bank Central Asia Tbk" },
  { ticker: "BMRI", name: "Bank Mandiri (Persero) Tbk" },
  { ticker: "BBNI", name: "Bank Negara Indonesia Tbk" },
  { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk" },
  { ticker: "BBTN", name: "Bank Tabungan Negara Tbk" },
]

export default async function ArticlesHubPage() {
  const sentimentData = await getSentimentData("BBRI")

  return (
    <div className="flex flex-col w-full pb-space-lg">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              PILLAR 1: SENTIMENT & NLP
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              TIME-DECAY INTELLIGENCE
            </span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Transparansi Berita & Intelijen Regulasi
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Audit transparan dan rujukan langsung artikel berita sektoral perbankan beserta evaluasi sentimen berbasis LLM/NLP (BI-Rate, regulasi OJK, NPL, CASA) dengan pembobotan peluruhan waktu (time-decay rolling 30 hari).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <SyncNewsButton />
        </div>
      </div>

      <div className="flex items-center gap-space-xs p-1 bg-surface-card rounded border border-border-subtle mb-space-lg overflow-x-auto">
        <span className="px-3 py-1.5 font-caption text-caption font-semibold text-text-secondary uppercase">
          Pilih Emiten:
        </span>
        {TRACKED_BANKS.map((b) => (
          <Link
            key={b.ticker}
            href={`/articles/${b.ticker}`}
            className={`px-3 py-1.5 rounded font-mono text-tabular-sm font-semibold transition-colors ${
              b.ticker === "BBRI"
                ? "bg-brand-red text-text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-container"
            }`}
          >
            {b.ticker}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
        <SentimentCard
          score={sentimentData.companySentimentScore}
          label={sentimentData.companySentimentLabel}
          trend={sentimentData.sampleTrend7d}
          sampleCount={sentimentData.companyArticlesCount}
        />
        <PolicyExposureCard
          score={sentimentData.policyExposureScore}
          label={sentimentData.policyExposureLabel}
          dominantIssue={sentimentData.dominantIssue}
          dominantRegulation={sentimentData.dominantRegulation}
        />

      </div>

      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-text-secondary">
              feed
            </span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              Aliran Artikel & Hasil Ekstraksi NLP (BBRI)
            </h2>
          </div>
          <span className="font-caption text-caption text-text-secondary">
            Menampilkan {sentimentData.articles.length} Sumber Terverifikasi
          </span>
        </div>

        <ArticleList articles={sentimentData.articles} />
      </div>
    </div>
  )
}

