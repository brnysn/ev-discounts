import { formatAvailability, formatKw, socketRowsFromStation, type SocketSpeedRow } from "@/lib/station-sockets"
import type { StationStatusPayload } from "@/lib/station-status"
import type { StationRecord } from "@/types/stations"

function BoltIcon() {
  return (
    <svg className="bolt" viewBox="0 0 10 16" width="9" height="14" aria-hidden>
      <path fill="#16a34a" d="M6.1 0 0 9.1h4.05L3.7 16 10 6.7H5.9z" />
    </svg>
  )
}

function SpeedRow({ row }: { row: SocketSpeedRow }) {
  const kw = formatKw(row.kw)
  return (
    <div className="speed-row">
      <div className="speed-left">
        {row.kind === "ac" ? (
          <span className="speed-ac">AC</span>
        ) : (
          <span className="speed-bolts" aria-hidden>
            {Array.from({ length: row.bolts }, (_, index) => (
              <BoltIcon key={index} />
            ))}
            {row.plus ? <span className="bolt-plus">+</span> : null}
          </span>
        )}
        {kw ? <span className="speed-kw">{kw}</span> : null}
      </div>
      <div className="speed-status">
        <span className={`sig sig-${row.signal}`} />
        <span className="speed-avail">{formatAvailability(row.free, row.total)}</span>
      </div>
    </div>
  )
}

export function SocketSpeedRows({
  station,
  occupancy,
}: {
  station: StationRecord
  occupancy?: StationStatusPayload | null
}) {
  const rows = socketRowsFromStation(station, occupancy)
  if (!rows.length) return null
  return (
    <div className="speed-list">
      {rows.map((row) => (
        <SpeedRow key={row.id} row={row} />
      ))}
    </div>
  )
}
