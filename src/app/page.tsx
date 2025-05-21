"use client"

import { useState, useEffect, useRef } from "react"
import { DiscountFilters } from "@/components/discount-filters"
import { DiscountCard } from "@/components/discount-card"
import { Timeline } from "@/components/timeline"
import { ChargingPort, DiscountWithCompany, PriceGroup, FilterState, BatteryOption } from "@/types"
import type { Company } from "@/types"
import data from "./data/data.json"
import { blogPosts } from "./data/blog-posts"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { AnnouncementPill } from "@/components/announcement-pill"
import { PriceTables } from "@/components/price-tables"
import { Blog } from "@/components/ui/blog"
import Image from "next/image"
import { useDiscountCalculator } from "@/hooks/useDiscountCalculator"
import { CustomNavbar } from "@/components/custom-navbar"
import { FaqSection } from "@/components/faq-section"
import { BankCampaigns } from "@/components/BankCampaigns"

// Add import for HomeHeadTags
import { HomeHeadTags } from "@/components/home-head-tags"

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
  const faqRef = useRef<HTMLDivElement>(null);
  
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
  
  const scrollToFaq = () => {
    if (faqRef.current) {
      const yOffset = -80; // header height plus some padding
      const y = faqRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Load all discounts initially - we'll filter in applyFilters later
    const initialDiscounts = (data as Company[]).flatMap((company) =>
      company.discounts.map((discount) => ({
        ...discount,
        company,
      }))
    );
    
    // Filter out past discounts by default
    const now = new Date();
    const currentAndUpcomingDiscounts = initialDiscounts.filter(discount => {
      const endDate = new Date(discount.ends_at);
      return now <= endDate; // Keep only current and upcoming discounts
    });
    
    setFilteredDiscounts(sortDiscounts(currentAndUpcomingDiscounts));
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
    } else if (!filterState.showPastDiscounts) {
      // If not showing past discounts and no specific status filter is applied
      const now = new Date();
      filteredDiscounts = filteredDiscounts.filter((discount) => {
        const endDate = new Date(discount.ends_at);
        return now <= endDate; // Filter out past discounts
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
      <HomeHeadTags />
      <CustomNavbar 
        scrollFunctions={{
          campaigns: scrollToCampaigns,
          prices: scrollToPrices,
          faq: scrollToFaq
        }}
        menu={[
          { title: "Kampanyalar", url: "#kampanyalar" },
          { title: "Fiyatlar", url: "#fiyatlar" },
          { title: "Blog", url: "/blog" },
          { title: "SSS", url: "#sss" }
        ]}
      />
      
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Elektrikli Araç Şarj Kampanyaları</h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Elektrikli araç şarj istasyonlarının kampanyalarını karşılaştırabileceğiniz güncel ve tarafsız bir platform. Fiyatlar, şarj hızları, istasyon tipleri ve daha fazlasını kolayca filtreleyin. Bu sayede en uygun şarj hizmetine hızlıca ulaşın.
          </p>
        </div>
        {filteredDiscounts.length > 0 && (
          <div className="min-h-[200px] pt-4">
            <Timeline discounts={filteredDiscounts} />
          </div>
        )}
        
        <div className="mb-8 pt-4" ref={campaignsRef} id="kampanyalar">
          <h2 className="text-2xl font-bold mb-2">Şarj İstasyonu Kampanyaları</h2>
        </div>

        <DiscountFilters
          onChange={applyFilters}
          selectedBattery={selectedBattery}
          onBatteryChange={handleBatteryChange}
        />
         
        {filteredDiscounts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Seçtiğiniz kriterlere uygun kampanya bulunamadı</h3>
            <p className="text-muted-foreground">
              Seçtiğiniz kriterlere uygun kampanya şu anda bulunamadı. Filtrelerinizi genişleterek yeni kampanyaları keşfedebilirsiniz. Elektrikli araç sahipleri için en uygun şarj tarifelerini bulmak için buradayız.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
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

        {/* Bank Campaigns Section */}
        <div className="mt-12 mb-8 border-t pt-12">
          <BankCampaigns />
        </div>

        {/* Blog Section */}
        <div className="mt-16 mb-8">
          <Blog 
            tagline="Elektrikli Araç Dünyası"
            heading="Bilgi Merkezi"
            description="Elektrikli araç kullanıcıları için faydalı bilgiler, tasarruf ipuçları ve sektördeki son gelişmeler. En verimli şarj stratejileri ve elektrikli araç bakımı konularında uzman görüşlerimizi okuyun."
            buttonText="Tüm yazılara göz atın"
            buttonUrl="/blog"
            posts={blogPosts.slice(0, 3)}
          />
        </div>

        <div className="mt-12 pt-4" ref={pricesRef} id="fiyatlar">
          <h2 className="text-2xl font-bold mb-8">Fiyat Karşılaştırması</h2>
          <PriceTables data={data as Company[]} />
        </div>
        
        <div className="mt-16" ref={faqRef}>
          <FaqSection />
        </div>
      </main>
       
      <footer className="bg-white py-8 border-t mt-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <a href="https://fullplus.team/" target="_blank" rel="noopener noreferrer">
              <div className="w-20 h-20 relative next-image-container">
                <Image
                  src="/images/full.jpg"
                  alt="Full+ Team"
                  fill
                  sizes="80px"
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </a>
          </div>
          <h2 className="text-xl font-semibold text-center mb-6">
            Elektrikli araç şarj firmaları
          </h2>
          <InfiniteSlider 
            gap={30} 
            duration={20}
            durationOnHover={140}
            className="w-full h-full bg-white"
          >
            {data.map((company) => (
              <div 
                key={company.name}
                className="h-12 w-auto min-w-[100px] flex items-center justify-center"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                  unoptimized
                  loading="eager"
                />
              </div>
            ))}
          </InfiniteSlider>
          <div className="text-center text-muted-foreground text-sm mt-8">
            © {new Date().getFullYear()} Şarj Kampanya. Tüm hakları saklıdır.
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
