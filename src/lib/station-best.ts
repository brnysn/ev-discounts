import { haversineKm, type LatLng } from "@/lib/geo"
import type { StationBankDeal, StationCompanyOffer, StationPortPrice, StationRecord } from "@/types/stations"

export type NearbyPort = "dc" | "ac" | "both"

export type DcKwRange = {
  min: number
  max: number
}

export function stationDcSpeeds(station: StationRecord): number[] {
  if (station.dc <= 0) return []
  const fromGroups =
    station.groups
      ?.filter((group) => group.kind === "dc" && group.count > 0 && group.kw > 0)
      .map((group) => group.kw) ?? []
  if (fromGroups.length) return fromGroups
  return station.maxKw > 0 ? [station.maxKw] : []
}

export function stationHasDcInRange(station: StationRecord, minKw: number, maxKw: number): boolean {
  return stationDcSpeeds(station).some((kw) => kw >= minKw && kw <= maxKw)
}

export function dcKwBoundsFromStations(stations: StationRecord[]): DcKwRange {
  let min = Infinity
  let max = 0
  for (const station of stations) {
    for (const kw of stationDcSpeeds(station)) {
      if (kw < min) min = kw
      if (kw > max) max = kw
    }
  }
  if (!Number.isFinite(min) || max <= 0) return { min: 50, max: 400 }
  return { min: Math.floor(min), max: Math.ceil(max) }
}

export type BestStationPick = {
  station: StationRecord
  offer: StationCompanyOffer
  price: number
  original: number
  hasCampaign: boolean
  campaignName?: string
  bankDeals: StationBankDeal[]
  networkPrice: number
  port: "ac" | "dc"
  distanceKm: number
}

function pricedPort(
  station: StationRecord,
  offer: StationCompanyOffer | null,
  port: "ac" | "dc"
): { port: "ac" | "dc"; price: StationPortPrice } | null {
  if (!offer) return null
  if (port === "dc" && station.dc <= 0) return null
  if (port === "ac" && station.ac <= 0) return null
  const price = offer[port]
  if (!price) return null
  return { port, price }
}

function bestPricedPort(
  station: StationRecord,
  offer: StationCompanyOffer | null,
  port: NearbyPort
): { port: "ac" | "dc"; price: StationPortPrice } | null {
  if (port === "both") {
    const dc = pricedPort(station, offer, "dc")
    const ac = pricedPort(station, offer, "ac")
    if (dc && ac) return dc.price.discounted <= ac.price.discounted ? dc : ac
    return dc ?? ac
  }
  return pricedPort(station, offer, port)
}

export function pickBestStation(
  origin: LatLng,
  radiusKm: number,
  stations: StationRecord[],
  offers: Map<string, StationCompanyOffer | null>,
  port: NearbyPort,
  dcKwRange?: DcKwRange | null
): BestStationPick | null {
  let winner: BestStationPick | null = null

  for (const station of stations) {
    const distanceKm = haversineKm(origin, station)
    if (distanceKm > radiusKm) continue
    if (port === "dc" && dcKwRange && !stationHasDcInRange(station, dcKwRange.min, dcKwRange.max)) continue

    const offer = offers.get(station.id) ?? null
    const priced = bestPricedPort(station, offer, port)
    if (!priced || !offer) continue

    const candidate: BestStationPick = {
      station,
      offer,
      price: priced.price.discounted,
      original: priced.price.original,
      hasCampaign: priced.price.hasCampaign,
      campaignName: priced.price.campaignName,
      bankDeals: priced.price.bankDeals,
      networkPrice: priced.price.networkPrice,
      port: priced.port,
      distanceKm,
    }

    if (
      !winner ||
      candidate.price < winner.price ||
      (candidate.price === winner.price && candidate.distanceKm < winner.distanceKm)
    ) {
      winner = candidate
    }
  }

  return winner
}
