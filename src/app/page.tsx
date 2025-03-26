"use client"

import { useState, useEffect } from "react"
import { Filter, FilterType } from "@/components/ui/filters"
import { DiscountFilters } from "@/components/discount-filters"
import { DiscountCard } from "@/components/discount-card"
import { getDiscountStatus, extractCarManufacturers } from "@/lib/discount-utils"
import { ChargingPort, DiscountWithCompany, PriceGroup, FilterState, SortOption } from "@/types"
import type { Company } from "@/types"
import data from "./data/data.json"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { AnnouncementPill } from "@/components/announcement-pill"
import { PriceTables } from "@/components/price-tables"

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedChargePort, setSelectedChargePort] = useState<ChargingPort | "all">("DC")
  const [selectedPowerRange, setSelectedPowerRange] = useState<string>("all")
  const [selectedSort, setSelectedSort] = useState<SortOption>("ac-lowest")
  const [filteredDiscounts, setFilteredDiscounts] = useState<DiscountWithCompany[]>([])
  const [activeChargingPort, setActiveChargingPort] = useState<ChargingPort>("DC")

  // Extract unique car manufacturers
  const allCarManufacturers = extractCarManufacturers(
    (data as Company[]).flatMap(company => company.discounts)
  )

  useEffect(() => {
    const initialDiscounts = (data as Company[]).flatMap((company) =>
      company.discounts.map((discount) => ({
        ...discount,
        company,
      }))
    )
    setFilteredDiscounts(initialDiscounts)
  }, [])

  const calculateDiscountedPrice = (price: number, discountRate?: number) => {
    if (!discountRate) return price;
    return price * (1 - discountRate / 100);
  }

  const applyFilters = (filterState: FilterState) => {
    setSelectedStatus(filterState.status);
    setSelectedChargePort(filterState.chargingPort);
    setSelectedPowerRange(filterState.powerRange);
    setSelectedSort(filterState.sortBy);
    if (filterState.chargingPort !== "all") {
      setActiveChargingPort(filterState.chargingPort);
    }

    let filteredDiscounts = (data as Company[]).flatMap((company) =>
      company.discounts.map((discount) => ({
        ...discount,
        company,
      }))
    );

    if (filterState.status !== "all") {
      filteredDiscounts = filteredDiscounts.filter((discount) => {
        const now = new Date();
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

    // Sort the discounts
    filteredDiscounts.sort((a, b) => {
      const pricesA = a.discounted_prices || a.company.prices[0];
      const pricesB = b.discounted_prices || b.company.prices[0];
      const chargeType = filterState.chargingPort.toLowerCase() as keyof PriceGroup;
      const powerRange = filterState.powerRange || (chargeType === "ac" ? "11" : "< 50");

      const getPriceForRange = (prices: PriceGroup, discount?: { discount_rate?: number }) => {
        const price = prices[chargeType].find((p) => p.kwh.toString() === powerRange);
        if (!price) return Infinity;
        return calculateDiscountedPrice(price.price, discount?.discount_rate);
      };

      const priceA = getPriceForRange(pricesA, a);
      const priceB = getPriceForRange(pricesB, b);

      const isAscending = filterState.sortBy.endsWith("lowest");
      return isAscending ? priceA - priceB : priceB - priceA;
    });

    setFilteredDiscounts(filteredDiscounts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-center">Elektrikli Araç Şarj Kampanyaları</h1>
          <p className="text-center text-muted-foreground mt-2">
            Elektrikli aracınızı şarj etmek için en iyi fırsatları bulun
          </p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Mevcut Kampanyalar</h2>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Çeşitli sağlayıcılardan en iyi elektrikli araç şarj kampanyalarını bulun ve karşılaştırın
            </p>
          </div>
        </div>

        <DiscountFilters
          carManufacturers={allCarManufacturers}
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
                selectedPowerRange={selectedPowerRange}
              />
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">Fiyat Karşılaştırması</h2>
          <PriceTables data={data as Company[]} />
        </div>
      </main>
       
      <footer className="bg-white py-8 border-t mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold text-center mb-6">
            Elektrikli Araç Şarj Ağı Ortakları
          </h2>
          <InfiniteSlider 
            gap={24} 
            duration={25}
            durationOnHover={40}
            className="w-full h-full bg-white"
          >
            {data.map((company) => (
              <img
                key={company.name}
                src={company.logo}
                alt={company.name}
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
