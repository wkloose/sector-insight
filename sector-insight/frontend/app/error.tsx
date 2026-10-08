"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/src/shared/ui/Button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-margin text-center select-none">
      <div className="w-16 h-16 rounded-lg bg-data-bearish/15 border border-data-bearish/30 flex items-center justify-center text-data-bearish mb-space-md">
        <span className="material-symbols-outlined text-[32px]">error</span>
      </div>

      <span className="font-mono text-headline-metric font-bold text-data-bearish tracking-tight">
        500
      </span>

      <h1 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1 mb-2">
        Terjadi Kesalahan Sistem
      </h1>

      <p className="font-body-sm text-body-sm text-text-secondary max-w-md mb-space-lg leading-relaxed">
        Terminal mengalami kendala saat memproses pipeline data. Silakan coba muat ulang atau kembali ke beranda utama.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-space-sm">
        <Button
          variant="primary"
          onClick={() => reset()}
          leftIcon={<span className="material-symbols-outlined text-[16px]">refresh</span>}
        >
          Coba Lagi
        </Button>
        <Link href="/dashboard">
          <Button variant="secondary">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
