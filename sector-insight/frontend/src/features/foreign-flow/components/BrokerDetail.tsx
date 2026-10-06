import React from "react"
import { Broker } from "@/src/entities/broker"
import { formatRupiah } from "@/src/shared/lib/format"

export interface BrokerDetailProps {
  broker: Broker
  className?: string
}

export const BrokerDetail: React.FC<BrokerDetailProps> = ({ broker, className }) => {
  const isPositive = (broker.netValue ?? 0) >= 0

  return (
    <div className={className || "flex items-center gap-space-sm"}>
      <span className="font-mono text-tabular-sm font-bold px-2 py-0.5 rounded bg-surface-container-high text-text-primary border border-border-subtle">
        {broker.code}
      </span>
      <div className="flex flex-col">
        <span className="font-body-sm text-[13px] font-semibold text-text-primary">
          {broker.name}
        </span>
        <span className="font-caption text-[11px] text-text-secondary">
          {broker.category}
        </span>
      </div>
      {broker.netValue !== undefined && (
        <span
          className={`ml-auto font-mono text-tabular-sm font-bold ${
            isPositive ? "text-data-bullish" : "text-data-bearish"
          }`}
        >
          {broker.netValue >= 0 ? "+" : ""}
          {formatRupiah(broker.netValue)}
        </span>
      )}
    </div>
  )
}

