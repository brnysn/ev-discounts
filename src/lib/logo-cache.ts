import { useEffect, useState } from "react"
import companies from "@/app/data/data.json"
import campaigns from "@/app/data/campaigns.json"

const blobUrls = new Map<string, string>()
const inflight = new Map<string, Promise<string>>()
let preloadStarted = false

function logoKey(src: string): string {
  if (!src || src.startsWith("blob:")) return src
  try {
    if (/^https?:\/\//i.test(src)) return new URL(src).pathname
  } catch {
    return src
  }
  return src
}

async function cacheOne(src: string): Promise<string> {
  const key = logoKey(src)
  const cached = blobUrls.get(key)
  if (cached) return cached
  const pending = inflight.get(key)
  if (pending) return pending

  const request = (async () => {
    try {
      const response = await fetch(key, { cache: "force-cache", mode: "same-origin" })
      if (!response.ok) return key
      const type = response.headers.get("content-type") ?? ""
      if (type && !type.startsWith("image/")) return key
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      blobUrls.set(key, url)
      return url
    } catch {
      return key
    } finally {
      inflight.delete(key)
    }
  })()

  inflight.set(key, request)
  return request
}

export function cachedLogoSrc(src: string): string {
  if (!src) return src
  return blobUrls.get(logoKey(src)) ?? src
}

export function getCachedLogoSrc(src: string): Promise<string> {
  if (!src) return Promise.resolve(src)
  return cacheOne(src)
}

export function logoSrc(src: string): string {
  if (!src) return src
  void getCachedLogoSrc(src)
  return cachedLogoSrc(src)
}

export function applyCachedLogos(root: HTMLElement | null | undefined) {
  if (!root) return
  for (const img of root.querySelectorAll<HTMLImageElement>("img[data-logo-key]")) {
    const key = img.dataset.logoKey
    if (!key) continue
    const cached = blobUrls.get(logoKey(key))
    if (cached && img.getAttribute("src") !== cached) img.src = cached
  }
  for (const el of root.querySelectorAll<HTMLElement>("[data-logo-key].bank-logo")) {
    const key = el.dataset.logoKey
    if (!key) continue
    const cached = blobUrls.get(logoKey(key))
    if (cached) el.style.backgroundImage = `url("${cached}")`
  }
}

export function bindCachedLogos(root: HTMLElement | null | undefined) {
  if (!root) return
  applyCachedLogos(root)
  const keys = new Set<string>()
  for (const el of root.querySelectorAll<HTMLElement>("[data-logo-key]")) {
    const key = el.dataset.logoKey
    if (key) keys.add(key)
  }
  void Promise.all([...keys].map(getCachedLogoSrc)).then(() => applyCachedLogos(root))
}

export function useCachedLogoSrc(src: string) {
  const [url, setUrl] = useState(() => cachedLogoSrc(src))
  useEffect(() => {
    let alive = true
    void getCachedLogoSrc(src).then((next) => {
      if (alive) setUrl(next)
    })
    return () => {
      alive = false
    }
  }, [src])
  return url
}

function bankLogoUrls(): string[] {
  const urls = new Set<string>()
  for (const item of campaigns as { company?: { logo?: string } }[]) {
    if (item.company?.logo) urls.add(item.company.logo)
  }
  return [...urls]
}

function chargerLogoUrls(): string[] {
  const urls = new Set<string>()
  for (const company of companies as { logo?: string }[]) {
    if (company.logo) urls.add(company.logo)
  }
  return [...urls]
}

export function startStationLogoPreload() {
  if (typeof window === "undefined" || preloadStarted) return
  preloadStarted = true
  for (const src of bankLogoUrls()) void getCachedLogoSrc(src)
  const warmChargers = () => {
    for (const src of chargerLogoUrls()) void getCachedLogoSrc(src)
  }
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(warmChargers, { timeout: 2000 })
  } else {
    window.setTimeout(warmChargers, 400)
  }
}
