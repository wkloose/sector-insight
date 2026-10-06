import React from "react"
import { Skeleton } from "@/src/shared/ui/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col w-full gap-space-lg select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md py-space-sm mb-space-xs">
        <div className="flex items-center gap-space-sm">
          <Skeleton className="w-48 h-7 rounded" />
          <Skeleton className="w-24 h-7 rounded" />
        </div>
        <div className="flex items-center gap-space-sm">
          <Skeleton className="w-36 h-7 rounded" />
        </div>
      </div>

      <Skeleton className="w-full h-36 rounded" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <Skeleton className="h-64 rounded" />
        <Skeleton className="h-64 rounded" />
        <Skeleton className="h-64 rounded" />
        <Skeleton className="h-64 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <Skeleton className="lg:col-span-7 h-72 rounded" />
        <Skeleton className="lg:col-span-5 h-72 rounded" />
      </div>
    </div>
  )
}

