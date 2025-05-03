import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { blogPosts } from "@/app/data/blog-posts"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  Moon, 
  Tags, 
  Clock, 
  Bell, 
  Battery, 
  Zap
} from "lucide-react"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"

// Generate metadata using Next.js 13 App Router pattern
export function generateMetadata(): Metadata {
  return {
    title: "Optimum Şarj Stratejileri Elektrikli Araçlar | Sarj Kampanya",
    description: "Elektrikli araç sahipleri için akıllı şarj rehberi: Gece tarifesi, ev-halka açık istasyon kullanımı, kampanyalar ve tasarruf sağlayan stratejiler.",
    keywords: ["elektrikli araç şarj stratejileri", "elektrikli araç tasarruf", "şarj kampanyaları", "ev şarj istasyonu", "gece tarifesi", "ekonomik şarj", "regeneratif frenleme", "DC hızlı şarj", "AC yavaş şarj"],
    openGraph: {
      title: "Optimum Şarj Stratejileri Elektrikli Araçlar | Sarj Kampanya",
      description: "Elektrikli araç sahipleri için akıllı şarj rehberi: Gece tarifesi, ev-halka açık istasyon kullanımı, kampanyalar ve tasarruf sağlayan stratejiler.",
      url: "https://sarjkampanya.com/blog/sarj-stratejileri",
      type: "article",
      publishedTime: "2025-04-16",
      authors: ["Yasin Baran"],
      images: [
        {
          url: "https://sarjkampanya.com/images/sarj-strateji.jpg",
          width: 1200,
          height: 630,
          alt: "Elektrikli Araç Şarj Stratejileri",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Optimum Şarj Stratejileri Elektrikli Araçlar | Sarj Kampanya",
      description: "Elektrikli araç sahipleri için akıllı şarj rehberi: Gece tarifesi, ev-halka açık istasyon kullanımı, kampanyalar ve tasarruf sağlayan stratejiler.",
      images: ["https://sarjkampanya.com/images/sarj-strateji.jpg"],
    },
    alternates: {
      canonical: "https://sarjkampanya.com/blog/sarj-stratejileri",
    },
  }
}

// Server component
export default function SarjStratejileri() {
  // Find the post data server-side
  const post = blogPosts.find(post => post.id === "post-1")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  // Directly render the content with proper metadata
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/sarj-stratejileri" />
        <BlogStructuredData 
          title="Optimum Şarj Stratejileri Elektrikli Araçlar | Sarj Kampanya"
          description="Elektrikli araç sahipleri için akıllı şarj rehberi: Gece tarifesi, ev-halka açık istasyon kullanımı, kampanyalar ve tasarruf sağlayan stratejiler."
          datePublished="2025-04-16"
          imageUrl="https://sarjkampanya.com/images/sarj-strateji.jpg"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/sarj-stratejileri"
        />
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Elektrikli Araç Sahipleri İçin En Uygun Şarj Stratejileri: Zamandan ve Paradan Tasarruf Etmenin Yolları
          </h2>
          
          <p>
            Elektrikli araç (EV) kullanımı her geçen gün artarken, sürücülerin en çok dikkat ettiği konulardan biri de şarj maliyetleri ve şarj süresi. Özellikle şehir içi kullanımda sık sık şarj ihtiyacı duyan kullanıcılar için, doğru stratejiyle hareket etmek hem zamandan hem de paradan ciddi tasarruf sağlayabilir.
          </p>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Moon className="h-5 w-5 text-blue-500" />
            1. Gece Tarifelerini Kullanın
          </h3>
          
          <p>
            Birçok şarj sağlayıcısı, gece saatlerinde daha uygun fiyatlı tarifeler sunar. Özellikle ev tipi AC şarj istasyonu olan kullanıcılar için bu büyük avantaj sağlar. Eğer zaman probleminiz yoksa, aracı gece şarj etmek %20-30 daha ucuz olabilir.
          </p>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Tags className="h-5 w-5 text-green-500" />
            2. Kampanyaları Takip Edin
          </h3>
          
          <p>
            Türkiye&apos;de hizmet veren birçok şarj ağı firması, belirli dönemlerde kampanyalar sunar. Özellikle:
          </p>
          
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Tatil dönemleri</li>
            <li>Hafta sonları</li>
            <li>Özel günler (29 Ekim, 23 Nisan gibi)</li>
          </ul>
          
          <p>
            gibi zamanlarda ücretsiz ya da indirimli şarj imkanları sunulabiliyor. <strong><a href="https://sarjkampanya.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">sarjkampanya.com</a></strong> üzerinden anlık kampanya karşılaştırmaları yaparak size en uygun seçeneği kolayca bulabilirsiniz.
          </p>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Clock className="h-5 w-5 text-amber-500" />
            3. Hızlı Şarj Yerine Planlı Şarj
          </h3>
          
          <p>
            DC (hızlı) şarj istasyonları zaman kazandırır ancak maliyet açısından daha pahalıdır. Eğer zamanınız varsa, AC (yavaş) şarj ile günlük ihtiyaçlarınızı daha ekonomik şekilde karşılayabilirsiniz.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300">
              <span className="mt-1 flex-shrink-0"><Zap className="h-4 w-4" /></span>
              <span><strong>İpucu:</strong> Günlük ortalama 30-40 km yapan bir kullanıcı için haftada 1 AC şarj yeterli olabilir.</span>
            </p>
          </div>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Bell className="h-5 w-5 text-red-500" />
            4. Uygulama Bildirimlerini Açık Tutun
          </h3>
          
          <p>
            ZES, Eşarj, Sharz.net gibi firmalar, mobil uygulamaları üzerinden anlık kampanya bildirimleri gönderiyor. Bu bildirimleri kaçırmamak, özel indirimleri değerlendirmek açısından çok önemli.
          </p>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Battery className="h-5 w-5 text-green-500" />
            5. Araçların Regeneratif (Geri Kazanım) Özelliğini Aktif Kullanın
          </h3>
          
          <p>
            Birçok yeni nesil elektrikli araç, fren yaptığınızda veya yokuş aşağı inerken enerji geri kazanımı sağlar. Bu özellik hem menzil kazandırır hem de şarj ihtiyacınızı azaltır.
          </p>
          
          <h2 className="flex items-center gap-2 mt-10 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Sonuç
          </h2>
          
          <p>
            Elektrikli araç kullanmak, doğru şarj stratejisiyle oldukça ekonomik bir ulaşım modeli sunar. Özellikle kampanyaları takip ederek ve şarj alışkanlıklarınızı optimize ederek tasarruf edebilir, daha verimli bir kullanım elde edebilirsiniz.
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
