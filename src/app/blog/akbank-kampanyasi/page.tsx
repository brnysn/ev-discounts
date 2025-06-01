import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  CreditCard, 
  Percent, 
  Zap,
  Building,
  Calendar
} from "lucide-react"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"
import Image from "next/image"
import data from "@/app/data/data.json"
import campaigns from "@/app/data/campaigns.json"

export const metadata: Metadata = {
  title: "Akbank EV Şarj Kampanyası: %20 İade Fırsatı | Şarj Kampanya",
  description: "Akbank banka kartı sahiplerine özel, tüm elektrikli şarj istasyonlarında %20 iade fırsatı. Aylık 500 TL, yıl sonuna kadar toplam 2.500 TL iade imkanı.",
  openGraph: {
    title: "Akbank EV Şarj Kampanyası: %20 İade Fırsatı",
    description: "Akbank banka kartı sahiplerine özel, tüm elektrikli şarj istasyonlarında %20 iade fırsatı. Aylık 500 TL, yıl sonuna kadar toplam 2.500 TL iade imkanı.",
    url: "https://sarjkampanya.com/blog/akbank-kampanyasi",
    type: "article",
    publishedTime: "2025-05-21",
    authors: ["Yasin Baran"],
    images: [
      {
        url: "https://sarjkampanya.com/images/posts/akbank-kampanya.webp",
        width: 1200,
        height: 630,
        alt: "Akbank Elektrikli Araç Şarj Kampanyası",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akbank EV Şarj Kampanyası: %20 İade Fırsatı",
    description: "Akbank banka kartı sahiplerine özel, tüm elektrikli şarj istasyonlarında %20 iade fırsatı. Aylık 500 TL, yıl sonuna kadar toplam 2.500 TL iade imkanı.",
    images: ["https://sarjkampanya.com/images/posts/akbank-kampanya.webp"],
  },
  alternates: {
    canonical: "https://sarjkampanya.com/blog/akbank-kampanyasi",
  },
};

export default function AkbankKampanyasi() {
  // Find the post data server-side
  const post = {
    id: "post-10",
    title: "Akbank'tan Elektrikli Araç Sahiplerine %20 İade Kampanyası",
    label: "Kampanyalar",
    author: "Yasin Baran",
    published: "21 Mayıs 2025",
    image: "/images/posts/akbank-kampanya.webp"
  }
  
  // Get Akbank campaign data
  const akbankCampaign = campaigns.find(c => c.company.name === "Akbank")
  
  // Get compatible charging companies
  const getCompanyById = (id: string) => {
    return data.find(company => 
      company.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
  };

  const compatibleCompanies = akbankCampaign?.campaign.compatibleWith.includes("all") 
    ? data 
    : (akbankCampaign?.campaign.compatibleWith || [])
        .map(id => getCompanyById(id))
        .filter(company => company !== undefined) || [];
  
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/akbank-kampanyasi" />
        <BlogStructuredData 
          title="Akbank'tan Elektrikli Araç Sahiplerine %20 İade Kampanyası"
          description="Akbank banka kartı sahiplerine özel, tüm elektrikli şarj istasyonlarında %20 iade fırsatı. Aylık 500 TL, yıl sonuna kadar toplam 2.500 TL iade imkanı."
          datePublished="2025-05-21"
          imageUrl="https://sarjkampanya.com/images/posts/akbank-kampanya.webp"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/akbank-kampanyasi"
        />
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
            Akbank&apos;tan Elektrikli Araç Sahiplerine Özel Kampanya
          </h2>
          
          <p>
            Akbank, elektrikli araç sahipleri için avantajlı bir kampanya başlattı. 
            1 Mayıs - 30 Haziran 2025 tarihleri arasında Akbank banka kartları ile tüm elektrikli şarj istasyonlarında 
            yapılacak ödemelerde %20 iade fırsatı sunuluyor.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300 font-medium">
              <span className="mt-1 flex-shrink-0">📢</span>
              <span>Kampanyaya katılım için Akbank Mobil&apos;de &quot;Tam Senlik Fırsatlar&quot; programı altındaki &quot;Elektrikli Araç Sahiplerine Özel Fırsatlar&quot; kampanyasına katılım gereklidir!</span>
            </p>
          </div>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Calendar className="h-6 w-6 text-primary" />
            Kampanya Süresi ve İade Limitleri
          </h2>
          <ul className="pl-6 list-disc space-y-2 my-4">
            <li>Kampanya 1 Mayıs - 30 Haziran 2025 tarihleri arasında geçerlidir</li>
            <li>Aylık maksimum 500 TL iade kazanılabilir</li>
            <li>Yıl sonuna kadar toplam 2.500 TL iade fırsatı sunulmaktadır</li>
            <li>Kampanya tüm şarj istasyonlarında geçerlidir</li>
          </ul>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Building className="h-6 w-6 text-primary" />
            Geçerli Şarj İstasyonları
          </h2>
          <p>
            Akbank&apos;ın bu kampanyası, Türkiye&apos;deki tüm elektrikli şarj istasyonlarında geçerlidir. Bunlardan bazıları:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-6">
            {compatibleCompanies.slice(0, 12).map((company, index) => (
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
            <li>Kampanya sadece iletişime geçilen müşterilere özeldir</li>
            <li>Akbank Mobil&apos;de &quot;Tam Senlik Fırsatlar&quot; programı altındaki &quot;Elektrikli Araç Sahiplerine Özel Fırsatlar&quot; kampanyasına katılım gereklidir</li>
            <li>Programa katılım sağlamayan müşteriler kampanyadan faydalanamaz</li>
            <li>Kampanya sadece debit kartları ile yapılacak şarj ödemelerinde geçerlidir</li>
            <li>Kampanya kişi bazındadır</li>
          </ul>

          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 my-6">
            <p className="flex items-start gap-2 m-0 text-green-800 dark:text-green-300 font-medium">
              <span className="mt-1 flex-shrink-0">💡</span>
              <span>
                <strong>Tasarruf İpucu:</strong> Akbank&apos;ın %20 iade kampanyasını diğer banka ve şarj istasyonu kampanyalarıyla birleştirerek daha fazla tasarruf sağlayabilirsiniz.
              </span>
            </p>
          </div>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Percent className="h-6 w-6 text-primary" />
            Sonuç
          </h2>
          <p>
            Akbank&apos;ın bu kampanyası, elektrikli araç sahipleri için önemli bir tasarruf fırsatı sunuyor. 
            %20&apos;lik iade oranı, aylık 500 TL ve yıl sonuna kadar toplam 2.500 TL&apos;ye varan iade imkanı, düzenli şarj ihtiyacı olan kullanıcılar için 
            ciddi bir avantaj sağlıyor. Kampanyanın tüm şarj istasyonlarında geçerli olması ve diğer fırsatlarla birleştirilebilir olması da ek tasarruf imkanı sunuyor.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-8">
            <p className="m-0">
              Kampanya detayları ve güncel bilgiler için{" "}
              <a 
                href={akbankCampaign?.campaign.links.details}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Akbank&apos;ın kampanya sayfasını
              </a>{" "}
              ziyaret edebilirsiniz.
            </p>
          </div>
        </BlogPost>
      </div>
    </BlogPostWrapper>
  );
} 
