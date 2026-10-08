export function formatRupiah(value: number, compact: boolean = false): string {
  if (value === undefined || value === null || !isFinite(value)) {
    return "-"
  }

  if (compact) {
    const absValue = Math.abs(value)
    const sign = value < 0 ? "-" : ""

    if (absValue >= 1_000_000_000_000) {
      const formatted = (absValue / 1_000_000_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
      })
      return `${sign}Rp ${formatted}T`
    }

    if (absValue >= 1_000_000_000) {
      const formatted = (absValue / 1_000_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
      })
      return `${sign}Rp ${formatted}M`
    }

    if (absValue >= 1_000_000) {
      const formatted = (absValue / 1_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
      })
      return `${sign}Rp ${formatted}Jt`
    }
  }

  const absValue = Math.abs(value)
  const sign = value < 0 ? "-" : ""
  return `${sign}Rp ${absValue.toLocaleString("id-ID", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`
}

export function formatPercent(value: number, decimals: number = 2, showSign: boolean = true): string {
  if (value === undefined || value === null || !isFinite(value)) {
    return "-"
  }
  const sign = showSign && value > 0 ? "+" : ""
  const formatted = value.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${sign}${formatted}%`
}

export function formatCompactNumber(value: number): string {
  if (value === undefined || value === null || !isFinite(value)) {
    return "-"
  }
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatDate(
  dateInput: string | Date | number,
  formatType: "short" | "medium" | "long" = "medium"
): string {
  const date = new Date(dateInput)

  if (isNaN(date.getTime())) {
    return "-"
  }

  const options: Intl.DateTimeFormatOptions =
    formatType === "short"
      ? { day: "numeric", month: "short" }
      : formatType === "long"
      ? { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }
      : { day: "numeric", month: "short", year: "numeric" }

  return new Intl.DateTimeFormat("id-ID", options).format(date)
}

export function formatRelativeTime(dateInput: string | Date | number): string {
  const date = new Date(dateInput)

  if (isNaN(date.getTime())) {
    return "-"
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Baru saja"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} jam lalu`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} hari lalu`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan lalu`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} tahun lalu`
}
