export const TICKER_REGEX = /^[A-Z0-9]{4,6}$/

export function isValidTicker(ticker: unknown): ticker is string {
  if (typeof ticker !== "string") {
    return false
  }
  return TICKER_REGEX.test(ticker.trim().toUpperCase())
}

export function sanitizeTicker(ticker: unknown): string | null {
  if (typeof ticker !== "string") {
    return null
  }
  const normalized = ticker.trim().toUpperCase()
  return TICKER_REGEX.test(normalized) ? normalized : null
}

export function isSafeExternalUrl(url: unknown): boolean {
  if (typeof url !== "string") {
    return false
  }
  const trimmed = url.trim()
  return trimmed.startsWith("https://") || trimmed.startsWith("http://")
}

export function sanitizeExternalUrl(url: unknown, fallback: string = "#"): string {
  if (isSafeExternalUrl(url)) {
    return (url as string).trim()
  }
  return fallback
}

