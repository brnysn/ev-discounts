"use client"

import { useState, useEffect, useRef } from "react"
import { DiscountFilters } from "@/components/discount-filters"
import { DiscountCard } from "@/components/discount-card"
import { Timeline } from "@/components/timeline"
import { ChargingPort, DiscountWithCompany, PriceGroup, FilterState, BatteryOption } from "@/types"
import type { Company } from "@/types"
import data from "./data/data.json"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { AnnouncementPill } from "@/components/announcement-pill"
import { PriceTables } from "@/components/price-tables"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useDiscountCalculator } from "@/hooks/useDiscountCalculator"

export default function Home() {
  const [selectedPowerRange, setSelectedPowerRange] = useState<string>("all")
  const [filteredDiscounts, setFilteredDiscounts] = useState<DiscountWithCompany[]>([])
  const [activeChargingPort, setActiveChargingPort] = useState<ChargingPort>("DC")
  const [selectedBattery, setSelectedBattery] = useState<BatteryOption | null>({
    label: 'T10X Uzun',
    battery: 88.5
  })

  // Add refs for scrolling
  const campaignsRef = useRef<HTMLDivElement>(null);
  const pricesRef = useRef<HTMLDivElement>(null);
  
  const { sortDiscounts } = useDiscountCalculator({
    discounts: filteredDiscounts,
    chargingPort: activeChargingPort,
    powerRange: selectedPowerRange
  });
  
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
    
    setFilteredDiscounts(sortDiscounts(initialDiscounts));
  }, [sortDiscounts])

  // Calculate savings for selected battery
  const calculateSavings = (originalPrice: number, discountedPrice: number) => {
    if (!selectedBattery) return null;
    const priceDifference = originalPrice - discountedPrice;
    return priceDifference * selectedBattery.battery;
  }

  const handleBatteryChange = (battery: BatteryOption) => {
    if (selectedBattery?.label === battery.label) {
      setSelectedBattery(null);
    } else {
      setSelectedBattery(battery);
    }
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

    // Filter by status
    if (filterState.status !== "all") {
      const now = new Date();
      filteredDiscounts = filteredDiscounts.filter((discount) => {
        const startDate = new Date(discount.starts_at);
        const endDate = new Date(discount.ends_at);
        
        switch (filterState.status) {
          case "current":
            return now >= startDate && now <= endDate;
          case "soon":
            return now < startDate;
          case "passed":
            return now > endDate;
          default:
            return true;
        }
      });
    }

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

    setFilteredDiscounts(sortDiscounts(filteredDiscounts));
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
            <h1 className="text-2xl font-bold ml-4">Şarj Kampanya</h1>
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
        <Timeline discounts={filteredDiscounts} />
        
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
          selectedBattery={selectedBattery}
          onBatteryChange={handleBatteryChange}
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
                selectedBattery={selectedBattery}
                calculateSavings={calculateSavings}
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
          <div className="flex justify-center mb-8">
            <a href="https://t.me/ToggSahipleri" target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/easahipleri.jpg"
                alt="Elektrikli Araç Sahipleri"
                width={80}
                height={80}
                className="rounded-full"
              />
            </a>
          </div>
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
