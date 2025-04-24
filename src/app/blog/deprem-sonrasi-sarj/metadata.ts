import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deprem Sonrası Elektrikli Araç Kullanımı ve Şarj İstasyonlarının Rolü | Sarj Kampanya",
  description: "23 Nisan 2025 İstanbul depremi sonrası elektrikli araçlar ve şarj istasyonlarının durumu, EnYakıt'ın ücretsiz şarj desteği ve kriz anlarında e-mobilitenin önemi.",
  keywords: ["İstanbul depremi", "elektrikli araç deprem", "şarj istasyonları", "EnYakıt ücretsiz şarj", "e-mobilite afet", "acil durumlarda EV", "EV şarj Marmara"],
  openGraph: {
    title: "Deprem Sonrası Elektrikli Araç Kullanımı ve Şarj İstasyonlarının Rolü | Sarj Kampanya",
    description: "23 Nisan 2025 İstanbul depremi sonrası elektrikli araçlar ve şarj istasyonlarının durumu, EnYakıt'ın ücretsiz şarj desteği ve kriz anlarında e-mobilitenin önemi.",
    url: "https://sarjkampanya.com/blog/deprem-sonrasi-sarj",
    type: "article",
    publishedTime: "2025-04-24",
    authors: ["Yasin Baran"],
    images: [
      {
        url: "/images/deprem-ev.jpg",
        width: 1200,
        height: 630,
        alt: "Deprem Sonrası EV Kullanımı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deprem Sonrası Elektrikli Araç Kullanımı ve Şarj İstasyonlarının Rolü",
    description: "23 Nisan 2025 İstanbul depremi sonrası elektrikli araçlar ve şarj istasyonlarının durumu, EnYakıt'ın ücretsiz şarj desteği ve kriz anlarında e-mobilitenin önemi.",
    images: ["/images/deprem-ev.jpg"],
  },
  alternates: {
    canonical: "https://sarjkampanya.com/blog/deprem-sonrasi-sarj",
  },
};