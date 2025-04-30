"use client"

import { usePathname } from 'next/navigation'
import Script from 'next/script'

export function BlogHeadTags() {
  const pathname = usePathname()
  const canonicalUrl = 'https://sarjkampanya.com' + pathname

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <Script id="blog-canonical" strategy="afterInteractive">
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