import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { blogPosts } from "@/app/data/blog-posts"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  Battery, 
  Zap, 
  Flame, 
  Clock, 
  RefreshCw
} from "lucide-react"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"

// Generate metadata using Next.js 13 App Router pattern
export function generateMetadata(): Metadata {
  return {
    title: "Elektrikli Araç Batarya Ömrünü Uzatma Rehberi | Şarj Kampanya",
    description: "Batarya ömrünü uzatmak için 5 bilimsel yöntem: %20-80 şarj, hızlı şarjın etkisi, sıcaklık yönetimi, yazılım güncellemeleri ve park stratejileri.",
    keywords: ["elektrikli araç batarya ömrü", "batarya ömrünü uzatma", "elektrikli araç bakımı", "batarya sağlığı", "optimum şarj seviyesi", "batarya ısısı", "hızlı şarj etkisi", "batarya degradasyonu", "lityum iyon batarya bakımı", "elektrikli araç pil kullanımı"],
    openGraph: {
      title: "Elektrikli Araç Batarya Ömrünü Uzatma Rehberi | Şarj Kampanya",
      description: "Batarya ömrünü uzatmak için 5 bilimsel yöntem: %20-80 şarj, hızlı şarjın etkisi, sıcaklık yönetimi, yazılım güncellemeleri ve park stratejileri.",
      url: "https://sarjkampanya.com/blog/batarya-omru",
      type: "article",
      publishedTime: "2025-04-10",
      authors: ["Yasin Baran"],
      images: [
        {
          url: "https://sarjkampanya.com/images/posts/batarya-omru.jpg",
          width: 1200,
          height: 630,
          alt: "Elektrikli Araç Batarya Ömrü",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Elektrikli Araç Batarya Ömrünü Uzatma Rehberi | Şarj Kampanya",
      description: "Batarya ömrünü uzatmak için 5 bilimsel yöntem: %20-80 şarj, hızlı şarjın etkisi, sıcaklık yönetimi, yazılım güncellemeleri ve park stratejileri.",
      images: ["https://sarjkampanya.com/images/posts/batarya-omru.jpg"],
    },
    alternates: {
      canonical: "https://sarjkampanya.com/blog/batarya-omru",
    },
  }
}

// Server component
export default function BataryaOmru() {
  // Find the post data server-side
  const post = blogPosts.find(post => post.id === "post-3")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  // Directly render the content with proper metadata
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/batarya-omru" />
        <BlogStructuredData 
          title="Elektrikli Araç Batarya Ömrünü Uzatma Rehberi | Şarj Kampanya"
          description="Batarya ömrünü uzatmak için 5 bilimsel yöntem: %20-80 şarj, hızlı şarjın etkisi, sıcaklık yönetimi, yazılım güncellemeleri ve park stratejileri."
          datePublished="2025-04-10"
          imageUrl="https://sarjkampanya.com/images/posts/batarya-omru.jpg"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/batarya-omru"
        />
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Battery className="h-6 w-6 text-primary" />
            Elektrikli Araçlarda Batarya Ömrünü Uzatmanın 5 Etkili Yolu
          </h2>
          
          <p>
            Elektrikli araç (EV) sahibi olmak, birçok avantaj sunarken aynı zamanda bazı konularda dikkatli olmayı gerektirir. Bunların en başında da batarya bakımı gelir. Batarya, bir elektrikli aracın en değerli ve en maliyetli parçasıdır. Doğru kullanım ve bakımla bataryanızın ömrünü uzatabilir ve aracınızdan maksimum verim alabilirsiniz.
          </p>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Battery className="h-5 w-5 text-green-500" />
            1. Sürekli %0-100 Şarj Döngüsünden Kaçının
          </h3>
          
          <p>
            Lityum-iyon bataryalar, sürekli olarak tamamen boşalıp tamamen dolduğunda daha hızlı yıpranır. İdeal kullanım için:
          </p>
          
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Bataryanızı genellikle %20-80 aralığında tutun</li>
            <li>Uzun yolculuklar dışında %100 şarja getirmeyin</li>
            <li>Mümkünse %20&apos;nin altına düşürmeyin</li>
          </ul>
          
          <p>
            Modern elektrikli araçlarda, batarya yönetim sistemleri bu konuda yardımcı olur fakat kullanıcı alışkanlıklarınız da önemlidir.
          </p>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Zap className="h-5 w-5 text-red-500" />
            2. Hızlı Şarj İstasyonlarını Sürekli Kullanmaktan Kaçının
          </h3>
          
          <p>
            DC hızlı şarj istasyonları pratik olsa da sürekli kullanımları batarya ömrünü etkileyebilir. Hızlı şarj, batarya hücrelerinde daha fazla ısı üretir ve bu da zamanla kapasite kaybına yol açabilir.
          </p>
          
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Günlük kullanımda mümkünse AC şarjı tercih edin</li>
            <li>DC hızlı şarjı sadece uzun yolculuklarda veya acil durumlarda kullanın</li>
            <li>Hızlı şarj sonrası bataryanın soğumasını bekleyin</li>
          </ul>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Flame className="h-5 w-5 text-amber-500" />
            3. Aşırı Sıcak ve Soğuk Koşullardan Koruyun
          </h3>
          
          <p>
            Lityum-iyon bataryalar, aşırı sıcak ve soğuk hava koşullarından olumsuz etkilenir. İdeal sıcaklık aralığı genellikle 10-25°C arasıdır.
          </p>
          
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Yaz aylarında mümkünse aracınızı gölgede park edin</li>
            <li>Kış aylarında garaj gibi kapalı alanlarda park etmeye çalışın</li>
            <li>Aşırı soğuklarda, sürüşten önce bataryanın ısınmasını bekleyin</li>
          </ul>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <Clock className="h-5 w-5 text-blue-500" />
            4. Zamanlanmış Şarj Özelliğini Kullanın
          </h3>
          
          <p>
            Çoğu modern elektrikli araçta bulunan zamanlanmış şarj özelliği, sadece elektrik fiyatlarından tasarruf etmenizi sağlamaz, aynı zamanda batarya sağlığı için de faydalıdır.
          </p>
          
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Aracınızı uzun süre %100 şarjda bekletmeyin</li>
            <li>Hareket saatinize yakın bir zamanda şarjın tamamlanmasını programlayın</li>
            <li>Uzun süre kullanmayacaksanız, bataryayı %50 civarında bırakın</li>
          </ul>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <RefreshCw className="h-5 w-5 text-purple-500" />
            5. Düzenli Yazılım Güncellemelerini Yapın
          </h3>
          
          <p>
            Araç üreticileri, batarya yönetim sistemleri için düzenli yazılım güncellemeleri sunar. Bu güncellemeler genellikle batarya performansını ve ömrünü optimize etmeye yardımcı olur.
          </p>
          
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Aracınızın yazılım güncellemelerini düzenli olarak kontrol edin</li>
            <li>Servis zamanlarını kaçırmayın</li>
            <li>Yetkili servislerin batarya durum raporlarını takip edin</li>
          </ul>
          
          <h2 className="flex items-center gap-2 mt-10 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Sonuç
          </h2>
          
          <p>
            Elektrikli araç bataryaları, doğru kullanımla 8-10 yıl veya daha uzun süre yüksek performansla çalışabilir. Yukarıdaki ipuçlarını uygulayarak, batarya değişimi gibi maliyetli durumları erteleyebilir ve aracınızdan maksimum verim alabilirsiniz.
          </p>
          
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 my-6">
            <p className="flex items-start gap-2 m-0 text-green-800 dark:text-green-300 font-medium">
              <span className="mt-1 flex-shrink-0"><Battery className="h-4 w-4" /></span>
              <span><strong>Unutmayın:</strong> En iyi şarj stratejisi ve batarya bakımı için <a href="https://sarjkampanya.com" target="_blank" rel="noopener noreferrer" className="text-green-800 dark:text-green-300 underline hover:no-underline">sarjkampanya.com</a>&apos;u düzenli olarak ziyaret edin, en güncel bilgilere ve kampanyalara erişin!</span>
            </p>
          </div>
        </BlogPost>
      </div>
    </BlogPostWrapper>
  )
} 
