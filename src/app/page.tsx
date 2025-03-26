"use client"

import { useState, useEffect, useRef } from "react"
import { DiscountFilters } from "@/components/discount-filters"
import { DiscountCard } from "@/components/discount-card"
import { ChargingPort, DiscountWithCompany, PriceGroup, FilterState } from "@/types"
import type { Company } from "@/types"
import data from "./data/data.json"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { AnnouncementPill } from "@/components/announcement-pill"
import { PriceTables } from "@/components/price-tables"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [selectedPowerRange, setSelectedPowerRange] = useState<string>("all")
  const [filteredDiscounts, setFilteredDiscounts] = useState<DiscountWithCompany[]>([])
  const [activeChargingPort, setActiveChargingPort] = useState<ChargingPort>("DC")

  // Add refs for scrolling
  const campaignsRef = useRef<HTMLDivElement>(null);
  const pricesRef = useRef<HTMLDivElement>(null);
  
  // Functions to scroll to sections with offset to account for sticky header
  const scrollToCampaigns = () => {
    if (campaignsRef.current) {
      const yOffset = -80; // header height plus some padding
      const y = campaignsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  
  const scrollToPrices = () => {
    if (pricesRef.current) {
      const yOffset = -80; // header height plus some padding
      const y = pricesRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Collect all discounts with their company information
    const initialDiscounts = (data as Company[]).flatMap((company) =>
      company.discounts.map((discount) => ({
        ...discount,
        company,
      }))
    );
    
    // Sort discounts: active first, then upcoming, then expired
    initialDiscounts.sort((a, b) => {
      const nowDate = new Date();
      const aStartDate = new Date(a.starts_at);
      const aEndDate = new Date(a.ends_at);
      const bStartDate = new Date(b.starts_at);
      const bEndDate = new Date(b.ends_at);
      
      // Check discount status
      const aIsActive = nowDate >= aStartDate && nowDate <= aEndDate;
      const bIsActive = nowDate >= bStartDate && nowDate <= bEndDate;
      const aIsUpcoming = nowDate < aStartDate;
      const bIsUpcoming = nowDate < bStartDate;
      
      // Active discounts first
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      
      // Both are in the same status category
      if (aIsActive === bIsActive) {
        // If both are upcoming, upcoming with earliest start date first
        if (aIsUpcoming && bIsUpcoming) {
          // Sort by start date (ascending)
          return aStartDate.getTime() - bStartDate.getTime();
        }
        
        // Upcoming before expired
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
      }
      
      // Default sorting: by company name
      return a.company.name.localeCompare(b.company.name);
    });
    
    setFilteredDiscounts(initialDiscounts);
  }, [])

  const calculateDiscountedPrice = (price: number, discountRate?: number) => {
    if (!discountRate) return price;
    return price * (1 - discountRate / 100);
  }

  const applyFilters = (filterState: FilterState) => {
    setSelectedPowerRange(filterState.powerRange);
    if (filterState.chargingPort !== "all") {
      setActiveChargingPort(filterState.chargingPort);
    }

    let filteredDiscounts = (data as Company[]).flatMap((company) =>
      company.discounts.map((discount) => ({
        ...discount,
        company,
      }))
    );

    if (filterState.chargingPort !== "all") {
      filteredDiscounts = filteredDiscounts.filter((discount) => {
        const prices = discount.discounted_prices || discount.company.prices[0];
        return prices[filterState.chargingPort.toLowerCase() as keyof PriceGroup].length > 0;
      });
    }

    if (filterState.powerRange !== "all") {
      filteredDiscounts = filteredDiscounts.filter((discount) => {
        const prices = discount.discounted_prices || discount.company.prices[0];
        const chargeType = filterState.chargingPort.toLowerCase() as keyof PriceGroup;
        return prices[chargeType].some((price) => price.kwh.toString() === filterState.powerRange);
      });
    }

    // Sort the discounts - active first, then upcoming sorted by DC price (lowest to highest)
    filteredDiscounts.sort((a, b) => {
      const nowDate = new Date();
      const aStartDate = new Date(a.starts_at);
      const aEndDate = new Date(a.ends_at);
      const bStartDate = new Date(b.starts_at);
      const bEndDate = new Date(b.ends_at);
      
      // Check if discount is active (current date is between start and end date)
      const aIsActive = nowDate >= aStartDate && nowDate <= aEndDate;
      const bIsActive = nowDate >= bStartDate && nowDate <= bEndDate;
      
      // Check if discount is upcoming (current date is before start date)
      const aIsUpcoming = nowDate < aStartDate;
      const bIsUpcoming = nowDate < bStartDate;
      
      // First sort by status: active first, then upcoming, then expired
      if (aIsActive && !bIsActive) return -1; // a is active, b is not -> a comes first
      if (!aIsActive && bIsActive) return 1;  // b is active, a is not -> b comes first

      // If both are active or both are not active...
      if (aIsActive === bIsActive) {
        // If both are upcoming, sort by DC price
        if (aIsUpcoming && bIsUpcoming) {
          const pricesA = a.discounted_prices || a.company.prices[0];
          const pricesB = b.discounted_prices || b.company.prices[0];
          const chargeType = "dc" as keyof PriceGroup;
          
          // Get the lowest DC price for each discount
          const getPriceForDiscount = (prices: PriceGroup, discount?: { discount_rate?: number }): number => {
            if (!prices[chargeType].length) return Infinity;
            
            // Find the lowest price among all DC options
            let lowestPrice = Infinity;
            for (const priceOption of prices[chargeType]) {
              const effectivePrice = calculateDiscountedPrice(priceOption.price, discount?.discount_rate);
              if (effectivePrice < lowestPrice) {
                lowestPrice = effectivePrice;
              }
            }
            return lowestPrice;
          };
          
          const lowestPriceA = getPriceForDiscount(pricesA, a);
          const lowestPriceB = getPriceForDiscount(pricesB, b);
          
          return lowestPriceA - lowestPriceB; // Low to high
        }
        
        // If one is upcoming and one is expired, upcoming comes first
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
      }
      
      // For other cases (both active or both expired), use sort by DC price
      const pricesA = a.discounted_prices || a.company.prices[0];
      const pricesB = b.discounted_prices || b.company.prices[0];
      const chargeType = "dc" as keyof PriceGroup;
      
      // Get the lowest price for each
      const lowestPriceA = getLowestPrice(pricesA, a, chargeType);
      const lowestPriceB = getLowestPrice(pricesB, b, chargeType);
      
      return lowestPriceA - lowestPriceB; // Low to high
    });
    
    // Helper function to get lowest price
    function getLowestPrice(prices: PriceGroup, discount: DiscountWithCompany, chargeType: keyof PriceGroup): number {
      if (!prices[chargeType].length) return Infinity;
      
      let lowestPrice = Infinity;
      for (const priceOption of prices[chargeType]) {
        const effectivePrice = calculateDiscountedPrice(priceOption.price, discount?.discount_rate);
        if (effectivePrice < lowestPrice) {
          lowestPrice = effectivePrice;
        }
      }
      return lowestPrice;
    }

    setFilteredDiscounts(filteredDiscounts);
  };

  // Add scroll padding to HTML when component mounts
  useEffect(() => {
    // Add scroll-padding to ensure sections aren't hidden under sticky header
    document.documentElement.style.scrollPaddingTop = '80px';
    
    // Clean up when component unmounts
    return () => {
      document.documentElement.style.scrollPaddingTop = '0';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Şarj Kampanya</h1>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                onClick={scrollToCampaigns}
                className="font-medium"
              >
                Kampanyalar
              </Button>
              <Button 
                variant="ghost" 
                onClick={scrollToPrices}
                className="font-medium"
              >
                Fiyatlar
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 pt-4" ref={campaignsRef}>
          <h2 className="text-2xl font-bold mb-2">Kampanyalar</h2>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Çeşitli sağlayıcılardan en iyi elektrikli araç şarj kampanyalarını bulun ve karşılaştırın
            </p>
          </div>
        </div>

        <DiscountFilters
          onChange={applyFilters}
        />
         
        {filteredDiscounts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Kampanya bulunamadı</h3>
            <p className="text-muted-foreground">
              Filtrelerinizi değiştirmeyi deneyin veya yeni teklifler için daha sonra tekrar kontrol edin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDiscounts.map((discount, index) => (
              <DiscountCard
                key={`${discount.company.name}-${index}`}
                company={discount.company}
                discount={discount}
              />
            ))}
          </div>
        )}

        <div className="mt-12 pt-4" ref={pricesRef}>
          <h2 className="text-2xl font-bold mb-8">Fiyat Karşılaştırması</h2>
          <PriceTables data={data as Company[]} />
        </div>
      </main>
       
      <footer className="bg-white py-8 border-t mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold text-center mb-6">
            Elektrikli araç şarj firmaları
          </h2>
          <InfiniteSlider 
            gap={24} 
            duration={25}
            durationOnHover={40}
            className="w-full h-full bg-white"
          >
            {data.map((company) => (
              <Image
                key={company.name}
                src={company.logo}
                alt={company.name}
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
            ))}
          </InfiniteSlider>
          <div className="text-center text-muted-foreground text-sm mt-8">
            © {new Date().getFullYear()} EV Kampanyaları. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
       
      <AnnouncementPill 
        companies={data} 
        chargingPort={activeChargingPort}
        selectedPowerRange={selectedPowerRange}
      />
    </div>
  );
}
