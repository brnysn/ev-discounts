#!/usr/bin/env node
/**
 * Fetches public EV charging stations from EPDK REST
 * (GET https://apigateway.epdk.gov.tr/sarjIstasyonlari with JSON body).
 *
 * Quota (official kılavuz):
 *   - Unfiltered `{}`: once per hour
 *   - Filtered (lisansNo, sarjIstasyonuAdi, sarjIstasyonuNo, markaAdi,
 *     yesilSarjIstasyonuMu, hizmetSekli): once per minute
 *
 * Empty-string filters return 0 rows and still consume quota. Send only
 * keys that have real values, or `{}` for the full list.
 *
 * Usage:
 *   node scripts/sync-epdk-stations.mjs
 *   node scripts/sync-epdk-stations.mjs --wait-minutes=62
 *   node scripts/sync-epdk-stations.mjs --fallback-ibb
 *   node scripts/sync-epdk-stations.mjs --ci
 */

import { writeFileSync, mkdirSync, readFileSync } from "node:fs"
import https from "node:https"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const outPath = join(root, "public/data/stations.json")
const cacheDir = join(root, ".cache/epdk")

const EPDK_URL = "https://apigateway.epdk.gov.tr/sarjIstasyonlari"
const IBB_GEOJSON =
  "https://data.ibb.gov.tr/dataset/79b0e26e-e923-498b-a675-453382274178/resource/726e9d82-37f7-4142-8fa0-4f70a5530188/download/sarj_istasyonlari.geojson"
const IBB_SOCKETS_DATASTORE =
  "https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=ff424a4c-6478-455c-9bd5-b597a7df7df1&limit=50000"

const FILTER_WAIT_MS = 65_000
const QUOTA_RETRY_MS = 70_000
const HIZMET_VALUES = ["HALKA_ACIK", "OZEL"]

const BRAND_FILTERS = [
  "zes",
  "trugo",
  "voltrun",
  "eşarj",
  "esarj",
  "beefull",
  "wat mobilite",
  "ovolt",
  "sharz",
  "shell",
  "en yakıt",
  "aksa şarj",
  "otojet",
  "oncharge",
  "astor",
  "epsis",
  "estasyon",
  "5 şarj",
  "ecobox",
  "gioev",
  "lumicle",
  "miggo",
  "multiforce",
  "onlife",
  "voltgo",
  "şarj tak",
  "önizşarj",
  "bladeco",
  "aostechnology",
  "k şarj",
  "gel dol",
]

const PROVINCES = [
  "ADANA", "ADIYAMAN", "AFYONKARAHİSAR", "AĞRI", "AKSARAY", "AMASYA", "ANKARA",
  "ANTALYA", "ARDAHAN", "ARTVİN", "AYDIN", "BALIKESİR", "BARTIN", "BATMAN",
  "BAYBURT", "BİLECİK", "BİNGÖL", "BİTLİS", "BOLU", "BURDUR", "BURSA",
  "ÇANAKKALE", "ÇANKIRI", "ÇORUM", "DENİZLİ", "DİYARBAKIR", "DÜZCE", "EDİRNE",
  "ELAZIĞ", "ERZİNCAN", "ERZURUM", "ESKİŞEHİR", "GAZİANTEP", "GİRESUN",
  "GÜMÜŞHANE", "HAKKARİ", "HATAY", "IĞDIR", "ISPARTA", "İSTANBUL", "İZMİR",
  "KAHRAMANMARAŞ", "KARABÜK", "KARAMAN", "KARS", "KASTAMONU", "KAYSERİ",
  "KIRIKKALE", "KIRKLARELİ", "KIRŞEHİR", "KİLİS", "KOCAELİ", "KONYA",
  "KÜTAHYA", "MALATYA", "MANİSA", "MARDİN", "MERSİN", "MUĞLA", "MUŞ",
  "NEVŞEHİR", "NİĞDE", "ORDU", "OSMANİYE", "RİZE", "SAKARYA", "SAMSUN",
  "SİİRT", "SİNOP", "SİVAS", "ŞANLIURFA", "ŞIRNAK", "TEKİRDAĞ", "TOKAT",
  "TRABZON", "TUNCELİ", "UŞAK", "VAN", "YALOVA", "YOZGAT", "ZONGULDAK",
]

class QuotaError extends Error {
  constructor(message) {
    super(message)
    this.name = "QuotaError"
  }
}

function titleProvince(name) {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/(^|[\s-])(\S)/g, (_, sep, ch) => sep + ch.toLocaleUpperCase("tr-TR"))
}

function parseCity(address) {
  if (!address) return ""
  const lastSegment = address.split("/").pop()?.trim() ?? ""
  const lastUpper = lastSegment.toLocaleUpperCase("tr-TR")
  for (const province of PROVINCES) {
    if (lastUpper === province || lastUpper.startsWith(`${province} `) || lastUpper.endsWith(` ${province}`)) {
      return titleProvince(province)
    }
  }
  const upper = address.toLocaleUpperCase("tr-TR")
  for (const province of PROVINCES) {
    if (new RegExp(`(?:^|[\\s/,])${province}(?:$|[\\s/,])`).test(upper) && lastUpper.includes(province)) {
      return titleProvince(province)
    }
  }
  return lastSegment
}

function firstNumber(...values) {
  for (const value of values) {
    const n = Number(value)
    if (Number.isFinite(n) && n !== 0) return n
  }
  for (const value of values) {
    const n = Number(value)
    if (Number.isFinite(n)) return n
  }
  return 0
}

function parseSockets(raw) {
  const list = Array.isArray(raw) ? raw : []
  let ac = 0
  let dc = 0
  let maxKw = 0
  const groupMap = new Map()

  for (const socket of list) {
    if (!socket || typeof socket !== "object") continue
    const type = String(
      socket.soketTipi ?? socket.soketTuru ?? socket.tip ?? socket.SOKET_TIPI ?? socket.SOKET_TURU ?? ""
    ).toUpperCase()
    const kw = firstNumber(
      socket.soketGucu,
      socket.guc,
      socket.gucKw,
      socket.soketGucuKw,
      socket.SOKET_GUCU
    )
    const kind = type.includes("DC") || (!type.includes("AC") && kw >= 50) ? "dc" : "ac"
    if (kind === "dc") dc += 1
    else ac += 1
    if (kw > maxKw) maxKw = kw
    if (kw > 0) {
      const key = `${kind}:${kw}`
      const group = groupMap.get(key) ?? { kind, kw, count: 0 }
      group.count += 1
      groupMap.set(key, group)
    }
  }

  return { ac, dc, maxKw, groups: [...groupMap.values()] }
}

function isPublic(value) {
  const text = String(value ?? "").toUpperCase()
  return text.includes("HALKA") || text === "HALKA_ACIK"
}

function isGreen(value) {
  const text = String(value ?? "").toLowerCase()
  return text === "true" || text === "evet" || text === "1"
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function argValue(name) {
  const prefix = `${name}=`
  const hit = process.argv.find((item) => item.startsWith(prefix))
  return hit ? hit.slice(prefix.length) : undefined
}

function stamp() {
  return new Date().toISOString().replaceAll(":", "-")
}

function slug(label) {
  return label.replaceAll(/[^a-zA-Z0-9]+/g, "_").replaceAll(/^_|_$/g, "").slice(0, 60) || "query"
}

function saveRawResponse(buffer, status, label) {
  mkdirSync(cacheDir, { recursive: true })
  const file = join(cacheDir, `${stamp()}_http${status}_${slug(label)}.json`)
  writeFileSync(file, buffer)
  console.log(`  saved raw ${(buffer.length / 1024 / 1024).toFixed(2)} MB → ${file}`)
  return file
}

function httpsJson(url, { method = "GET", body, label = "query" } = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url)
    const payload = body === undefined ? null : JSON.stringify(body)
    const req = https.request(
      {
        hostname: target.hostname,
        path: `${target.pathname}${target.search}`,
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        const chunks = []
        res.on("data", (chunk) => chunks.push(chunk))
        res.on("end", () => {
          const buffer = Buffer.concat(chunks)
          const savedPath = saveRawResponse(buffer, res.statusCode ?? 0, label)
          resolve({
            status: res.statusCode ?? 0,
            text: buffer.toString("utf8"),
            savedPath,
          })
        })
      }
    )
    req.on("error", reject)
    if (payload) req.write(payload)
    req.end()
  })
}

function toStationFromEpdk(row) {
  const lat = firstNumber(row.enlem, row.latitude, row.LATITUDE)
  const lng = firstNumber(row.boylam, row.longitude, row.LONGITUDE)
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) return null

  const sockets = parseSockets(row.soketler)
  const address = String(row.adres ?? "")

  return {
    id: String(row.sarjIstasyonuNo ?? row.istasyonNo ?? ""),
    name: String(row.sarjIstasyonuAdi ?? row.ad ?? ""),
    lat,
    lng,
    brand: String(row.marka ?? row.markaAdi ?? ""),
    operator: String(row.sarjAgiIsletmecisiUnvan ?? ""),
    address,
    city: parseCity(address),
    public: isPublic(row.hizmetSekli),
    green: isGreen(row.yesilSarjIstasyonuMu),
    ac: sockets.ac,
    dc: sockets.dc,
    maxKw: sockets.maxKw,
    ...(sockets.groups.length ? { groups: sockets.groups } : {}),
  }
}

function snapshotFromRows(rows, sourceLabel) {
  const stations = rows.map(toStationFromEpdk).filter(Boolean)
  if (!stations.length) {
    throw new Error("EPDK returned no mappable stations (missing coordinates)")
  }
  return {
    updatedAt: new Date().toISOString(),
    source: "epdk",
    sourceLabel,
    stations,
  }
}

function mergeRows(groups) {
  const byId = new Map()
  for (const row of groups.flat()) {
    const id = String(row.sarjIstasyonuNo ?? row.istasyonNo ?? "")
    const key = id || `${row.enlem},${row.boylam},${row.sarjIstasyonuAdi}`
    if (!byId.has(key)) byId.set(key, row)
  }
  return [...byId.values()]
}

function extractRows(payload) {
  const candidates = [payload.result, payload.data, payload.data?.result, payload.data?.rows]
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length) {
      if (candidate[0] && typeof candidate[0] === "object" && !Array.isArray(candidate[0])) {
        return candidate
      }
      const cols = payload.columnNames
      if (Array.isArray(cols) && Array.isArray(candidate[0])) {
        return candidate.map((row) => Object.fromEntries(cols.map((col, index) => [col, row[index]])))
      }
    }
    if (typeof candidate === "string" && candidate.startsWith("[") && candidate.length > 2) {
      try {
        const parsed = JSON.parse(candidate)
        if (Array.isArray(parsed) && parsed.length) return parsed
      } catch {
        /* ignore */
      }
    }
  }
  return []
}

function snapshotFromPayloadText(text, sourceLabel) {
  const payload = JSON.parse(text)
  const rows = extractRows(payload)
  const dataType = payload.data == null ? "null" : Array.isArray(payload.data) ? `array(${payload.data.length})` : typeof payload.data
  console.log(`  parsed=${rows.length}, numRows=${payload.numRows ?? "n/a"}, data=${dataType}`)
  if (!rows.length) throw new Error("EPDK payload had 0 mappable rows")
  return snapshotFromRows(rows, sourceLabel)
}

function parseEpdkPayload(response, label) {
  const text = response.text
  if (response.status === 429) {
    throw new QuotaError(`EPDK 429 quota (${label}): ${text.slice(0, 240)}`)
  }
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`EPDK HTTP ${response.status} (${label}): ${text.slice(0, 400)}`)
  }

  const payload = JSON.parse(text)
  const rows = extractRows(payload)
  const dataType = payload.data == null ? "null" : Array.isArray(payload.data) ? `array(${payload.data.length})` : typeof payload.data
  console.log(
    `  ${label}: HTTP ${response.status}, numRows=${payload.numRows ?? "n/a"}, parsed=${rows.length}, data=${dataType}`
  )
  return rows
}

function snapshotFromSavedFile(file) {
  const text = readFileSync(file, "utf8")
  console.log(`Reading saved EPDK response ${file} (${(Buffer.byteLength(text) / 1024 / 1024).toFixed(2)} MB)`)
  return snapshotFromPayloadText(text, "EPDK Şarj İstasyonları Web Servisi (kayıtlı yanıt)")
}

async function epdkQuery(body, label) {
  const response = await httpsJson(EPDK_URL, { method: "GET", body, label })
  return parseEpdkPayload(response, label)
}

async function epdkQueryRetry(body, label, retries = 10) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await epdkQuery(body, label)
    } catch (error) {
      if (!(error instanceof QuotaError) || attempt === retries) throw error
      console.warn(`  ${label}: quota blocked, waiting ${QUOTA_RETRY_MS / 1000}s (${attempt}/${retries})`)
      await sleep(QUOTA_RETRY_MS)
    }
  }
  return []
}

async function fetchEpdkAll() {
  // Unfiltered quota is hourly; retrying 429 can reset the window.
  const rows = await epdkQuery({}, "unfiltered {}")
  if (!rows.length) throw new Error("EPDK unfiltered returned 0 rows")
  return snapshotFromRows(rows, "EPDK Şarj İstasyonları Web Servisi")
}

async function fetchEpdkByHizmetSekli() {
  const groups = []
  for (const [index, value] of HIZMET_VALUES.entries()) {
    if (index > 0) {
      console.log(`Waiting ${FILTER_WAIT_MS / 1000}s before next filtered query...`)
      await sleep(FILTER_WAIT_MS)
    }
    const rows = await epdkQueryRetry({ hizmetSekli: value }, `hizmetSekli=${value}`, 3)
    groups.push(rows)
  }
  const merged = mergeRows(groups)
  if (!merged.length) throw new Error("EPDK hizmetSekli queries returned 0 rows")
  return snapshotFromRows(merged, "EPDK Şarj İstasyonları Web Servisi (hizmet şekli)")
}

async function fetchEpdkByBrands() {
  const groups = []
  for (const [index, brand] of BRAND_FILTERS.entries()) {
    if (index > 0) await sleep(FILTER_WAIT_MS)
    try {
      const rows = await epdkQueryRetry({ markaAdi: brand }, `markaAdi=${brand}`, 4)
      groups.push(rows)
    } catch (error) {
      console.warn(`  skipped ${brand}: ${error.message}`)
    }
  }
  const merged = mergeRows(groups)
  if (!merged.length) throw new Error("EPDK markaAdi queries returned 0 rows")
  return snapshotFromRows(merged, "EPDK Şarj İstasyonları Web Servisi (marka birleşimi)")
}

async function fetchIbbFallback() {
  const [geoRes, socketRes] = await Promise.all([
    fetch(IBB_GEOJSON),
    fetch(IBB_SOCKETS_DATASTORE),
  ])

  if (!geoRes.ok) throw new Error(`İBB GeoJSON HTTP ${geoRes.status}`)
  const geo = await geoRes.json()
  const features = Array.isArray(geo.features) ? geo.features : []

  const socketsByStation = new Map()
  if (socketRes.ok) {
    const socketJson = await socketRes.json()
    const records = socketJson?.result?.records ?? []
    for (const record of records) {
      const id = String(record.ISTASYON_NO ?? "")
      if (!id) continue
      const current = socketsByStation.get(id) ?? { ac: 0, dc: 0, maxKw: 0, groups: new Map() }
      const type = String(record.SOKET_TIPI ?? record.SOKET_TURU ?? "").toUpperCase()
      const kw = Number(record.SOKET_GUCU) || 0
      const kind = type.includes("DC") ? "dc" : "ac"
      if (kind === "dc") current.dc += 1
      else current.ac += 1
      if (kw > current.maxKw) current.maxKw = kw
      if (kw > 0) {
        const key = `${kind}:${kw}`
        const group = current.groups.get(key) ?? { kind, kw, count: 0 }
        group.count += 1
        current.groups.set(key, group)
      }
      socketsByStation.set(id, current)
    }
  }

  const stations = []
  for (const feature of features) {
    const props = feature.properties ?? {}
    const coords = feature.geometry?.coordinates
    const lng = Number(props.LONGITUDE ?? coords?.[0])
    const lat = Number(props.LATITUDE ?? coords?.[1])
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue

    const id = String(props.ISTASYON_NO ?? "")
    const sockets = socketsByStation.get(id) ?? { ac: 0, dc: 0, maxKw: 0, groups: new Map() }
    const groups = sockets.groups instanceof Map ? [...sockets.groups.values()] : []
    const address = String(props.ADRES ?? "")

    stations.push({
      id,
      name: String(props.AD ?? ""),
      lat,
      lng,
      brand: String(props.MARKA_TESCIL_BELGESI ?? ""),
      operator: String(props.AGIL_ISLETMECISI_UNVAN ?? ""),
      address,
      city: parseCity(address),
      public: isPublic(props.HIZMET_SEKLI),
      green: false,
      ac: sockets.ac,
      dc: sockets.dc,
      maxKw: sockets.maxKw,
      ...(groups.length ? { groups } : {}),
    })
  }

  return {
    updatedAt: new Date().toISOString(),
    source: "ibb-epdk",
    sourceLabel: "EPDK verisi (İBB açık veri yansıması, İstanbul)",
    stations,
  }
}

function stationsFingerprint(stations) {
  return JSON.stringify(
    stations.map((station) => [
      station.id,
      station.lat,
      station.lng,
      station.ac,
      station.dc,
      station.maxKw,
      station.groups ?? null,
      station.public,
      station.address,
      station.name,
    ])
  )
}

function writeSnapshot(snapshot) {
  mkdirSync(dirname(outPath), { recursive: true })
  try {
    const previous = JSON.parse(readFileSync(outPath, "utf8"))
    if (previous?.stations && stationsFingerprint(previous.stations) === stationsFingerprint(snapshot.stations)) {
      console.log(`Unchanged (${snapshot.stations.length} stations). Keeping ${outPath}`)
      return
    }
  } catch {
    /* no previous snapshot */
  }
  writeFileSync(outPath, JSON.stringify(snapshot))
  const mb = (Buffer.byteLength(JSON.stringify(snapshot)) / 1024 / 1024).toFixed(2)
  const cities = new Set(snapshot.stations.map((station) => station.city).filter(Boolean))
  console.log(`Wrote ${snapshot.stations.length} stations (${mb} MB) to ${outPath}`)
  console.log(`Cities: ${cities.size} · Source: ${snapshot.sourceLabel}`)
}

async function fetchNationwideEpdk({ alreadyWaited = false, ci = false } = {}) {
  try {
    console.log("Fetching unfiltered EPDK list (max once per hour)...")
    return await fetchEpdkAll()
  } catch (error) {
    console.warn(`Unfiltered fetch failed: ${error.message}`)
    if (ci || alreadyWaited) throw error
  }

  console.log("Waiting 75s before filtered hizmetSekli queries...")
  await sleep(75_000)

  try {
    console.log("Fetching nationwide list by hizmetSekli (HALKA_ACIK + OZEL)...")
    return await fetchEpdkByHizmetSekli()
  } catch (error) {
    console.warn(`hizmetSekli fetch failed: ${error.message}`)
  }

  if (process.argv.includes("--by-brand")) {
    console.log("Fetching nationwide list by markaAdi (slow, 1 query/minute)...")
    return fetchEpdkByBrands()
  }

  const waitMinutes = Number(argValue("--quota-wait-minutes") || 62)
  console.log(`Waiting ${waitMinutes} minutes for unfiltered hourly quota, then retrying...`)
  await sleep(waitMinutes * 60 * 1000)
  return fetchEpdkAll()
}

async function main() {
  const fromFile = argValue("--from-file")
  if (fromFile) {
    writeSnapshot(snapshotFromSavedFile(fromFile))
    return
  }

  const forceIbb = process.argv.includes("--fallback-ibb")
  const ci = process.argv.includes("--ci") || process.env.CI === "true"
  const waitMinutes = Number(argValue("--wait-minutes") || 0)

  if (waitMinutes > 0) {
    console.log(`Waiting ${waitMinutes} minutes for EPDK hourly quota to reset...`)
    await sleep(waitMinutes * 60 * 1000)
  }

  if (forceIbb) {
    const fallback = await fetchIbbFallback()
    writeSnapshot(fallback)
    return
  }

  const snapshot = await fetchNationwideEpdk({ alreadyWaited: waitMinutes > 0, ci })
  writeSnapshot(snapshot)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
