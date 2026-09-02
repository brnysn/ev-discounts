import { splitGeocodeLabel, type GeocodeHit } from "@/lib/station-search"
import { NextResponse } from "next/server"

const CACHE_TTL_MS = 30_000
const cache = new Map<string, { expires: number; body: { results: GeocodeHit[] } }>()

type NominatimHit = {
  lat?: string
  lon?: string
  display_name?: string
  name?: string
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? ""
  if (q.length < 3) {
    return NextResponse.json({ results: [] as GeocodeHit[] })
  }

  const cacheKey = `tr-en:${q.toLocaleLowerCase("tr-TR")}`
  const cached = cache.get(cacheKey)
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.body)
  }

  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("q", q)
  url.searchParams.set("format", "jsonv2")
  url.searchParams.set("limit", "5")
  url.searchParams.set("accept-language", "tr,en")

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "tr,en",
        "User-Agent": "sarjkampanya.com/1.0 (https://sarjkampanya.com)",
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) {
      return NextResponse.json({ results: [] as GeocodeHit[] }, { status: 502 })
    }
    const json = (await response.json()) as NominatimHit[]
    const results: GeocodeHit[] = []
    for (const hit of Array.isArray(json) ? json : []) {
      const lat = Number(hit.lat)
      const lng = Number(hit.lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
      const display = String(hit.display_name ?? hit.name ?? "").trim()
      if (!display) continue
      const split = splitGeocodeLabel(display)
      results.push({
        label: display,
        title: hit.name?.trim() || split.title,
        subtitle: split.subtitle,
        lat,
        lng,
      })
    }
    const body = { results }
    cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, body })
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ results: [] as GeocodeHit[] }, { status: 502 })
  }
}
