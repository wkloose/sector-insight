import React from "react"
import { Metadata } from "next"
import {
  SignalFeedItem,
  getAlertFeed,
  getPrimaryAlert,
  CompositeAlertHero,
} from "@/src/features/composite-alert"

export const metadata: Metadata = {
  title: "Feed Sinyal Gabungan",
  description: "Kronologis sinyal gabungan 3 pilar data fundamental, sentimen, dan transaksi asing",
}

export default async function SignalsPage() {
  const [primaryAlert, feedItems] = await Promise.all([
    getPrimaryAlert(),
    getAlertFeed(),
  ])

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-mono text-tabular-sm px-2 py-0.5 rounded bg-brand-red-soft text-brand-red font-medium tracking-wide">
              MULTI-SIGNAL SYNTHESIS
            </span>
            <span className="font-caption text-caption text-text-secondary tracking-widest uppercase">
              FEED REALTIME
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold tracking-tight">
            Feed Sinyal Gabungan (Composite Alert Stream)
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-3xl mt-1">
            Aliran peringatan cerdas yang disintesis otomatis saat terjadi divergensi atau anomali simultan antara kinerja fundamental, sentimen berita, dan pergerakan broker asing.
          </p>
        </div>
      </div>

      <div className="mb-space-lg">
        <CompositeAlertHero alert={primaryAlert} />
      </div>

      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-text-secondary">
            history
          </span>
          <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
            Riwayat Sinyal & Peringatan Terkini
          </h2>
        </div>
        <span className="font-caption text-caption text-text-secondary">
          Menampilkan {feedItems.length} Sinyal Terverifikasi
        </span>
      </div>

      <div className="flex flex-col gap-space-md">
        {feedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-space-xl text-center border border-dashed border-border-subtle rounded bg-surface-card/40 my-space-md">
            <span className="material-symbols-outlined text-[28px] text-text-secondary mb-2">
              notifications_off
            </span>
            <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-1">
              Tidak Ada Sinyal Aktif
            </h4>
            <p className="font-body-sm text-body-sm text-text-secondary max-w-sm">
              Saat ini belum ada sinyal divergensi atau anomali baru yang terdeteksi dalam feed sistem.
            </p>
          </div>
        ) : (
          feedItems.map((item) => (
            <SignalFeedItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  )
}

