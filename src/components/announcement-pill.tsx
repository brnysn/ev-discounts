"use client"

import { useState, useEffect } from "react"
import { ChargingPort, Company, Price } from "@/types"
import { calculateDiscountedPrice, getDiscountStatus, getPrice } from "@/lib/discount-utils"
import { Badge } from "@/components/ui/badge"

interface AnnouncementPillProps {
  companies: Company[]
  chargingPort?: ChargingPort
  selectedPowerRange?: string
}

export function AnnouncementPill({ 
  companies, 
  chargingPort = "DC",
  selectedPowerRange 
}: AnnouncementPillProps) {
  const [bestDeal, setBestDeal] = useState<{
    company: string
    price: number
    powerRange: string
  } | null>(null)

  useEffect(() => {
    if (!companies.length) return

    let lowestPrice = Infinity
    let cheapestCompany = ""
    let bestPowerRange = ""

    companies.forEach((company) => {
      // Get base price for each power range
      const prices = company.prices[0]
      const powerRanges = chargingPort === "AC" 
        ? prices.ac.map((p: Price) => p.kwh.toString())
        : prices.dc.map((p: Price) => p.kwh.toString())
      
      powerRanges.forEach((range: string) => {
        // Get base price for this range
        const basePrice = getPrice(company.prices[0], chargingPort, range)
        
        // Check if there's any current discount
        let cheapestPrice = basePrice
        
        if (company.discounts) {
          company.discounts.forEach((discount) => {
            const status = getDiscountStatus(discount.starts_at, discount.ends_at)
            
            if (status === "current") {
              let discountedPrice: number
              
              if (discount.discount_rate) {
                discountedPrice = calculateDiscountedPrice(basePrice, discount.discount_rate)
              } else if (discount.discounted_prices) {
                discountedPrice = getPrice(discount.discounted_prices, chargingPort, range)
              } else {
                discountedPrice = basePrice
              }
              
              if (discountedPrice < cheapestPrice) {
                cheapestPrice = discountedPrice
              }
            }
          })
        }
        
        if (cheapestPrice < lowestPrice) {
          lowestPrice = cheapestPrice
          cheapestCompany = company.name
          bestPowerRange = range
        }
      })
    })

    if (cheapestCompany) {
      setBestDeal({
        company: cheapestCompany,
        price: lowestPrice,
        powerRange: bestPowerRange
      })
    }
  }, [companies, chargingPort, selectedPowerRange])

  if (!bestDeal) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <Badge variant="outline" className="bg-white shadow-lg px-4 py-2 text-base rounded-full">
        🔥 Bugünün en iyi {chargingPort} fiyatı: <span className="text-green-600 font-bold">{bestDeal.price.toFixed(2)}</span> - {bestDeal.company}
      </Badge>
    </div>
  )
} 