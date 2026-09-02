import { haversineKm, type LatLng } from "@/lib/geo"
import type { StationBankDeal, StationCompanyOffer, StationPortPrice, StationRecord } from "@/types/stations"

export type NearbyPort = "dc" | "ac" | "both"

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
  port: NearbyPort
): BestStationPick | null {
  let winner: BestStationPick | null = null

  for (const station of stations) {
    const distanceKm = haversineKm(origin, station)
    if (distanceKm > radiusKm) continue

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
