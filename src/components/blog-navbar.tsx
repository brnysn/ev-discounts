"use client"

import { CustomNavbar } from "@/components/custom-navbar"

export function BlogNavbar() {
  return (
    <CustomNavbar 
      menu={[
        { title: "Kampanyalar", url: "/#kampanyalar" },
        { title: "Fiyatlar", url: "/#fiyatlar" },
        { title: "Blog", url: "/blog" },
        { title: "SSS", url: "/#sss" }
      ]}
      activeSection="blog"
    />
  )
} 