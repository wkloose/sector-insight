import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface FooterProps {
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full border-t border-border-subtle py-space-md px-margin bg-surface-container-lowest/80 text-text-secondary select-none text-[12px] flex flex-col md:flex-row items-center justify-between gap-space-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-x-space-md gap-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-data-bullish" />
          <span>Data pasar oleh Sectors API</span>
        </div>
        <span className="text-border-subtle">•</span>
        <span>Diperbarui 24 Sep 2026 17:00 WIB (Bursa Efek Indonesia)</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 font-mono text-[11px]">
        <span>Sectors Core API v2.4.1</span>
        <span className="text-border-subtle">•</span>
        <span>Latensi: 24ms</span>
        <span className="text-border-subtle">•</span>
        <span>© 2026 Sectors.Intel Indonesia</span>
      </div>
    </footer>
  )
}

