import { useMemo } from 'react';
import { Company, DiscountWithCompany, ChargingPort, PriceGroup } from '@/types';

interface DiscountCalculatorOptions {
  companies?: Company[];
  discounts?: DiscountWithCompany[];
  chargingPort?: ChargingPort;
  powerRange?: string;
}

interface CalculatedPrice {
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  isZeroPrice: boolean;
}

export function useDiscountCalculator({
  companies,
  discounts,
  chargingPort = 'DC',
  powerRange = 'all',
}: DiscountCalculatorOptions) {
  const calculateDiscountedPrice = (price: number, discountRate?: number): number => {
    if (!discountRate) return price;
    return price * (1 - discountRate / 100);
  };

  const getPrice = (prices: PriceGroup, type: ChargingPort, powerValue: string): number => {
    const priceList = type.toLowerCase() === 'ac' ? prices.ac : prices.dc;
    const priceObj = priceList.find(p => p.kwh.toString() === powerValue);
    return priceObj ? priceObj.price : 0;
  };

  const calculateDiscountRate = (originalPrice: number, discountedPrice: number): number => {
    if (originalPrice === 0 || discountedPrice === originalPrice) return 0;
    return Number((((originalPrice - discountedPrice) / originalPrice) * 100).toFixed(2));
  };

  const getLowestPrice = (
    prices: PriceGroup,
    discount: DiscountWithCompany,
    chargeType: keyof PriceGroup
  ): CalculatedPrice => {
    if (!prices[chargeType].length) {
      return {
        originalPrice: Infinity,
        discountedPrice: Infinity,
        discountRate: 0,
        isZeroPrice: false
      };
    }

    let lowestOriginalPrice = Infinity;
    let lowestDiscountedPrice = Infinity;
    let resultDiscountRate = 0;
    let hasZeroPrice = false;

    for (const priceOption of prices[chargeType]) {
      const originalPrice = priceOption.price;
      let discountedPrice: number;

      if (discount.discounted_prices) {
        const matchingPrice = discount.discounted_prices[chargeType].find(p => p.kwh === priceOption.kwh)?.price;
        discountedPrice = matchingPrice !== undefined ? matchingPrice : originalPrice;
      } else {
        discountedPrice = calculateDiscountedPrice(originalPrice, discount?.discount_rate);
      }

      if (discountedPrice === 0) {
        hasZeroPrice = true;
        lowestDiscountedPrice = 0;
        lowestOriginalPrice = originalPrice;
        resultDiscountRate = 100;
        break;
      }

      if (discountedPrice < lowestDiscountedPrice) {
        lowestDiscountedPrice = discountedPrice;
        lowestOriginalPrice = originalPrice;
        resultDiscountRate = calculateDiscountRate(originalPrice, discountedPrice);
      }
    }

    return {
      originalPrice: lowestOriginalPrice,
      discountedPrice: lowestDiscountedPrice,
      discountRate: resultDiscountRate,
      isZeroPrice: hasZeroPrice
    };
  };

  const sortDiscounts = (discountsToSort: DiscountWithCompany[]): DiscountWithCompany[] => {
    return [...discountsToSort].sort((a, b) => {
      const nowDate = new Date();
      const aStartDate = new Date(a.starts_at);
      const aEndDate = new Date(a.ends_at);
      const bStartDate = new Date(b.starts_at);
      const bEndDate = new Date(b.ends_at);
      
      const aIsActive = nowDate >= aStartDate && nowDate <= aEndDate;
      const bIsActive = nowDate >= bStartDate && nowDate <= bEndDate;
      const aIsUpcoming = nowDate < aStartDate;
      const bIsUpcoming = nowDate < bStartDate;
      
      // Active discounts first
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      
      if (aIsActive === bIsActive) {
        const pricesA = a.discounted_prices || a.company.prices[0];
        const pricesB = b.discounted_prices || b.company.prices[0];
        const chargeType = chargingPort.toLowerCase() as keyof PriceGroup;
        
        const lowestPriceA = getLowestPrice(pricesA, a, chargeType);
        const lowestPriceB = getLowestPrice(pricesB, b, chargeType);
        
        // Zero prices first
        if (lowestPriceA.isZeroPrice && !lowestPriceB.isZeroPrice) return -1;
        if (!lowestPriceA.isZeroPrice && lowestPriceB.isZeroPrice) return 1;
        
        // Then sort by discounted price
        return lowestPriceA.discountedPrice - lowestPriceB.discountedPrice;
      }
      
      // Upcoming before expired
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;
      
      return a.company.name.localeCompare(b.company.name);
    });
  };

  const getBestDeal = useMemo(() => {
    if (!companies?.length) return null;

    let bestDeal = {
      company: '',
      price: Infinity,
      powerRange: '',
      discountRate: 0
    };

    companies.forEach((company) => {
      const prices = company.prices[0];
      const powerRanges = chargingPort === "AC" 
        ? prices.ac.map(p => p.kwh.toString())
        : prices.dc.map(p => p.kwh.toString());
      
      powerRanges.forEach((range) => {
        const basePrice = getPrice(company.prices[0], chargingPort, range);
        let cheapestPrice = basePrice;
        let bestDiscountRate = 0;
        
        if (company.discounts) {
          company.discounts.forEach((discount) => {
            const now = new Date();
            const startDate = new Date(discount.starts_at);
            const endDate = new Date(discount.ends_at);
            
            if (now >= startDate && now <= endDate) {
              let discountedPrice: number;
              
              if (discount.discount_rate) {
                discountedPrice = calculateDiscountedPrice(basePrice, discount.discount_rate);
              } else if (discount.discounted_prices) {
                discountedPrice = getPrice(discount.discounted_prices, chargingPort, range);
              } else {
                discountedPrice = basePrice;
              }
              
              if (discountedPrice < cheapestPrice) {
                cheapestPrice = discountedPrice;
                bestDiscountRate = calculateDiscountRate(basePrice, discountedPrice);
              }
            }
          });
        }
        
        if (cheapestPrice < bestDeal.price) {
          bestDeal = {
            company: company.name,
            price: cheapestPrice,
            powerRange: range,
            discountRate: bestDiscountRate
          };
        }
      });
    });

    return bestDeal.company ? bestDeal : null;
  }, [companies, chargingPort, powerRange]);

  const sortedDiscounts = useMemo(() => {
    if (!discounts?.length) return [];
    return sortDiscounts(discounts);
  }, [discounts, chargingPort]);

  return {
    calculateDiscountedPrice,
    getPrice,
    calculateDiscountRate,
    getLowestPrice,
    sortDiscounts,
    getBestDeal,
    sortedDiscounts
  };
} 