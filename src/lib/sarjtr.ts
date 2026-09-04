import https from "node:https"
import { haversineKm } from "@/lib/geo"

type SarjTrListStation = {
  id: number
  lat: number
  lng: number
}

type IndexCache = {
  expires: number
  cells: Map<string, SarjTrListStation[]>
}

const LIST_URL = "https://sarjtr.epdk.gov.tr/sarjet/api/stations"
const LIST_TTL_MS = 10 * 60 * 1000
const MATCH_KM = 0.05
const LIST_FETCH_TIMEOUT_MS = 8_000
const FETCH_TIMEOUT_MS = 2_500

let indexCache: IndexCache | null = null
let indexInflight: Promise<Map<string, SarjTrListStation[]>> | null = null

export function previousTurkeyMinuteStamp(date = new Date()): string {
  const shifted = new Date(date.getTime() - 60_000)
  const local = shifted.toLocaleString("sv-SE", { timeZone: "Europe/Istanbul" })
  return `${local.slice(0, 16)}:00`
}

export function encodeSarjTrTimestamp(stamp: string): string {
  return encodeURI(stamp)
}

export function stationDetailUrl(sarjTrId: number, stamp = previousTurkeyMinuteStamp()): string {
  return `https://sarjtr.epdk.gov.tr/sarjet/api/stations/id/${sarjTrId}/${encodeSarjTrTimestamp(stamp)}`
}

export function httpsGetJson(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<{ status: number; json: unknown }> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Dart/3.1 (dart:io)",
        },
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on("data", (chunk) => chunks.push(chunk as Buffer))
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8")
          let json: unknown = text
          try {
            json = JSON.parse(text)
          } catch {
            /* keep text */
          }
          resolve({ status: res.statusCode ?? 0, json })
        })
      }
    )
    req.on("error", reject)
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("timeout"))
    })
  })
}

function cellKey(lat: number, lng: number): string {
  return `${lat.toFixed(3)}:${lng.toFixed(3)}`
}

async function loadIndex(): Promise<Map<string, SarjTrListStation[]>> {
  if (indexCache && indexCache.expires > Date.now()) return indexCache.cells
  if (indexInflight) return indexInflight

  indexInflight = (async () => {
    const { status, json } = await httpsGetJson(LIST_URL, LIST_FETCH_TIMEOUT_MS)
    if (status !== 200 || !Array.isArray(json)) {
      throw new Error(`Şarj@TR list HTTP ${status}`)
    }
    const cells = new Map<string, SarjTrListStation[]>()
    for (const row of json as SarjTrListStation[]) {
      if (!Number.isFinite(row.lat) || !Number.isFinite(row.lng) || !row.id) continue
      const key = cellKey(row.lat, row.lng)
      const entry = { id: row.id, lat: row.lat, lng: row.lng }
      const list = cells.get(key)
      if (list) list.push(entry)
      else cells.set(key, [entry])
    }
    indexCache = { expires: Date.now() + LIST_TTL_MS, cells }
    return cells
  })()

  try {
    return await indexInflight
  } finally {
    indexInflight = null
  }
}

export async function findSarjTrId(lat: number, lng: number): Promise<number | null> {
  const cells = await loadIndex()
  const originLat = Number(lat.toFixed(3))
  const originLng = Number(lng.toFixed(3))
  const candidates: SarjTrListStation[] = []
  for (let di = -1; di <= 1; di += 1) {
    for (let dj = -1; dj <= 1; dj += 1) {
      const nearby = cells.get(`${(originLat + di * 0.001).toFixed(3)}:${(originLng + dj * 0.001).toFixed(3)}`)
      if (nearby) candidates.push(...nearby)
    }
  }

  let bestId: number | null = null
  let bestKm = MATCH_KM
  for (const station of candidates) {
    const distance = haversineKm({ lat, lng }, station)
    if (distance < bestKm) {
      bestKm = distance
      bestId = station.id
    }
  }
  return bestId
}
