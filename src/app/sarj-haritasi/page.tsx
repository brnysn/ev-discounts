import type { Metadata } from "next"
import { StationMap } from "@/components/station-map"

const canonical = "https://sarjkampanya.com/sarj-haritasi"
const title = "Şarj Haritası | En Yakın ve En Uygun Şarj İstasyonu"
const description =
  "Türkiye’deki EPDK kayıtlı elektrikli araç şarj istasyonlarını haritada görün. Size en yakın istasyonu bulun, ağ ve banka kampanyalarıyla kWh fiyatlarını karşılaştırın."

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "şarj haritası",
    "elektrikli araç şarj istasyonu haritası",
    "en yakın şarj istasyonu",
    "EPDK şarj istasyonları",
    "DC hızlı şarj haritası",
    "kampanyalı şarj fiyatı",
    "kWh karşılaştırma",
    "Trugo",
    "ZES",
    "Eşarj",
  ],
  alternates: {
    canonical,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: canonical,
    siteName: "Elektrikli Araç Şarj Kampanyaları",
    title: "Şarj Haritası",
    description,
    images: [
      {
        url: "https://sarjkampanya.com/images/logo.png",
        width: 512,
        height: 512,
        alt: "Şarj Kampanya şarj haritası",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Şarj Haritası | Şarj Kampanya",
    description,
    images: ["https://sarjkampanya.com/images/logo.png"],
  },
}

export default function SarjHaritasiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Şarj Haritası",
    url: canonical,
    description,
    inLanguage: "tr-TR",
    isPartOf: {
      "@type": "WebSite",
      name: "Şarj Kampanya",
      url: "https://sarjkampanya.com",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StationMap />
    </>
  )
}
