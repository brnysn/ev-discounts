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
 *   node scripts/sync-epdk-stations.mjs --reparse
 *
 * Official il/ilçe overlay (scripts/data/epdk-places.json) is matched by
 * istasyon_no / station.id. Overlay `id` and `hizmet_sekli` are ignored.
 */

import { writeFileSync, mkdirSync, readFileSync } from "node:fs"
import https from "node:https"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const outPath = join(root, "public/data/stations.json")
const placesPath = join(__dirname, "data/epdk-places.json")
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

const PROVINCE_TITLE = Object.fromEntries(PROVINCES.map((name) => [name, titleProvince(name)]))

/** Provincial capitals for stations whose address has no parseable il. */
const PROVINCE_CENTERS = [
  ["Adana", 37.0, 35.3213],
  ["Adıyaman", 37.7648, 38.2786],
  ["Afyonkarahisar", 38.7569, 30.5387],
  ["Ağrı", 39.7191, 43.0503],
  ["Aksaray", 38.3686, 34.0369],
  ["Amasya", 40.6534, 35.833],
  ["Ankara", 39.9334, 32.8597],
  ["Antalya", 36.8841, 30.7056],
  ["Ardahan", 41.1105, 42.7022],
  ["Artvin", 41.1828, 41.8183],
  ["Aydın", 37.8444, 27.8458],
  ["Balıkesir", 39.6484, 27.8826],
  ["Bartın", 41.6344, 32.3375],
  ["Batman", 37.8812, 41.1351],
  ["Bayburt", 40.2552, 40.2249],
  ["Bilecik", 40.1426, 29.9793],
  ["Bingöl", 38.8855, 40.498],
  ["Bitlis", 38.4006, 42.109],
  ["Bolu", 40.7392, 31.6089],
  ["Burdur", 37.7183, 30.2828],
  ["Bursa", 40.193, 29.0742],
  ["Çanakkale", 40.1553, 26.4142],
  ["Çankırı", 40.6013, 33.6134],
  ["Çorum", 40.5499, 34.9537],
  ["Denizli", 37.7765, 29.0864],
  ["Diyarbakır", 37.91, 40.2306],
  ["Düzce", 40.8438, 31.1565],
  ["Edirne", 41.6771, 26.5557],
  ["Elazığ", 38.6748, 39.2225],
  ["Erzincan", 39.75, 39.4914],
  ["Erzurum", 39.9055, 41.2658],
  ["Eskişehir", 39.7767, 30.5206],
  ["Gaziantep", 37.0662, 37.3833],
  ["Giresun", 40.9128, 38.3895],
  ["Gümüşhane", 40.4603, 39.4814],
  ["Hakkari", 37.5744, 43.7408],
  ["Hatay", 36.2023, 36.1613],
  ["Isparta", 37.7648, 30.5566],
  ["Iğdır", 39.92, 44.044],
  ["İstanbul", 41.0082, 28.9784],
  ["İzmir", 38.4192, 27.1287],
  ["Kahramanmaraş", 37.5858, 36.9371],
  ["Karabük", 41.2061, 32.6204],
  ["Karaman", 37.181, 33.2222],
  ["Kars", 40.6013, 43.0975],
  ["Kastamonu", 41.3766, 33.7765],
  ["Kayseri", 38.7312, 35.4787],
  ["Kırıkkale", 39.8468, 33.5153],
  ["Kırklareli", 41.7355, 27.2256],
  ["Kırşehir", 39.1461, 34.1595],
  ["Kilis", 36.7184, 37.1212],
  ["Kocaeli", 40.7654, 29.9408],
  ["Konya", 37.8714, 32.4846],
  ["Kütahya", 39.4192, 29.9857],
  ["Malatya", 38.3552, 38.3095],
  ["Manisa", 38.6191, 27.4289],
  ["Mardin", 37.3212, 40.7245],
  ["Mersin", 36.8121, 34.6415],
  ["Muğla", 37.2153, 28.3636],
  ["Muş", 38.7348, 41.491],
  ["Nevşehir", 38.6247, 34.7141],
  ["Niğde", 37.9667, 34.6793],
  ["Ordu", 40.9862, 37.8797],
  ["Osmaniye", 37.0746, 36.2464],
  ["Rize", 41.0201, 40.5234],
  ["Sakarya", 40.7889, 30.406],
  ["Samsun", 41.2867, 36.33],
  ["Siirt", 37.9274, 41.9403],
  ["Sinop", 42.0267, 35.1511],
  ["Sivas", 39.7477, 37.0179],
  ["Şanlıurfa", 37.1674, 38.7955],
  ["Şırnak", 37.5184, 42.4537],
  ["Tekirdağ", 40.9781, 27.5117],
  ["Tokat", 40.3235, 36.5522],
  ["Trabzon", 41.0053, 39.725],
  ["Tunceli", 39.1061, 39.5481],
  ["Uşak", 38.6742, 29.4058],
  ["Van", 38.5012, 43.373],
  ["Yalova", 40.655, 29.2769],
  ["Yozgat", 39.8181, 34.8147],
  ["Zonguldak", 41.4564, 31.7987],
]

function titleProvince(name) {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/(^|[\s-])(\S)/g, (_, sep, ch) => sep + ch.toLocaleUpperCase("tr-TR"))
}

function stripCadastral(address) {
  return String(address ?? "")
    .replace(/\(\s*Ada\s*:[\s\S]*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
}

function matchProvinceToken(segment) {
  const upper = String(segment ?? "").trim().toLocaleUpperCase("tr-TR")
  if (!upper) return ""
  for (const province of PROVINCES) {
    if (
      upper === province ||
      upper.startsWith(`${province} `) ||
      upper.startsWith(`${province}/`) ||
      upper.startsWith(`${province}.`)
    ) {
      return PROVINCE_TITLE[province]
    }
  }
  return ""
}

function splitProvince(address) {
  const cleaned = stripCadastral(address)
  const lastSlash = cleaned.lastIndexOf("/")
  if (lastSlash >= 0) {
    const city = matchProvinceToken(cleaned.slice(lastSlash + 1))
    if (city) return { city, before: cleaned.slice(0, lastSlash).trim() }
  }
  const tokens = cleaned.split(/\s+/).filter(Boolean)
  const city = matchProvinceToken(tokens.at(-1) ?? "")
  if (city) return { city, before: tokens.slice(0, -1).join(" ") }
  return { city: "", before: cleaned }
}

function lastDistrictName(text) {
  const source = String(text ?? "")

  const mahalle = source.match(
    /^([A-ZÇĞİÖŞÜa-zçğıöşü0-9]+(?:\s+[A-ZÇĞİÖŞÜa-zçğıöşü0-9]+){0,3})\s+Mahallesi/i
  )

  let value = source
    .replace(/\bNo:\s*[\w./-]+/gi, " ")
    .replace(
      /(^|[\s/.,])(?:Mahallesi|Mahalle|Mah\.?|Caddesi|Cadde|Cad\.?|Sokağı|Sokak|Sok\.?|Bulvarı|Bulvar|Mevkii|Mevki|Kümeevleri|Küme\s+Evleri|Organize\s+Sanayi(?:\s+Bölgesi)?|Bayırı|Yolu)(?=[\s/.,]|$)/gi,
      " "
    )
    .replace(/[/(),.]+/g, " ")
    .replace(/\b\d+[A-Za-zÇĞİÖŞÜçğıöşü]?\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  const skip = new Set([
    "osb",
    "sitesi",
    "site",
    "köyü",
    "koyu",
    "beldesi",
    "mah",
    "sokağı",
    "sokak",
    "caddesi",
    "cadde",
    "mahallesi",
    "bayırı",
    "yolu",
    "bulvarı",
    "mevkii",
  ])
  const tokens = value.split(" ").filter((token) => {
    const key = token.toLocaleLowerCase("tr-TR")
    return token.length > 1 && !/^\d/.test(token) && !skip.has(key)
  })
  const fromTokens = tokens.length ? titleProvince(tokens.at(-1)) : ""
  return { fromTokens, mahalle: mahalle ? titleProvince(mahalle[1].replace(/\s+Osb$/i, "").trim()) : "" }
}

const STREET_OR_JUNK = new Set([
  "sokağı",
  "sokak",
  "caddesi",
  "cadde",
  "mahallesi",
  "bayırı",
  "yolu",
  "bulvarı",
  "mevkii",
])

const PROVINCE_LOWER = new Set(Object.values(PROVINCE_TITLE).map((name) => name.toLocaleLowerCase("tr-TR")))

function isJunkDistrict(name, city) {
  if (!name) return true
  const parts = name.split(/\s+/).filter(Boolean)
  for (const part of parts) {
    const key = part.toLocaleLowerCase("tr-TR")
    if (STREET_OR_JUNK.has(key)) return true
  }
  const key = name.toLocaleLowerCase("tr-TR")
  if (PROVINCE_LOWER.has(key) && name.toLocaleLowerCase("tr-TR") !== city.toLocaleLowerCase("tr-TR")) return true
  return false
}

function pickDistrict(before, city, fromSlash) {
  const { fromTokens, mahalle } = lastDistrictName(before)
  if (fromSlash && !isJunkDistrict(fromTokens, city)) return fromTokens
  if (!isJunkDistrict(fromTokens, city)) return fromTokens
  if (!isJunkDistrict(mahalle, city)) return mahalle
  return ""
}

function parsePlace(address, lat, lng) {
  const { city: parsedCity, before } = splitProvince(address)
  const city =
    parsedCity || (Number.isFinite(lat) && Number.isFinite(lng) ? nearestProvince(lat, lng) : "")
  const district = pickDistrict(before, city, Boolean(parsedCity))
  return { city, district }
}

function haversineKm(from, to) {
  const radius = 6371
  const dLat = ((to.lat - from.lat) * Math.PI) / 180
  const dLng = ((to.lng - from.lng) * Math.PI) / 180
  const lat1 = (from.lat * Math.PI) / 180
  const lat2 = (to.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)))
}

function nearestProvince(lat, lng) {
  let best = ""
  let bestKm = Number.POSITIVE_INFINITY
  for (const [name, plat, plng] of PROVINCE_CENTERS) {
    const km = haversineKm({ lat, lng }, { lat: plat, lng: plng })
    if (km < bestKm) {
      bestKm = km
      best = name
    }
  }
  return best
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

  return withPlaces({
    id: String(row.sarjIstasyonuNo ?? row.istasyonNo ?? ""),
    name: String(row.sarjIstasyonuAdi ?? row.ad ?? ""),
    lat,
    lng,
    brand: String(row.marka ?? row.markaAdi ?? ""),
    operator: String(row.sarjAgiIsletmecisiUnvan ?? ""),
    address,
    public: isPublic(row.hizmetSekli),
    green: isGreen(row.yesilSarjIstasyonuMu),
    ac: sockets.ac,
    dc: sockets.dc,
    maxKw: sockets.maxKw,
    ...(sockets.groups.length ? { groups: sockets.groups } : {}),
  })
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

    stations.push(
      withPlaces({
        id,
        name: String(props.AD ?? ""),
        lat,
        lng,
        brand: String(props.MARKA_TESCIL_BELGESI ?? ""),
        operator: String(props.AGIL_ISLETMECISI_UNVAN ?? ""),
        address,
        public: isPublic(props.HIZMET_SEKLI),
        green: false,
        ac: sockets.ac,
        dc: sockets.dc,
        maxKw: sockets.maxKw,
        ...(groups.length ? { groups } : {}),
      })
    )
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
      station.city,
      station.district ?? "",
    ])
  )
}

function placeFields(address, lat, lng) {
  const { city, district } = parsePlace(address, lat, lng)
  return district ? { city, district } : { city }
}

let placesById = null

function loadPlaces() {
  if (placesById) return placesById
  placesById = new Map()
  try {
    const raw = JSON.parse(readFileSync(placesPath, "utf8"))
    const entries = Array.isArray(raw)
      ? raw.map((row) => [String(row.istasyon_no ?? ""), row])
      : Object.entries(raw)
    for (const [id, row] of entries) {
      if (!id || !row || typeof row !== "object") continue
      placesById.set(id, row)
    }
  } catch {
    /* overlay is optional */
  }
  return placesById
}

function namesEqual(a, b) {
  return titleProvince(a).toLocaleLowerCase("tr-TR") === titleProvince(b).toLocaleLowerCase("tr-TR")
}

function applyOfficialPlace(station, places = loadPlaces()) {
  const place = places.get(station.id)
  if (!place) return station

  const officialCity = titleProvince(place.il ?? place.city ?? "")
  if (!officialCity) return station

  const addressCity = splitProvince(station.address).city
  if (addressCity && !namesEqual(officialCity, addressCity)) return station

  const officialDistrict = titleProvince(place.ilce ?? place.district ?? "")
  const officialAddress = stripCadastral(place.adres ?? place.address ?? "")
  const next = { ...station, city: officialCity }
  if (officialAddress) next.address = officialAddress

  const keepSpecificDistrict =
    officialDistrict.toLocaleLowerCase("tr-TR") === "merkez" &&
    next.district &&
    next.district.toLocaleLowerCase("tr-TR") !== "merkez"
  if (officialDistrict && !keepSpecificDistrict) next.district = officialDistrict
  if (!next.district) delete next.district
  return next
}

function withPlaces(station) {
  const parsed = { ...station, ...placeFields(station.address, station.lat, station.lng) }
  if (!parsed.district) delete parsed.district
  return applyOfficialPlace(parsed)
}

function reparseSnapshot(snapshot) {
  const stations = snapshot.stations.map((station) => withPlaces(station))
  return {
    ...snapshot,
    updatedAt: new Date().toISOString(),
    stations,
  }
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
  const districts = snapshot.stations.filter((station) => station.district).length
  const overlayHits = snapshot.stations.filter((station) => loadPlaces().has(station.id)).length
  console.log(`Wrote ${snapshot.stations.length} stations (${mb} MB) to ${outPath}`)
  console.log(
    `İl: ${cities.size} · ilçeli kayıt: ${districts} · resmi eşleşme: ${overlayHits} · Source: ${snapshot.sourceLabel}`
  )
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
  if (process.argv.includes("--reparse")) {
    const previous = JSON.parse(readFileSync(outPath, "utf8"))
    writeSnapshot(reparseSnapshot(previous))
    return
  }

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
