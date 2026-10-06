import React from "react"
import { Skeleton } from "@/src/shared/ui/Skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface p-margin flex flex-col gap-space-lg select-none">
      <div className="flex items-center justify-between h-16 border-b border-border-subtle pb-space-sm">
        <div className="flex items-center gap-space-sm">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-32 h-6 rounded" />
        </div>
        <div className="flex items-center gap-space-sm">
          <Skeleton className="w-48 h-9 rounded" />
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md mt-space-md">
        <Skeleton className="h-40 rounded" />
        <Skeleton className="h-40 rounded" />
        <Skeleton className="h-40 rounded" />
        <Skeleton className="h-40 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mt-space-md">
        <Skeleton className="lg:col-span-7 h-80 rounded" />
        <Skeleton className="lg:col-span-5 h-80 rounded" />
      </div>
    </div>
  )
}

