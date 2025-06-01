import { BlogNavbar } from "@/components/blog-navbar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Elektrikli Araç Şarj Kampanyaları",
  description: "Elektrikli araç kullanıcıları için güncel bilgiler, şarj stratejileri, kampanya haberleri ve tasarruf ipuçları.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Elektrikli Araç Şarj Kampanyaları",
    title: "Blog | Elektrikli Araç Şarj Kampanyaları",
    description: "Elektrikli araç kullanıcıları için güncel bilgiler, şarj stratejileri, kampanya haberleri ve tasarruf ipuçları.",
    url: "https://sarjkampanya.com/blog",
    images: [
      {
        url: "https://sarjkampanya.com/images/logo.png",
        width: 512,
        height: 512,
        alt: "Elektrikli Araç Şarj Kampanyaları Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Elektrikli Araç Şarj Kampanyaları",
    description: "Elektrikli araç kullanıcıları için güncel bilgiler, şarj stratejileri, kampanya haberleri ve tasarruf ipuçları.",
    images: ["https://sarjkampanya.com/images/logo.png"],
  },
  alternates: {
    canonical: "https://sarjkampanya.com/blog",
  },
};

// Simple layout without client components to avoid hydration errors
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BlogNavbar />
      {children}
    </>
  )
} 