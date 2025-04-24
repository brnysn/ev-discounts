"use client"

import { format, addDays, parseISO, isSameDay } from "date-fns"
import { tr } from "date-fns/locale"
import { DiscountWithCompany, Company, ChargingPort } from "@/types"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useDiscountCalculator } from "@/hooks/useDiscountCalculator"
import { TriangleAlert } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Helper components
interface PriceDisplayProps {
  prices: Array<{kwh: string | number, price: number}>
  type: ChargingPort
  company: Company
  discount: DiscountWithCompany
}

function PriceDisplay({ prices, type, company, discount }: PriceDisplayProps) {
  const { getPrice, calculateDiscountedPrice, calculateDiscountRate } = useDiscountCalculator({});

  if (!prices.length) return <span className="text-[10px] text-muted-foreground">-</span>
  
  // Just show the first price to save space
  const firstPrice = prices[0]
  const originalPrice = getPrice(company.prices[0], type, firstPrice.kwh.toString())
  let discountedPrice = originalPrice

  // Calculate discounted price based on discount type
  if (discount.discount_rate) {
    discountedPrice = calculateDiscountedPrice(originalPrice, discount.discount_rate)
  } else if (discount.discounted_prices) {
    // Get the first price from discounted_prices for this type
    const discountedTypePrices = discount.discounted_prices[type.toLowerCase() as keyof typeof discount.discounted_prices]
    if (discountedTypePrices && discountedTypePrices.length > 0) {
      // Find matching kwh range or use first price if no match
      const matchingPrice = discountedTypePrices.find((p: { kwh: string | number, price: number }) => p.kwh === firstPrice.kwh) || discountedTypePrices[0]
      discountedPrice = matchingPrice.price
    }
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

interface TimelineProps {
  discounts: DiscountWithCompany[]
}

export function Timeline({ discounts }: TimelineProps) {
  // Generate the next 7 days for the timeline and set first day to start of current day
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to beginning of day for consistent calculations
  const days = Array.from({ length: 5 }, (_, i) => addDays(today, i))
  
  // Filter only active and upcoming discounts
  const activeAndUpcomingDiscounts = discounts.filter(discount => {
    const endDate = parseISO(discount.ends_at)
    const isEndDateToday = isSameDay(endDate, today)
    
    // Create a copy for comparison, preserving the original time
    const compareEndDate = new Date(endDate)
    
    // Check if endDate has already passed (including time)
    const now = new Date()
    
    // If the end date is today and the end time has passed, exclude this discount
    if (isEndDateToday && now > endDate) {
      return false
    }
    
    // If the end date is before today, exclude this discount
    if (compareEndDate < today && !isEndDateToday) {
      return false
    }
    
    return true
  })

  // Don't render the timeline if there are no active or upcoming discounts
  if (activeAndUpcomingDiscounts.length === 0) {
    return null
  }

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
            const endHour = endDate.getHours()
            const endMinute = endDate.getMinutes()
            const isEndDateToday = isSameDay(endDate, today)
            const isLastDay = isSameDay(endDate, days[days.length - 1])
            
            // Handle special cases for end times
            if (endHour === 23 && endMinute === 59 && isEndDateToday && !isLastDay) {
              // For 23:59 end time, extend to next day
              endDate.setDate(endDate.getDate() + 1)
              endDate.setHours(0, 0, 0, 0)
            } else if (endHour > 0) {
              // For partial days (like 12:00), keep the same day but add 0.5 to the width calculation later
              // Do NOT reset hours here to preserve the time information
            } else {
              // Default case for 00:00 - normalize to start of day
              endDate.setHours(0, 0, 0, 0)
            }
            
            // Calculate the day index (0-7) for start and end dates
            let startDayIndex = -1
            let endDayIndex = -1
            
            // Find exact day indexes by comparing with our day array
            for (let i = 0; i < days.length; i++) {
              // Only compare the date part (year, month, day) ignoring time
              if (isSameDay(startDate, days[i])) {
                startDayIndex = i
              }
              
              const dateOnly = new Date(endDate)
              dateOnly.setHours(0, 0, 0, 0)
              
              // For end dates, we need to use the date part for day index calculation
              if (isSameDay(dateOnly, days[i])) {
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
              // Width is the number of days between start and end
              widthDays = endDayIndex - (startDayIndex === -1 ? 0 : startDayIndex)
              
              // Add partial day for mid-day end times (like 12:00)
              if (endDate.getHours() > 0) {
                // Scale by time of day (12:00 = 0.5, etc.)
                const fractionOfDay = endDate.getHours() / 24
                
                // For 12:00, we want exactly half a day
                if (endDate.getHours() === 12 && endDate.getMinutes() === 0) {
                  widthDays += 0.5
                } else {
                  // For other times, calculate proportionally
                  // Apply partial width for same day or multi-day discounts
                  if (widthDays === 0) {
                    // For same day discounts, use at least the fraction of the day
                    widthDays = Math.max(0.25, fractionOfDay)
                  } else {
                    // For multi-day discounts, add the partial day
                    widthDays += fractionOfDay
                  }
                }
              }
            }
            
            // Ensure minimum width and convert to percentage
            const width = (Math.max(0.25, widthDays) / 4) * 100
            
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
                <Card className="overflow-hidden h-12 sm:h-14 border-l-4 shadow-sm hover:shadow my-2 cursor-pointer" 
                  style={{ 
                    borderLeftColor: getColorForDiscount(discount.company.name),
                    width: '100%'
                  }}
                  onClick={() => {
                    const element = document.getElementById(`discount-${discount.company.name.toLowerCase().replace(/\s+/g, '-')}`)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
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
                        unoptimized
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

                    {discount.text && (
                      <>
                        {/* Check if discount ends today or tomorrow */}
                        {(() => {
                          const endDate = parseISO(discount.ends_at)
                          const isEndDateToday = isSameDay(endDate, today)
                          const isEndDateTomorrow = isSameDay(endDate, addDays(today, 1))
                          
                          // Don't show text if ends today or tomorrow
                          if (isEndDateToday || isEndDateTomorrow) return null
                          
                          return (
                            <>
                              {/* Warning icon with popover - visible on all screens */}
                              <div className="block">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button 
                                      className="p-1 hover:bg-gray-100 rounded-full"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <TriangleAlert className="h-4 w-4 text-yellow-500" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 p-4">
                                    <p className="text-sm">{discount.text}</p>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </>
                          )
                        })()}
                      </>
                    )}
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