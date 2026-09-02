export type SocketAvailability = "free" | "busy" | "fault" | "unknown"

export type StationSocketStatus = {
  id: string | number | null
  status: SocketAvailability
  kind?: "ac" | "dc"
  kw?: number
}

export type StationStatusSummary = {
  free: number
  busy: number
  fault: number
  unknown: number
}

export type StationStatusPayload = {
  sockets: StationSocketStatus[]
  summary: StationStatusSummary
}

type SarjAvailabilityEntry = {
  active?: number
  status?: string
  startTime?: string
  endTime?: string
}

type SarjSocket = {
  id?: string | number
  availability?: SarjAvailabilityEntry[]
  socketType?: string
  soketTipi?: string
  soketTuru?: string
  type?: string
  tip?: string
  power?: number
  guc?: number
  soketGucu?: number
  powerKw?: number
  gucKw?: number
}

export function sarjTrStationId(epdkId: string): string | null {
  const match = epdkId.match(/(\d+)/)
  return match ? match[1] : null
}

export function mapAvailabilityStatus(raw: string | undefined): SocketAvailability {
  const value = String(raw ?? "")
    .trim()
    .toLocaleUpperCase("tr-TR")
    .replaceAll("İ", "I")
    .replace(/[^A-Z0-9]+/g, "")

  if (
    value === "FREE" ||
    value === "AVAILABLE" ||
    value === "IDLE" ||
    value === "MUSAAIT" ||
    value === "MUSAIT"
  ) {
    return "free"
  }
  if (
    value === "INUSE" ||
    value === "OCCUPIED" ||
    value === "BUSY" ||
    value === "CHARGING" ||
    value === "DOLU"
  ) {
    return "busy"
  }
  if (
    value === "FAULT" ||
    value === "FAULTED" ||
    value === "FAULTY" ||
    value === "OUTOFORDER" ||
    value === "UNAVAILABLE" ||
    value === "ERROR" ||
    value === "ARIZA" ||
    value === "ARIZALI"
  ) {
    return "fault"
  }
  return "unknown"
}

export function currentSarjAvailability(entries: SarjAvailabilityEntry[] | undefined): string | undefined {
  if (!Array.isArray(entries) || entries.length === 0) return undefined

  const now = Date.now()
  const current = entries.find((entry) => {
    if (entry.active !== 1) return false
    try {
      const start = new Date(String(entry.startTime)).getTime()
      const endRaw = String(entry.endTime ?? "").slice(0, 19)
      const end = new Date(endRaw).getTime() + 1000
      return Number.isFinite(start) && Number.isFinite(end) && now >= start && now < end
    } catch {
      return false
    }
  })

  return current?.status ?? entries.find((entry) => entry.active === 1)?.status
}

function socketKind(socket: SarjSocket, kw?: number): "ac" | "dc" | undefined {
  const type = String(
    socket.socketType ?? socket.soketTipi ?? socket.soketTuru ?? socket.type ?? socket.tip ?? ""
  ).toLocaleUpperCase("tr-TR")
  if (type.includes("DC")) return "dc"
  if (type.includes("AC")) return "ac"
  if (kw != null && kw >= 50) return "dc"
  if (kw != null && kw > 0) return "ac"
  return undefined
}

function socketKw(socket: SarjSocket): number | undefined {
  const value = Number(socket.power ?? socket.guc ?? socket.soketGucu ?? socket.powerKw ?? socket.gucKw)
  return Number.isFinite(value) && value > 0 ? value : undefined
}

export function parseSarjTrStation(payload: unknown): StationStatusPayload {
  const rawSockets =
    payload && typeof payload === "object" && "sockets" in payload && Array.isArray(payload.sockets)
      ? payload.sockets
      : []
  const sockets = rawSockets.map((item) => {
    const socket = (item && typeof item === "object" ? item : {}) as SarjSocket
    const kw = socketKw(socket)
    return {
      id: socket.id ?? null,
      status: mapAvailabilityStatus(currentSarjAvailability(socket.availability)),
      kind: socketKind(socket, kw),
      kw,
    }
  })

  const summary: StationStatusSummary = { free: 0, busy: 0, fault: 0, unknown: 0 }
  for (const socket of sockets) {
    summary[socket.status] += 1
  }

  return { sockets, summary }
}

export function hasKnownAvailability(summary: StationStatusSummary): boolean {
  return summary.free + summary.busy + summary.fault > 0
}

export function statusSummaryHtml(summary: StationStatusSummary): string {
  if (!hasKnownAvailability(summary)) return ""
  const parts = [
    summary.free ? `<span class="st-free">${summary.free} müsait</span>` : "",
    summary.busy ? `<span class="st-busy">${summary.busy} dolu</span>` : "",
    summary.fault ? `<span class="st-fault">${summary.fault} arızalı</span>` : "",
  ].filter(Boolean)
  return parts.length ? `<div class="status-row">${parts.join(" · ")}</div>` : ""
}
