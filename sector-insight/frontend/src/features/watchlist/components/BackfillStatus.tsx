import React from "react"
import { IngestionWorkerStatus } from "../types/watchlist"

export interface BackfillStatusProps {
  workers: IngestionWorkerStatus[]
}

export const BackfillStatus: React.FC<BackfillStatusProps> = ({ workers }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
      {workers.map((worker) => (
        <div
          key={worker.id}
          className="bg-surface-card rounded p-space-md border border-border-subtle flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-data-bullish opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-data-bullish" />
                </span>
                <span className="font-caption text-caption font-semibold tracking-wider text-text-secondary uppercase">
                  {worker.title}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-data-bullish">
                {worker.icon}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-headline-sm text-headline-sm text-text-primary">
                {worker.statusLabel}
              </span>
              <span className="font-mono text-tabular-sm text-data-bullish font-medium">
                {worker.meta}
              </span>
            </div>

            <p className="font-caption text-caption text-text-secondary mt-1 leading-relaxed">
              {worker.description}
            </p>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between font-mono text-[11px] text-text-secondary bg-surface-container-lowest/50 px-2 py-1 rounded border border-border-subtle/40">
            <span>{worker.footerLeft}</span>
            <span className="text-data-bullish">{worker.footerRight}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

