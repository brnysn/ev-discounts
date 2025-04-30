"use client"

import Script from 'next/script'

export function HomeHeadTags() {
  const canonicalUrl = 'https://sarjkampanya.com'
  
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <Script id="home-canonical" strategy="afterInteractive">
        {`
          // Add canonical link if not present
          if (!document.querySelector('link[rel="canonical"]')) {
            const link = document.createElement('link');
            link.rel = 'canonical';
            link.href = '${canonicalUrl}';
            document.head.appendChild(link);
          }
        `}
      </Script>
    </>
  )
} 