export type LatLng = {
  lat: number
  lng: number
}

function toRad(value: number): number {
  return (value * Math.PI) / 180
}

export function haversineKm(from: LatLng, to: LatLng): number {
  const earthKm = 6371
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * earthKm * Math.asin(Math.min(1, Math.sqrt(a)))
}
