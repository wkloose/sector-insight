"use client"

import React, { useState } from "react"
import { syncLiveNews } from "../services/sentimentApi"

interface SyncNewsButtonProps {
  className?: string
  onSyncComplete?: () => void
}

export const SyncNewsButton: React.FC<SyncNewsButtonProps> = ({ className, onSyncComplete }) => {
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

  const handleSync = async () => {
    setLoading(true)
    setStatusMessage("Menghubungi Sectors API & AI Service...")
    setIsSuccess(null)

    try {
      const res = await syncLiveNews()
      if (res.status === "success") {
        setIsSuccess(true)
        setStatusMessage(res.message || "Sinkronisasi berita live berhasil!")
        if (onSyncComplete) onSyncComplete()
        setTimeout(() => {
          setStatusMessage(null)
          setIsSuccess(null)
        }, 5000)
      } else {
        setIsSuccess(false)
        setStatusMessage(res.message || "Gagal sinkronisasi berita.")
        setTimeout(() => {
          setStatusMessage(null)
          setIsSuccess(null)
        }, 5000)
      }
    } catch (e: unknown) {
      setIsSuccess(false)
      const errorMsg = e instanceof Error ? e.message : "Koneksi backend gagal."
      setStatusMessage(errorMsg)
      setTimeout(() => {
        setStatusMessage(null)
        setIsSuccess(null)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleSync}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded font-body-sm font-semibold transition-all border ${
          loading
            ? "bg-surface-card text-text-secondary border-border-subtle cursor-wait"
            : "bg-surface-card hover:bg-surface-card/80 text-text-primary border-border-subtle hover:border-brand-red/50 shadow-sm"
        } ${className || ""}`}
      >
        <span
          className={`material-symbols-outlined text-[18px] ${
            loading ? "animate-spin text-brand-red" : "text-brand-red"
          }`}
        >
          {loading ? "sync" : "refresh"}
        </span>
        <span>{loading ? "Menyinkronkan..." : "Sync Berita Live"}</span>
      </button>

      {statusMessage && (
        <div
          role="status"
          className={`absolute right-0 top-full mt-2 w-72 p-2.5 rounded shadow-lg border text-caption z-50 animate-in fade-in slide-in-from-top-1 ${
            isSuccess
              ? "bg-surface-card border-data-bullish text-text-primary"
              : isSuccess === false
              ? "bg-surface-card border-brand-red text-text-primary"
              : "bg-surface-card border-border-subtle text-text-secondary"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[16px] ${
                isSuccess
                  ? "text-data-bullish"
                  : isSuccess === false
                  ? "text-brand-red"
                  : "text-text-secondary"
              }`}
            >
              {isSuccess ? "check_circle" : isSuccess === false ? "error" : "info"}
            </span>
            <span className="font-medium text-xs">{statusMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}

