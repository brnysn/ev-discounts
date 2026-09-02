import { dcBoltStyle } from "@/lib/station-sockets"
import { hasKnownAvailability, type StationStatusPayload } from "@/lib/station-status"
import type { StationRecord } from "@/types/stations"

type LeafletLib = typeof import("leaflet")

export type StationPinTone = "green" | "yellow" | "red" | "black"

/** Colors sampled from ABRP light_hpc / light_dcfc / light_chargeplug large markers. */
const TONES: Record<StationPinTone, { ring: string; inner: string; glyph: string }> = {
  green: { ring: "#0AB913", inner: "#E3F6E1", glyph: "#058A0B" },
  yellow: { ring: "#FE8E41", inner: "#FFDCC4", glyph: "#BC5B05" },
  red: { ring: "#F19184", inner: "#FEDBD6", glyph: "#E25347" },
  black: { ring: "#474747", inner: "#E2E2E2", glyph: "#1B1B1B" },
}

/** 48×72 teardrop traced from ABRP `*_large` markers: circular head filling the width, pointed tail. */
const PIN_PATH =
  "M24 68C24 68 1.2 42 1.2 24A22.8 22.8 0 1 1 46.8 24C46.8 42 24 68 24 68Z"

const BOLT_PATH = "M10.2.2 2.1 11.4h4.7L3.6 21.8 14.8 8.6H9.6z"

export function occupancyToPinTone(occupancy?: StationStatusPayload | null): StationPinTone {
  if (!occupancy || !hasKnownAvailability(occupancy.summary)) return "black"
  const { free, busy, fault } = occupancy.summary
  const total = free + busy + fault
  if (total <= 0) return "black"
  if (free === 0 && busy === 0 && fault > 0) return "black"
  if (free === 0) return "red"
  if (free < total / 2) return "yellow"
  return "green"
}

export function stationPinHtml(station: StationRecord, tone: StationPinTone, highlighted = false): string {
  const palette = TONES[tone]
  const acOnly = station.ac > 0 && station.dc === 0
  const glyph = acOnly ? plugGlyph(palette.glyph) : boltsGlyph(pinBoltCount(station), palette.glyph)
  return pinSvg(palette, glyph, highlighted)
}

export function stationPinDivIcon(
  leaflet: LeafletLib,
  station: StationRecord,
  occupancy: StationStatusPayload | null | undefined,
  highlighted: boolean
) {
  const tone = occupancyToPinTone(occupancy)
  return leaflet.divIcon({
    className: highlighted ? "station-pin is-best" : "station-pin",
    html: stationPinHtml(station, tone, highlighted),
    iconSize: [24, 36],
    iconAnchor: [12, 34],
    popupAnchor: [0, -28],
  })
}

function pinMaxKw(station: StationRecord): number {
  const dcGroups = station.groups?.filter((group) => group.kind === "dc" && group.kw > 0) ?? []
  if (dcGroups.length) return Math.max(...dcGroups.map((group) => group.kw))
  return station.maxKw || 0
}

function pinBoltCount(station: StationRecord): number {
  const kw = pinMaxKw(station)
  if (kw >= 400) return 3
  return dcBoltStyle(kw).bolts
}

function pinSvg(palette: (typeof TONES)[StationPinTone], glyph: string, highlighted: boolean): string {
  const outline = highlighted
    ? `<path d="${PIN_PATH}" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>`
    : ""
  return `<svg viewBox="0 0 48 72" width="24" height="36" aria-hidden="true">
    ${outline}
    <path d="${PIN_PATH}" fill="${palette.ring}"/>
    <circle cx="24" cy="24" r="16.6" fill="${palette.inner}"/>
    ${glyph}
  </svg>`
}

function plugGlyph(fill: string): string {
  return `<g fill="${fill}">
    <rect x="19.05" y="12" width="1.9" height="5.3" rx=".3"/>
    <rect x="27.05" y="12" width="1.9" height="5.3" rx=".3"/>
    <path d="M16.2 17.3h15.6v10.2L26.8 32.2v3.7h-5.6v-3.7L16.2 27.5z"/>
  </g>`
}

function boltsGlyph(count: number, fill: string): string {
  const bolts = Math.min(3, Math.max(1, count))
  const scale = bolts === 1 ? 1.05 : bolts === 2 ? 0.72 : 0.54
  const width = 14.8 * scale
  const gap = bolts === 3 ? -0.4 : 0.15
  const total = bolts * width + (bolts - 1) * gap
  const start = 24 - total / 2
  return Array.from({ length: bolts }, (_, index) => {
    const x = start + index * (width + gap)
    return `<g transform="translate(${x.toFixed(2)} 13.1) rotate(-18 7.4 11) scale(${scale})"><path fill="${fill}" d="${BOLT_PATH}"/></g>`
  }).join("")
}
