import { NextResponse } from "next/server"
import { DEFAULT_STOCK_QUOTES } from "@/src/features/market"

export async function GET() {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${backendUrl}/api/v1/stocks/quotes`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch {
  }

  return NextResponse.json(DEFAULT_STOCK_QUOTES)
}
