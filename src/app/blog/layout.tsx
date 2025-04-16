"use client"

import { CustomNavbar } from "@/components/custom-navbar"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CustomNavbar 
        menu={[
          { title: "Kampanyalar", url: "/#kampanyalar" },
          { title: "Fiyatlar", url: "/#fiyatlar" },
          { title: "Blog", url: "/blog" }
        ]}
        activeSection="blog"
      />
      {children}
    </>
  )
} 