"use client"

import React, { useState, useEffect } from "react"

interface StockSearchResult {
  ticker: string
  name: string
  subsector?: string
  category?: string
  price?: number
  priceChange?: number
}

interface StockSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (ticker: string) => void
  currentTickers: string[]
}

const POPULAR_STOCKS = [
  { ticker: "BBCA", name: "Bank Central Asia", sector: "Keuangan" },
  { ticker: "BMRI", name: "Bank Mandiri", sector: "Keuangan" },
  { ticker: "BBRI", name: "Bank Rakyat Indonesia", sector: "Keuangan" },
  { ticker: "ADRO", name: "Alamtri Resources (Adaro)", sector: "Energi" },
  { ticker: "PTBA", name: "Bukit Asam", sector: "Energi" },
  { ticker: "MEDC", name: "Medco Energi", sector: "Energi" },
  { ticker: "TLKM", name: "Telkom Indonesia", sector: "Infrastruktur" },
  { ticker: "ISAT", name: "Indosat Ooredoo", sector: "Infrastruktur" },
  { ticker: "EXCL", name: "XL Axiata", sector: "Infrastruktur" },
  { ticker: "ANTM", name: "Aneka Tambang", sector: "Barang Baku" },
  { ticker: "MDKA", name: "Merdeka Copper Gold", sector: "Barang Baku" },
  { ticker: "INCO", name: "Vale Indonesia", sector: "Barang Baku" },
  { ticker: "ICBP", name: "Indofood CBP Sukses Makmur", sector: "Konsumen Primer" },
  { ticker: "INDF", name: "Indofood Sukses Makmur", sector: "Konsumen Primer" },
  { ticker: "UNVR", name: "Unilever Indonesia", sector: "Konsumen Primer" },
  { ticker: "ASII", name: "Astra International", sector: "Perindustrian" },
  { ticker: "UNTR", name: "United Tractors", sector: "Perindustrian" },
  { ticker: "GOTO", name: "GoTo Gojek Tokopedia", sector: "Teknologi" },
  { ticker: "CTRA", name: "Ciputra Development", sector: "Properti" },
  { ticker: "KLBF", name: "Kalbe Farma", sector: "Kesehatan" },
]

export const StockSelectorModal: React.FC<StockSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentTickers,
}) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<StockSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setQuery("")
    setResults([])
    onClose()
  }

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      return
    }

    let isMounted = true
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/v1/stocks/search?q=${encodeURIComponent(trimmed)}`)
        if (res.ok && isMounted) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setResults(data)
          }
        }
      } catch {
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [query])

  if (!isOpen) return null

  const displayList: StockSearchResult[] = query.trim()
    ? results
    : POPULAR_STOCKS.map((s) => ({
        ticker: s.ticker,
        name: s.name,
        category: s.sector,
        subsector: s.sector,
      }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-card border border-border-subtle rounded-xl max-w-xl w-full p-space-lg shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              Pilih Saham untuk Komparasi
            </h2>
            <p className="font-caption text-caption text-text-secondary">
              Cari seluruh saham yang tercatat di Bursa Efek Indonesia (941 Emiten)
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Tutup dialog"
            className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Ketik kode ticker atau nama perusahaan (misal: ANTM, ADRO, Telkom)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg pl-10 pr-4 py-2.5 text-body-sm font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-red transition-all"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="mt-4 flex-1 overflow-y-auto divide-y divide-border-subtle/50 pr-1">
          {displayList.length === 0 ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-[32px] text-text-tertiary mb-2">
                manage_search
              </span>
              <p className="font-body-sm text-text-secondary">
                Tidak ada saham ditemukan untuk &quot;{query}&quot;
              </p>
            </div>
          ) : (
            displayList.map((stock) => {
              const isSelected = currentTickers.includes(stock.ticker)
              return (
                <button
                  key={stock.ticker}
                  onClick={() => {
                    if (!isSelected) {
                      onSelect(stock.ticker)
                      onClose()
                    }
                  }}
                  disabled={isSelected}
                  className={`w-full py-2.5 px-3 flex items-center justify-between text-left rounded-lg transition-colors ${
                    isSelected
                      ? "opacity-50 cursor-not-allowed bg-surface-container-low/40"
                      : "hover:bg-surface-container-low cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-headline-sm text-text-primary w-16">
                      {stock.ticker}
                    </span>
                    <div>
                      <p className="font-body-sm text-text-primary font-medium line-clamp-1">
                        {stock.name}
                      </p>
                      <span className="font-caption text-caption text-text-secondary">
                        {stock.subsector || stock.category || "Indeks Saham BEI"}
                      </span>
                    </div>
                  </div>

                  <div>
                    {isSelected ? (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-container-high text-text-tertiary">
                        Sudah Dipilih
                      </span>
                    ) : (
                      <span className="text-[12px] font-medium text-brand-red flex items-center gap-1">
                        Pilih
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
