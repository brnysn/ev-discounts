import type { Metadata } from "next"
import { BlogNavbar } from "@/components/blog-navbar"

export const metadata: Metadata = {
  title: "Blog | Elektrikli Araç Şarj Kampanyaları",
  description: "Elektrikli araç şarj istasyonları hakkında bilgiler, şarj stratejileri ve daha fazlası.",
  alternates: {
    canonical: "https://sarjkampanya.com/blog",
  },
}

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