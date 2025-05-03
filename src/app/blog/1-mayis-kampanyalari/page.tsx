import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { blogPosts } from "@/app/data/blog-posts"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  Percent, 
  Zap,
  Battery,
  ExternalLink
} from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"

// Generate metadata using Next.js 13 App Router pattern
export function generateMetadata(): Metadata {
  return {
    title: "1 Mayıs Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya",
    description: "1 Mayıs 2025’e özel Beefull, onChange kampanyaları: İndirimli, ücretsiz şarj fırsatları ve tarifeleri karşılaştırmalı rehber.",
    keywords: ["1 Mayıs şarj kampanyaları", "elektrikli araç indirimleri", "ZES 1 Mayıs", "Eşarj kampanya", "şarj istasyonu indirimleri", "elektrikli araç şarj fırsatları", "1 Mayıs özel fırsatlar", "DC hızlı şarj indirimi", "Sharz.net kampanya", "EV şarj kampanyaları"],
    openGraph: {
      title: "1 Mayıs Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya",
      description: "1 Mayıs 2025’e özel Beefull, onChange kampanyaları: İndirimli, ücretsiz şarj fırsatları ve tarifeleri karşılaştırmalı rehber.",
      url: "https://sarjkampanya.com/blog/1-mayis-kampanyalari",
      type: "article",
      publishedTime: "2025-04-25",
      authors: ["Yasin Baran"],
      images: [
        {
          url: "https://sarjkampanya.com/images/1mayis.jpg",
          width: 1200,
          height: 630,
          alt: "1 Mayıs Elektrikli Araç Şarj Kampanyaları",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "1 Mayıs Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya",
      description: "1 Mayıs 2025’e özel Beefull, onChange kampanyaları: İndirimli, ücretsiz şarj fırsatları ve tarifeleri karşılaştırmalı rehber.",
      images: ["https://sarjkampanya.com/images/1mayis.jpg"],
    },
    alternates: {
      canonical: "https://sarjkampanya.com/blog/1-mayis-kampanyalari",
    },
  }
}

// Server component
export default function MayisKampanyalari() {
  // Find the post data server-side
  const post = blogPosts.find(post => post.id === "post-5")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  // Directly render the content with proper metadata
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/1-mayis-kampanyalari" />
        <BlogStructuredData 
          title="1 Mayıs Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya"
          description="1 Mayıs 2025’e özel Beefull, onChange kampanyaları: İndirimli, ücretsiz şarj fırsatları ve tarifeleri karşılaştırmalı rehber."
          datePublished="2025-04-28"
          imageUrl="https://sarjkampanya.com/images/1mayis.jpg"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/1-mayis-kampanyalari"
        />
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Percent className="h-6 w-6 text-primary" />
            1 Mayıs&apos;ta Elektrikli Araç Şarj İstasyonlarının Özel Kampanyaları
          </h2>
          
          <p>
            Emek ve Dayanışma Günü olan 1 Mayıs&apos;ta, Türkiye&apos;deki önde gelen elektrikli araç şarj istasyonu operatörleri, elektrikli araç kullanıcılarına özel indirimler ve fırsatlar sunuyor. Bu kampanyalar hem işçi bayramını kutlamak hem de elektrikli araç kullanımını teşvik etmek amacıyla düzenleniyor. Peki bu özel günde hangi şarj operatörleri ne tür avantajlar sunuyor? Hepsini bu yazımızda derledik.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300 font-medium">
              <span className="mt-1 flex-shrink-0">📢</span>
              <span>Açıklanan Tüm 1 Mayıs Şarj Kampanyaları Aşağıda Sizin İçin Listelenecek — En güncel fırsatları buradan takip edebilirsiniz!</span>
            </p>
          </div>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <span></span> 1 Mayıs Şarj Kampanyaları Listesi
          </h3>
          
          <p className="italic text-gray-600 mb-6">
            Aşağıda açıklanan tüm kampanyalar anlık olarak güncellenecek.
          </p>

          {/* Beeful 1 Mayıs Kampanyası */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Image 
                src="https://i.ibb.co/F4KPsh51/beefull.webp" 
                alt="Beeful Logo" 
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
                unoptimized
              />
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-green-600" />
                <span className="font-medium">Tarih:</span> 
                <span>1 Mayıs 2025 (Tüm gün)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Detaylar:</span>
                <span className="text-red-600">Sadece DC istasyonlarında geçerlidir</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">DC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{"< 60 kWh"}</span>
                  <span className="font-bold text-green-600">₺5.00 / kWh</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{"> 60 kWh"}</span>
                  <span className="font-bold text-green-600">₺5.00 / kWh</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Normal fiyat: ₺10.99-₺12.99 / kWh
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">AC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{"< 20 kWh"}</span>
                  <span className="font-bold">₺8.29 / kWh</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{"> 20 kWh"}</span>
                  <span className="font-bold">₺8.99 / kWh</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Bu fiyatlar AC&apos;de indirim olmadan geçerli fiyatlardır
                </div>
              </div>
            </div>
            
            <div className="text-sm mt-4">
              <span className="font-medium">Not:</span> Bu kampanya kapsamında DC şarj istasyonlarında yaklaşık %55 indirim uygulanmaktadır. AC şarjda indirim bulunmamaktadır.
            </div>
          </div>
          
          {/* oncharge 1 Mayıs Kampanyası */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Image 
                src="https://www.sarjfiyat.com/images/oncharge_logo.png" 
                alt="oncharge Logo" 
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
                unoptimized
              />
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-green-600" />
                <span className="font-medium">Tarih:</span> 
                <span>1 Mayıs 2025 (Tüm gün)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">DC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tüm kWh</span>
                  <span className="font-bold text-green-600">₺8.79 / kWh</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Normal fiyat: ₺10.99 / kWh
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Tasarruf: ₺194.52
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">AC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tüm kWh</span>
                  <span className="font-bold text-green-600">₺7.19 / kWh</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Normal fiyat: ₺8.99 / kWh
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Tasarruf: ₺159.12
                </div>
              </div>
            </div>
            
            <div className="text-sm mt-4">
              <span className="font-medium">Not:</span> Bu kampanya kapsamında tüm şarj istasyonlarında %20 indirim uygulanmaktadır.
            </div>
          </div>
          
          <h2 className="flex items-center gap-2 mt-10 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Kampanyalardan Nasıl Faydalanabilirsiniz?
          </h2>
          
          <p>
            Bu kampanyalardan yararlanmak için şunlara dikkat etmeniz gerekiyor:
          </p>
          
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>İlgili operatörlerin mobil uygulamalarını indirin ve güncel tutun</li>
            <li>Kampanya şartlarını kontrol edin (bazı kampanyalar sadece belirli istasyonlarda geçerli olabilir)</li>
            <li>Şarj işlemine başlamadan önce uygulamadan kampanya koşullarını onaylayın</li>
            <li>Bazı kampanyalar için önceden rezervasyon gerekebilir</li>
            <li>Yoğunluk yaşanabileceği için şarj planlamanızı önceden yapın</li>
          </ul>
          
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 my-6">
            <p className="flex items-start gap-2 m-0 text-green-800 dark:text-green-300 font-medium">
              <span className="mt-1 flex-shrink-0"><Percent className="h-4 w-4" /></span>
              <span><strong>Unutmayın:</strong> Kampanyalara ilişkin güncel bilgiler için <a href="https://sarjkampanya.com" target="_blank" rel="noopener noreferrer" className="text-green-800 dark:text-green-300 underline hover:no-underline">sarjkampanya.com</a>&apos;u düzenli olarak takip edin. Tüm operatörlerin kampanyalarını karşılaştırmalı olarak görebilir ve en avantajlı fırsatları kaçırmazsınız!</span>
            </p>
          </div>
        </BlogPost>
      </div>
    </BlogPostWrapper>
  )
} 
