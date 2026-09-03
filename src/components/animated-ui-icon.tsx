"use client"

import type { AnimatedLucideIcon } from "@animated-color-icons/lucide-react"

export function AnimatedUiIcon({
  icon: Icon,
  size = 16,
  className,
}: {
  icon: AnimatedLucideIcon
  size?: number
  className?: string
}) {
  return (
    <span aria-hidden="true" className={className}>
      <Icon size={size} />
    </span>
  )
}
