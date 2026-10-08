import React from "react"
import { Metadata } from "next"
import { ScreenerTable, getScreenerData } from "@/src/features/fundamental"

export const metadata: Metadata = {
  title: "Screener Fundamental Perbankan",
  description: "Pemeringkatan komparatif saham perbankan berdasarkan 7 parameter fundamental",
}

export default async function ScreenerPage() {
  const data = await getScreenerData()

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              SCREENER SEKTOR
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              MODEL 7-DIMENSI
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Screener Fundamental Sektor Finansial
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Daftar bank terurut berdasarkan Skor Fundamental (0-100), dihitung dari normalisasi persentil relatif 7 rasio kunci perbankan.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto shrink-0">
          <div className="flex items-center gap-space-xs px-space-sm py-2 bg-surface-card border border-border-subtle rounded text-body-sm text-text-primary">
            <span className="font-caption text-caption text-text-secondary">Subsektor:</span>
            <span className="font-medium">Semua Bank</span>
            <span className="material-symbols-outlined text-[16px] text-text-secondary">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      <div className="mb-space-lg">
        <ScreenerTable data={data} />
      </div>

      <div className="p-space-md bg-surface-card rounded border border-border-subtle text-caption text-text-secondary flex items-center justify-between">
        <span>* Kolom dapat diurutkan dengan mengklik header tabel. Data diperbarui setiap rilis laporan keuangan kuartalan.</span>
        <span className="font-mono text-[11px] text-text-primary">Terakhir Sinkron: {data[0]?.quarter || "Q2 2026"}</span>
      </div>
    </div>
  )
}
