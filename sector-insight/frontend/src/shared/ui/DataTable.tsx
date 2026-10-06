"use client"

import React, { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { cn } from "@/src/shared/lib/cn"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
  onRowClick?: (row: TData) => void
  emptyMessage?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  onRowClick,
  emptyMessage = "Tidak ada data tersedia",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className={cn("w-full overflow-x-auto border border-border-subtle rounded bg-surface-card", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border-subtle bg-surface-container-lowest/60">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                const ariaSort = sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : canSort ? "none" : undefined
                return (
                  <th
                    key={header.id}
                    aria-sort={ariaSort}
                    tabIndex={canSort ? 0 : undefined}
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={canSort ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        header.column.getToggleSortingHandler()?.(e)
                      }
                    } : undefined}
                    className={cn(
                      "px-space-md py-space-sm font-caption text-caption text-text-secondary uppercase select-none font-semibold",
                      canSort && "cursor-pointer hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-red"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {canSort && (
                        <span className="material-symbols-outlined text-[14px]">
                          {{
                            asc: "arrow_drop_up",
                            desc: "arrow_drop_down",
                          }[sorted as string] ?? "unfold_more"}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border-subtle/60">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row.original)}
                className={cn(
                  "transition-colors hover:bg-surface-container-low",
                  onRowClick && "cursor-pointer"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-space-md py-space-sm font-body-sm text-body-sm text-text-primary align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-space-md py-space-xl text-center text-text-secondary font-body-sm">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

