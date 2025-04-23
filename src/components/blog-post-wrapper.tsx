"use client"

import { ReactNode } from "react"
import { ClientAnnouncementPill } from "@/components/client-announcement-pill"
import data from "@/app/data/data.json"

interface BlogPostWrapperProps {
  children: ReactNode
}

export function BlogPostWrapper({ children }: BlogPostWrapperProps) {
  return (
    <>
      {children}
      <ClientAnnouncementPill companies={data} />
    </>
  )
} 