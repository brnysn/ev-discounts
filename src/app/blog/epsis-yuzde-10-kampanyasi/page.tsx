"use client"

import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { blogPosts } from "@/app/data/blog-posts"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { metadata as pageMetadata } from "./metadata"
import Head from "next/head"
import { 
  Zap, 
  Tags, 
  Clock, 
  Bell,
  Calendar
} from "lucide-react"
import Script from 'next/script'

function EpsisCanonical() {
  return (
    <>
      <link rel="canonical" href="https://sarjkampanya.com/blog/epsis-yuzde-10-kampanyasi" />
      <Script id="epsis-canonical" strategy="afterInteractive">
        {`
          // Add canonical link if not present
          if (!document.querySelector('link[rel="canonical"]')) {
            const link = document.createElement('link');
            link.rel = 'canonical';
            link.href = 'https://sarjkampanya.com/blog/epsis-yuzde-10-kampanyasi';
            document.head.appendChild(link);
          }
        `}
      </Script>
    </>
  )
}

export default function EpsisKampanyasi() {
  const post = blogPosts.find(post => post.id === "post-6")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  return (
    <BlogPostWrapper>
      <Head>
        <title>{pageMetadata.title as string}</title>
        <meta name="description" content={pageMetadata.description as string} />
        
        {/* OpenGraph tags */}
        <meta property="og:title" content={pageMetadata.openGraph?.title as string} />
        <meta property="og:description" content={pageMetadata.openGraph?.description as string} />
        <meta property="og:url" content={pageMetadata.openGraph?.url as string} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://sarjkampanya.com/images/epsis-kampanya.jpg" />
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMetadata.twitter?.title as string} />
        <meta name="twitter:description" content={pageMetadata.twitter?.description as string} />
        <meta name="twitter:image" content="https://sarjkampanya.com/images/epsis-kampanya.jpg" />

        {/* Keywords */}
        <meta name="keywords" content={(pageMetadata.keywords as string[])?.join(',')} />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <EpsisCanonical />
        <BlogStructuredData 
          title={pageMetadata.title as string}
          description={pageMetadata.description as string}
          datePublished="2025-04-29"
          imageUrl="https://sarjkampanya.com/images/epsis-kampanya.jpg"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/epsis-yuzde-10-kampanyasi"
        />
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Favori 5 İstasyonda %10 İndirim: Epsis&apos;ten Yeni Kampanya!
          </h2>
          
          <p>
            Elektrikli araç sahipleri için sevindirici haber! Epsis, 23 Nisan – 30 Mayıs 2025 tarihleri arasında mobil uygulaması üzerinden seçilen favori 5 istasyonda %10 indirim fırsatı sunuyor. Bu kampanya sayesinde şarj maliyetlerinizi önemli ölçüde azaltabilirsiniz.
          </p>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Tags className="h-5 w-5 text-green-500" />
            Kampanya Detayları
          </h3>
          
          <p>
            Kampanya kapsamında, Epsis mobil uygulamasında favori istasyonlar olarak işaretlenen beş farklı şarj noktası üzerinden yapılan şarj işlemlerinde toplam tutar üzerinden %10 indirim uygulanacaktır. Kampanya 23 Nisan 2025 tarihinde başlayıp 30 Mayıs 2025 tarihinde sona erecektir.
          </p>
          
          <div className="my-6">
            <h4 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              🗓 Kampanya Detayları
            </h4>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">📍</span>
                <span><strong>Geçerli Alan:</strong> Uygulama üzerinden favori olarak seçilen 5 istasyon</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">✅</span>
                <span><strong>İndirim Oranı:</strong> %10</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">🔄</span>
                <span><strong>Değişiklik Hakkı:</strong> 5 favori istasyondan yalnızca 3 tanesi bir kez değiştirilebilir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">🔓</span>
                <span><strong>Aktivasyon Şartı:</strong> Kampanya sadece QR kod ile başlatılan şarj işlemlerinde geçerlidir.</span>
              </li>
            </ul>
          </div>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Clock className="h-5 w-5 text-amber-500" />
            Kampanyadan Nasıl Faydalanılır?
          </h3>
          
          <p>
            Öncelikle Epsis mobil uygulamasını güncelleyin ve favori istasyonlarınızı belirleyin. Şarj işlemi sırasında bu istasyonlarda %10 indirim otomatik olarak uygulanacaktır. Kampanya sadece uygulama üzerinden yapılan işlemler için geçerlidir.
          </p>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Bell className="h-5 w-5 text-red-500" />
            Kampanya Takibi ve Bildirimler
          </h3>
          
          <p>
            Epsis uygulamasındaki bildirimleri açık tutarak kampanya ile ilgili güncellemelerden ve ek fırsatlardan anında haberdar olabilirsiniz. Böylece indirim fırsatlarını kaçırmazsınız.
          </p>
          
          <h2 className="flex items-center gap-2 mt-10 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Sonuç
          </h2>
          
          <p>
            Epsis&apos;in favori 5 istasyonda sunduğu %10 indirim kampanyası, elektrikli araç sahipleri için önemli bir maliyet avantajı sağlıyor. Bu fırsatı değerlendirerek şarj giderlerinizi azaltabilir, daha ekonomik bir sürüş deneyimi yaşayabilirsiniz.
          </p>
          
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 my-6">
            <p className="flex items-start gap-2 m-0 text-green-800 dark:text-green-300 font-medium">
              <span className="mt-1 flex-shrink-0"><Zap className="h-4 w-4" /></span>
              <span><strong>En güncel şarj kampanyalarını takip etmek için <a href="https://sarjkampanya.com" target="_blank" rel="noopener noreferrer" className="text-green-800 dark:text-green-300 underline hover:no-underline">sarjkampanya.com</a>&apos;u düzenli olarak ziyaret etmeyi unutmayın!</strong></span>
            </p>
          </div>
        </BlogPost>
      </div>
    </BlogPostWrapper>
  )
}
