"use client"

import { useEffect } from 'react'
import { CanonicalWrapper } from "@/components/canonical-wrapper";

// Client component for handling canonical link
export default function AkbankKampanyasiCanonical() {
  // This useEffect ensures the canonical link is added to the head
  useEffect(() => {
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    
    if (!canonicalLink) {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = 'https://sarjkampanya.com/blog/akbank-kampanyasi'
      document.head.appendChild(link)
    }
  }, [])
  
  return (
    <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/akbank-kampanyasi" />
  );
} 