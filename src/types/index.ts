export interface Company {
  name: string
  logo: string
  phone: string
  website: string
  prices: PriceGroup[]
  discounts: Discount[]
}

export interface Price {
  kwh: number | string
  price: number
}

export interface PriceGroup {
  ac: Price[]
  dc: Price[]
}

export interface Discount {
  starts_at: string
  ends_at: string
  discount_rate?: number
  discounted_prices?: PriceGroup
  cars?: string[]
  url?: string
  text?: string
}

export interface DiscountWithCompany extends Discount {
  company: Company
}

export type DiscountStatus = "current" | "soon" | "passed"

export type ChargingPort = "AC" | "DC"

export type SortOption = "ac-lowest" | "ac-highest" | "dc-lowest" | "dc-highest"

export interface FilterState {
  status: DiscountStatus | "all"
  chargingPort: ChargingPort | "all"
  carManufacturer: string | "all"
  sortBy: SortOption
  powerRange: string | "all"
}

export interface BatteryOption {
  label: string
  battery: number
} 