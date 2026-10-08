import React from "react"
import Link from "next/link"
import { AlertFeedItem } from "../types/compositeAlert"
import { StatusBadge } from "@/src/shared/ui/StatusBadge"

export interface SignalFeedItemProps {
  item: AlertFeedItem
}

export const SignalFeedItem: React.FC<SignalFeedItemProps> = ({ item }) => {
  return (
    <div className="p-space-lg bg-surface-card rounded border border-border-subtle hover:bg-surface-container-low transition-colors flex flex-col gap-space-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/stock/${item.ticker}`}
            className="font-label-ticker text-[16px] font-bold text-text-primary hover:text-brand-red transition-colors"
          >
            {item.ticker}
          </Link>
          <span className="font-body-sm text-[12px] text-text-secondary">
            {item.bankName}
          </span>
          <span className="text-border-subtle">•</span>
          <span className="font-caption text-caption text-text-secondary">
            {item.timestamp} ({item.timeAgo})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} size="sm" />
        </div>
      </div>

      <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary leading-snug">
        {item.title}
      </h3>

      <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
        {item.description}
      </p>

      <div className="pt-2 border-t border-border-subtle/50 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-text-secondary">
        <div className="flex items-center gap-space-md">
          <span>Fundamental: <strong className="text-text-primary">{item.fundamentalScore}/100</strong></span>
          <span>Z-Score: <strong className={item.zScore < -2 ? "text-data-bearish" : "text-data-bullish"}>{item.zScore}σ</strong></span>
          <span>Policy: <strong className={item.policyExposure < 0 ? "text-data-neutral" : "text-data-bullish"}>{item.policyExposure >= 0 ? `+${item.policyExposure}` : item.policyExposure}</strong></span>
        </div>

        <Link
          href={`/stock/${item.ticker}`}
          aria-label={`Detail analisis saham ${item.ticker}`}
          className="text-brand-red hover:underline flex items-center gap-0.5 font-sans text-caption font-semibold min-h-[36px]"
        >
          <span>Detail Analisis</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}
