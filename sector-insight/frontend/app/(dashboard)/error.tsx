"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/src/shared/ui/Button"

export default function DashboardError({
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
    <div className="flex flex-col items-center justify-center p-space-xl my-space-xl text-center select-none bg-surface-card rounded border border-border-subtle max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-lg bg-data-bearish/15 border border-data-bearish/30 flex items-center justify-center text-data-bearish mb-space-md">
        <span className="material-symbols-outlined text-[28px]">warning</span>
      </div>

      <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-2">
        Gagal Memuat Komponen Terminal
      </h2>

      <p className="font-body-sm text-body-sm text-text-secondary max-w-md mb-space-lg leading-relaxed">
        Terjadi galat saat memproses data modul ini. Anda dapat mencoba inisialisasi ulang komponen tanpa meninggalkan halaman.
      </p>

      <div className="flex items-center gap-space-sm">
        <Button
          variant="primary"
          size="sm"
          onClick={() => reset()}
          leftIcon={<span className="material-symbols-outlined text-[16px]">refresh</span>}
        >
          Muat Ulang Modul
        </Button>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm">
            Dashboard Utama
          </Button>
        </Link>
      </div>
    </div>
  )
}

