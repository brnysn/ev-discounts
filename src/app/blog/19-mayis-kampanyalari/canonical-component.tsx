"use client"

import { useEffect } from 'react'

// Client component for handling canonical link
export default function MayisCanonical() {
  // This useEffect ensures the canonical link is added to the head
  useEffect(() => {
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    
    if (!canonicalLink) {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = 'https://sarjkampanya.com/blog/19-mayis-kampanyalari'
      document.head.appendChild(link)
    }
  }, [])
  
  return null
} 