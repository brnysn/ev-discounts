import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { blogPosts } from "@/app/data/blog-posts"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  CreditCard, 
  Percent, 
  Zap,
  Building
} from "lucide-react"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"
import Image from "next/image"
import data from "@/app/data/data.json"
import campaigns from "@/app/data/campaigns.json"

export const metadata: Metadata = {
  title: "VakıfBank'tan Elektrikli Araç Sahiplerine %20 Şarj İndirimi | Şarj Kampanya",
  description: "VakıfBank kredi kartı sahiplerine özel, seçili elektrikli şarj istasyonlarında %20 indirim fırsatı. Kampanya detayları, katılım koşulları ve uyumlu şarj istasyonları hakkında bilgi.",
  openGraph: {
    title: "VakıfBank'tan Elektrikli Araç Sahiplerine %20 Şarj İndirimi",
    description: "VakıfBank kredi kartı sahiplerine özel, seçili elektrikli şarj istasyonlarında %20 indirim fırsatı. Kampanya detayları ve koşulları.",
    url: "https://sarjkampanya.com/blog/vakifbank-kampanyasi",
    type: "article",
    publishedTime: "2025-05-23",
    authors: ["Yasin Baran"],
    images: [
      {
        url: "https://sarjkampanya.com/images/posts/vakifbank-kampanya.webp",
        width: 1200,
        height: 630,
        alt: "VakıfBank Elektrikli Araç Şarj Kampanyası",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VakıfBank&apos;tan Elektrikli Araç Sahiplerine %20 Şarj İndirimi",
    description: "VakıfBank kredi kartı sahiplerine özel, seçili elektrikli şarj istasyonlarında %20 indirim fırsatı. Kampanya detayları ve koşulları.",
    images: ["https://sarjkampanya.com/images/posts/vakifbank-kampanya.webp"],
  },
  alternates: {
    canonical: "https://sarjkampanya.com/blog/vakifbank-kampanyasi",
  },
};

export default function VakifbankKampanyasi() {
  // Find the post data server-side
  const post = blogPosts.find(post => post.id === "post-9")
  
  // Get VakıfBank campaign data
  const vakifbankCampaign = campaigns.find(c => c.company.name === "VakıfBank")
  
  // Get compatible charging companies
  const getCompanyById = (id: string) => {
    return data.find(company => 
      company.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
  };

  const compatibleCompanies = vakifbankCampaign?.campaign.compatibleWith
    .map(id => getCompanyById(id))
    .filter(company => company !== undefined) || [];
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/vakifbank-kampanyasi" />
        <BlogStructuredData 
          title="VakıfBank&apos;tan Elektrikli Araç Sahiplerine %20 Şarj İndirimi | Şarj Kampanya"
          description="VakıfBank kredi kartı sahiplerine özel, seçili elektrikli şarj istasyonlarında %20 indirim fırsatı. Kampanya detayları, katılım koşulları ve uyumlu şarj istasyonları hakkında bilgi."
          datePublished="2025-05-23"
          imageUrl="https://sarjkampanya.com/images/posts/vakifbank-kampanya.webp"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/vakifbank-kampanyasi"
        />
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
            VakıfBank&apos;tan Elektrikli Araç Sahiplerine Özel Kampanya
          </h2>
          
          <p>
            VakıfBank, elektrikli araç sahipleri için avantajlı bir kampanya başlattı. 
            1-31 Mayıs 2025 tarihleri arasında VakıfBank bireysel kredi kartları ile seçili elektrikli şarj istasyonlarında 
            yapılacak ödemelerde %20 indirim fırsatı sunuluyor.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300 font-medium">
              <span className="mt-1 flex-shrink-0">📢</span>
              <span>Kampanya 1-31 Mayıs 2025 tarihleri arasında geçerlidir. Katılım için &quot;Hemen Katıl&quot; butonunu kullanmayı unutmayın!</span>
            </p>
          </div>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Percent className="h-6 w-6 text-primary" />
            Kampanya Detayları
          </h2>
          <p>
            VakıfBank&apos;ın yeni kampanyası kapsamında, bireysel kredi kartı sahipleri aşağıdaki avantajlardan yararlanabilecek:
          </p>
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Seçili şarj istasyonlarında %20 indirim</li>
            <li>Aylık maksimum 300 TL indirim kazanma fırsatı</li>
            <li>Diğer kampanyalarla birleştirilebilme avantajı</li>
          </ul>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Building className="h-6 w-6 text-primary" />
            Uyumlu Şarj İstasyonları
          </h2>
          <p>
            Kampanya kapsamında aşağıdaki şarj istasyonu operatörlerinde indirim fırsatından yararlanabilirsiniz:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-6">
            {compatibleCompanies.map((company, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center h-24 relative">
                <div className="relative w-full h-full">
                  <Image 
                    src={company.logo}
                    alt={`${company.name} Logo`}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Kampanya Katılım Koşulları
          </h2>
          <p>
            Kampanyadan yararlanmak için dikkat edilmesi gereken önemli noktalar:
          </p>
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Kampanyaya katılım için &quot;Hemen Katıl&quot; butonunun kullanılması gerekiyor</li>
            <li>Express Card kullanıcıları için katılım bedeli 9.99 TL</li>
            <li>Ticari kartlar, Bankomat Kartlar ve Recycle Card kampanyaya dahil değil</li>
            <li>Kampanya sadece bireysel kredi kartları için geçerli</li>
          </ul>

          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 my-6">
            <p className="flex items-start gap-2 m-0 text-green-800 dark:text-green-300 font-medium">
              <span className="mt-1 flex-shrink-0">💡</span>
              <span>
                <strong>Tasarruf İpucu:</strong> VakıfBank&apos;ın %20 indirim kampanyasını diğer banka ve şarj istasyonu kampanyalarıyla birleştirerek daha fazla tasarruf sağlayabilirsiniz.
              </span>
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Tasarruf İpuçları</h3>
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Aylık 300 TL indirim limitini göz önünde bulundurarak şarj planlaması yapın</li>
            <li>Kampanyaya katılmadan önce mutlaka kartınızın uygunluğunu kontrol edin</li>
            <li>Diğer banka ve şarj istasyonu kampanyalarıyla birleştirerek ek tasarruf sağlayabilirsiniz</li>
          </ul>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4 mt-8">
            <Percent className="h-6 w-6 text-primary" />
            Sonuç
          </h2>
          <p>
            VakıfBank&apos;ın bu kampanyası, elektrikli araç sahipleri için önemli bir tasarruf fırsatı sunuyor. 
            %20&apos;lik indirim oranı ve aylık 300 TL&apos;ye varan tasarruf imkanı, düzenli şarj ihtiyacı olan kullanıcılar için 
            ciddi bir avantaj sağlıyor. Kampanyanın diğer fırsatlarla birleştirilebilir olması da ek tasarruf imkanı sunuyor.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-8">
            <p className="m-0">
              Kampanya detayları ve güncel bilgiler için{" "}
              <a 
                href="https://www.vakifkart.com.tr/kampanyalar/elektrikli-sarj-istasyonu-harcamalariniza-20-indirim-38257" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                VakıfBank&apos;ın kampanya sayfasını
              </a>{" "}
              ziyaret edebilirsiniz.
            </p>
          </div>
        </BlogPost>
      </div>
    </BlogPostWrapper>
  );
} 
