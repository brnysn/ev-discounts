"use client"

import { format, addDays, parseISO, isSameDay } from "date-fns"
import { tr } from "date-fns/locale"
import { DiscountWithCompany, Company } from "@/types"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getPrice, calculateDiscountedPrice, calculateDiscountRate } from "@/lib/discount-utils"

interface TimelineProps {
  discounts: DiscountWithCompany[]
}

export function Timeline({ discounts }: TimelineProps) {
  // Generate the next 7 days for the timeline and set first day to start of current day
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to beginning of day for consistent calculations
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i))
  
  // Filter only active and upcoming discounts
  const activeAndUpcomingDiscounts = discounts.filter(discount => {
    const endDate = parseISO(discount.ends_at)
    return endDate >= today
  })

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Kampanya Takvimi</h2>
      
      <div className="mb-8 relative">
        {/* Timeline bar */}
        <div className="h-0.5 bg-gray-300 w-full absolute top-8" />
        
        {/* Day markers */}
        <div className="flex justify-between items-start relative">
          {days.map((day, index) => {
            const isToday = isSameDay(day, today)
            
            return (
              <div key={index} className="flex flex-col items-center">
                {/* Day number with marker line */}
                <div className={cn(
                  "relative text-lg font-bold mb-2",
                  isToday && "text-green-600"
                )}>
                  {format(day, "d")}
                  <div className="absolute h-4 w-0.5 bg-gray-400 bottom-[-8px] left-1/2 transform -translate-x-1/2" />
                </div>
                
                {/* Day name and month */}
                <div className="text-xs text-muted-foreground">
                  {format(day, "EEE", { locale: tr })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(day, "MMM", { locale: tr })}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Discount cards */}
        <div className="mt-12 relative" style={{ height: `${Math.max(1, activeAndUpcomingDiscounts.length) * 80}px` }}>
          {activeAndUpcomingDiscounts.map((discount, index) => {
            const startDate = parseISO(discount.starts_at)
            startDate.setHours(0, 0, 0, 0) // Normalize to start of day for calculation
            
            const endDate = parseISO(discount.ends_at)
            // Normalize to start of day for consistent calculation
            endDate.setHours(0, 0, 0, 0)
            
            // Calculate the day index (0-7) for start and end dates
            let startDayIndex = -1
            let endDayIndex = -1
            
            // Find exact day indexes by comparing with our day array
            for (let i = 0; i < days.length; i++) {
              if (startDate.getTime() === days[i].getTime()) {
                startDayIndex = i
              }
              if (endDate.getTime() === days[i].getTime()) {
                endDayIndex = i
              }
            }
            
            // If the start day is before our visible range, set it to the first day
            if (startDayIndex === -1 && startDate < today) {
              startDayIndex = 0
            }
            
            // If dates are not in our visible range, skip this discount
            if (
              (startDayIndex === -1 && startDate > days[6]) || // Start date after visible range
              (endDayIndex === -1 && endDate < today) || // End date before visible range
              (startDayIndex === -1 && endDayIndex === -1) // Neither start nor end date in range
            ) {
              return null
            }
            
            // Calculate position based on day indexes
            const leftPosition = startDayIndex === -1 
              ? 0 // If start date is before visible range, start at 0
              : (startDayIndex / 6) * 100
              
            // Calculate width based on day indexes
            let widthDays = 0
            
            if (endDayIndex === -1) {
              // If end date is beyond visible range, extend to the end
              widthDays = 6 - (startDayIndex === -1 ? 0 : startDayIndex)
            } else {
              // Width is the number of days between start and end (subtract 1 to end exactly on the end date)
              widthDays = endDayIndex - (startDayIndex === -1 ? 0 : startDayIndex)
            }
            
            // Ensure minimum width and convert to percentage
            const width = (Math.max(0.25, widthDays) / 6) * 100
            
            return (
              <div 
                key={index} 
                className="absolute" 
                style={{ 
                  left: `${leftPosition}%`, 
                  width: `${Math.min(width, 100 - leftPosition)}%`, // Prevent overflow to right
                  top: `${index * 75}px`, // Increased vertical space between cards for taller displays
                  maxWidth: '100%'
                }}
              >
                <Card className="overflow-hidden h-12 sm:h-14 border-l-4 shadow-sm hover:shadow my-2" 
                  style={{ 
                    borderLeftColor: getColorForDiscount(discount.company.name),
                    width: '100%'
                  }}
                >
                  <CardContent className="p-1 flex items-center h-full">
                    <div className="shrink-0 mr-3">
                      <Image 
                        src={discount.company.logo} 
                        alt={discount.company.name}
                        width={32}
                        height={32}
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow overflow-hidden">
                      <div className="flex flex-col gap-1">
                        <div className="text-[10px] flex gap-1 items-center">
                          <span className="font-medium">DC:</span>
                          <PriceDisplay 
                            prices={discount.company.prices[0].dc} 
                            type="DC" 
                            company={discount.company}
                            discount={discount}
                          />
                        </div>
                        
                        <div className="text-[10px] flex gap-1 items-center">
                          <span className="font-medium">AC:</span>
                          <PriceDisplay 
                            prices={discount.company.prices[0].ac} 
                            type="AC" 
                            company={discount.company}
                            discount={discount}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Helper components
interface PriceDisplayProps {
  prices: Array<{kwh: string | number, price: number}>
  type: "AC" | "DC"
  company: Company
  discount: DiscountWithCompany
}

function PriceDisplay({ prices, type, company, discount }: PriceDisplayProps) {
  if (!prices.length) return <span className="text-[10px] text-muted-foreground">-</span>
  
  // Just show the first price to save space
  const firstPrice = prices[0]
  const originalPrice = getPrice(company.prices[0], type, firstPrice.kwh.toString())
  let discountedPrice = originalPrice

  // Calculate discounted price based on discount type
  if (discount.discount_rate) {
    discountedPrice = calculateDiscountedPrice(originalPrice, discount.discount_rate)
  } else if (discount.discounted_prices) {
    discountedPrice = getPrice(discount.discounted_prices, type, firstPrice.kwh.toString())
  }

  const discountRate = calculateDiscountRate(originalPrice, discountedPrice)
  
  return (
    <div className="text-[10px] flex items-center gap-1">
      {discountRate > 0 ? (
        <>
          <span className="text-red-500 line-through hidden sm:inline">₺{originalPrice.toFixed(2)}</span>
          <span className="text-green-600 font-bold text-xs sm:text-sm">₺{discountedPrice.toFixed(2)}</span>
          <Badge className={cn("h-4 px-1 text-[8px] hidden sm:inline-flex", getBadgeColorByDiscountRate(discountRate))}>
            %{discountRate}
          </Badge>
        </>
      ) : (
        <span>₺{originalPrice.toFixed(2)}</span>
      )}
    </div>
  )
}

// Helper function to determine badge color based on discount rate
function getBadgeColorByDiscountRate(discountRate: number): string {
  if (discountRate >= 60) {
    return "bg-green-100 text-green-800";
  } else if (discountRate >= 30) {
    return "bg-yellow-100 text-yellow-800";
  } else {
    return "bg-orange-100 text-orange-800";
  }
}

// Generate consistent colors for companies
function getColorForDiscount(companyName: string): string {
  // Simple hash function to get a deterministic color
  const hash = companyName.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)
  
  // List of pleasant colors
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ]
  
  return colors[hash % colors.length]
} 