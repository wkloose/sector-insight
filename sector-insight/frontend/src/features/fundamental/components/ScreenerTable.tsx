"use client"

import React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { ScreenerBankItem } from "../types/fundamental"
import { DataTable } from "@/src/shared/ui/DataTable"
import { StatusBadge } from "@/src/shared/ui/StatusBadge"

export interface ScreenerTableProps {
  data: ScreenerBankItem[]
}

export const ScreenerTable: React.FC<ScreenerTableProps> = ({ data }) => {
  const columns: ColumnDef<ScreenerBankItem>[] = [
    {
      accessorKey: "ticker",
      header: "Ticker & Nama Bank",
      cell: ({ row }) => (
        <Link
          href={`/stock/${row.original.ticker}`}
          className="flex flex-col group py-1"
        >
          <div className="flex items-center gap-2">
            <span className="font-label-ticker text-[15px] font-bold text-text-primary group-hover:text-brand-red transition-colors">
              {row.original.ticker}
            </span>
            <span className="font-caption text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high text-text-secondary">
              {row.original.category}
            </span>
          </div>
          <span className="font-body-sm text-[12px] text-text-secondary truncate max-w-[200px]">
            {row.original.name}
          </span>
        </Link>
      ),
    },
    {
      accessorKey: "score",
      header: "Skor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-surface-container-highest rounded-full h-1.5 overflow-hidden hidden sm:block">
            <div
              className={`h-full rounded-full ${
                row.original.score >= 75
                  ? "bg-data-bullish"
                  : row.original.score >= 60
                  ? "bg-data-neutral"
                  : "bg-brand-red"
              }`}
              style={{ width: `${row.original.score}%` }}
            />
          </div>
          <span className="font-mono text-tabular-sm font-bold text-text-primary">
            {row.original.score}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "nim",
      header: "NIM",
      cell: ({ row }) => (
        <span className="font-mono text-tabular-sm text-text-primary">
          {row.original.nim}
        </span>
      ),
    },
    {
      accessorKey: "ldr",
      header: "LDR",
      cell: ({ row }) => (
        <span className="font-mono text-tabular-sm text-text-primary">
          {row.original.ldr}
        </span>
      ),
    },
    {
      accessorKey: "loanGrowth",
      header: "Loan Growth",
      cell: ({ row }) => (
        <span className="font-mono text-tabular-sm text-text-primary">
          {row.original.loanGrowth}
        </span>
      ),
    },
    {
      accessorKey: "roe",
      header: "ROE",
      cell: ({ row }) => (
        <span className="font-mono text-tabular-sm text-text-primary">
          {row.original.roe}
        </span>
      ),
    },
    {
      accessorKey: "dividend",
      header: "Dividen",
      cell: ({ row }) => (
        <span className="font-mono text-tabular-sm text-text-primary">
          {row.original.dividend}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} size="sm" />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Link
          href={`/stock/${row.original.ticker}`}
          aria-label={`Lihat detail saham ${row.original.ticker}`}
          className="p-1 min-w-[36px] min-h-[36px] flex items-center justify-center text-text-secondary hover:text-brand-red transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-red rounded"
          title="Lihat Detail"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </Link>
      ),
    },
  ]

  return <DataTable columns={columns} data={data} />
}

