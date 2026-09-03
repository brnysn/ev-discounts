"use client"

import { CustomNavbar } from "@/components/custom-navbar"
import companies from "@/app/data/data.json"
import { getStationOffer, formatTl } from "@/lib/station-pricing"
import { pickBestStation, dcKwBoundsFromStations, type NearbyPort } from "@/lib/station-best"
import { haversineKm } from "@/lib/geo"
import { sarjTrStationId, type StationStatusPayload } from "@/lib/station-status"
import { socketRowsFromStation, speedRowsHtml } from "@/lib/station-sockets"
import { stationPinDivIcon } from "@/lib/station-pin"
import { cityCenterFocus } from "@/lib/city-centers"
import { matchCities, matchStations, type GeocodeHit } from "@/lib/station-search"
import { SocketSpeedRows } from "@/components/socket-speed-rows"
import type { Company } from "@/types"
import type { StationCompanyOffer, StationRecord, StationSnapshot, StationSocketGroup } from "@/types/stations"
import { ChevronRight, Filter, LocateFixed, LocateOff, MapPin, Menu, Navigation, Search, X, Zap } from "@animated-color-icons/lucide-react"
import { AnimatedUiIcon } from "@/components/animated-ui-icon"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Fragment, startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Circle, CircleMarker, Map as LeafletMap, Marker, MarkerClusterGroup } from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

const companyList = companies as Company[]
const RADIUS_KM_OPTIONS = [5, 10, 15, 25] as const
const DEFAULT_RADIUS_KM = 10
const DC_KW_STEP = 10
const DC_KW_DEFAULT_MIN = 150
const LOCATION_PROMPT_KEY = "sarjkampanya.location-prompt.v2"
const SHEET_PEEK_PX = 64
const MAP_PAGE_MENU = [
  { title: "Kampanyalar", url: "/#kampanyalar" },
  { title: "Fiyatlar", url: "/#fiyatlar" },
  { title: "Şarj haritası", url: "/sarj-haritasi" },
  { title: "Blog", url: "/blog" },
  { title: "SSS", url: "/#sss" },
] as const

function sheetExpandedPx(): number {
  return Math.round(Math.min(window.innerHeight * 0.72, window.innerHeight - 88))
}

function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

function isDesktopMap(): boolean {
  return window.matchMedia("(min-width: 768px)").matches
}

type LeafletNS = typeof import("leaflet")

async function loadLeaflet(): Promise<LeafletNS> {
  const mod = (await import("leaflet")) as LeafletNS & { default?: LeafletNS }
  return mod.default ?? mod
}

function locationPromptChoice(): "dismissed" | "requested" | null {
  try {
    const value = localStorage.getItem(LOCATION_PROMPT_KEY)
    if (value === "dismissed" || value === "requested") return value
  } catch {
    /* private mode */
  }
  return null
}

function rememberLocationPrompt(choice: "dismissed" | "requested") {
  try {
    localStorage.setItem(LOCATION_PROMPT_KEY, choice)
  } catch {
    /* private mode */
  }
}

function sheetHeight(): number {
  return document.querySelector("[data-station-sheet]")?.getBoundingClientRect().height ?? 0
}

function visibleMapHeight(): number {
  const map = document.querySelector(".station-map")
  const mapH = map?.getBoundingClientRect().height ?? window.innerHeight
  return Math.max(180, mapH - sheetHeight())
}

function popupBindOptions(): {
  maxWidth: number
  minWidth: number
  maxHeight: number
  autoPan: boolean
  keepInView: boolean
  autoPanPaddingTopLeft: [number, number]
  autoPanPaddingBottomRight: [number, number]
} {
  const desktop = isDesktopMap()
  const bottomPad = desktop ? 96 : Math.round(sheetHeight()) + 16
  return {
    maxWidth: 320,
    minWidth: 248,
    maxHeight: desktop ? 420 : Math.min(320, Math.max(200, visibleMapHeight() - 48)),
    autoPan: desktop,
    keepInView: false,
    autoPanPaddingTopLeft: desktop ? [392, 16] : [16, 12],
    autoPanPaddingBottomRight: [16, bottomPad],
  }
}

function centerLatLngInView(
  map: LeafletMap,
  lat: number,
  lng: number,
  zoom: number,
  place: "popup-anchor" | "visible-center" = "popup-anchor"
) {
  if (isDesktopMap()) {
    map.setView([lat, lng], zoom, { animate: false })
    return
  }
  const size = map.getSize()
  const sheet = sheetHeight()
  const visibleH = Math.max(120, size.y - sheet)
  const desiredY = place === "visible-center" ? visibleH / 2 : Math.max(80, visibleH - 28)
  const target = map.project([lat, lng], zoom)
  target.y += size.y / 2 - desiredY
  map.setView(map.unproject(target, zoom), zoom, { animate: false })
}

function refreshPopupLayout(popup: {
  _updateLayout?: () => void
  _updatePosition?: () => void
  _adjustPan?: () => void
}) {
  popup._updateLayout?.()
  popup._updatePosition?.()
  if (isDesktopMap()) popup._adjustPan?.()
}

type Filters = {
  city: string
  company: string
  port: "all" | "ac" | "dc"
  publicOnly: boolean
  campaignOnly: boolean
  minKw: string
}

type UserLocation = { lat: number; lng: number }

function formatDistanceKm(km: number): string {
  return `${km.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} km`
}

function applyDistanceLine(line: HTMLElement, origin: UserLocation | null) {
  if (!origin) {
    line.hidden = true
    line.textContent = ""
    return
  }
  const lat = Number(line.dataset.lat)
  const lng = Number(line.dataset.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    line.hidden = true
    line.textContent = ""
    return
  }
  line.textContent = formatDistanceKm(haversineKm(origin, { lat, lng }))
  line.hidden = false
}

function fillPopupDistance(root: ParentNode | null | undefined, origin: UserLocation | null) {
  const line = root?.querySelector(".distance-line")
  if (line instanceof HTMLElement) applyDistanceLine(line, origin)
}

function defaultDcKwRange(bounds: { min: number; max: number }): [number, number] {
  const high = bounds.max
  const low = Math.min(Math.max(DC_KW_DEFAULT_MIN, bounds.min), high)
  return [low, high]
}

function DualRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  label,
}: {
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  label: string
}) {
  const span = max - min || 1
  const left = ((value[0] - min) / span) * 100
  const right = ((value[1] - min) / span) * 100

  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between gap-2 text-xs">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value[0]}–{value[1]} kW
        </span>
      </div>
      <div className="dc-range">
        <div className="dc-range-track" />
        <div className="dc-range-fill" style={{ left: `${left}%`, width: `${Math.max(0, right - left)}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          aria-label="Minimum DC şarj hızı"
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange([Math.min(next, value[1]), value[1]])
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          aria-label="Maksimum DC şarj hızı"
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange([value[0], Math.max(next, value[0])])
          }}
        />
      </div>
    </div>
  )
}

const defaultFilters: Filters = {
  city: "all",
  company: "all",
  port: "all",
  publicOnly: true,
  campaignOnly: false,
  minKw: "",
}

const SEARCH_DEBOUNCE_MS = 250

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function priceLine(label: string, price?: StationCompanyOffer["dc"]): string {
  if (!price) return ""
  return `<div class="price-row"><span class="port">${escapeHtml(label)}</span><span class="price"><strong>${formatTl(price.original)} TL/kWh</strong></span></div>`
}

function portPriceSummary(
  station: StationRecord,
  offer: StationCompanyOffer,
  pick: (price: NonNullable<StationCompanyOffer["dc"]>) => number
): string {
  const parts: string[] = []
  if (station.dc > 0 && offer.dc) parts.push(`DC ${formatTl(pick(offer.dc))}`)
  if (station.ac > 0 && offer.ac) parts.push(`AC ${formatTl(pick(offer.ac))}`)
  return parts.join(" · ")
}

function bankPortPriceHtml(oldPrice: number, newPrice: number, label?: string): string {
  return `
    ${label ? `<div class="bank-port">${escapeHtml(label)}</div>` : ""}
    <div class="bank-old">${formatTl(oldPrice)} TL/kWh</div>
    <div class="bank-new">${formatTl(newPrice)} TL/kWh</div>`
}

type DisplayBankDeal = {
  title: string
  description: string
  name: string
  logo: string
  detailsUrl?: string
  prices: { label?: string; oldPrice: number; newPrice: number }[]
}

function displayBankDeals(
  station: StationRecord,
  offer: StationCompanyOffer,
  port?: "ac" | "dc"
): DisplayBankDeal[] {
  const byTitle = new Map<string, DisplayBankDeal>()
  const add = (price: StationCompanyOffer["dc"], label: string, include: boolean) => {
    if (!include || !price) return
    for (const deal of price.bankDeals) {
      const current = byTitle.get(deal.title) ?? {
        title: deal.title,
        description: deal.description,
        name: deal.name,
        logo: deal.logo,
        detailsUrl: deal.detailsUrl,
        prices: [],
      }
      current.prices.push({ label, oldPrice: deal.oldPrice, newPrice: deal.newPrice })
      byTitle.set(deal.title, current)
    }
  }
  if (!port || port === "dc") add(offer.dc, "DC", station.dc > 0)
  if (!port || port === "ac") add(offer.ac, "AC", station.ac > 0)
  const deals = [...byTitle.values()]
  for (const deal of deals) {
    if (deal.prices.length === 1) deal.prices[0].label = undefined
  }
  return deals
}

function listPriceHtml(station: StationRecord, offer: StationCompanyOffer): string {
  return `${station.dc > 0 ? priceLine("DC", offer.dc) : ""}${station.ac > 0 ? priceLine("AC", offer.ac) : ""}`
}

function networkCampaignHtml(station: StationRecord, offer: StationCompanyOffer): string {
  const campaignName = offer.dc?.campaignName || offer.ac?.campaignName
  if (!campaignName) return ""
  return `<div class="deal">Ağ kampanyası: ${escapeHtml(campaignName)}</div><div class="deal">${escapeHtml(portPriceSummary(station, offer, (price) => price.networkPrice))} TL/kWh</div>`
}

function bankPricesHtml(prices: DisplayBankDeal["prices"]): string {
  return prices.map((price) => bankPortPriceHtml(price.oldPrice, price.newPrice, price.label)).join("")
}

function bankLogoHtml(deal: DisplayBankDeal): string {
  if (deal.logo) {
    return `<img class="bank-logo" src="${escapeHtml(deal.logo)}" alt="${escapeHtml(deal.name)}" width="80" height="32">`
  }
  return `<span class="muted">${escapeHtml(deal.name)}</span>`
}

function bankCampaignsHtml(station: StationRecord, offer: StationCompanyOffer): string {
  const bankDeals = displayBankDeals(station, offer)
  if (!bankDeals.length) return ""
  let html = `<div class="bank-deal"><div class="bank-hook">Banka kampanyasıyla daha az ödeyin</div>`
  for (const deal of bankDeals) {
    html += `
        <details class="bank-item">
          <summary class="bank-row">
            ${bankLogoHtml(deal)}
            <div class="bank-prices">${bankPricesHtml(deal.prices)}</div>
          </summary>
          <div class="bank-body">
            <div class="bank-title">${escapeHtml(deal.title)}</div>
            ${deal.description ? `<p class="bank-desc">${escapeHtml(deal.description)}</p>` : ""}
            ${deal.detailsUrl ? `<a class="bank-link" href="${escapeHtml(deal.detailsUrl)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Kampanya detayı</a>` : ""}
          </div>
        </details>`
  }
  html += `</div>`
  return html
}

function brandBlockHtml(station: StationRecord, offer: StationCompanyOffer | null): string {
  if (offer?.logo) {
    const logo = `<img class="brand-logo" src="${escapeHtml(offer.logo)}" alt="" width="32" height="32">`
    return station.public ? logo : `${logo}<div class="muted">Özel</div>`
  }
  const brand = station.brand || offer?.companyName || ""
  if (!brand) {
    return station.public ? "" : `<div class="muted">Özel</div>`
  }
  return `<div class="muted">${escapeHtml(brand)}${station.public ? "" : " · Özel"}</div>`
}

function BankCampaignDeals({ deals }: { deals: DisplayBankDeal[] }) {
  if (!deals.length) return null
  return (
    <div className="bank-deal">
      <div className="bank-hook">Banka kampanyasıyla daha az ödeyin</div>
      {deals.map((deal) => (
        <details key={deal.title} className="bank-item">
          <summary className="bank-row">
            {deal.logo ? (
              <Image src={deal.logo} alt={deal.name} width={80} height={32} className="bank-logo" unoptimized />
            ) : (
              <span className="muted">{deal.name}</span>
            )}
            <div className="bank-prices">
              {deal.prices.map((price) => (
                <Fragment key={`${deal.title}-${price.label ?? "price"}`}>
                  {price.label ? <div className="bank-port">{price.label}</div> : null}
                  <div className="bank-old">{formatTl(price.oldPrice)} TL/kWh</div>
                  <div className="bank-new">{formatTl(price.newPrice)} TL/kWh</div>
                </Fragment>
              ))}
            </div>
          </summary>
          <div className="bank-body">
            <div className="bank-title">{deal.title}</div>
            {deal.description ? <p className="bank-desc">{deal.description}</p> : null}
            {deal.detailsUrl ? (
              <a
                className="bank-link"
                href={deal.detailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                Kampanya detayı
              </a>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  )
}

function BrandMark({ station, offer }: { station: StationRecord; offer: StationCompanyOffer | null }) {
  if (offer?.logo) {
    return (
      <>
        <Image src={offer.logo} alt="" width={32} height={32} className="brand-logo" unoptimized />
        {!station.public ? <div className="muted">Özel</div> : null}
      </>
    )
  }
  const brand = station.brand || offer?.companyName
  if (!brand) {
    return station.public ? null : <div className="muted">Özel</div>
  }
  return (
    <div className="muted">
      {brand}
      {station.public ? "" : " · Özel"}
    </div>
  )
}

function PriceRows({ station, offer }: { station: StationRecord; offer: StationCompanyOffer }) {
  const campaignName = offer.dc?.campaignName || offer.ac?.campaignName
  return (
    <>
      {station.dc > 0 && offer.dc ? (
        <div className="price-row">
          <span className="port">DC</span>
          <span className="price">
            <strong>{formatTl(offer.dc.original)} TL/kWh</strong>
          </span>
        </div>
      ) : null}
      {station.ac > 0 && offer.ac ? (
        <div className="price-row">
          <span className="port">AC</span>
          <span className="price">
            <strong>{formatTl(offer.ac.original)} TL/kWh</strong>
          </span>
        </div>
      ) : null}
      {campaignName ? (
        <>
          <div className="deal">Ağ kampanyası: {campaignName}</div>
          <div className="deal">{portPriceSummary(station, offer, (price) => price.networkPrice)} TL/kWh</div>
        </>
      ) : null}
    </>
  )
}

function StationDetailCard({
  heading,
  station,
  offer,
  occupancy,
  distanceKm,
  onFocus,
}: {
  heading: string
  station: StationRecord
  offer: StationCompanyOffer | null
  occupancy: StationStatusPayload | null
  distanceKm?: number
  onFocus?: () => void
}) {
  const name = station.name || station.brand
  const deals = offer ? displayBankDeals(station, offer) : []

  return (
    <div className="station-best rounded-lg border bg-background p-3 text-sm shadow-lg">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{heading}</div>
      <div className="station-popup">
        <button type="button" className="w-full text-left" onClick={onFocus}>
          <strong>{name}</strong>
        </button>
        <BrandMark station={station} offer={offer} />
        <SocketSpeedRows station={station} occupancy={occupancy} />
        {offer ? <PriceRows station={station} offer={offer} /> : null}
        {distanceKm != null ? <div className="muted">{formatDistanceKm(distanceKm)}</div> : null}
        <button
          type="button"
          className="popup-btn al-icon-wrapper"
          onClick={() => {
            window.open(directionsUrl(station.lat, station.lng), "_blank", "noopener,noreferrer")
          }}
        >
          <AnimatedUiIcon icon={Navigation} />
          Yol tarifi al
        </button>
        <BankCampaignDeals deals={deals} />
      </div>
    </div>
  )
}

const CLOSE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animated-lucide-icon animated-lucide-icon-x" aria-hidden="true"><path d="M18 6 6 18" class="al-primary al-anim-scale-pop al-delay-0"/><path d="m6 6 12 12" class="al-secondary al-anim-scale-pop al-delay-1"/></svg>'

const NAV_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animated-lucide-icon animated-lucide-icon-navigation" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11" class="al-primary al-anim-rocket-lift al-delay-0"/></svg>'

function popupHtml(station: StationRecord, offer: StationCompanyOffer | null): string {
  const maps = directionsUrl(station.lat, station.lng)
  const groupsAttr = station.groups?.length ? escapeHtml(JSON.stringify(station.groups)) : ""

  return `
    <div class="station-popup">
      <strong>${escapeHtml(station.name || station.brand)}</strong>
      ${brandBlockHtml(station, offer)}
      <div class="speed-list" data-status-id="${escapeHtml(station.id)}" data-lat="${station.lat}" data-lng="${station.lng}" data-ac="${station.ac}" data-dc="${station.dc}" data-max-kw="${station.maxKw}" data-groups="${groupsAttr}">
        ${speedRowsHtml(socketRowsFromStation(station))}
      </div>
      ${offer ? `${listPriceHtml(station, offer)}${networkCampaignHtml(station, offer)}` : ""}
      <div class="muted distance-line" hidden data-lat="${station.lat}" data-lng="${station.lng}"></div>
      <button type="button" class="popup-btn al-icon-wrapper" onclick="window.open('${maps}','_blank','noopener,noreferrer')">${NAV_SVG} Yol tarifi al</button>
      ${offer ? bankCampaignsHtml(station, offer) : ""}
    </div>
  `
}

async function fetchStationStatus(
  stationId: string,
  lat: number,
  lng: number
): Promise<{ data: StationStatusPayload | null; hardFail: boolean }> {
  const numericId = sarjTrStationId(stationId) ?? "0"
  try {
    const response = await fetch(
      `/api/station-status/${encodeURIComponent(numericId)}?lat=${lat}&lng=${lng}`
    )
    if (response.status === 404) return { data: null, hardFail: false }
    if (!response.ok) return { data: null, hardFail: true }
    return { data: (await response.json()) as StationStatusPayload, hardFail: false }
  } catch {
    return { data: null, hardFail: true }
  }
}

export function StationMap() {
  const mapEl = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const sheetDragRef = useRef<{
    pointerId: number
    startY: number
    startH: number
    startT: number
    moved: boolean
  } | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const clusterRef = useRef<MarkerClusterGroup | null>(null)
  const circleRef = useRef<Circle | null>(null)
  const userMarkerRef = useRef<CircleMarker | null>(null)
  const placeMarkerRef = useRef<CircleMarker | null>(null)
  const markerByIdRef = useRef<Map<string, Marker>>(new Map())
  const occupancyCacheRef = useRef(new Map<string, StationStatusPayload | null>())
  const occupancyInflightRef = useRef(new Set<string>())
  const leafletRef = useRef<typeof import("leaflet") | null>(null)
  const snapshotRef = useRef<StationSnapshot | null>(null)
  const bestIdRef = useRef<string | undefined>(undefined)
  const highlightedIdRef = useRef<string | undefined>(undefined)
  const refreshMarkerIconRef = useRef<(id: string) => void>(() => {})
  const focusStationMarkerRef = useRef<(marker: Marker) => void>(() => {})
  const selectStationRef = useRef<(id: string) => void>(() => {})
  const selectedIdRef = useRef<string | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [snapshot, setSnapshot] = useState<StationSnapshot | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [searchText, setSearchText] = useState("")
  const [localQuery, setLocalQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [geocodeHits, setGeocodeHits] = useState<GeocodeHit[]>([])
  const [geocodeBusy, setGeocodeBusy] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [locateBusy, setLocateBusy] = useState(false)
  const [locationPromptOpen, setLocationPromptOpen] = useState(false)
  const [gpsDenied, setGpsDenied] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const userLocationRef = useRef<UserLocation | null>(null)
  userLocationRef.current = userLocation
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM)
  const [nearbyPort, setNearbyPort] = useState<NearbyPort>("dc")
  const [dcKwRange, setDcKwRange] = useState<[number, number] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [bestOccupancy, setBestOccupancy] = useState<StationStatusPayload | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetDragging, setSheetDragging] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const didFitRef = useRef(false)
  const lastLocateKeyRef = useRef<string | null>(null)
  const locationRequestIdRef = useRef(0)

  useEffect(() => {
    didFitRef.current = false
  }, [filters.city])

  const offers = useMemo(() => {
    const map = new Map<string, StationCompanyOffer | null>()
    if (!snapshot) return map
    for (const station of snapshot.stations) {
      map.set(station.id, getStationOffer(station, companyList))
    }
    return map
  }, [snapshot])

  const cities = useMemo(() => {
    if (!snapshot) return []
    return [...new Set(snapshot.stations.map((station) => station.city).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "tr")
    )
  }, [snapshot])

  const companiesOnMap = useMemo(() => {
    const names = new Set<string>()
    for (const offer of offers.values()) {
      if (offer) names.add(offer.companyName)
    }
    return [...names].sort((a, b) => a.localeCompare(b, "tr"))
  }, [offers])

  const filtered = useMemo(() => {
    if (!snapshot) return []
    const minKw = Number(filters.minKw) || 0

    return snapshot.stations.filter((station) => {
      if (filters.publicOnly && !station.public) return false
      if (filters.city !== "all" && station.city !== filters.city) return false
      if (filters.port === "ac" && station.ac === 0) return false
      if (filters.port === "dc" && station.dc === 0) return false
      if (minKw && station.maxKw < minKw) return false

      const offer = offers.get(station.id) ?? null
      if (filters.company === "campaigns" && !offer) return false
      if (filters.company === "other" && offer) return false
      if (
        filters.company !== "all" &&
        filters.company !== "campaigns" &&
        filters.company !== "other" &&
        offer?.companyName !== filters.company
      ) {
        return false
      }
      if (filters.campaignOnly && !offer?.ac?.hasCampaign && !offer?.dc?.hasCampaign) return false
      return true
    })
  }, [snapshot, filters, offers])

  const dcKwBounds = useMemo(
    () => dcKwBoundsFromStations(snapshot?.stations ?? []),
    [snapshot]
  )
  const effectiveDcKwRange = useMemo(() => {
    const [low, high] = dcKwRange ?? defaultDcKwRange(dcKwBounds)
    const min = Math.min(Math.max(low, dcKwBounds.min), dcKwBounds.max)
    const max = Math.min(Math.max(high, min), dcKwBounds.max)
    return [min, max] as [number, number]
  }, [dcKwRange, dcKwBounds])

  const bestStation = useMemo(() => {
    if (!userLocation) return null
    return pickBestStation(
      userLocation,
      radiusKm,
      filtered,
      offers,
      nearbyPort,
      nearbyPort === "dc" ? { min: effectiveDcKwRange[0], max: effectiveDcKwRange[1] } : null
    )
  }, [userLocation, radiusKm, filtered, offers, nearbyPort, effectiveDcKwRange])

  const bestOffer = bestStation?.offer ?? null
  const bestDistanceKm = bestStation?.distanceKm

  snapshotRef.current = snapshot
  bestIdRef.current = bestStation?.station.id
  selectedIdRef.current = selectedId
  refreshMarkerIconRef.current = (id: string) => {
    const leaflet = leafletRef.current
    const marker = markerByIdRef.current.get(id)
    const station = snapshotRef.current?.stations.find((item) => item.id === id)
    if (!leaflet || !marker || !station) return
    const highlightId = bestIdRef.current
    const highlighted = highlightId === id
    marker.setIcon(
      stationPinDivIcon(leaflet, station, occupancyCacheRef.current.get(id) ?? null, highlighted)
    )
    marker.setZIndexOffset(highlighted ? 800 : 0)
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      startTransition(() => setDebouncedQuery(searchText.trim()))
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timeout)
  }, [searchText])

  useEffect(() => {
    if (searchText.trim() && !isDesktopMap()) setSheetOpen(true)
  }, [searchText])

  const searchStations = useMemo(() => {
    if (!snapshot || !localQuery) return []
    return matchStations(snapshot.stations, localQuery)
  }, [snapshot, localQuery])

  const searchCities = useMemo(() => {
    if (!snapshot || !localQuery) return []
    return matchCities(snapshot.stations, localQuery)
  }, [snapshot, localQuery])

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setGeocodeHits([])
      setGeocodeBusy(false)
      return
    }
    const controller = new AbortController()
    setGeocodeBusy(true)
    void fetch(`/api/geocode?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<{ results?: GeocodeHit[] }>) : { results: [] }))
      .then((data) => {
        if (!controller.signal.aborted) setGeocodeHits(data.results ?? [])
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setGeocodeHits([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setGeocodeBusy(false)
      })
    return () => {
      controller.abort()
    }
  }, [debouncedQuery])

  const searchPlaceHits = useMemo(() => {
    const citiesLower = new Set(searchCities.map((city) => city.toLocaleLowerCase("tr-TR")))
    return geocodeHits.filter((hit) => !citiesLower.has(hit.title.toLocaleLowerCase("tr-TR")))
  }, [geocodeHits, searchCities])

  const hasSearchQuery = Boolean(searchText.trim())
  const hasSearchResults = searchStations.length > 0 || searchCities.length > 0 || searchPlaceHits.length > 0

  useEffect(() => {
    let cancelled = false
    const request = fetch("/data/stations.json")
      .then((response) => {
        if (!response.ok) throw new Error("İstasyon verisi yüklenemedi")
        return response.json() as Promise<StationSnapshot>
      })
      .then((data) => {
        if (!cancelled) setSnapshot(data)
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message)
      })
    void request
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!mapEl.current) return

    let cancelled = false
    let createdMap: LeafletMap | null = null

    async function initMap() {
      const L = await loadLeaflet()
      await import("leaflet.markercluster")

      if (cancelled || !mapEl.current) return

      const map = L.map(mapEl.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([39.2, 35.2], 6)
      createdMap = map
      leafletRef.current = L
      L.control.zoom({ position: "bottomright" }).addTo(map)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      const cluster = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 56,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        disableClusteringAtZoom: 15,
      })
      map.addLayer(cluster)

      map.on("popupopen", (event) => {
        const latlng = event.popup.getLatLng()
        if (latlng && !isDesktopMap()) {
          centerLatLngInView(
            event.target as LeafletMap,
            latlng.lat,
            latlng.lng,
            (event.target as LeafletMap).getZoom(),
            "popup-anchor"
          )
        }
        const popupRoot = event.popup.getElement()
        const closeBtn = popupRoot?.querySelector(".leaflet-popup-close-button")
        if (closeBtn instanceof HTMLElement && closeBtn.dataset.animated !== "1") {
          closeBtn.dataset.animated = "1"
          closeBtn.classList.add("al-icon-wrapper")
          closeBtn.innerHTML = CLOSE_SVG
        }
        const scrolled = popupRoot?.querySelector(".leaflet-popup-content") as HTMLElement | null
        if (scrolled) scrolled.scrollTop = 0
        fillPopupDistance(popupRoot, userLocationRef.current)
        if (popupRoot) refreshPopupLayout(event.popup)
        if (popupRoot && popupRoot.dataset.bankToggle !== "1") {
          popupRoot.dataset.bankToggle = "1"
          popupRoot.addEventListener(
            "toggle",
            (toggleEvent) => {
              if (!(toggleEvent.target instanceof HTMLDetailsElement)) return
              const popup = event.popup as import("leaflet").Popup & {
                _updateLayout?: () => void
                _updatePosition?: () => void
                _adjustPan?: () => void
              }
              const content = popup.getElement()?.querySelector(".leaflet-popup-content") as HTMLElement | null
              if (content) {
                content.style.height = ""
              }
              refreshPopupLayout(popup)
            },
            true
          )
        }
        const slot = event.popup.getElement()?.querySelector("[data-status-id]") as HTMLElement | null
        if (!slot || slot.dataset.loaded === "1") return
        const stationId = slot.dataset.statusId
        if (!stationId) return
        slot.dataset.loaded = "1"
        const lat = Number(slot.dataset.lat)
        const lng = Number(slot.dataset.lng)
        void fetchStationStatus(stationId, lat, lng).then(({ data }) => {
          occupancyCacheRef.current.set(stationId, data)
          refreshMarkerIconRef.current(stationId)
          if (!data || !slot.isConnected) return
          let groups: StationSocketGroup[] = []
          try {
            groups = JSON.parse(slot.dataset.groups || "[]") as StationSocketGroup[]
          } catch {
            groups = []
          }
          slot.innerHTML = speedRowsHtml(
            socketRowsFromStation(
              {
                ac: Number(slot.dataset.ac) || 0,
                dc: Number(slot.dataset.dc) || 0,
                maxKw: Number(slot.dataset.maxKw) || 0,
                groups,
              },
              data
            )
          )
          const popup = event.popup as import("leaflet").Popup & {
            _updateLayout?: () => void
            _updatePosition?: () => void
            _adjustPan?: () => void
          }
          const content = popup.getElement()?.querySelector(".leaflet-popup-content") as HTMLElement | null
          if (content) content.style.height = ""
          refreshPopupLayout(popup)
        })
      })

      mapRef.current = map
      clusterRef.current = cluster
      setTimeout(() => {
        if (!cancelled) map.invalidateSize()
      }, 100)
      if (!cancelled) setMapReady(true)
    }

    void initMap()

    return () => {
      cancelled = true
      setMapReady(false)
      createdMap?.remove()
      mapRef.current = null
      clusterRef.current = null
      circleRef.current = null
      userMarkerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const root = mapEl.current
    if (!mapReady || !map || !root) return
    const syncSize = () => map.invalidateSize()
    const timeout = window.setTimeout(syncSize, 50)
    window.addEventListener("resize", syncSize)

    const sheet = document.querySelector("[data-station-sheet]")
    const syncSheet = () => {
      const height = isDesktopMap() ? 0 : (sheet?.getBoundingClientRect().height ?? 0)
      root.style.setProperty("--station-sheet-h", `${Math.round(height)}px`)
    }
    syncSheet()
    const observer = sheet ? new ResizeObserver(syncSheet) : null
    if (sheet) observer?.observe(sheet)

    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener("resize", syncSize)
      observer?.disconnect()
    }
  }, [mapReady, locationPromptOpen, userLocation, filtersOpen])

  useEffect(() => {
    const cluster = clusterRef.current
    const map = mapRef.current
    if (!cluster || !map || !mapReady) return

    let cancelled = false

    async function redraw() {
      const L = await loadLeaflet()
      const group = clusterRef.current
      if (cancelled || !group) return
      group.clearLayers()
      markerByIdRef.current = new Map()

      const bestId = bestIdRef.current
      const layers: import("leaflet").Layer[] = []
      for (const station of filtered) {
        const offer = offers.get(station.id) ?? null
        const highlighted = station.id === bestId
        const marker = L.marker([station.lat, station.lng], {
          icon: stationPinDivIcon(L, station, occupancyCacheRef.current.get(station.id) ?? null, highlighted),
          zIndexOffset: highlighted ? 800 : 0,
          riseOnHover: true,
          title: station.name || station.brand,
          alt: station.name || station.brand,
        })
        const stationId = station.id
        marker.on("click", () => selectStationRef.current(stationId))
        marker.bindPopup(popupHtml(station, offer), popupBindOptions())
        markerByIdRef.current.set(station.id, marker)
        layers.push(marker)
      }
      group.addLayers(layers)
      const mapInstance = mapRef.current
      if (mapInstance && layers.length && !didFitRef.current && !userLocation) {
        didFitRef.current = true
        mapInstance.fitBounds(group.getBounds(), { padding: [48, 72], maxZoom: 11 })
        mapInstance.invalidateSize()
      }
    }

    void redraw()
    return () => {
      cancelled = true
    }
  }, [filtered, offers, mapReady, userLocation])

  useEffect(() => {
    const next = bestStation?.station.id
    const prev = highlightedIdRef.current
    if (prev === next) return
    if (prev) refreshMarkerIconRef.current(prev)
    if (next) refreshMarkerIconRef.current(next)
    highlightedIdRef.current = next
  }, [bestStation?.station.id])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    let cancelled = false

    async function drawCircle() {
      const L = await loadLeaflet()
      const map = mapRef.current
      if (cancelled || !map) return

      if (!userLocation) {
        circleRef.current?.remove()
        userMarkerRef.current?.remove()
        circleRef.current = null
        userMarkerRef.current = null
        return
      }

      const radiusMeters = radiusKm * 1000
      if (circleRef.current) {
        circleRef.current.setLatLng(userLocation)
        circleRef.current.setRadius(radiusMeters)
      } else {
        circleRef.current = L.circle(userLocation, {
          radius: radiusMeters,
          color: "#2563eb",
          weight: 2,
          fillColor: "#2563eb",
          fillOpacity: 0.14,
        }).addTo(map)
      }

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(userLocation)
      } else {
        userMarkerRef.current = L.circleMarker(userLocation, {
          radius: 7,
          color: "#1d4ed8",
          fillColor: "#3b82f6",
          fillOpacity: 1,
          weight: 2,
        }).addTo(map)
      }

      const locateKey = `${userLocation.lat.toFixed(5)},${userLocation.lng.toFixed(5)}`
      if (lastLocateKeyRef.current !== locateKey) {
        lastLocateKeyRef.current = locateKey
        centerLatLngInView(map, userLocation.lat, userLocation.lng, 16, "visible-center")
      }
    }

    void drawCircle()
    return () => {
      cancelled = true
    }
  }, [mapReady, userLocation, radiusKm])

  useEffect(() => {
    const root = mapEl.current
    if (!root) return
    for (const node of root.querySelectorAll(".distance-line")) {
      if (node instanceof HTMLElement) applyDistanceLine(node, userLocation)
    }
    for (const marker of markerByIdRef.current.values()) {
      if (!marker.isPopupOpen()) continue
      const popup = marker.getPopup()
      if (popup) refreshPopupLayout(popup)
    }
  }, [userLocation])

  useEffect(() => {
    if (!bestStation) {
      setBestOccupancy(null)
      return
    }
    let cancelled = false
    const cached = occupancyCacheRef.current.get(bestStation.station.id)
    if (cached !== undefined) {
      setBestOccupancy(cached)
    } else {
      setBestOccupancy(null)
    }
    void fetchStationStatus(bestStation.station.id, bestStation.station.lat, bestStation.station.lng).then(({ data }) => {
      if (cancelled) return
      occupancyCacheRef.current.set(bestStation.station.id, data)
      refreshMarkerIconRef.current(bestStation.station.id)
      setBestOccupancy(data)
    })
    return () => {
      cancelled = true
    }
  }, [bestStation])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map) return

    let cancelled = false
    let failStreak = 0

    async function drain(ids: string[]) {
      let index = 0
      async function worker() {
        while (index < ids.length && !cancelled && failStreak < 4) {
          const id = ids[index++]
          if (!id) continue
          if (occupancyCacheRef.current.has(id) || occupancyInflightRef.current.has(id)) continue
          occupancyInflightRef.current.add(id)
          const marker = markerByIdRef.current.get(id)
          const latLng = marker?.getLatLng()
          if (!latLng) {
            occupancyInflightRef.current.delete(id)
            continue
          }
          const { data, hardFail } = await fetchStationStatus(id, latLng.lat, latLng.lng)
          occupancyInflightRef.current.delete(id)
          if (cancelled) return
          occupancyCacheRef.current.set(id, data)
          if (data) failStreak = 0
          else if (hardFail) failStreak += 1
          refreshMarkerIconRef.current(id)
        }
      }
      await Promise.all([worker(), worker(), worker()])
    }

    function collect() {
      if (!map || map.getZoom() < 15) return
      failStreak = 0
      const bounds = map.getBounds()
      const ids: string[] = []
      for (const [id, marker] of markerByIdRef.current) {
        if (occupancyCacheRef.current.has(id) || occupancyInflightRef.current.has(id)) continue
        if (!bounds.contains(marker.getLatLng())) continue
        ids.push(id)
        if (ids.length >= 24) break
      }
      if (ids.length) void drain(ids)
    }

    map.on("moveend", collect)
    map.on("zoomend", collect)
    const timeout = window.setTimeout(collect, 400)
    return () => {
      cancelled = true
      map.off("moveend", collect)
      map.off("zoomend", collect)
      window.clearTimeout(timeout)
    }
  }, [mapReady, filtered])

  const focusStationMarker = useCallback((marker: Marker) => {
    const map = mapRef.current
    if (!map) return
    const reveal = () => {
      const latlng = marker.getLatLng()
      centerLatLngInView(map, latlng.lat, latlng.lng, Math.max(map.getZoom(), 16), "popup-anchor")
      window.setTimeout(() => marker.openPopup(), 50)
    }
    const cluster = clusterRef.current as
      | (MarkerClusterGroup & {
          getVisibleParent?: (current: Marker) => Marker | undefined
          zoomToShowLayer?: (current: Marker, fn?: () => void) => void
        })
      | null
    const parent = cluster?.getVisibleParent?.(marker)
    if (cluster?.zoomToShowLayer && parent && parent !== marker) {
      cluster.zoomToShowLayer(marker, reveal)
      return
    }
    reveal()
  }, [])

  focusStationMarkerRef.current = focusStationMarker

  const clearPlaceMarker = useCallback(() => {
    placeMarkerRef.current?.remove()
    placeMarkerRef.current = null
  }, [])

  const selectStation = useCallback(
    (id: string) => {
      clearPlaceMarker()
      const previous = selectedIdRef.current
      selectedIdRef.current = id
      setSelectedId(id)
      if (previous && previous !== id) refreshMarkerIconRef.current(previous)
      refreshMarkerIconRef.current(id)
      const marker = markerByIdRef.current.get(id)
      if (marker) {
        focusStationMarker(marker)
        return
      }
      const station = snapshotRef.current?.stations.find((item) => item.id === id)
      const map = mapRef.current
      if (station && map) {
        centerLatLngInView(map, station.lat, station.lng, 16, "popup-anchor")
      }
    },
    [clearPlaceMarker, focusStationMarker]
  )

  const focusCity = useCallback((city: string) => {
    const map = mapRef.current
    const stations = snapshotRef.current?.stations.filter((station) => station.city === city) ?? []
    if (!map || !stations.length) return
    clearPlaceMarker()
    selectedIdRef.current = null
    setSelectedId(null)
    const view = cityCenterFocus(city, stations)
    centerLatLngInView(map, view.lat, view.lng, view.zoom, "visible-center")
  }, [clearPlaceMarker])

  const focusPlace = useCallback(
    (lat: number, lng: number) => {
      const map = mapRef.current
      const L = leafletRef.current
      if (!map || !L) return
      selectedIdRef.current = null
      setSelectedId(null)
      clearPlaceMarker()
      placeMarkerRef.current = L.circleMarker([lat, lng], {
        radius: 8,
        color: "#0f172a",
        fillColor: "#38bdf8",
        fillOpacity: 1,
        weight: 2,
      }).addTo(map)
      centerLatLngInView(map, lat, lng, 14, "visible-center")
    },
    [clearPlaceMarker]
  )

  selectStationRef.current = selectStation

  const openStationPopup = useCallback(
    (id: string) => {
      selectStation(id)
    },
    [selectStation]
  )

  const applyPosition = useCallback((lat: number, lng: number) => {
    selectedIdRef.current = null
    setSelectedId(null)
    setUserLocation({ lat, lng })
    setLocationPromptOpen(false)
    setGpsDenied(false)
    setLocateBusy(false)
  }, [])

  const skipLocation = useCallback(() => {
    locationRequestIdRef.current += 1
    rememberLocationPrompt("dismissed")
    setGpsDenied(true)
    setLocationPromptOpen(false)
    setLocateBusy(false)
  }, [])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationPromptOpen(false)
      return
    }
    const requestId = ++locationRequestIdRef.current
    setLocateBusy(true)
    rememberLocationPrompt("requested")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== locationRequestIdRef.current) return
        applyPosition(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        if (requestId !== locationRequestIdRef.current) return
        setLocateBusy(false)
        if (error.code === error.PERMISSION_DENIED) {
          setGpsDenied(true)
          setLocationPromptOpen(false)
          return
        }
        setLocationPromptOpen(true)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [applyPosition])

  useEffect(() => {
    let cancelled = false
    async function bootLocation() {
      try {
        if (navigator.permissions?.query) {
          const status = await navigator.permissions.query({ name: "geolocation" })
          if (cancelled) return
          if (status.state === "granted") {
            requestLocation()
            return
          }
          if (status.state === "denied") {
            setGpsDenied(true)
            setLocationPromptOpen(false)
            return
          }
        }
      } catch {
        /* Safari / unsupported */
      }
      if (cancelled) return
      if (locationPromptChoice() === "dismissed") {
        setGpsDenied(true)
        return
      }
      setLocationPromptOpen(true)
    }
    void bootLocation()
    return () => {
      cancelled = true
    }
  }, [requestLocation])

  const locate = useCallback(() => {
    if (userLocation && mapRef.current) {
      lastLocateKeyRef.current = `${userLocation.lat.toFixed(5)},${userLocation.lng.toFixed(5)}`
      centerLatLngInView(mapRef.current, userLocation.lat, userLocation.lng, 16, "visible-center")
      return
    }
    requestLocation()
  }, [userLocation, requestLocation])

  useLayoutEffect(() => {
    const el = sheetRef.current
    if (!el) return
    const apply = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        el.style.height = ""
        return
      }
      if (sheetDragRef.current) return
      el.style.height = `${sheetOpen ? sheetExpandedPx() : SHEET_PEEK_PX}px`
    }
    apply()
    window.addEventListener("resize", apply)
    return () => window.removeEventListener("resize", apply)
  }, [sheetOpen])

  const onSheetHandlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDesktopMap()) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const startH = sheetRef.current?.getBoundingClientRect().height ?? SHEET_PEEK_PX
    sheetDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startH,
      startT: Date.now(),
      moved: false,
    }
    setSheetDragging(true)
  }, [])

  const onSheetHandlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = sheetDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dy = drag.startY - event.clientY
    if (Math.abs(dy) > 6) drag.moved = true
    const expanded = sheetExpandedPx()
    const next = Math.max(SHEET_PEEK_PX, Math.min(expanded, drag.startH + dy))
    if (sheetRef.current) sheetRef.current.style.height = `${Math.round(next)}px`
  }, [])

  const onSheetHandlePointerEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = sheetDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    sheetDragRef.current = null
    setSheetDragging(false)
    const dy = drag.startY - event.clientY
    const dt = Math.max(1, Date.now() - drag.startT)
    const velocity = dy / dt
    if (!drag.moved) {
      setSheetOpen((open) => !open)
      return
    }
    const expanded = sheetExpandedPx()
    const height = Math.max(SHEET_PEEK_PX, Math.min(expanded, drag.startH + dy))
    const mid = (SHEET_PEEK_PX + expanded) / 2
    setSheetOpen(height > mid || velocity > 0.45)
  }, [])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <div className="hidden md:block">
        <CustomNavbar menu={[...MAP_PAGE_MENU]} />
      </div>

      <Dialog
        open={locationPromptOpen}
        onOpenChange={(open) => {
          if (!open && locationPromptOpen && locationPromptChoice() !== "requested") {
            skipLocation()
            return
          }
          setLocationPromptOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konumunuzu kullanabilir miyiz?</DialogTitle>
            <DialogDescription>
              Size en yakın ve en uygun istasyonu bulmak için bu gerekli. İzin verirseniz çevrenize bir çember çizer,
              seçtiğiniz çap içindeki en uygun fiyatlı istasyonu gösteririz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={skipLocation}
            >
              Şimdi değil
            </Button>
            <Button onClick={requestLocation} disabled={locateBusy}>
              {locateBusy ? <Loader2 className="size-4 animate-spin" /> : "Konumumu kullan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative h-[100dvh] min-h-0 flex-1 md:h-[calc(100dvh-72px)]">
        <div ref={mapEl} className="station-map h-[100dvh] w-full md:h-[calc(100dvh-72px)]" />

        {gpsDenied ? (
          <button
            type="button"
            onClick={requestLocation}
            className="al-icon-wrapper absolute top-3 right-3 z-[500] flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-md"
          >
            <AnimatedUiIcon icon={LocateOff} />
            GPS reddedildi
          </button>
        ) : null}

        {!snapshot && !loadError && (
          <div className="absolute inset-0 z-[400] flex items-center justify-center bg-background/60">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 z-[400] flex items-center justify-center p-6">
            <p className="rounded-md border bg-background px-4 py-3 text-sm">{loadError}</p>
          </div>
        )}

        <Sheet
          open={navOpen}
          onOpenChange={(open) => {
            setNavOpen(open)
            if (open) setSheetOpen(false)
          }}
        >
          <SheetContent side="left" className="w-[280px] p-6 md:hidden">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center gap-2" onClick={() => setNavOpen(false)}>
                  <Image src="/images/logo.png" alt="Şarj Kampanya" width={40} height={40} unoptimized />
                  <span className="text-base">Şarj Kampanya</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {MAP_PAGE_MENU.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted"
                  onClick={() => setNavOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div
          ref={sheetRef}
          data-station-sheet
          className={`absolute inset-x-0 bottom-0 z-[500] grid grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden rounded-t-2xl border bg-background shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:inset-auto md:top-3 md:left-3 md:bottom-auto md:max-h-[calc(100dvh-96px)] md:w-[360px] md:gap-3 md:overflow-hidden md:rounded-lg md:border-0 md:bg-transparent md:shadow-none ${
            sheetDragging ? "" : "duration-200 ease-out md:transition-none max-md:transition-[height]"
          }`}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label={sheetOpen ? "Paneli küçült" : "Paneli büyüt"}
            aria-expanded={sheetOpen}
            className="flex cursor-grab touch-none items-center justify-center py-1.5 active:cursor-grabbing md:hidden"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                setSheetOpen((open) => !open)
              }
            }}
            onPointerDown={onSheetHandlePointerDown}
            onPointerMove={onSheetHandlePointerMove}
            onPointerUp={onSheetHandlePointerEnd}
            onPointerCancel={onSheetHandlePointerEnd}
          >
            <span className="h-1 w-10 rounded-full bg-muted-foreground/35" />
          </div>
          <div className="flex gap-2 px-3 pb-1.5 md:p-0">
            <Button
              variant="outline"
              size="icon"
              className="al-icon-wrapper bg-background shadow-md md:hidden"
              onClick={() => {
                setSheetOpen(false)
                setNavOpen(true)
              }}
              aria-label="Menü"
            >
              <AnimatedUiIcon icon={Menu} />
            </Button>
            <div className="al-icon-wrapper relative flex-1">
              <AnimatedUiIcon
                icon={Search}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={searchText}
                onChange={(event) => {
                  const value = event.target.value
                  setSearchText(value)
                  startTransition(() => setLocalQuery(value.trim()))
                }}
                placeholder="İstasyon, marka veya adres"
                className="bg-background pl-9 shadow-md"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="al-icon-wrapper bg-background shadow-md"
              onClick={() => {
                setFiltersOpen((open) => !open)
                if (!filtersOpen) setSheetOpen(true)
              }}
              aria-label="Filtreler"
            >
              {filtersOpen ? <AnimatedUiIcon icon={X} /> : <AnimatedUiIcon icon={Filter} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="al-icon-wrapper bg-background shadow-md"
              onClick={locate}
              disabled={locateBusy}
              aria-label="Konumuma git"
            >
              {locateBusy ? <Loader2 className="size-4 animate-spin" /> : <AnimatedUiIcon icon={LocateFixed} />}
            </Button>
          </div>

          <ScrollArea
            type="auto"
            className="min-h-0"
            viewportClassName="h-full max-h-none md:h-auto md:max-h-[calc(100dvh-152px)]"
          >
          <div className="flex flex-col gap-2 overscroll-contain px-3 pb-[max(12px,env(safe-area-inset-bottom))] md:gap-3 md:px-0.5 md:pb-0.5">

          {hasSearchQuery ? (
            <div className="overflow-hidden rounded-lg border bg-background shadow-lg">
              {searchCities.map((city) => (
                <button
                  key={`city-${city}`}
                  type="button"
                  className="al-icon-wrapper flex w-full items-center gap-3 border-b px-3 py-2.5 text-left last:border-b-0 hover:bg-muted/60"
                  onClick={() => focusCity(city)}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <AnimatedUiIcon icon={MapPin} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-sky-700">{city}</span>
                    <span className="block text-xs text-muted-foreground">İl</span>
                  </span>
                  <AnimatedUiIcon icon={ChevronRight} className="shrink-0 text-muted-foreground" />
                </button>
              ))}
              {searchStations.map((station) => {
                const offer = offers.get(station.id)
                const title = station.name || station.address || station.brand
                return (
                  <button
                    key={station.id}
                    type="button"
                    className="al-icon-wrapper flex w-full items-center gap-3 border-b px-3 py-2.5 text-left last:border-b-0 hover:bg-muted/60"
                    onClick={() => selectStation(station.id)}
                  >
                    {offer?.logo ? (
                      <Image
                        src={offer.logo}
                        alt=""
                        width={32}
                        height={32}
                        className="size-8 shrink-0 object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white">
                        <AnimatedUiIcon icon={Zap} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        <span className="font-medium text-sky-700">{station.brand || offer?.companyName || "İstasyon"}</span>
                        <span className="text-foreground"> · {title}</span>
                      </span>
                    </span>
                    {station.maxKw > 0 ? (
                      <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                        {station.maxKw} kW
                      </span>
                    ) : null}
                    <AnimatedUiIcon icon={ChevronRight} className="shrink-0 text-muted-foreground" />
                  </button>
                )
              })}
              {searchPlaceHits.map((hit) => (
                <button
                  key={`${hit.lat},${hit.lng},${hit.label}`}
                  type="button"
                  className="al-icon-wrapper flex w-full items-center gap-3 border-b px-3 py-2.5 text-left last:border-b-0 hover:bg-muted/60"
                  onClick={() => focusPlace(hit.lat, hit.lng)}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <AnimatedUiIcon icon={MapPin} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-sky-700">{hit.title}</span>
                    {hit.subtitle ? (
                      <span className="block truncate text-xs text-muted-foreground">{hit.subtitle}</span>
                    ) : null}
                  </span>
                  <AnimatedUiIcon icon={ChevronRight} className="shrink-0 text-muted-foreground" />
                </button>
              ))}
              {geocodeBusy && debouncedQuery.length >= 3 ? (
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Adres aranıyor
                </div>
              ) : null}
              {!hasSearchResults && !geocodeBusy && localQuery && searchText.trim() === localQuery ? (
                <p className="px-3 py-2.5 text-sm text-muted-foreground">Eşleşen istasyon veya konum yok.</p>
              ) : null}
            </div>
          ) : null}

          {filtersOpen && (
            <div className="rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur">
              <div className="grid gap-3">
                <label className="grid gap-1 text-xs font-medium">
                  İl
                  <select
                    className="h-9 rounded-md border bg-transparent px-2 text-sm"
                    value={filters.city}
                    onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))}
                  >
                    <option value="all">Tümü</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-medium">
                  Ağ / kampanya
                  <select
                    className="h-9 rounded-md border bg-transparent px-2 text-sm"
                    value={filters.company}
                    onChange={(event) => setFilters((current) => ({ ...current, company: event.target.value }))}
                  >
                    <option value="all">Tüm ağlar</option>
                    <option value="campaigns">Sitede fiyatı olanlar</option>
                    {companiesOnMap.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                    <option value="other">Diğer ağlar</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-medium">
                  Soket
                  <select
                    className="h-9 rounded-md border bg-transparent px-2 text-sm"
                    value={filters.port}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, port: event.target.value as Filters["port"] }))
                    }
                  >
                    <option value="all">AC + DC</option>
                    <option value="dc">Yalnız DC</option>
                    <option value="ac">Yalnız AC</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-medium">
                  Min. güç (kW)
                  <Input
                    inputMode="numeric"
                    value={filters.minKw}
                    onChange={(event) => setFilters((current) => ({ ...current, minKw: event.target.value }))}
                    placeholder="Örn. 150"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.publicOnly}
                    onCheckedChange={(checked) =>
                      setFilters((current) => ({ ...current, publicOnly: checked === true }))
                    }
                  />
                  Yalnız halka açık
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.campaignOnly}
                    onCheckedChange={(checked) =>
                      setFilters((current) => ({ ...current, campaignOnly: checked === true }))
                    }
                  />
                  Yalnız aktif kampanyalı
                </label>
              </div>
            </div>
          )}

          {userLocation && (
            <div className="rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur">
              <p className="mb-2 text-xs font-medium">Çap</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {RADIUS_KM_OPTIONS.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={radiusKm === value ? "default" : "outline"}
                    onClick={() => setRadiusKm(value)}
                  >
                    {value} km
                  </Button>
                ))}
              </div>
              <p className="mb-2 text-xs font-medium">Şarj tipi</p>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    ["dc", "DC"],
                    ["ac", "AC"],
                    ["both", "Tümü"],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={nearbyPort === value ? "default" : "outline"}
                    onClick={() => setNearbyPort(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {nearbyPort === "dc" ? (
                <DualRangeSlider
                  min={dcKwBounds.min}
                  max={dcKwBounds.max}
                  step={DC_KW_STEP}
                  value={effectiveDcKwRange}
                  onChange={setDcKwRange}
                  label="DC şarj hızı"
                />
              ) : null}
            </div>
          )}

          {bestStation ? (
            <StationDetailCard
              heading="En uygun istasyon"
              station={bestStation.station}
              offer={bestOffer}
              occupancy={bestOccupancy}
              distanceKm={bestDistanceKm}
              onFocus={() => openStationPopup(bestStation.station.id)}
            />
          ) : userLocation ? (
            <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground shadow-lg">
              Bu çapta fiyatı bilinen istasyon yok.
            </div>
          ) : null}

          </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
