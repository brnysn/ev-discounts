"use client"

import { ChargingPort, Company } from "@/types"
import { Badge } from "@/components/ui/badge"
import { useDiscountCalculator } from "@/hooks/useDiscountCalculator"

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
  const { getBestDeal } = useDiscountCalculator({
    companies,
    chargingPort,
    powerRange: selectedPowerRange
  });

  if (!getBestDeal) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-bounce w-[calc(100%-2rem)] max-w-screen-sm">
      <Badge variant="outline" className="bg-white shadow-lg hover:shadow-xl px-4 py-2 text-base rounded-full transition-shadow w-full flex justify-center">
        🔥 En ucuz {chargingPort}: <span className="text-green-600 font-bold mx-1">₺{getBestDeal.price.toFixed(2)}</span> - {getBestDeal.company}
      </Badge>
    </div>
  )
} 