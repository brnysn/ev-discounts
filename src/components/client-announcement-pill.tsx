"use client"

import { AnnouncementPill } from "@/components/announcement-pill"
import type { Company } from "@/types"
import { useRouter } from "next/navigation"

interface ClientAnnouncementPillProps {
  companies: Company[]
}

export function ClientAnnouncementPill({ companies }: ClientAnnouncementPillProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push('/')
  }

  return (
    <div 
      onClick={handleClick} 
      className="cursor-pointer"
      title="Ana sayfaya dön"
    >
      <AnnouncementPill 
        companies={companies}
        chargingPort="DC"
        selectedPowerRange="all"
      />
    </div>
  )
} 