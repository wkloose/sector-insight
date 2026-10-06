import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Metodologi & Transparansi Skor",
  description: "Dokumentasi formula deterministik 3 pilar: fundamental, NLP sentimen, dan anomali broker asing",
}

export default function MethodologyPage() {
  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              DOKUMENTASI RESMI
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              SECTORS HACKATHON TRACK 3
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Metodologi & Transparansi Skor Sintesis
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Penjelasan transparan dan matematis dari seluruh formula kalkulasi 3 pilar utama: Fundamental, NLP Sentimen Berita/Kebijakan, dan Deteksi Anomali Arus Broker Asing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md mb-space-xl">
        <div className="p-space-md bg-surface-card rounded border border-border-subtle">
          <span className="font-mono text-[11px] text-data-bullish font-bold uppercase">Pilar 01</span>
          <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1">
            Fundamental (7 Rasio)
          </h4>
          <p className="font-caption text-caption text-text-secondary mt-1">
            Normalisasi persentil sektoral (0-100) atas 7 indikator kesehatan bank.
          </p>
        </div>

        <div className="p-space-md bg-surface-card rounded border border-border-subtle">
          <span className="font-mono text-[11px] text-brand-red font-bold uppercase">Pilar 02</span>
          <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1">
            NLP Sentimen & Kebijakan
          </h4>
          <p className="font-caption text-caption text-text-secondary mt-1">
            IndoBERT Fin dengan peluruhan eksponensial waktu (half-life 7 hari).
          </p>
        </div>

        <div className="p-space-md bg-surface-card rounded border border-border-subtle">
          <span className="font-mono text-[11px] text-data-neutral font-bold uppercase">Pilar 03</span>
          <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1">
            Anomali Broker Asing
          </h4>
          <p className="font-caption text-caption text-text-secondary mt-1">
            Deteksi Z-Score statistik rolling 90 hari dengan threshold |Z| ≥ 2.0σ.
          </p>
        </div>

        <div className="p-space-md bg-surface-card rounded border border-brand-red/40 bg-brand-red-soft/20">
          <span className="font-mono text-[11px] text-brand-red font-bold uppercase">Pilar 04</span>
          <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1">
            Composite Synthesizer
          </h4>
          <p className="font-caption text-caption text-text-secondary mt-1">
            Matriks deterministik 3-dimensi yang menghasilkan status & rekomendasi.
          </p>
        </div>
      </div>

      <section className="bg-surface-card rounded border border-border-subtle p-space-lg mb-space-xl">
        <div className="flex items-center gap-space-sm mb-space-md pb-space-sm border-b border-border-subtle">
          <span className="w-1.5 h-4 bg-data-bullish rounded-full" />
          <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Pilar 01: Formula Skor Fundamental Perbankan (0 - 100)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md mb-space-md">
          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle font-mono text-[12px]">
            <span className="text-text-secondary uppercase">1. NIM Proxy (Bobot: 20%)</span>
            <p className="text-text-primary mt-1 font-sans">
              Normalisasi margin bunga bersih terhadap seluruh emiten di subsektor perbankan.
            </p>
          </div>

          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle font-mono text-[12px]">
            <span className="text-text-secondary uppercase">2. LDR Sweet-spot (Bobot: 15%)</span>
            <p className="text-text-primary mt-1 font-sans">
              Penalti parabola simetris jika rasio LDR berada di luar rentang optimal 78% - 92%.
            </p>
          </div>

          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle font-mono text-[12px]">
            <span className="text-text-secondary uppercase">3. Pertumbuhan Kredit (Bobot: 15%)</span>
            <p className="text-text-primary mt-1 font-sans">
              Persentil pertumbuhan loan YoY terhadap rata-rata pertumbuhan industri perbankan IDX.
            </p>
          </div>

          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle font-mono text-[12px]">
            <span className="text-text-secondary uppercase">4. Pertumbuhan Simpanan (Bobot: 10%)</span>
            <p className="text-text-primary mt-1 font-sans">
              Pertumbuhan deposit YoY dan rasio dana murah tabungan/giro (CASA).
            </p>
          </div>

          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle font-mono text-[12px]">
            <span className="text-text-secondary uppercase">5. Return on Equity (Bobot: 15%)</span>
            <p className="text-text-primary mt-1 font-sans">
              Tingkat profitabilitas modal ROE yang dinormalisasi dalam persentil sektoral.
            </p>
          </div>

          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle font-mono text-[12px]">
            <span className="text-text-secondary uppercase">6. Konsistensi Laba & Dividen (Bobot: 25%)</span>
            <p className="text-text-primary mt-1 font-sans">
              Konsistensi laba bersih kuartalan (8 kuartal berturut-turut) dan dividend yield 5 tahun.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-card rounded border border-border-subtle p-space-lg mb-space-xl">
        <div className="flex items-center gap-space-sm mb-space-md pb-space-sm border-b border-border-subtle">
          <span className="w-1.5 h-4 bg-brand-red rounded-full" />
          <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Pilar 02: Model NLP IndoBERT & Exponential Time-Decay
          </h2>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded border border-border-subtle font-mono text-body-sm mb-space-md">
          <div className="text-text-secondary"># Formula Pembobotan Peluruhan Waktu:</div>
          <div className="text-text-primary font-bold my-1">
            W(t) = exp( - ln(2) * (t_now - t_publish) / half_life )
          </div>
          <div className="text-text-secondary text-caption">
            * half_life = 7 hari untuk berita spesifik emiten, 14 hari untuk rilis kebijakan BI/OJK.
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
          Setiap artikel diproses oleh IndoBERT Fin untuk klasifikasi polaritas (-1.0 s.d +1.0) dan ekstraksi entitas terdampak (Named Entity Recognition). Filter deduplikasi berbasis Cosine Similarity (ambang 0.88) mencegah bias sentimen akibat berita sindikasi berulang.
        </p>
      </section>

      <section className="bg-surface-card rounded border border-border-subtle p-space-lg mb-space-xl">
        <div className="flex items-center gap-space-sm mb-space-md pb-space-sm border-b border-border-subtle">
          <span className="w-1.5 h-4 bg-data-neutral rounded-full" />
          <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Pilar 03: Deteksi Anomali Arus Broker Asing (Z-Score)
          </h2>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded border border-border-subtle font-mono text-body-sm mb-space-md">
          <div className="text-text-secondary"># Formula Statistical Deviation:</div>
          <div className="text-text-primary font-bold my-1">
            Z = ( NetFlow_t - mean(NetFlow_90d) ) / std_dev(NetFlow_90d)
          </div>
          <div className="text-text-secondary text-caption">
            * Kondisi Anomali: |Z| ≥ 2.0σ (probabilitas &lt; 5% terjadi secara kebetulan).
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md font-body-sm text-[13px]">
          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle">
            <span className="font-bold text-data-bullish">Z ≥ +2.0σ : Akumulasi Anomali</span>
            <p className="text-text-secondary mt-1">
              Arus beli institusi asing di luar deviasi wajar, mengindikasikan akumulasi masif.
            </p>
          </div>
          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle">
            <span className="font-bold text-text-primary">-2.0σ &lt; Z &lt; +2.0σ : Normal</span>
            <p className="text-text-secondary mt-1">
              Fluktuasi harian dalam koridor statistik wajar 90 hari.
            </p>
          </div>
          <div className="p-space-sm bg-surface-container-lowest rounded border border-border-subtle">
            <span className="font-bold text-data-bearish">Z ≤ -2.0σ : Distribusi Ekstrem</span>
            <p className="text-text-secondary mt-1">
              Arus jual institusi asing signifikan, memicu peringatan risiko likuiditas jangka pendek.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-card rounded border border-border-subtle p-space-lg">
        <div className="flex items-center gap-space-sm mb-space-md pb-space-sm border-b border-border-subtle">
          <span className="w-1.5 h-4 bg-brand-red rounded-full" />
          <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Pilar 04: Matriks Keputusan Sintesis (Composite Alert)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-sm text-[13px]">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-lowest font-caption text-caption text-text-secondary uppercase">
                <th className="px-space-md py-space-sm">Skor Fundamental</th>
                <th className="px-space-md py-space-sm">Sentimen Berita</th>
                <th className="px-space-md py-space-sm">Arus Asing (Z)</th>
                <th className="px-space-md py-space-sm">Klasifikasi Status</th>
                <th className="px-space-md py-space-sm">Tindakan Sistem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-mono text-data-bullish">Tinggi (≥ 75)</td>
                <td className="px-space-md py-space-sm font-mono text-data-bullish">Positif (&gt; +0.2)</td>
                <td className="px-space-md py-space-sm font-mono text-data-bullish">Netral / Inflow (Z &gt; -1.0σ)</td>
                <td className="px-space-md py-space-sm"><span className="text-data-bullish font-bold">🟢 Stabil</span></td>
                <td className="px-space-md py-space-sm text-text-secondary">Konfirmasi bullish terpadu</td>
              </tr>
              <tr className="hover:bg-surface-container-low bg-brand-red-soft/20">
                <td className="px-space-md py-space-sm font-mono text-data-bullish">Tinggi (≥ 70)</td>
                <td className="px-space-md py-space-sm font-mono text-data-neutral">Negatif (&lt; -0.1)</td>
                <td className="px-space-md py-space-sm font-mono text-data-bearish font-bold">Outflow Ekstrim (Z ≤ -2.0σ)</td>
                <td className="px-space-md py-space-sm"><span className="text-data-bearish font-bold">🔴 Perhatian Khusus</span></td>
                <td className="px-space-md py-space-sm text-data-bearish font-medium">Divergensi Tajam: Peringatan mitigasi portofolio</td>
              </tr>
              <tr className="hover:bg-surface-container-low">
                <td className="px-space-md py-space-sm font-mono text-data-neutral">Sedang (60 - 74)</td>
                <td className="px-space-md py-space-sm font-mono text-text-secondary">Netral (-0.1 s.d +0.2)</td>
                <td className="px-space-md py-space-sm font-mono text-data-neutral">Outflow Moderat (-1.0 s.d -2.0σ)</td>
                <td className="px-space-md py-space-sm"><span className="text-data-neutral font-bold">🟡 Waspada</span></td>
                <td className="px-space-md py-space-sm text-text-secondary">Monitor kelanjutan aksi broker asing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

