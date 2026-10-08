"use client"

import React, { useState } from "react"
import { SentimentArticle } from "../types/sentiment"
import { SearchInput } from "@/src/shared/ui/SearchInput"
import { sanitizeExternalUrl } from "@/src/shared/lib"

export interface ArticleListProps {
  articles: SentimentArticle[]
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  const [activeTab, setActiveTab] = useState<"all" | "company" | "macro">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = articles.filter((art) => {
    if (activeTab === "company" && art.category !== "company_specific") return false
    if (activeTab === "macro" && art.category !== "macro_policy") return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        art.title.toLowerCase().includes(q) ||
        art.reasoning.toLowerCase().includes(q) ||
        art.source.toLowerCase().includes(q)
      )
    }
    return true
  })

  const companyCount = articles.filter(
    (a) => a.category === "company_specific"
  ).length
  const macroCount = articles.filter((a) => a.category === "macro_policy").length

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-card p-space-md rounded border border-border-subtle">
        <div role="tablist" aria-label="Filter kategori artikel" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 min-h-[36px] rounded font-caption text-caption font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red ${
              activeTab === "all"
                ? "bg-brand-red text-text-primary shadow-sm"
                : "bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            Semua Artikel ({articles.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "company"}
            onClick={() => setActiveTab("company")}
            className={`px-3 py-1.5 min-h-[36px] rounded font-caption text-caption font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red ${
              activeTab === "company"
                ? "bg-brand-red text-text-primary shadow-sm"
                : "bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            Spesifik Perusahaan ({companyCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "macro"}
            onClick={() => setActiveTab("macro")}
            className={`px-3 py-1.5 min-h-[36px] rounded font-caption text-caption font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red ${
              activeTab === "macro"
                ? "bg-brand-red text-text-primary shadow-sm"
                : "bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            Kebijakan Makro ({macroCount})
          </button>
        </div>

        <div className="w-full md:w-72">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Cari kata kunci artikel..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-space-md">
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-space-xl text-center border border-dashed border-border-subtle rounded bg-surface-card/40 my-space-md">
            <span className="material-symbols-outlined text-[28px] text-text-secondary mb-2">
              find_in_page
            </span>
            <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-1">
              Tidak Ada Artikel yang Cocok
            </h4>
            <p className="font-body-sm text-body-sm text-text-secondary max-w-sm">
              Tidak ditemukan artikel untuk kategori ini atau dengan kata kunci yang dimasukkan.
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isPositive = article.sentimentScore >= 0

          return (
            <article
              key={article.id}
              className="p-space-lg bg-surface-card rounded border border-border-subtle hover:border-border-subtle/80 transition-colors flex flex-col gap-space-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold uppercase ${
                      article.category === "macro_policy"
                        ? "bg-data-neutral/20 text-data-neutral border border-data-neutral/30"
                        : "bg-data-bullish/20 text-data-bullish border border-data-bullish/30"
                    }`}
                  >
                    {article.categoryLabel}
                  </span>
                  <span className="font-caption text-caption text-text-secondary">
                    {article.source} • {article.publishedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[12px]">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      isPositive
                        ? "bg-data-bullish/15 text-data-bullish"
                        : "bg-data-bearish/15 text-data-bearish"
                    }`}
                  >
                    {isPositive ? `+${article.sentimentScore}` : article.sentimentScore}{" "}
                    ({article.sentimentLabel})
                  </span>
                  <span className="text-text-secondary">
                    Keyakinan: {article.confidence}%
                  </span>
                </div>
              </div>

              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary leading-snug">
                {article.title}
              </h3>

              <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle/60 text-body-sm text-text-secondary italic leading-relaxed">
                &ldquo;{article.quote}&rdquo;
              </div>

              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                <strong className="text-text-primary not-italic">Analisis NLP:</strong>{" "}
                {article.reasoning}
              </p>

              <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-caption font-caption text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>{article.timeDecayLabel}</span>
                </div>

                <a
                  href={sanitizeExternalUrl(article.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buka artikel asli: ${article.title}`}
                  className="text-brand-red hover:underline flex items-center gap-1 font-medium min-h-[36px]"
                >
                  <span>Buka Artikel Asli</span>
                  <span className="material-symbols-outlined text-[14px]">
                    open_in_new
                  </span>
                </a>
              </div>
            </article>
          )
        }))}
      </div>
    </div>
  )
}
