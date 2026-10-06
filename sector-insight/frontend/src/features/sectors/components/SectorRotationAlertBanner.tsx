"use client"

import React from "react"
import { SectorRotationAlert } from "../types"

interface SectorRotationAlertBannerProps {
  alert: SectorRotationAlert
}

export function SectorRotationAlertBanner({ alert }: SectorRotationAlertBannerProps) {
  const isSurge = alert.alert_type === "ROTATION_SURGE"

  const containerClasses = isSurge
    ? "bg-emerald-950/40 border-emerald-500/60"
    : "bg-amber-950/40 border-amber-500/60"

  const badgeClasses = isSurge
    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
    : "bg-amber-500/20 text-amber-300 border-amber-500/40"

  const icon = isSurge ? "trending_up" : "sync_problem"

  return (
    <div
      role="alert"
      className={`p-space-md rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md ${containerClasses}`}
    >
      <div className="flex items-start md:items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${badgeClasses}`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${badgeClasses}`}>
              {alert.alert_type.replace("_", " ")}
            </span>
            <span className="text-caption text-text-secondary font-mono">
              SMRS Momentum Engine (PRD-4)
            </span>
          </div>
          <h4 className="font-title-md text-title-md font-bold text-text-primary mt-0.5">
            {alert.headline}
          </h4>
          <p className="text-body-sm text-text-primary/90 mt-1 leading-relaxed">
            {alert.summary}
          </p>
        </div>
      </div>
    </div>
  )
}

