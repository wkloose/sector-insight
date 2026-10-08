"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/shared/lib/cn"
import { MAIN_NAV_ITEMS } from "@/src/shared/config/navigation"
import { StatusBadge } from "@/src/shared/ui/StatusBadge"

export interface SidebarProps {
  className?: string
}

const QUICK_WATCHLIST = [
  { ticker: "BBCA", score: 84, status: "Stabil" as const },
  { ticker: "BBRI", score: 71, status: "Perhatian Khusus" as const },
  { ticker: "BMRI", score: 79, status: "Stabil" as const },
  { ticker: "BBNI", score: 75, status: "Stabil" as const },
]

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 w-60 z-40 bg-surface-container-lowest border-r border-border-subtle hidden md:flex flex-col justify-between select-none",
        className
      )}
    >
      <div className="flex flex-col pt-space-md overflow-y-auto">
        <div className="px-space-md mb-space-sm">
          <span className="font-caption text-caption font-semibold tracking-wider text-text-secondary uppercase">
            Navigasi Terminal
          </span>
        </div>

        <nav aria-label="Navigasi Utama" className="flex flex-col gap-0.5">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-space-sm px-space-md py-2.5 transition-colors text-body-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-red",
                  isActive
                    ? "border-l-2 border-brand-red bg-surface-card text-text-primary"
                    : "text-text-secondary hover:bg-surface-card hover:text-text-primary"
                )}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-col border-t border-border-subtle p-space-md gap-space-sm bg-surface-card/40">
        <div className="flex items-center justify-between">
          <span className="font-caption text-caption font-semibold tracking-wider text-text-secondary uppercase">
            Watchlist Cepat
          </span>
          <span className="font-mono text-[10px] text-text-secondary">4 Emiten</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {QUICK_WATCHLIST.map((item) => (
            <Link
              key={item.ticker}
              href={`/stock/${item.ticker}`}
              aria-label={`Buka detail saham ${item.ticker}`}
              className="flex items-center justify-between p-1.5 bg-surface-container-lowest border border-border-subtle rounded hover:border-brand-red/40 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-red"
            >
              <div className="flex items-center gap-space-xs">
                <span className="font-label-ticker text-[13px] font-semibold text-text-primary">
                  {item.ticker}
                </span>
                <span className="font-mono text-tabular-sm text-text-secondary">
                  {item.score}
                </span>
              </div>
              <StatusBadge status={item.status} size="sm" />
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between pt-space-xs border-t border-border-subtle/60 text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-data-bullish animate-pulse" />
            <span className="font-caption text-caption">IDX Feed Terhubung</span>
          </div>
          <span className="font-mono text-[11px] text-text-secondary">24ms</span>
        </div>
      </div>
    </aside>
  )
}
