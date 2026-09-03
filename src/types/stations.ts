export interface StationSocketGroup {
  kind: "ac" | "dc"
  kw: number
  count: number
}

export interface StationRecord {
  id: string
  name: string
  lat: number
  lng: number
  brand: string
  operator: string
  address: string
  city: string
  district?: string
  public: boolean
  green: boolean
  ac: number
  dc: number
  maxKw: number
  groups?: StationSocketGroup[]
}

export interface StationSnapshot {
  updatedAt: string
  source: "epdk" | "ibb-epdk"
  sourceLabel: string
  stations: StationRecord[]
}

export interface OperatorMapEntry {
  name: string
  brands: string[]
  unvanIncludes: string[]
}

export interface OperatorMapFile {
  companies: OperatorMapEntry[]
}

export interface StationBankDeal {
  name: string
  logo: string
  title: string
  description: string
  percent: number
  oldPrice: number
  newPrice: number
  detailsUrl?: string
}

export interface StationPortPrice {
  original: number
  networkPrice: number
  discounted: number
  hasCampaign: boolean
  campaignName?: string
  bankDeals: StationBankDeal[]
}

export interface StationCompanyOffer {
  companyName: string
  logo: string
  website: string
  slug: string
  ac?: StationPortPrice
  dc?: StationPortPrice
}
