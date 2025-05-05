import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { blogPosts } from "@/app/data/blog-posts"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  Clock, 
  Battery, 
  Zap
} from "lucide-react"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"

// Generate metadata using Next.js 13 App Router pattern
export function generateMetadata(): Metadata {
  return {
    title: "20/80 Kuralı ile Optimize Şarj Nedir? | Sarj Kampanya",
    description: "Elektrikli araç batarya sağlığı için en etkili strateji: Şarjınızı %20 ile %80 arasında tutarak batarya ömrünü uzatın.",
    keywords: ["20/80 kuralı", "optimize şarj", "batarya sağlığı", "elektrikli araç bakımı", "şarj optimizasyonu"],
    openGraph: {
      title: "20/80 Kuralı ile Optimize Şarj Nedir? | Sarj Kampanya",
      description: "Elektrikli araç batarya sağlığı için en etkili strateji: Şarjınızı %20 ile %80 arasında tutarak batarya ömrünü uzatın.",
      url: "https://sarjkampanya.com/blog/optimize-sarj",
      type: "article",
      publishedTime: "2025-04-16",
      authors: ["Yasin Baran"],
      images: [
        {
          url: "https://sarjkampanya.com/images/posts/optimize-sarj.jpg",
          width: 1200,
          height: 630,
          alt: "20/80 Kuralı Optimize Şarj",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "20/80 Kuralı ile Optimize Şarj Nedir? | Sarj Kampanya",
      description: "Elektrikli araç batarya sağlığı için en etkili strateji: Şarjınızı %20 ile %80 arasında tutarak batarya ömrünü uzatın.",
      images: ["https://sarjkampanya.com/images/posts/optimize-sarj.jpg"],
    },
    alternates: {
      canonical: "https://sarjkampanya.com/blog/optimize-sarj",
    },
  }
}

// Server component
export default function OptimizeSarj() {
  // Find the post data server-side
  const post = blogPosts.find(post => post.id === "post-7")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  // Directly render the content with proper metadata
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/optimize-sarj" />
        <BlogStructuredData 
          title="20/80 Kuralı ile Optimize Şarj Nedir? | Sarj Kampanya"
          description="Elektrikli araç batarya sağlığı için en etkili strateji: Şarjınızı %20 ile %80 arasında tutarak batarya ömrünü uzatın."
          datePublished="2025-04-16"
          imageUrl="https://sarjkampanya.com/images/posts/optimize-sarj.jpg"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/optimize-sarj"
        />
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Battery className="h-6 w-6 text-primary" />
            20/80 Kuralı: Batarya Sağlığında Optimize Şarjın Önemi
          </h2>

          <p>
            Elektrikli araç batarya sağlığı için en etkili strateji, şarj seviyesini %20 ile %80 arasında tutmaktır. Bu yöntem, batarya ömrünü uzatırken performans kaybını önler ve uzun vadede aracınızın değerini korur.
          </p>

          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Battery className="h-5 w-5 text-green-500" />
            Neden %20 ile %80 Arası Şarj?
          </h3>
          <p>
            Bataryaların tamamen dolu veya tamamen boş kalması kimyasal yapısına zarar verebilir. %20 ile %80 arası şarj aralığı, bu kimyasal stresleri azaltarak bataryanın daha uzun süre sağlıklı kalmasını sağlar.
          </p>

          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Clock className="h-5 w-5 text-amber-500" />
            Şarj Süresi ve Gücünün Batarya Ömrüne Etkisi
          </h3>
          <p>
            Hızlı şarj yöntemleri bataryaya daha fazla ısı ve stres yükleyebilir. AC şarj gibi daha yavaş ve kontrollü yöntemleri tercih etmek, batarya sağlığını korumaya yardımcı olur.
          </p>

          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Zap className="h-5 w-5 text-primary" />
            Optimize Şarj ile Uzun Vadeli Performans
          </h3>
          <p>
            Bataryanızı %20 ile %80 arasında tutmak, hem günlük kullanımda yeterli menzil sağlar hem de batarya kapasitesinin zamanla azalmasını yavaşlatır. Bu sayede aracınızın performansı ve değeri korunur.
          </p>

          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 my-6">
            <p className="flex items-start gap-2 m-0 text-green-800 dark:text-green-300 font-medium">
              <span className="mt-1 flex-shrink-0"><Battery className="h-4 w-4" /></span>
              <span>20/80 kuralına uyarak batarya sağlığınızı koruyabilir, elektrikli aracınızın ömrünü ve performansını maksimize edebilirsiniz.</span>
            </p>
          </div>
        </BlogPost>
      </div>
    </BlogPostWrapper>
  )
} 
