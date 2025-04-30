"use client"

import Script from "next/script"

interface BlogStructuredDataProps {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  imageUrl: string
  authorName: string
  authorUrl?: string
  canonicalUrl: string
}

export function BlogStructuredData({
  title,
  description,
  datePublished,
  dateModified,
  imageUrl,
  authorName,
  authorUrl = "https://yasinbaran.com",
  canonicalUrl,
}: BlogStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Şarj Kampanya",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sarjkampanya.com/images/logo.png",
        "width": "512",
        "height": "512"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  }

  return (
    <Script 
      id="blog-structured-data" 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
} 