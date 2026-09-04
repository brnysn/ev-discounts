import { hasKnownAvailability, type StationStatusPayload, type StationSocketStatus } from "@/lib/station-status"
import type { StationRecord, StationSocketGroup } from "@/types/stations"

export type SocketSignal = "grey" | "red" | "yellow" | "green"

export type SocketSpeedRow = {
  id: string
  kind: "ac" | "dc"
  kw: number
  bolts: number
  plus: boolean
  free: number | null
  total: number
  signal: SocketSignal
}

type StationSocketInput = Pick<StationRecord, "ac" | "dc" | "maxKw"> & {
  groups?: StationSocketGroup[]
}

type OccupancyGroup = {
  kind: "ac" | "dc"
  kw?: number
  free: number | null
  total: number
}

const BOLT_SVG =
  '<svg class="bolt" viewBox="0 0 10 16" width="9" height="14" aria-hidden="true"><path fill="#16a34a" d="M6.1 0 0 9.1h4.05L3.7 16 10 6.7H5.9z"/></svg>'

const PLUG_SVG =
  '<svg class="plug" viewBox="0 0 16 22" width="12" height="16" aria-hidden="true"><rect x="4.15" y="0" width="2.3" height="5.4" rx=".35"/><rect x="9.55" y="0" width="2.3" height="5.4" rx=".35"/><path d="M2.1 5.9h11.8v8.1L10.5 18.4v3.1H5.5v-3.1L2.1 14z"/></svg>'

export function dcBoltStyle(kw: number): { bolts: number; plus: boolean } {
  if (kw >= 400) return { bolts: 3, plus: true }
  if (kw >= 150) return { bolts: 3, plus: false }
  if (kw >= 50) return { bolts: 2, plus: false }
  return { bolts: 1, plus: false }
}

export function socketSignal(free: number | null, total: number): SocketSignal {
  if (free == null || total <= 0) return "grey"
  if (free <= 0) return "red"
  if (free < total / 2) return "yellow"
  return "green"
}

export function formatKw(kw: number): string {
  if (!kw) return ""
  const label = Number.isInteger(kw) ? String(kw) : kw.toLocaleString("tr-TR", { maximumFractionDigits: 1 })
  return `${label} kW`
}

export function formatAvailability(free: number | null, total: number): string {
  if (total <= 0) return "–"
  if (free == null) return String(total)
  return `${free}/${total}`
}

export function socketRowsFromStation(
  station: StationSocketInput,
  occupancy?: StationStatusPayload | null
): SocketSpeedRow[] {
  const occGroups = occupancy ? occupancyGroups(occupancy) : []
  const occWithKw = occGroups.filter((group) => group.kw != null && group.kw > 0)
  if (occWithKw.length) {
    return sortRows(occWithKw.map((group) => toRow(group.kind, group.kw ?? 0, group.free, group.total)))
  }

  const base = baseGroups(station)
  return sortRows(
    base.map((group) => {
      const sameKind = base.filter((item) => item.kind === group.kind)
      const match = occGroups.find((item) => item.kind === group.kind && item.kw == null)
      if (match && sameKind.length === 1) {
        return toRow(group.kind, group.kw, match.free, match.total)
      }
      if (!occGroups.length && occupancy && hasKnownAvailability(occupancy.summary)) {
        const onlyDc = station.dc > 0 && station.ac === 0
        const onlyAc = station.ac > 0 && station.dc === 0
        if ((group.kind === "dc" && onlyDc) || (group.kind === "ac" && onlyAc)) {
          const total =
            occupancy.summary.free + occupancy.summary.busy + occupancy.summary.fault + occupancy.summary.unknown
          return toRow(group.kind, group.kw, occupancy.summary.free, total || group.count)
        }
      }
      return toRow(group.kind, group.kw, null, group.count)
    })
  )
}

export type SocketRowPrices = Partial<Record<"ac" | "dc", string>>

export function speedRowsHtml(rows: SocketSpeedRow[], prices?: SocketRowPrices): string {
  return rows
    .map((row) => {
      const left =
        row.kind === "ac"
          ? `<span class="speed-plug">${PLUG_SVG}</span>`
          : `<span class="speed-bolts">${BOLT_SVG.repeat(row.bolts)}${row.plus ? `<span class="bolt-plus">+</span>` : ""}</span>`
      const kw = formatKw(row.kw)
      const price = prices?.[row.kind]
      return `<div class="speed-row">
        <div class="speed-left">${left}${kw ? `<span class="speed-kw">${kw}</span>` : ""}</div>
        <div class="speed-price">${price ? `<strong>${price}</strong> <span class="price-unit">TL/kWh</span>` : ""}</div>
        <div class="speed-status"><span class="sig sig-${row.signal}"></span><span class="speed-avail">${formatAvailability(row.free, row.total)}</span></div>
      </div>`
    })
    .join("")
}

function baseGroups(station: StationSocketInput): StationSocketGroup[] {
  if (station.groups?.length) {
    return station.groups.filter((group) => group.count > 0)
  }
  const groups: StationSocketGroup[] = []
  if (station.dc > 0) {
    groups.push({ kind: "dc", kw: station.maxKw || 0, count: station.dc })
  }
  if (station.ac > 0) {
    groups.push({
      kind: "ac",
      kw: station.dc > 0 ? 22 : station.maxKw || 22,
      count: station.ac,
    })
  }
  return groups
}

function occupancyGroups(occupancy: StationStatusPayload): OccupancyGroup[] {
  const sockets = occupancy.sockets
  if (!sockets.length || sockets.some((socket) => !socket.kind)) return []

  const allHaveKw = sockets.every((socket) => socket.kw != null && socket.kw > 0)
  if (allHaveKw) {
    const buckets = new Map<string, StationSocketStatus[]>()
    for (const socket of sockets) {
      const key = `${socket.kind}:${Math.round(socket.kw ?? 0)}`
      const list = buckets.get(key) ?? []
      list.push(socket)
      buckets.set(key, list)
    }
    return [...buckets.entries()].map(([key, list]) => {
      const [kind, kw] = key.split(":")
      const counts = countsFromSockets(list)
      return { kind: kind as "ac" | "dc", kw: Number(kw), ...counts }
    })
  }

  const rows: OccupancyGroup[] = []
  const dc = sockets.filter((socket) => socket.kind === "dc")
  const ac = sockets.filter((socket) => socket.kind === "ac")
  if (dc.length) rows.push({ kind: "dc", ...countsFromSockets(dc) })
  if (ac.length) rows.push({ kind: "ac", ...countsFromSockets(ac) })
  return rows
}

function countsFromSockets(sockets: StationSocketStatus[]): { free: number | null; total: number } {
  const total = sockets.length
  const known = sockets.filter((socket) => socket.status !== "unknown")
  if (!known.length) return { free: null, total }
  return { free: sockets.filter((socket) => socket.status === "free").length, total }
}

function toRow(kind: "ac" | "dc", kw: number, free: number | null, total: number): SocketSpeedRow {
  const bolts = kind === "dc" ? dcBoltStyle(kw) : { bolts: 0, plus: false }
  return {
    id: `${kind}-${kw}-${total}`,
    kind,
    kw,
    bolts: bolts.bolts,
    plus: bolts.plus,
    free,
    total,
    signal: socketSignal(free, total),
  }
}

function sortRows(rows: SocketSpeedRow[]): SocketSpeedRow[] {
  return [...rows].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dc" ? -1 : 1
    return b.kw - a.kw
  })
}
