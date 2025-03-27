"use client"

import { Company, Discount, BatteryOption } from "@/types"
import { calculateDiscountRate, calculateDiscountedPrice, getDiscountStatus, getPrice, getPowerRanges } from "@/lib/discount-utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/ui/alert"
import { TriangleAlert, Battery } from "lucide-react"

interface DiscountCardProps {
  company: Company
  discount: Discount
  selectedBattery: BatteryOption | null
  calculateSavings: (originalPrice: number, discountedPrice: number) => number | null
}

export function DiscountCard({ company, discount, selectedBattery, calculateSavings }: DiscountCardProps) {
  const status = getDiscountStatus(discount.starts_at, discount.ends_at)
  
  // Format dates in human-readable Turkish format
  const formatDateInTurkish = (dateString: string): string => {
    const date = new Date(dateString);
    
    // Get day, month name and year
    const day = date.getDate();
    
    // Turkish month names
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };
  
  const startDate = formatDateInTurkish(discount.starts_at);
  const endDate = formatDateInTurkish(discount.ends_at);
  
  // Get badge styles based on status
  const getBadgeVariant = () => {
    switch (status) {
      case "current":
        return "default" as const
      case "passed":
        return "destructive" as const
      case "soon":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }
  
  // Format a savings value as Turkish Lira
  const formatSavings = (savings: number | null) => {
    if (savings === null) return null;
    return `₺${savings.toFixed(2)}`;
  };
  
  // Calculate and format prices
  const renderPrices = () => {
    const acPowerRanges = getPowerRanges(company.prices[0], "AC")
    const dcPowerRanges = getPowerRanges(company.prices[0], "DC")
    
    // Check if there are any AC discounts
    const hasAcDiscounts = acPowerRanges.some((range: string | number) => {
      const originalPrice = getPrice(company.prices[0], "AC", range.toString())
      let discountedPrice = originalPrice

      if (discount.discount_rate) {
        discountedPrice = calculateDiscountedPrice(originalPrice, discount.discount_rate)
      } else if (discount.discounted_prices) {
        discountedPrice = getPrice(discount.discounted_prices, "AC", range.toString())
      }

      const discountRate = calculateDiscountRate(originalPrice, discountedPrice)
      return discountRate > 0
    })

    // Check if there are any DC discounts
    const hasDcDiscounts = dcPowerRanges.some((range: string | number) => {
      const originalPrice = getPrice(company.prices[0], "DC", range.toString())
      let discountedPrice = originalPrice

      if (discount.discount_rate) {
        discountedPrice = calculateDiscountedPrice(originalPrice, discount.discount_rate)
      } else if (discount.discounted_prices) {
        discountedPrice = getPrice(discount.discounted_prices, "DC", range.toString())
      }

      const discountRate = calculateDiscountRate(originalPrice, discountedPrice)
      return discountRate > 0
    })

    // If no discounts at all, show a message
    if (!hasAcDiscounts && !hasDcDiscounts) {
      return (
        <div className="mt-4 text-center text-muted-foreground">
          Aktif kampanya bulunmamaktadır
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {/* Always show AC prices */}
        <div className="flex flex-col space-y-1">
          <div className="text-xs text-muted-foreground">AC</div>
          {acPowerRanges.map((range: string | number) => {
            const originalPrice = getPrice(company.prices[0], "AC", range.toString())
            let discountedPrice = originalPrice

            if (discount.discount_rate) {
              discountedPrice = calculateDiscountedPrice(originalPrice, discount.discount_rate)
            } else if (discount.discounted_prices) {
              discountedPrice = getPrice(discount.discounted_prices, "AC", range.toString())
            }

            const discountRate = calculateDiscountRate(originalPrice, discountedPrice)
            const savings = calculateSavings(originalPrice, discountedPrice);

            return (
              <div key={range} className="flex flex-col">
                <div className="text-xs text-muted-foreground">{range} kWh</div>
                <div className="flex items-center space-x-2">
                  {discountRate > 0 ? (
                    // Show discounted price with original price strikethrough when there's a discount
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500 line-through text-sm">₺{originalPrice.toFixed(2)}</span>
                      <span className="text-lg font-bold text-green-600">₺{discountedPrice.toFixed(2)}</span>
                    </div>
                  ) : (
                    // Show only original price when there's no discount
                    <span className="text-lg font-bold">₺{originalPrice.toFixed(2)}</span>
                  )}
                  
                  {discountRate > 0 && (
                    <Badge className={cn("h-5 px-1 text-xs", getBadgeColorByDiscountRate(discountRate))}>
                      %{discountRate}
                    </Badge>
                  )}
                </div>
                {selectedBattery && discountRate > 0 && (
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <Battery className="size-3 mr-1" />
                    <span>Tasarruf: {formatSavings(savings)}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Show DC prices when there are discounts */}
        {hasDcDiscounts && (
          <div className="flex flex-col space-y-1">
            <div className="text-xs text-muted-foreground">DC</div>
            {dcPowerRanges.map((range: string | number) => {
              const originalPrice = getPrice(company.prices[0], "DC", range.toString())
              let discountedPrice = originalPrice

              if (discount.discount_rate) {
                discountedPrice = calculateDiscountedPrice(originalPrice, discount.discount_rate)
              } else if (discount.discounted_prices) {
                discountedPrice = getPrice(discount.discounted_prices, "DC", range.toString())
              }

              const discountRate = calculateDiscountRate(originalPrice, discountedPrice)
              const savings = calculateSavings(originalPrice, discountedPrice);

              // Skip if no discount for DC
              if (discountRate <= 0) return null

              return (
                <div key={range} className="flex flex-col">
                  <div className="text-xs text-muted-foreground">{range} kWh</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500 line-through text-sm">₺{originalPrice.toFixed(2)}</span>
                      <span className="text-lg font-bold text-green-600">₺{discountedPrice.toFixed(2)}</span>
                    </div>
                    <Badge className={cn("h-5 px-1 text-xs", getBadgeColorByDiscountRate(discountRate))}>
                      %{discountRate}
                    </Badge>
                  </div>
                  {selectedBattery && (
                    <div className="flex items-center mt-1 text-xs text-green-600">
                      <Battery className="size-3 mr-1" />
                      <span>Tasarruf: {formatSavings(savings)}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
  
  // Helper function to determine badge color based on discount rate
  const getBadgeColorByDiscountRate = (discountRate: number): string => {
    if (discountRate >= 60) {
      return "bg-green-100 text-green-800";
    } else if (discountRate >= 30) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-orange-100 text-orange-800";
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Image 
            src={company.logo} 
            alt={company.name}
            width={48}
            height={48}
            className="h-12 w-auto object-contain"
          />
          <Badge 
            variant={getBadgeVariant()}
            className={cn(
              status === "current" && "bg-green-400 hover:bg-green-400/90",
              status === "soon" && "bg-yellow-400 hover:bg-yellow-400/90",
              status === "passed" && "bg-gray-400 hover:bg-gray-400/90",
            )}
          >
            {status === "current" ? "Aktif" : status === "soon" ? "Yakında" : "Süresi Doldu"}
          </Badge>
        </div>
        <h3 className="font-bold text-lg">{company.name}</h3>
        <div className="text-xs text-muted-foreground">
          {startDate} - {endDate}
        </div>
        
        {discount.cars && discount.cars.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {discount.cars.map((car) => (
              <Badge key={car} variant="outline" className="text-xs">
                {car}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow">
        {discount.text && (
          <Alert
            className="mb-3"
            layout="row"
            variant="warning"
            icon={<TriangleAlert className="opacity-60" size={16} strokeWidth={2} />}
          >
            <p className="text-sm">{discount.text}</p>
          </Alert>
        )}
        {renderPrices()}
      </CardContent>
      
      <CardFooter className="pt-0 hidden sm:block">
        <TooltipProvider>
          <div className="w-full flex justify-center items-center">
            {discount.url ? (
              <Button asChild>
                <Link href={discount.url} target="_blank" rel="noopener noreferrer">
                  <span className="text-xs">Teklifi Gör</span>
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={company.website} target="_blank" rel="noopener noreferrer">
                  <span className="text-xs">Detaylı Bilgi</span>
                </Link>
              </Button>
            )}
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
} 