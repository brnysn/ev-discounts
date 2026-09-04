import { formatAvailability, formatKw, socketRowsFromStation, type SocketSpeedRow } from "@/lib/station-sockets"
import type { StationStatusPayload } from "@/lib/station-status"
import type { StationRecord } from "@/types/stations"

function PlugIcon() {
  return (
    <svg className="plug" viewBox="0 0 16 22" width="12" height="16" aria-hidden>
      <rect x="4.15" y="0" width="2.3" height="5.4" rx=".35" />
      <rect x="9.55" y="0" width="2.3" height="5.4" rx=".35" />
      <path d="M2.1 5.9h11.8v8.1L10.5 18.4v3.1H5.5v-3.1L2.1 14z" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg className="bolt" viewBox="0 0 10 16" width="9" height="14" aria-hidden>
      <path fill="#16a34a" d="M6.1 0 0 9.1h4.05L3.7 16 10 6.7H5.9z" />
    </svg>
  )
}

function SpeedRow({ row, price }: { row: SocketSpeedRow; price?: string }) {
  const kw = formatKw(row.kw)
  return (
    <div className="speed-row">
      <div className="speed-left">
        {row.kind === "ac" ? (
          <span className="speed-plug" aria-label="AC">
            <PlugIcon />
          </span>
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
      <div className="speed-price">
        {price ? (
          <>
            <strong>{price}</strong> <span className="price-unit">TL/kWh</span>
          </>
        ) : null}
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
  prices,
}: {
  station: StationRecord
  occupancy?: StationStatusPayload | null
  prices?: Partial<Record<"ac" | "dc", string>>
}) {
  const rows = socketRowsFromStation(station, occupancy)
  if (!rows.length) return null
  return (
    <div className="speed-list">
      {rows.map((row) => (
        <SpeedRow key={row.id} row={row} price={prices?.[row.kind]} />
      ))}
    </div>
  )
}
