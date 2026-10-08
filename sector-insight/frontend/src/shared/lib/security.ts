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

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

export function sanitizeSearchInput(query: unknown, maxLength: number = 100): string {
  if (typeof query !== "string") {
    return ""
  }
  const cleaned = query
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .slice(0, maxLength)
  return cleaned
}

export function sanitizeTextInput(input: unknown, maxLength: number = 2000): string {
  if (typeof input !== "string") {
    return ""
  }
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "")
    .slice(0, maxLength)
    .trim()
}

export function sanitizeHtml(input: unknown, maxLength: number = 2000): string {
  return escapeHtml(sanitizeTextInput(input, maxLength))
}
