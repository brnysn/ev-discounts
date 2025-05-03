"use client"

import { useEffect } from 'react'

interface CanonicalWrapperProps {
  canonicalUrl: string;
}

export function CanonicalWrapper({ canonicalUrl }: CanonicalWrapperProps) {
  useEffect(() => {
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    
    if (!canonicalLink) {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = canonicalUrl
      document.head.appendChild(link)
    } else if (canonicalLink.getAttribute('href') !== canonicalUrl) {
      canonicalLink.setAttribute('href', canonicalUrl)
    }
  }, [canonicalUrl])
  
  return null
} 