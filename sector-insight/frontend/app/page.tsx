import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: {
    absolute: "Sectors.Intel — Financial Sector Intelligence Dashboard",
  },
  description: "Platform intelijen sektor keuangan perbankan Indonesia (IDX) berbasis Fundamental, Arus Modal Asing, dan Sentimen Berita.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-text-primary flex flex-col select-none">
      <header className="h-16 border-b border-border-subtle bg-surface-container-lowest flex items-center justify-between px-6 md:px-margin">
        <div className="flex items-center gap-space-sm">
          <Image
            src="/assets/images/logo.svg"
            alt="Sectors.Intel"
            width={32}
            height={32}
            priority
            className="w-8 h-8 object-contain"
          />
          <div className="flex items-baseline gap-space-xs">
            <span className="font-label-ticker text-label-ticker font-bold tracking-wider text-text-primary">
              SECTORS
            </span>
            <span className="font-label-ticker text-label-ticker font-bold tracking-wider text-brand-red">
              .INTEL
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-space-lg text-body-sm font-medium text-text-secondary">
          <Link href="/dashboard" className="hover:text-text-primary transition-colors">
            Terminal
          </Link>
          <Link href="/screener" className="hover:text-text-primary transition-colors">
            Screener
          </Link>
          <Link href="/signals" className="hover:text-text-primary transition-colors">
            Sinyal
          </Link>
          <Link href="/compare" className="hover:text-text-primary transition-colors">
            Perbandingan
          </Link>
          <Link href="/methodology" className="hover:text-text-primary transition-colors">
            Metodologi
          </Link>
        </nav>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-brand-red/90 text-text-primary font-body-sm font-semibold rounded transition-colors shadow-sm min-h-[40px]"
        >
          <span>Buka Dashboard</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 md:px-margin py-space-xl max-w-6xl mx-auto w-full">
        <section className="text-center flex flex-col items-center my-space-xl max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-red/15 border border-brand-red/30 text-brand-red font-caption text-caption font-semibold mb-space-md">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            <span>SECTORS HACKATHON 2026 • TRACK 03: MARKET INTELLIGENCE</span>
          </div>

          <h1 className="font-headline-lg text-3xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight mb-space-md">
            Satu Sinyal Terpadu dari{" "}
            <span className="text-brand-red underline decoration-brand-red/50">
              Tiga Pilar
            </span>{" "}
            Pasar Finansial.
          </h1>

          <p className="font-body-md text-base md:text-lg text-text-secondary max-w-2xl mb-space-xl leading-relaxed">
            Satu sinyal, tiga sumber data. Fundamental perbankan, sentimen berita &amp; kebijakan, serta arus transaksi broker asing dibaca jadi satu kesimpulan teruji.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-space-md">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-space-xl py-3 bg-brand-red hover:bg-brand-red/90 text-text-primary font-semibold rounded transition-all shadow-md text-body-sm min-h-[44px]"
            >
              <span>Masuk Terminal Pasar</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              href="/methodology"
              className="flex items-center gap-2 px-space-xl py-3 bg-surface-card hover:bg-surface-container-high text-text-primary font-medium rounded border border-border-subtle transition-colors text-body-sm min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Audit Metodologi</span>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-space-md w-full mb-space-xl">
          <div className="p-space-lg bg-surface-card rounded border border-border-subtle text-center">
            <span className="font-mono text-3xl font-bold text-text-primary">44</span>
            <span className="block font-caption text-caption text-text-secondary mt-1">
              Emiten Sektor Finansial
            </span>
          </div>
          <div className="p-space-lg bg-surface-card rounded border border-border-subtle text-center">
            <span className="font-mono text-3xl font-bold text-data-bullish">90D</span>
            <span className="block font-caption text-caption text-text-secondary mt-1">
              Window Uji Statistik
            </span>
          </div>
          <div className="p-space-lg bg-surface-card rounded border border-border-subtle text-center">
            <span className="font-mono text-3xl font-bold text-brand-red">3 Pilar</span>
            <span className="block font-caption text-caption text-text-secondary mt-1">
              Sintesis Multidimensi
            </span>
          </div>
          <div className="p-space-lg bg-surface-card rounded border border-border-subtle text-center">
            <span className="font-mono text-3xl font-bold text-data-neutral">7 Rasio</span>
            <span className="block font-caption text-caption text-text-secondary mt-1">
              Model Fundamental Bank
            </span>
          </div>
        </section>

        <section className="w-full bg-brand-red-soft p-space-lg rounded border border-brand-red/50 relative overflow-hidden mb-space-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div>
              <span className="font-mono text-caption text-brand-red uppercase tracking-wider font-bold">
                CONTOH KASUS LIVE: BBRI
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary mt-1">
                Fundamental Kuat Divergen dengan Outflow Asing Masif (-2.80σ)
              </h3>
              <p className="font-body-sm text-body-sm text-text-secondary mt-1 max-w-2xl">
                Skor fundamental 71/100, namun net sell broker asing mencapai Rp 89M dalam 1 hari disertai sentimen negatif regulasi mikro OJK. Sistem mendeteksi sinyal waspada dan menghasilkan peringatan otomatis.
              </p>
            </div>
            <Link
              href="/stock/BBRI"
              className="px-4 py-2 bg-brand-red hover:bg-brand-red/90 text-text-primary font-body-sm font-semibold rounded whitespace-nowrap self-start md:self-auto transition-colors min-h-[40px] flex items-center justify-center"
            >
              Lihat Detail BBRI →
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-space-lg w-full mb-space-xl">
          <div className="p-space-lg bg-surface-card rounded border border-border-subtle flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-data-bullish/15 flex items-center justify-center text-data-bullish mb-space-md">
                <span className="material-symbols-outlined text-[24px]">analytics</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-2">
                1. Skor Fundamental 7-Dimensi
              </h3>
              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                Normalisasi persentil sektoral atas NIM, LDR Sweet-Spot (78-92%), Loan Growth, Deposit Growth, ROE, Konsistensi Laba 8 Kuartal, dan Keandalan Dividen.
              </p>
            </div>
            <Link href="/screener" className="text-brand-red text-body-sm font-semibold hover:underline mt-space-md inline-flex items-center min-h-[36px]">
              Buka Screener →
            </Link>
          </div>

          <div className="p-space-lg bg-surface-card rounded border border-border-subtle flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-brand-red/15 flex items-center justify-center text-brand-red mb-space-md">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-2">
                2. Dual-Engine NLP Sentimen
              </h3>
              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                Klasifikasi berita via IndoBERT Fin dengan pemisahan sentimen spesifik emiten vs paparan kebijakan makro BI/OJK dan pembobotan peluruhan waktu.
              </p>
            </div>
            <Link href="/articles/BBRI" className="text-brand-red text-body-sm font-semibold hover:underline mt-space-md inline-flex items-center min-h-[36px]">
              Buka Audit Berita →
            </Link>
          </div>

          <div className="p-space-lg bg-surface-card rounded border border-border-subtle flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-data-neutral/15 flex items-center justify-center text-data-neutral mb-space-md">
                <span className="material-symbols-outlined text-[24px]">radar</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-2">
                3. Deteksi Anomali Asing 90-Hari
              </h3>
              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                Model deviasi statistik Z-Score berbasis rolling baseline 90 hari untuk mendeteksi akumulasi atau distribusi institusi asing ekstrem (|Z| ≥ 2.0σ).
              </p>
            </div>
            <Link href="/foreign-activity/BBRI" className="text-brand-red text-body-sm font-semibold hover:underline mt-space-md inline-flex items-center min-h-[36px]">
              Buka Grafik Arus →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle py-space-md px-6 md:px-margin bg-surface-container-lowest text-text-secondary text-caption flex flex-col md:flex-row items-center justify-between gap-space-sm">
        <span>© 2026 Sectors.Intel — Sectors Hackathon 2026 Track 3 (Market Intelligence)</span>
        <div className="flex items-center gap-space-md font-mono text-[11px]">
          <span>Data Pasar: Sectors API</span>
          <span>•</span>
          <span>Bursa Efek Indonesia (IDX)</span>
        </div>
      </footer>
    </div>
  )
}

