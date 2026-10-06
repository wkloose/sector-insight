"use client"

import React, { useState } from "react"
import { GlossaryItem } from "../types"

interface GlossaryTooltipProps {
  term: string
  glossary?: GlossaryItem[]
  children?: React.ReactNode
}

const DEFAULT_TERMS: Record<string, { simpleName: string; analogy: string }> = {
  NIM: {
    simpleName: "Margin Bunga Pinjaman",
    analogy: "Keuntungan bersih yang didapat bank dari selisih bunga kredit yang dipinjamkan dikurangi bunga tabungan/deposito nasabah.",
  },
  LDR: {
    simpleName: "Tingkat Amannya Simpanan",
    analogy: "Perbandingan seberapa banyak uang pinjaman yang disalurkan dibanding total uang tabungan masyarakat. Idealnya 78% - 92%.",
  },
  ROE: {
    simpleName: "Kemampuan Cetak Laba Modal",
    analogy: "Ukuran seberapa pintar manajemen perusahaan memutar uang modal investor untuk menghasilkan laba bersih tahunan.",
  },
  CASA: {
    simpleName: "Rasio Dana Tabungan Murah",
    analogy: "Porsi uang nasabah yang ada di tabungan dan giro biasa berbunga rendah. Makin tinggi, makin murah biaya modal bank.",
  },
  "Foreign Flow": {
    simpleName: "Aliran Uang Investor Asing",
    analogy: "Selisih total pembelian dan penjualan saham oleh investor luar negeri atau institusi global besar di bursa.",
  },
  "Z-Score": {
    simpleName: "Tingkat Ketidakwajaran Transaksi",
    analogy: "Indikator statistik untuk melihat apakah volume transaksi hari ini normal atau melonjak ekstrem di luar kebiasaannya.",
  },
  Dividen: {
    simpleName: "Bagi Hasil Tunai Tahunan",
    analogy: "Bagian keuntungan bersih perusahaan yang ditransfer langsung secara tunai ke rekening para pemilik saham.",
  },
  PBV: {
    simpleName: "Harga Saham vs Modal Asli",
    analogy: "Perbandingan harga saham di bursa dibanding nilai modal bersih perusahaan. Menunjukkan apakah saham tergolong murah atau mahal.",
  },
}

export function GlossaryTooltip({ term, glossary, children }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const foundItem = glossary?.find((g) => g.term.toLowerCase() === term.toLowerCase())
  const item = foundItem || DEFAULT_TERMS[term] || {
    simpleName: term,
    analogy: "Istilah keuangan pasar modal terverifikasi.",
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center gap-1 border-b border-dashed border-brand-red text-text-primary hover:text-brand-red font-medium transition-colors cursor-help text-left"
        aria-label={`Penjelasan istilah ${term}`}
      >
        <span>{children || term}</span>
        <span className="material-symbols-outlined text-[13px] text-text-secondary opacity-70">
          help
        </span>
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-surface-card border border-brand-red/30 rounded-lg shadow-xl text-left pointer-events-auto backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-border-subtle/60">
            <span className="font-semibold text-[13px] text-brand-red font-mono">{term}</span>
            <span className="text-[11px] text-text-secondary bg-surface-container-lowest px-1.5 py-0.5 rounded font-medium">
              {"simple_name" in item ? item.simple_name : item.simpleName}
            </span>
          </div>
          <p className="text-[12px] text-text-primary leading-relaxed">{item.analogy}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-surface-card" />
        </div>
      )}
    </span>
  )
}

