"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface PaletteItem {
  id: string
  title: string
  subtitle: string
  path: string
  category: "Halaman" | "Emiten" | "Fitur"
  icon: string
  badge?: string
}

const ITEMS: PaletteItem[] = [
  { id: "p-1", title: "Dashboard Utama", subtitle: "Ringkasan sektor finansial & hero composite alert", path: "/dashboard", category: "Halaman", icon: "space_dashboard" },
  { id: "p-2", title: "Screener Fundamental", subtitle: "Pemeringkatan 7 pilar rasio perbankan", path: "/screener", category: "Halaman", icon: "table_chart" },
  { id: "p-3", title: "Feed Sinyal Gabungan", subtitle: "Aliran realtime divergensi sinyal multi-pilar", path: "/signals", category: "Halaman", icon: "rss_feed" },
  { id: "p-4", title: "Perbandingan Antar-Saham", subtitle: "Benchmarking komparatif multi-emiten", path: "/compare", category: "Halaman", icon: "compare_arrows" },
  { id: "p-5", title: "Kelola Watchlist", subtitle: "Manajemen pool emiten yang dipantau", path: "/watchlist", category: "Halaman", icon: "bookmark" },
  { id: "p-6", title: "Metodologi Skor", subtitle: "Dokumentasi formula matematis & transparansi model", path: "/methodology", category: "Halaman", icon: "analytics" },
  { id: "s-1", title: "BBRI — Bank Rakyat Indonesia", subtitle: "KBMI 4 • Anomali Outflow Masif (-2.80σ)", path: "/stock/BBRI", category: "Emiten", icon: "account_balance", badge: "Perhatian Khusus" },
  { id: "s-2", title: "BBCA — Bank Central Asia", subtitle: "KBMI 4 • Skor Fundamental 84 (Stabil)", path: "/stock/BBCA", category: "Emiten", icon: "account_balance", badge: "Stabil" },
  { id: "s-3", title: "BMRI — Bank Mandiri", subtitle: "KBMI 4 • CASA Tinggi & Pertumbuhan Simpanan", path: "/stock/BMRI", category: "Emiten", icon: "account_balance", badge: "Stabil" },
  { id: "s-4", title: "BBNI — Bank Negara Indonesia", subtitle: "KBMI 4 • Valuasi Terdiskon PBV 1.18x", path: "/stock/BBNI", category: "Emiten", icon: "account_balance", badge: "Stabil" },
  { id: "s-5", title: "BRIS — Bank Syariah Indonesia", subtitle: "KBMI 3 • Pertumbuhan Pembiayaan Syariah Terbesar", path: "/stock/BRIS", category: "Emiten", icon: "account_balance", badge: "Stabil" },
  { id: "s-6", title: "BBTN — Bank Tabungan Negara", subtitle: "KBMI 3 • Spesialis KPR & Diskon Nilai Buku", path: "/stock/BBTN", category: "Emiten", icon: "account_balance", badge: "Perhatian Khusus" },
  { id: "f-1", title: "Transparansi Berita BBRI", subtitle: "Audit 18 artikel NLP & verifikasi kutipan bukti", path: "/articles/BBRI", category: "Fitur", icon: "feed" },
  { id: "f-2", title: "Aktivitas Asing 90 Hari BBRI", subtitle: "Visualisasi deviasi Z-score & konfirmasi broker", path: "/foreign-activity/BBRI", category: "Fitur", icon: "swap_horiz" },
  { id: "f-3", title: "Transparansi Berita BBCA", subtitle: "Audit artikel sentimen CASA & laba BBCA", path: "/articles/BBCA", category: "Fitur", icon: "feed" },
  { id: "f-4", title: "Aktivitas Asing 90 Hari BBCA", subtitle: "Visualisasi net-inflow akumulasi asing BBCA", path: "/foreign-activity/BBCA", category: "Fitur", icon: "swap_horiz" },
]

const CommandPaletteModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filteredItems = ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    inputRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev === 0 ? (filteredItems.length ? filteredItems.length - 1 : 0) : prev - 1
        )
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          router.push(filteredItems[selectedIndex].path)
          onClose()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, filteredItems, onClose, router])

  useEffect(() => {
    if (filteredItems[selectedIndex]) {
      const activeEl = document.getElementById(filteredItems[selectedIndex].id)
      activeEl?.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex, filteredItems])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigasi Cepat Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface-card border border-border-subtle rounded shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-border-subtle bg-surface-container-lowest">
          <span className="material-symbols-outlined text-[20px] text-text-secondary mr-3">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={true}
            aria-controls="palette-listbox"
            aria-activedescendant={filteredItems[selectedIndex]?.id}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Ketik rute, ticker saham, atau fitur terminal..."
            aria-label="Ketik rute, ticker saham, atau fitur terminal"
            className="w-full bg-transparent font-body-sm text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 bg-surface-container-high border border-border-subtle rounded font-mono text-[10px] text-text-secondary">
            ESC
          </kbd>
        </div>

        <div
          id="palette-listbox"
          role="listbox"
          aria-label="Hasil pencarian perintah"
          className="max-h-80 overflow-y-auto divide-y divide-border-subtle/40 p-2"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex

              return (
                <div
                  key={item.id}
                  id={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    router.push(item.path)
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-2.5 rounded cursor-pointer transition-colors min-h-[44px] ${
                    isSelected ? "bg-brand-red text-text-primary" : "hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isSelected ? "text-text-primary" : "text-brand-red"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-body-sm text-[13px] font-semibold">
                          {item.title}
                        </span>
                        <span
                          className={`font-caption text-[10px] px-1.5 py-0.2 rounded uppercase ${
                            isSelected
                              ? "bg-black/30 text-text-primary"
                              : "bg-surface-container-high text-text-secondary"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <span
                        className={`font-caption text-[11px] truncate max-w-sm ${
                          isSelected ? "text-text-primary/80" : "text-text-secondary"
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`font-caption text-[10px] px-2 py-0.5 rounded font-medium ${
                        isSelected
                          ? "bg-white/20 text-text-primary"
                          : "bg-brand-red/15 text-brand-red"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )
            })
          ) : (
            <div className="p-6 text-center text-text-secondary font-body-sm">
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-surface-container-lowest border-t border-border-subtle flex items-center justify-between text-[11px] font-caption text-text-secondary">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigasi</span>
            <span>↵ Buka</span>
            <span>ESC Tutup</span>
          </div>
          <span>Sectors Terminal Navigator</span>
        </div>
      </div>
    </div>
  )
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return <CommandPaletteModal onClose={onClose} />
}

