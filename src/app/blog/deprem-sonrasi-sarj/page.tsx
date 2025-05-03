import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { blogPosts } from "@/app/data/blog-posts"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  AlertTriangle, 
  Building, 
  Zap
} from "lucide-react"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"

// Generate metadata using Next.js 13 App Router pattern
export function generateMetadata(): Metadata {
  return {
    title: "Deprem Sonrası Elektrikli Araç Şarj Çözümleri | Sarj Kampanya",
    description: "23 Nisan 2025 İstanbul depremi sonrası EnYakıt ücretsiz şarj, kesintisiz enerji noktaları, V2G rolü ve afetlerde EV kullanımı için kritik bilgiler.",
    keywords: ["İstanbul depremi", "elektrikli araç deprem", "şarj istasyonları", "EnYakıt ücretsiz şarj", "e-mobilite afet", "acil durumlarda EV", "EV şarj Marmara"],
    openGraph: {
      title: "Deprem Sonrası Elektrikli Araç Şarj Çözümleri | Sarj Kampanya",
      description: "23 Nisan 2025 İstanbul depremi sonrası EnYakıt ücretsiz şarj, kesintisiz enerji noktaları, V2G rolü ve afetlerde EV kullanımı için kritik bilgiler.",
      url: "https://sarjkampanya.com/blog/deprem-sonrasi-sarj",
      type: "article",
      publishedTime: "2025-04-24",
      authors: ["Yasin Baran"],
      images: [
        {
          url: "https://sarjkampanya.com/images/deprem-ev.jpg",
          width: 1200,
          height: 630,
          alt: "Deprem Sonrası EV Kullanımı",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Deprem Sonrası Elektrikli Araç Şarj Çözümleri | Sarj Kampanya",
      description: "23 Nisan 2025 İstanbul depremi sonrası EnYakıt ücretsiz şarj, kesintisiz enerji noktaları, V2G rolü ve afetlerde EV kullanımı için kritik bilgiler.",
      images: ["https://sarjkampanya.com/images/deprem-ev.jpg"],
    },
    alternates: {
      canonical: "https://sarjkampanya.com/blog/deprem-sonrasi-sarj",
    },
  }
}

// Server component
export default function DepremSonrasiSarj() {
  // Find the post data server-side
  const post = blogPosts.find(post => post.id === "post-4")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  // Directly render the content with proper metadata
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/deprem-sonrasi-sarj" />
        <BlogStructuredData 
          title="Deprem Sonrası Elektrikli Araç Şarj Çözümleri | Sarj Kampanya"
          description="23 Nisan 2025 İstanbul depremi sonrası EnYakıt ücretsiz şarj, kesintisiz enerji noktaları, V2G rolü ve afetlerde EV kullanımı için kritik bilgiler."
          datePublished="2025-04-24"
          imageUrl="https://sarjkampanya.com/images/deprem-ev.jpg"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/deprem-sonrasi-sarj"
        />
        
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <div className="prose max-w-none">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Deprem Sonrası Elektrikli Araç Kullanımı ve Şarj İstasyonları
            </h2>
            
            <p>
              23 Nisan 2025 tarihinde İstanbul Silivri açıklarında saat 12.49&apos;da 6.2, ardından 5.9 büyüklüğünde iki deprem meydana geldi. Depremler, Yalova ve Sakarya gibi çevre illerde de hissedildi. AFAD, şu ana kadar 184 artçı sarsıntı kaydedildiğini ve 7&apos;sinin 4 ve üzeri büyüklükte olduğunu bildirdi.
            </p>
            
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Deprem Sonrası Duruma Genel Bakış
            </h3>
            
            <p>
              Bu tür büyük depremlerin ardından elektrik altyapısında yaşanabilecek olası kesintiler, elektrikli araç şarj istasyonlarını da etkileyebilir. Bazı bölgelerde şebeke elektriğinin kesilmesi, istasyonların devre dışı kalmasına yol açabilir. Ayrıca, fiber bağlantıların hasar görmesi durumunda ödeme sistemleri veya uzaktan erişim gibi hizmetlerde de aksaklıklar yaşanabilir.
            </p>
            
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
              <Building className="h-5 w-5 text-blue-500" />
              EnYakıt&apos;ın Ücretsiz Şarj Desteği
            </h3>
            
            <p>
              Deprem sonrası dikkat çeken girişimlerden biri, EnYakıt şirketinin Marmara bölgesindeki istasyonlarında ücretsiz şarj hizmeti sunması oldu.
            </p>

            <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
              <Zap className="h-5 w-5 text-yellow-500" />
              Afet Planlamalarında E-Mobilite
            </h3>
            
            <p>
              Uzmanlara göre, genel afet hazırlıkları kapsamında aşağıdaki maddelerin dikkate alınması önerilmektedir:
            </p>
            
            <ul className="pl-6 list-disc space-y-2 my-4">
              <li>Kritik şarj istasyonlarına kesintisiz güç kaynağı sağlanması</li>
              <li>Acil durum şarj noktalarının belirlenmesi ve duyurulması</li>
              <li>Yedek güç kaynağı olarak kullanılabilecek V2G (Vehicle-to-Grid) sistemlerinin yaygınlaştırılması</li>
              <li>Şarj istasyonu operatörleri ile acil durum yönetimi birimlerinin koordinasyonunun artırılması</li>
            </ul>
            
            <h2 className="flex items-center gap-2 mt-10 text-2xl font-bold mb-4">
              <Zap className="h-6 w-6 text-primary" />
              Sonuç
            </h2>
            
            <p>
              İstanbul depremi, elektrikli araçların afet durumlarındaki rolünü ve şarj 
              altyapısının dirençliliğini test eden önemli bir deneyim oldu. Bu süreçte edinilen 
              tecrübeler, hem şarj operatörleri hem de elektrikli araç sahipleri için değerli 
              dersler içeriyor.
            </p>
            
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 my-6">
              <p className="flex items-start gap-2 m-0 text-green-800 dark:text-green-300">
                <span className="mt-1 flex-shrink-0"><AlertTriangle className="h-4 w-4" /></span>
                <span><strong>Bu yazı,</strong> 23 Nisan 2025 İstanbul depremi sonrası elektrikli araç ekosistemini 
                incelemek amacıyla hazırlanmıştır. Veriler, resmi açıklamalar ve saha gözlemlerine dayanmaktadır.</span>
              </p>
            </div>
          </div>
        </BlogPost>
      </div>
    </BlogPostWrapper>
  )
}