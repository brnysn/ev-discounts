import operatorMap from "@/app/data/operator-map.json"
import type { OperatorMapFile, StationRecord } from "@/types/stations"

const mapFile = operatorMap as OperatorMapFile

export function normalizeMatchKey(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("â", "a")
    .replaceAll("ê", "e")
    .replaceAll("û", "u")
    .replace(/[^a-z0-9]+/g, "")
}

const brandIndex = new Map<string, string>()
const unvanNeedles: { needle: string; company: string }[] = []

for (const entry of mapFile.companies) {
  for (const brand of entry.brands) {
    brandIndex.set(normalizeMatchKey(brand), entry.name)
  }
  brandIndex.set(normalizeMatchKey(entry.name), entry.name)
  for (const needle of entry.unvanIncludes) {
    unvanNeedles.push({
      needle: needle.toLocaleUpperCase("tr-TR"),
      company: entry.name,
    })
  }
}

export function matchCompanyName(station: Pick<StationRecord, "brand" | "operator">): string | null {
  const brandKey = normalizeMatchKey(station.brand)
  if (brandKey && brandIndex.has(brandKey)) {
    return brandIndex.get(brandKey) ?? null
  }

  const operatorUpper = station.operator.toLocaleUpperCase("tr-TR")
  for (const { needle, company } of unvanNeedles) {
    if (operatorUpper.includes(needle)) {
      return company
    }
  }

  return null
}

export function companySlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-")
}
