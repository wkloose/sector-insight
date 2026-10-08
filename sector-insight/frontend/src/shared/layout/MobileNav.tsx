"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/shared/lib/cn"

export const MobileNav: React.FC = () => {
  const pathname = usePathname()

  const items = [
    { label: "Dashboard", path: "/dashboard", icon: "space_dashboard" },
    { label: "Screener", path: "/screener", icon: "table_chart" },
    { label: "Sinyal", path: "/signals", icon: "rss_feed" },
    { label: "Watchlist", path: "/watchlist", icon: "bookmark" },
  ]

  return (
    <nav
      aria-label="Navigasi bawah mobile"
      className="fixed bottom-0 left-0 right-0 h-14 bg-surface-container-lowest border-t border-border-subtle z-50 flex items-center justify-around md:hidden px-space-sm select-none"
    >
      {items.map((item) => {
        const isActive =
          item.path === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.path)

        return (
          <Link
            key={item.path}
            href={item.path}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded transition-colors text-[11px] font-medium min-h-[44px] min-w-[48px]",
              isActive
                ? "text-brand-red"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
