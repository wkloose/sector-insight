"use client"

import React, { useState, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/src/shared/lib/cn"
import { SearchInput } from "@/src/shared/ui/SearchInput"
import { CommandPalette } from "@/src/shared/ui/CommandPalette"
import {
  getMarketSummary,
  getWibTimeAndStatus,
  DEFAULT_MARKET_SUMMARY,
  MarketSummary,
} from "@/src/features/market"

export interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [searchValue, setSearchValue] = useState("")
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [marketSummary, setMarketSummary] = useState<MarketSummary>(DEFAULT_MARKET_SUMMARY)
  const [wibTime, setWibTime] = useState<string>("--:--:-- WIB")
  const [currentStatus, setCurrentStatus] = useState<string>("Pasar Tutup")
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    const updateTimeAndStatus = () => {
      const { formattedTime, status } = getWibTimeAndStatus()
      setWibTime(formattedTime)
      setCurrentStatus(status)
    }

    updateTimeAndStatus()
    const timer = setInterval(updateTimeAndStatus, 1000)

    const fetchSummary = () => {
      getMarketSummary().then((data) => {
        if (data) setMarketSummary(data)
      })
    }
    fetchSummary()
    const summaryInterval = setInterval(fetchSummary, 5000)

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsPaletteOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      clearInterval(timer)
      clearInterval(summaryInterval)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const formattedIhsg =
    typeof marketSummary.ihsg_index === "number"
      ? marketSummary.ihsg_index.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : String(marketSummary.ihsg_index || "6.148,92")

  const ihsgChangeRaw = (() => {
    const pct = marketSummary.ihsg_change_percent
    if (typeof pct === "number") {
      const sign = pct >= 0 ? "+" : ""
      return `${sign}${pct.toFixed(2).replace(".", ",")}%`
    }
    const s = String(pct || "+0,49%")
    if (s.includes(",")) return s.endsWith("%") ? s : s + "%"
    return s.replace(".", ",").endsWith("%") ? s.replace(".", ",") : s.replace(".", ",") + "%"
  })()

  const isIhsgPositive = !ihsgChangeRaw.startsWith("-")

  const foreignFlowFormatted =
    marketSummary.total_foreign_flow_formatted ||
    (typeof marketSummary.total_foreign_flow === "number"
      ? `${marketSummary.total_foreign_flow >= 0 ? "+" : "-"}Rp ${(Math.abs(marketSummary.total_foreign_flow) / 1e9).toFixed(0)} M`
      : "+Rp 31 M")
  const isFlowPositive = !foreignFlowFormatted.startsWith("-")

  const sectorIndicator =
    marketSummary.top_sector ||
    marketSummary.sector_leader ||
    marketSummary.active_sector ||
    "Perbankan Big 4"

  const marketStatus = mounted
    ? (marketSummary.market_status && !["Pasar Tutup", "Sesi I Buka", "Istirahat Pasar", "Sesi II Buka", "Pra-Penutupan"].includes(marketSummary.market_status)
        ? marketSummary.market_status
        : currentStatus)
    : (marketSummary.market_status || "Pasar Tutup")

  const isMarketOpen = marketStatus.includes("Buka")

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 h-16 z-40 backdrop-blur-md bg-surface-container-lowest/80 border-b border-border-subtle flex items-center justify-between px-margin transition-colors duration-200",
          className
        )}
      >
        <div className="flex items-center gap-space-lg">
          <Link href="/" className="flex items-center gap-space-sm hover:opacity-90 transition-opacity">
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
          </Link>

          <div className="h-4 w-[1px] bg-border-subtle hidden lg:block" />

          <div className="hidden xl:flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-card/80 border border-border-subtle rounded transition-colors hover:bg-surface-card">
              <span className="font-caption text-caption text-text-secondary uppercase">IHSG</span>
              <span className="font-mono tracking-tight font-semibold text-tabular-sm text-text-primary">{formattedIhsg}</span>
              <span className={`font-mono tracking-tight font-semibold text-tabular-sm ${isIhsgPositive ? "text-data-bullish" : "text-data-bearish"}`}>
                {ihsgChangeRaw}
              </span>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-card/80 border border-border-subtle rounded transition-colors hover:bg-surface-card">
              <span className="font-caption text-caption text-text-secondary uppercase">Asing Bersih</span>
              <span className={`font-mono tracking-tight font-semibold text-tabular-sm ${isFlowPositive ? "text-data-bullish" : "text-data-bearish"}`}>
                {foreignFlowFormatted}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-card/80 border border-border-subtle rounded cursor-pointer hover:bg-surface-container-high transition-colors">
            <span className="font-caption text-caption text-text-secondary">Sektor:</span>
            <span className="font-body-sm text-body-sm text-text-primary font-medium">{sectorIndicator}</span>
            <span className="material-symbols-outlined text-[14px] text-text-secondary">arrow_drop_down</span>
          </div>
        </div>

        <div className="flex items-center gap-space-md">
          <div
            className="hidden sm:flex w-72 cursor-pointer"
            onClick={() => setIsPaletteOpen(true)}
          >
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="Cari ticker, broker, sinyal..."
              readOnly
            />
          </div>

          <button
            type="button"
            aria-label="Pencarian cepat"
            onClick={() => setIsPaletteOpen(true)}
            className="sm:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer rounded hover:bg-surface-card focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-red"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <div className="hidden lg:flex items-center gap-space-xs px-space-sm py-space-xs border border-border-subtle rounded bg-surface-card/80 select-none hover:bg-surface-card transition-colors">
            <span className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? "bg-data-bullish animate-pulse" : "bg-data-neutral animate-pulse"}`} />
            <span className="font-mono tracking-tight font-semibold text-tabular-sm text-text-secondary">
              {mounted ? wibTime : (marketSummary.market_time || "--:--:-- WIB")}
            </span>
            <span className="text-border-subtle">•</span>
            <span className="font-caption text-caption text-text-secondary">{marketStatus}</span>
          </div>

          <button
            type="button"
            aria-label="Notifikasi"
            onClick={() => setIsPaletteOpen(true)}
            className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer rounded hover:bg-surface-card focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-red"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-red" />
          </button>

          <div className="flex items-center gap-space-sm pl-space-xs border-l border-border-subtle">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="font-caption text-caption font-medium text-text-primary leading-none">
                Institutional Desk
              </span>
              <span className="font-mono tracking-tight text-[10px] text-text-secondary mt-0.5 leading-none">
                ID-7729X
              </span>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </>
  )
}
