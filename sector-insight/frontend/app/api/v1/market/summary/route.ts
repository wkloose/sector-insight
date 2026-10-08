import { NextResponse } from "next/server"
import { computeLiveMarketSummary } from "@/src/features/market"

export async function GET() {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${backendUrl}/api/v1/market/summary`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch {
  }

  return NextResponse.json(computeLiveMarketSummary())
}
