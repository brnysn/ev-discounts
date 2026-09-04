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
    title: "19 Mayıs Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya",
    description: "19 Mayıs 2025'e özel Beefull ve Voltrun kampanyaları: İndirimli, ücretsiz şarj fırsatları ve tarifeleri karşılaştırmalı rehber.",
    keywords: ["19 Mayıs şarj kampanyaları", "elektrikli araç indirimleri", "ZES 19 Mayıs", "Eşarj kampanya", "şarj istasyonu indirimleri", "elektrikli araç şarj fırsatları", "19 Mayıs özel fırsatlar", "DC hızlı şarj indirimi", "Sharz.net kampanya", "EV şarj kampanyaları"],
    openGraph: {
      title: "19 Mayıs Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya",
      description: "19 Mayıs 2025'e özel Beefull ve Voltrun kampanyaları: İndirimli, ücretsiz şarj fırsatları ve tarifeleri karşılaştırmalı rehber.",
      url: "https://sarjkampanya.com/blog/19-mayis-kampanyalari",
      type: "article",
      publishedTime: "2025-05-16",
      authors: ["Yasin Baran"],
      images: [
        {
          url: "https://sarjkampanya.com/images/posts/19mayis.webp",
          width: 1200,
          height: 630,
          alt: "19 Mayıs Elektrikli Araç Şarj Kampanyaları",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "19 Mayıs Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya",
      description: "19 Mayıs 2025'e özel Beefull ve Voltrun kampanyaları: İndirimli, ücretsiz şarj fırsatları ve tarifeleri karşılaştırmalı rehber.",
      images: ["https://sarjkampanya.com/images/posts/19mayis.webp"],
    },
    alternates: {
      canonical: "https://sarjkampanya.com/blog/19-mayis-kampanyalari",
    },
  }
}

// Server component
export default function MayisKampanyalari() {
  // Find the post data server-side
  const post = blogPosts.find(post => post.id === "post-8")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  // Directly render the content with proper metadata
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/19-mayis-kampanyalari" />
        <BlogStructuredData 
          title="19 Mayıs Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya"
          description="19 Mayıs 2025'e özel Beefull ve Voltrun kampanyaları: İndirimli, ücretsiz şarj fırsatları ve tarifeleri karşılaştırmalı rehber."
          datePublished="2025-05-16"
          imageUrl="https://sarjkampanya.com/images/posts/19mayis.webp"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/19-mayis-kampanyalari"
        />
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Percent className="h-6 w-6 text-primary" />
            19 Mayıs&apos;ta Elektrikli Araç Şarj İstasyonlarının Özel Kampanyaları
          </h2>
          
          <p>
            Gençlik ve Spor Bayramı olan 19 Mayıs&apos;ta, Türkiye&apos;deki önde gelen elektrikli araç şarj istasyonu operatörleri, elektrikli araç kullanıcılarına özel indirimler ve fırsatlar sunuyor. Bu kampanyalar hem gençlik bayramını kutlamak hem de elektrikli araç kullanımını teşvik etmek amacıyla düzenleniyor. Peki bu özel günde hangi şarj operatörleri ne tür avantajlar sunuyor? Hepsini bu yazımızda derledik.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300 font-medium">
              <span className="mt-1 flex-shrink-0">📢</span>
              <span>Açıklanan Tüm 19 Mayıs Şarj Kampanyaları Aşağıda Sizin İçin Listelenecek — En güncel fırsatları buradan takip edebilirsiniz!</span>
            </p>
          </div>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <span></span> 19 Mayıs Şarj Kampanyaları Listesi
          </h3>
          
          <p className="italic text-gray-600 mb-6">
            Aşağıda açıklanan tüm kampanyalar anlık olarak güncellenecek.
          </p>

          {/* Beefull 19 Mayıs Kampanyası */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Image 
                src="/images/chargers/beeful.png" 
                alt="Beefull Logo"
                width={500}
                height={140}
                style={{ height: '140px' }}
                className="object-contain"
                unoptimized
              />
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-green-600" />
                <span className="font-medium">Tarih:</span> 
                <span>19 Mayıs 2025 (Tüm gün)</span>
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
                  <div>
                    <span className="text-red-500 line-through mr-2">₺10.99</span>
                    <span className="font-bold text-green-600">₺5.00 / kWh</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{"> 60 kWh"}</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺12.99</span>
                    <span className="font-bold text-green-600">₺5.00 / kWh</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Normal fiyat: ₺10.99-₺12.99 / kWh
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">AC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{"< 20 kWh"}</span>
                  <div>
                    <span className="font-bold">₺8.29 / kWh</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{"> 20 kWh"}</span>
                  <div>
                    <span className="font-bold">₺8.99 / kWh</span>
                  </div>
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
          
          {/* Voltrun 19 Mayıs Kampanyası */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Image 
                src="/images/chargers/voltrun.png" 
                alt="Voltrun Logo"
                width={500}
                height={140}
                style={{ height: '140px' }}
                className="object-contain"
                unoptimized
              />
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-green-600" />
                <span className="font-medium">Tarih:</span> 
                <span>17-19 Mayıs 2025 (Üç gün)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Detaylar:</span>
                <span className="text-green-600">Tüm istasyonlarda geçerlidir</span>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 my-3">
              <h5 className="text-sm font-semibold mb-2">Kampanya Detayları</h5>
              <div className="flex items-center justify-between">
                <span className="text-sm">İndirim Oranı</span>
                <span className="font-bold text-green-600">%19.19</span>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                19 Mayıs Gençlik ve Spor Bayramı&apos;na özel tam 3 gün boyunca geçerli indirim
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">DC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{"< 100 kWh"}</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺10.49</span>
                    <span className="font-bold text-green-600">₺8.48 / kWh</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{"> 100 kWh"}</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺12.49</span>
                    <span className="font-bold text-green-600">₺10.09 / kWh</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Normal fiyat: ₺10.49-₺12.49 / kWh
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">AC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{"AC-1 kWh"}</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺8.29</span>
                    <span className="font-bold text-green-600">₺6.70 / kWh</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{"AC-2 kWh"}</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺9.29</span>
                    <span className="font-bold text-green-600">₺7.51 / kWh</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Normal fiyat: ₺8.29-₺9.29 / kWh
                </div>
              </div>
            </div>
            
            <div className="text-sm mt-4">
              <span className="font-medium">Not:</span> Bu kampanya kapsamında tüm şarj istasyonlarında %19.19 indirim uygulanmaktadır. İndirim oranı 19 Mayıs Gençlik ve Spor Bayramı&apos;nı temsil etmektedir.
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
