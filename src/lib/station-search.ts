import { areaFocus, cityCenterFocus } from "@/lib/city-centers"
import type { StationRecord } from "@/types/stations"

export const SEARCH_STATION_LIMIT = 20
export const SEARCH_PLACE_LIMIT = 8

export type GeocodeHit = {
  label: string
  title: string
  subtitle: string
  lat: number
  lng: number
}

export type PlaceKind = "city" | "district" | "neighborhood"

export type PlaceHit = {
  key: string
  kind: PlaceKind
  title: string
  subtitle: string
  lat: number
  lng: number
  zoom: number
}

type PlaceBucket = {
  city: string
  district?: string
  neighborhood?: string
  stations: StationRecord[]
}

const MAHALLE_RE =
  /([A-ZÇĞİÖŞÜa-zçğıöşü0-9']+(?:\s+[A-ZÇĞİÖŞÜa-zçğıöşü0-9']+){0,3})\s+Mah(?:allesi|\.?)\b/i

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

function nameScore(name: string, needle: string): number | null {
  const value = normalizeSearch(name)
  if (!value) return null
  if (value === needle) return 0
  if (value.startsWith(needle)) return 1
  if (needle.length >= 3 && value.includes(needle)) return 2
  return null
}

function extractMahalle(address: string): string {
  const match = address.match(MAHALLE_RE)
  const name = (match?.[1]?.trim() ?? "").replace(/\s+Mahallesi$/i, "").trim()
  const key = normalizeSearch(name)
  if (!name || key.length < 3 || key === "merkez" || key === "mah" || key === "mahalle") return ""
  if (/\b(yolu|karayolu|caddesi|cadde|sokak|sokağı)\b/i.test(name)) return ""
  return name
}

function districtZoom(count: number): number {
  if (count >= 200) return 12
  if (count >= 60) return 13
  return 14
}

function pushBucket(map: Map<string, PlaceBucket>, key: string, station: StationRecord, seed: Omit<PlaceBucket, "stations">) {
  const current = map.get(key)
  if (current) {
    current.stations.push(station)
    return
  }
  map.set(key, { ...seed, stations: [station] })
}

export function matchPlaces(stations: StationRecord[], query: string, limit = SEARCH_PLACE_LIMIT): PlaceHit[] {
  const needle = normalizeSearch(query)
  if (!needle) return []

  const cities = new Map<string, PlaceBucket>()
  const districts = new Map<string, PlaceBucket>()
  const neighborhoods = new Map<string, PlaceBucket>()

  for (const station of stations) {
    const city = station.city?.trim()
    if (!city) continue
    const cityKey = normalizeSearch(city)
    const district = station.district?.trim()
    const districtKey = district ? normalizeSearch(district) : ""

    if (nameScore(city, needle) != null) {
      pushBucket(cities, cityKey, station, { city })
    }
    if (district && districtKey && districtKey !== "merkez" && nameScore(district, needle) != null) {
      pushBucket(districts, `${cityKey}|${districtKey}`, station, { city, district })
    }

    const neighborhood = extractMahalle(station.address || "")
    if (neighborhood && nameScore(neighborhood, needle) != null) {
      pushBucket(neighborhoods, `${cityKey}|${districtKey}|${normalizeSearch(neighborhood)}`, station, {
        city,
        district: district || undefined,
        neighborhood,
      })
    }
  }

  const ranked: { kind: PlaceKind; bucket: PlaceBucket; score: number }[] = []
  for (const bucket of cities.values()) {
    const score = nameScore(bucket.city, needle)
    if (score != null) ranked.push({ kind: "city", bucket, score })
  }
  for (const bucket of districts.values()) {
    const score = nameScore(bucket.district ?? "", needle)
    if (score != null) ranked.push({ kind: "district", bucket, score: 10 + score })
  }
  for (const bucket of neighborhoods.values()) {
    const score = nameScore(bucket.neighborhood ?? "", needle)
    if (score != null) ranked.push({ kind: "neighborhood", bucket, score: 20 + score })
  }

  ranked.sort(
    (a, b) =>
      a.score - b.score ||
      b.bucket.stations.length - a.bucket.stations.length ||
      (a.bucket.neighborhood ?? a.bucket.district ?? a.bucket.city).localeCompare(
        b.bucket.neighborhood ?? b.bucket.district ?? b.bucket.city,
        "tr"
      )
  )

  return ranked.slice(0, limit).map((item) => toPlaceHit(item.kind, item.bucket))
}

function toPlaceHit(kind: PlaceKind, bucket: PlaceBucket): PlaceHit {
  if (kind === "city") {
    const view = cityCenterFocus(bucket.city, bucket.stations)
    return {
      key: `city:${bucket.city}`,
      kind,
      title: bucket.city,
      subtitle: "İl",
      lat: view.lat,
      lng: view.lng,
      zoom: view.zoom,
    }
  }
  if (kind === "district") {
    const title = bucket.district ?? bucket.city
    const view = areaFocus(bucket.stations, districtZoom(bucket.stations.length))
    return {
      key: `district:${bucket.city}:${title}`,
      kind,
      title,
      subtitle: `${bucket.city} · İlçe`,
      lat: view.lat,
      lng: view.lng,
      zoom: view.zoom,
    }
  }
  const title = bucket.neighborhood ?? bucket.city
  const view = areaFocus(bucket.stations, 15)
  const area = [bucket.district, bucket.city].filter(Boolean).join(", ")
  return {
    key: `neighborhood:${bucket.city}:${bucket.district ?? ""}:${title}`,
    kind,
    title,
    subtitle: `${area} · Mahalle`,
    lat: view.lat,
    lng: view.lng,
    zoom: view.zoom,
  }
}

export function splitGeocodeLabel(displayName: string): { title: string; subtitle: string } {
  const parts = displayName.split(",").map((part) => part.trim()).filter(Boolean)
  return {
    title: parts[0] ?? displayName,
    subtitle: parts.slice(1).join(", "),
  }
}
