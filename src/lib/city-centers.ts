import { haversineKm } from "@/lib/geo"
import type { StationRecord } from "@/types/stations"

function cityKey(city: string): string {
  return city.trim().toLocaleLowerCase("tr-TR")
}

/** Provincial capitals (il merkezi) keyed by EPDK city name. */
const CITY_CENTER_LIST: [string, number, number][] = [
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

const CITY_CENTERS = Object.fromEntries(
  CITY_CENTER_LIST.map(([name, lat, lng]) => [cityKey(name), { lat, lng }])
) as Record<string, { lat: number; lng: number }>

function densestCenter(stations: StationRecord[]): { lat: number; lng: number } {
  const cell = 0.025
  const buckets = new Map<string, StationRecord[]>()
  for (const station of stations) {
    if (!Number.isFinite(station.lat) || !Number.isFinite(station.lng)) continue
    const key = `${Math.round(station.lat / cell)}:${Math.round(station.lng / cell)}`
    const list = buckets.get(key)
    if (list) list.push(station)
    else buckets.set(key, [station])
  }
  let best: StationRecord[] = stations.slice(0, 1)
  for (const list of buckets.values()) {
    if (list.length > best.length) best = list
  }
  const bi = Math.round(best[0].lat / cell)
  const bj = Math.round(best[0].lng / cell)
  const core: StationRecord[] = []
  for (let di = -1; di <= 1; di += 1) {
    for (let dj = -1; dj <= 1; dj += 1) {
      const list = buckets.get(`${bi + di}:${bj + dj}`)
      if (list) core.push(...list)
    }
  }
  const group = core.length ? core : best
  return {
    lat: group.reduce((sum, item) => sum + item.lat, 0) / group.length,
    lng: group.reduce((sum, item) => sum + item.lng, 0) / group.length,
  }
}

function zoomForLocalCount(count: number): number {
  if (count >= 400) return 12
  if (count >= 120) return 13
  return 14
}

export function cityCenterFocus(city: string, stations: StationRecord[]): { lat: number; lng: number; zoom: number } {
  const valid = stations.filter((station) => Number.isFinite(station.lat) && Number.isFinite(station.lng))
  if (!valid.length) return { lat: 39.2, lng: 35.2, zoom: 7 }

  const center = CITY_CENTERS[cityKey(city)] ?? densestCenter(valid)

  let local: StationRecord[] = []
  for (const radius of [8, 12, 16]) {
    const next = valid.filter((station) => haversineKm(center, station) <= radius)
    local = next
    if (next.length >= Math.min(10, valid.length)) break
  }
  if (!local.length) local = [valid[0]]

  return { lat: center.lat, lng: center.lng, zoom: zoomForLocalCount(local.length) }
}

export function areaFocus(stations: StationRecord[], zoom: number): { lat: number; lng: number; zoom: number } {
  const valid = stations.filter((station) => Number.isFinite(station.lat) && Number.isFinite(station.lng))
  if (!valid.length) return { lat: 39.2, lng: 35.2, zoom }
  const center = densestCenter(valid)
  return { lat: center.lat, lng: center.lng, zoom }
}
