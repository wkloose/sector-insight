import React from "react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-margin text-center select-none">
      <div className="w-16 h-16 rounded-lg bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red mb-space-md">
        <span className="material-symbols-outlined text-[32px]">error</span>
      </div>

      <span className="font-mono text-headline-metric font-bold text-text-primary tracking-tight">
        404
      </span>

      <h1 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1 mb-2">
        Halaman Tidak Ditemukan
      </h1>

      <p className="font-body-sm text-body-sm text-text-secondary max-w-sm mb-space-lg leading-relaxed">
        Ticker atau halaman terminal yang Anda cari tidak tersedia dalam direktori pemantauan sistem.
      </p>

      <Link
        href="/dashboard"
        className="px-space-lg py-2.5 bg-brand-red hover:bg-brand-red/90 text-text-primary font-body-sm font-semibold rounded transition-colors shadow-sm flex items-center gap-1.5 min-h-[44px]"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Kembali ke Dashboard Utama</span>
      </Link>
    </div>
  )
}
