import bankCampaignsFile from "@/app/data/campaigns.json"
import { getDiscountStatus } from "@/lib/discount-utils"
import { companySlug, matchCompanyName } from "@/lib/station-operators"
import type { Company, PriceGroup } from "@/types"
import type { StationBankDeal, StationCompanyOffer, StationPortPrice, StationRecord } from "@/types/stations"

type BankCampaignEntry = {
  company: { name: string }
  campaign: {
    title: string
    description: string
    startDate: string
    endDate: string
    combinable: boolean
    compatibleWith: string[]
    calculateCombinedPrice?: { type: string; value: number }
  }
}

const bankCampaigns = bankCampaignsFile as BankCampaignEntry[]

function lowestListPrice(prices: PriceGroup, port: "ac" | "dc"): number | undefined {
  const list = prices[port]
  if (!list.length) return undefined
  return Math.min(...list.map((item) => item.price))
}

function campaignMatchesCompany(compatibleWith: string[], slug: string): boolean {
  if (compatibleWith.includes("all")) return true
  const key = slug.toLocaleLowerCase("tr-TR")
  return compatibleWith.some((id) => id.toLocaleLowerCase("tr-TR") === key)
}

function matchingBankDeals(slug: string, listPrice: number, networkPrice: number): StationBankDeal[] {
  const deals: StationBankDeal[] = []

  for (const item of bankCampaigns) {
    if (getDiscountStatus(item.campaign.startDate, item.campaign.endDate) !== "current") continue
    if (!campaignMatchesCompany(item.campaign.compatibleWith, slug)) continue
    const percent = item.campaign.calculateCombinedPrice?.value
    if (!percent) continue
    const oldPrice = item.campaign.combinable ? networkPrice : listPrice
    const newPrice = Number((oldPrice * (1 - percent / 100)).toFixed(2))
    if (newPrice >= oldPrice) continue
    deals.push({
      name: item.company.name,
      title: item.campaign.title,
      description: item.campaign.description,
      percent,
      oldPrice,
      newPrice,
    })
  }

  return deals.sort((a, b) => a.newPrice - b.newPrice || a.title.localeCompare(b.title, "tr"))
}

function discountedPortPrice(company: Company, port: "ac" | "dc", slug: string): StationPortPrice | undefined {
  const base = lowestListPrice(company.prices[0], port)
  if (base === undefined) return undefined

  const active = company.discounts.filter(
    (discount) => getDiscountStatus(discount.starts_at, discount.ends_at) === "current"
  )

  let network = base
  let campaignName: string | undefined

  for (const discount of active) {
    let candidate = base
    if (discount.discounted_prices) {
      const explicit = lowestListPrice(discount.discounted_prices, port)
      if (explicit !== undefined) candidate = explicit
    } else if (discount.discount_rate) {
      candidate = base * (1 - discount.discount_rate / 100)
    }
    if (candidate < network) {
      network = candidate
      campaignName = (discount as { name?: string }).name || discount.text || "Ağ kampanyası"
    }
  }

  network = Number(network.toFixed(2))
  const bankDeals = matchingBankDeals(slug, base, network)
  const cheapestBank = bankDeals[0]
  const discounted = cheapestBank && cheapestBank.newPrice < network ? cheapestBank.newPrice : network

  return {
    original: base,
    networkPrice: network,
    discounted,
    hasCampaign: discounted < base,
    campaignName,
    bankDeals,
  }
}

export function getStationOffer(
  station: StationRecord,
  companies: Company[]
): StationCompanyOffer | null {
  const companyName = matchCompanyName(station)
  if (!companyName) return null

  const company = companies.find((item) => item.name === companyName)
  if (!company) return null

  const slug = companySlug(company.name)

  return {
    companyName: company.name,
    logo: company.logo,
    website: company.website,
    slug,
    ac: discountedPortPrice(company, "ac", slug),
    dc: discountedPortPrice(company, "dc", slug),
  }
}

export function formatTl(value: number): string {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
