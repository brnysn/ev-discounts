import type { Metadata } from "next"
import { BlogNavbar } from "@/components/blog-navbar"
import { BlogHeadTags } from "@/components/blog-head-tags"

export const metadata: Metadata = {
  title: "Blog | Elektrikli Araç Şarj Kampanyaları",
  description: "Elektrikli araç şarj istasyonları hakkında güncel bilgiler, operatör karşılaştırmaları, özel kampanyalar, verimli şarj stratejileri ve batarya bakımı ile ilgili uzman tavsiyeleri. Türkiye'deki tüm EV kullanıcıları için kapsamlı şarj rehberi.",
}

// Simple layout without client components to avoid hydration errors
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BlogHeadTags />
      <BlogNavbar />
      {children}
    </>
  )
} 