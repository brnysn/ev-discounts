import type { StationRecord } from "@/types/stations"

export const SEARCH_STATION_LIMIT = 20
export const SEARCH_CITY_LIMIT = 5

export type GeocodeHit = {
  label: string
  title: string
  subtitle: string
  lat: number
  lng: number
}

export function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase("tr-TR")
}

export function stationMatchesQuery(station: StationRecord, needle: string): boolean {
  if (!needle) return false
  const haystack =
    `${station.name} ${station.brand} ${station.operator} ${station.address} ${station.city} ${station.district ?? ""}`.toLocaleLowerCase(
      "tr-TR"
    )
  return haystack.includes(needle)
}

export function matchStations(stations: StationRecord[], query: string, limit = SEARCH_STATION_LIMIT): StationRecord[] {
  const needle = normalizeSearch(query)
  if (!needle) return []
  const ranked: { station: StationRecord; score: number }[] = []
  for (const station of stations) {
    if (!stationMatchesQuery(station, needle)) continue
    ranked.push({ station, score: stationScore(station, needle) })
  }
  ranked.sort((a, b) => a.score - b.score)
  return ranked.slice(0, limit).map((item) => item.station)
}

function stationScore(station: StationRecord, needle: string): number {
  const brand = (station.brand || "").toLocaleLowerCase("tr-TR")
  const name = (station.name || "").toLocaleLowerCase("tr-TR")
  const city = (station.city || "").toLocaleLowerCase("tr-TR")
  const district = (station.district || "").toLocaleLowerCase("tr-TR")
  if (brand === needle) return 0
  if (brand.startsWith(needle)) return 1
  if (brand.includes(needle)) return 2
  if (name.startsWith(needle)) return 3
  if (name.includes(needle)) return 4
  if (city === needle || city.startsWith(needle) || district === needle || district.startsWith(needle)) return 5
  return 6
}

export function matchCities(stations: StationRecord[], query: string, limit = SEARCH_CITY_LIMIT): string[] {
  const needle = normalizeSearch(query)
  if (!needle) return []
  const hits: string[] = []
  const seen = new Set<string>()
  for (const station of stations) {
    const city = station.city?.trim()
    if (!city || seen.has(city)) continue
    const district = (station.district ?? "").toLocaleLowerCase("tr-TR")
    const cityHit = city.toLocaleLowerCase("tr-TR").includes(needle)
    const districtHit = Boolean(district) && district !== "merkez" && district.includes(needle)
    if (!cityHit && !districtHit) continue
    seen.add(city)
    hits.push(city)
    if (hits.length >= limit) break
  }
  return hits
}

export function splitGeocodeLabel(displayName: string): { title: string; subtitle: string } {
  const parts = displayName.split(",").map((part) => part.trim()).filter(Boolean)
  return {
    title: parts[0] ?? displayName,
    subtitle: parts.slice(1).join(", "),
  }
}
