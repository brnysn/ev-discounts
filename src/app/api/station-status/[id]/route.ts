import { findSarjTrId, httpsGetJson, previousTurkeyMinuteStamp, stationDetailUrl } from "@/lib/sarjtr"
import { parseSarjTrStation } from "@/lib/station-status"
import { NextResponse } from "next/server"

const CACHE_TTL_MS = 30_000
const ERROR_TTL_MS = 15_000
const cache = new Map<string, { expires: number; body: unknown; status: number }>()

function queryNumber(url: string, key: string): number | null {
  const value = Number(new URL(url).searchParams.get(key))
  return Number.isFinite(value) ? value : null
}

export async function GET(request: Request) {
  const lat = queryNumber(request.url, "lat")
  const lng = queryNumber(request.url, "lng")
  if (lat == null || lng == null) {
    return NextResponse.json({ error: "missing_coords" }, { status: 400 })
  }

  let sarjTrId: number | null
  try {
    sarjTrId = await findSarjTrId(lat, lng)
  } catch {
    return NextResponse.json({ error: "index_unavailable" }, { status: 502 })
  }

  if (!sarjTrId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const cacheKey = String(sarjTrId)
  const cached = cache.get(cacheKey)
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.body, { status: cached.status })
  }

  const url = stationDetailUrl(sarjTrId, previousTurkeyMinuteStamp())

  try {
    const { status, json } = await httpsGetJson(url, 8000)
    if (status !== 200) {
      const body = { error: "upstream", status }
      cache.set(cacheKey, { expires: Date.now() + ERROR_TTL_MS, body, status: 502 })
      return NextResponse.json(body, { status: 502 })
    }

    const payload = parseSarjTrStation(json as { sockets?: unknown[] })
    cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, body: payload, status: 200 })
    return NextResponse.json(payload)
  } catch {
    const body = { error: "unavailable" }
    cache.set(cacheKey, { expires: Date.now() + ERROR_TTL_MS, body, status: 502 })
    return NextResponse.json(body, { status: 502 })
  }
}
