import { blogPosts } from "@/app/data/blog-posts"
import type { Metadata } from "next"
import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  Zap, 
  Tags, 
  Clock, 
  Bell,
  Calendar
} from "lucide-react"
import { CanonicalWrapper } from "@/components/canonical-wrapper"

// This is a server component
// Generate metadata using Next.js 13 App Router pattern
export function generateMetadata(): Metadata {
  return {
    title: "Favori 5 İstasyonda %10 İndirim | Epsis Kampanyası – Sarj Kampanya",
    description: "Epsis'in 23 Nisan – 30 Mayıs 2025 tarihleri arasında mobil uygulama üzerinden seçilen favori 5 istasyonda sunduğu %10 indirim kampanyasının tüm detayları.",
    keywords: ["Epsis şarj kampanyası", "elektrikli araç indirim", "şarj istasyonu kampanyası", "favori istasyon indirimi", "1 Mayıs şarj", "ev şarj indirimleri"],
    openGraph: {
      title: "Favori 5 İstasyonda %10 İndirim | Epsis Kampanyası – Sarj Kampanya",
      description: "Epsis'in 23 Nisan – 30 Mayıs 2025 tarihleri arasında mobil uygulama üzerinden seçilen favori 5 istasyonda sunduğu %10 indirim kampanyasının tüm detayları.",
      url: "https://sarjkampanya.com/blog/epsis-yuzde-10-kampanyasi",
      type: "article",
      publishedTime: "2025-04-29",
      authors: ["Yasin Baran"],
      images: [
        {
          url: "https://sarjkampanya.com/images/posts/epsis-kampanya.jpg",
          width: 1200,
          height: 630,
          alt: "Epsis %10 İndirim Kampanyası",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Favori 5 İstasyonda %10 İndirim | Epsis Kampanyası",
      description: "Epsis'in 23 Nisan – 30 Mayıs 2025 tarihleri arasında mobil uygulama üzerinden seçilen favori 5 istasyonda sunduğu %10 indirim kampanyasının tüm detayları.",
      images: ["https://sarjkampanya.com/images/posts/epsis-kampanya.jpg"],
    },
    alternates: {
      canonical: "https://sarjkampanya.com/blog/epsis-yuzde-10-kampanyasi",
    },
  }
}

// Server component
export default function EpsisKampanyasi() {
  // Find the post data server-side
  const post = blogPosts.find(post => post.id === "post-6")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  // Directly render the content with proper metadata
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/epsis-yuzde-10-kampanyasi" />
        <BlogStructuredData 
          title="Favori 5 İstasyonda %10 İndirim | Epsis Kampanyası – Sarj Kampanya"
          description="Epsis'in 23 Nisan – 30 Mayıs 2025 tarihleri arasında mobil uygulama üzerinden seçilen favori 5 istasyonda sunduğu %10 indirim kampanyasının tüm detayları."
          datePublished="2025-04-29"
          imageUrl="https://sarjkampanya.com/images/posts/epsis-kampanya.jpg"
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
