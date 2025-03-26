import { ChargingPort, Discount, DiscountStatus, PriceGroup } from "@/types"

// Calculate the discount percentage based on original price and discounted price
export const calculateDiscountRate = (originalPrice: number, discountedPrice: number): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

// Calculate discounted price based on original price and discount rate
export const calculateDiscountedPrice = (originalPrice: number, discountRate: number): number => {
  return originalPrice * (1 - discountRate / 100)
}

// Get the discount status based on dates
export const getDiscountStatus = (startsAt: string, endsAt: string): DiscountStatus => {
  const now = new Date()
  const startDate = new Date(startsAt)
  const endDate = new Date(endsAt)
  
  if (now >= startDate && now <= endDate) {
    return "current"
  } else if (now < startDate) {
    return "soon"
  } else {
    return "passed"
  }
}

// Extract unique car manufacturers from all discounts
export const extractCarManufacturers = (discounts: Discount[]): string[] => {
  const manufacturers = new Set<string>()
  
  discounts.forEach(discount => {
    if (discount.cars) {
      discount.cars.forEach(car => manufacturers.add(car))
    }
  })
  
  return Array.from(manufacturers)
}

// Get the price based on charging port and possibly DC charging speed
export const getPrice = (prices: PriceGroup, chargingPort: ChargingPort, powerRange?: string): number => {
  if (chargingPort === "AC") {
    // For AC, return the price of the first power range if no specific range is requested
    if (!powerRange || !prices.ac.length) return prices.ac[0]?.price || 0
    const acPrice = prices.ac.find(p => p.kwh.toString() === powerRange)
    return acPrice?.price || prices.ac[0]?.price || 0
  } else {
    // For DC, return the price of the first power range if no specific range is requested
    if (!powerRange || !prices.dc.length) return prices.dc[0]?.price || 0
    const dcPrice = prices.dc.find(p => p.kwh === powerRange)
    return dcPrice?.price || prices.dc[0]?.price || 0
  }
}

export function getPowerRanges(prices: PriceGroup, chargingPort: ChargingPort) {
  if (chargingPort === "AC") {
    return prices.ac.map(p => p.kwh.toString())
  } else {
    return prices.dc.map(p => p.kwh)
  }
} 