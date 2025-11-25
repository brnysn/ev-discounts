import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  // Percent, 
  // Zap,
  Building,
  Calendar,
  // CreditCard
} from "lucide-react"
// import Image from "next/image"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"
// import campaigns from "@/app/data/campaigns.json"
import { Timeline } from "@/components/timeline"
import type { Company } from "@/types"
import data from "@/app/data/data.json"
import { useDiscountCalculator } from "@/hooks/useDiscountCalculator"

export const metadata: Metadata = {
  title: "30 Ağustos Zafer Bayramı Şarj Kampanyaları | Şarj Kampanya",
  description: "30 Ağustos Zafer Bayramı'nda elektrikli araç şarj istasyonlarının özel kampanyaları, banka kartı indirimleri ve avantajlı fırsatlar hakkında detaylı bilgi.",
  keywords: ["30 Ağustos şarj kampanyaları", "Zafer Bayramı indirimleri", "elektrikli araç şarj", "bayram kampanyaları", "şarj indirimi", "bayramda şarj istasyonu", "EV şarj kampanyaları"],
  openGraph: {
    title: "30 Ağustos Zafer Bayramı Şarj Kampanyaları",
    description: "30 Ağustos Zafer Bayramı'nda elektrikli araç şarj istasyonlarının özel kampanyaları, banka kartı indirimleri ve avantajlı fırsatlar hakkında detaylı bilgi.",
    url: "https://sarjkampanya.com/blog/30-agustos-2025",
    type: "article",
    publishedTime: "2025-08-05",
    authors: ["Yasin Baran"],
    images: [
      {
        url: "https://sarjkampanya.com/images/posts/30-agustos.webp",
        width: 1200,
        height: 630,
        alt: "30 Ağustos Zafer Bayramı Şarj Kampanyaları",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "30 Ağustos Zafer Bayramı Şarj Kampanyaları | Şarj Kampanya",
    description: "30 Ağustos Zafer Bayramı'nda elektrikli araç şarj istasyonlarının özel kampanyaları, banka kartı indirimleri ve avantajlı fırsatlar hakkında detaylı bilgi.",
    images: ["https://sarjkampanya.com/images/posts/30-agustos.webp"],
  },
  alternates: {
    canonical: "https://sarjkampanya.com/blog/30-agustos-2025",
  },
}

export default function OtuzAgustos2025() {
  // Find relevant campaigns for 30 August
  // const akbankCampaign = campaigns.find(c => c.company.name === "Akbank")
  // const ziraatCampaign = campaigns.find(c => c.company.name === "Ziraat Bankası")
  
  // Get discounts from data.json
  const initialDiscounts = (data as Company[]).flatMap((company) =>
    company.discounts.map((discount) => ({
      ...discount,
      company,
    }))
  ).filter(discount => {
    const startDate = new Date(discount.starts_at)
    const endDate = new Date(discount.ends_at)
    const bayramStart = new Date("2025-08-30")
    const bayramEnd = new Date("2025-08-30")
    
    // Only show discounts that overlap with 30 Ağustos Zafer Bayramı
    return startDate <= bayramEnd && endDate >= bayramStart
  })

  // Sort discounts using the same hook as home page
  const { sortDiscounts } = useDiscountCalculator({
    discounts: initialDiscounts,
    chargingPort: "DC",
    powerRange: "all"
  })
  
  const discounts = sortDiscounts(initialDiscounts)
  
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50 [&_html]:scroll-pt-8">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/30-agustos-2025" />
        <BlogStructuredData 
          title="30 Ağustos Zafer Bayramı Şarj Kampanyaları | Sarj Kampanya"
          description="30 Ağustos Zafer Bayramı'nda elektrikli araç şarj istasyonlarının özel kampanyaları, banka kartı indirimleri ve avantajlı fırsatlar hakkında detaylı bilgi."
          datePublished="2025-08-30"
          imageUrl="https://sarjkampanya.com/images/posts/30-agustos.webp"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/30-agustos-2025"
        />
                  <BlogPost
            title="30 Ağustos Zafer Bayramı Şarj Kampanyaları"
            label="Kampanyalar"
            published="05 Ağustos 2025"
            image="/images/posts/30-agustos.webp"
          >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Calendar className="h-6 w-6 text-primary" />
            30 Ağustos Zafer Bayramı&apos;nda Elektrikli Araç Şarj İstasyonlarının Özel Kampanyaları
          </h2>
          
          <p>
            30 Ağustos Zafer Bayramı&apos;nda, Türkiye&apos;nin önde gelen bankaları ve elektrikli araç şarj istasyonu operatörleri, 
            elektrikli araç kullanıcılarına özel indirimler ve avantajlı fırsatlar sunuyor. Bu yazımızda, Zafer Bayramı süresince 
            faydalanabileceğiniz tüm kampanyaları detaylı olarak inceleyeceğiz.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300 font-medium">
              <span className="mt-1 flex-shrink-0">📢</span>
              <span>Zafer Bayramı boyunca geçerli olacak tüm kampanyalar bu sayfada güncellenecektir. Takipte kalın!</span>
            </p>
          </div>

          {discounts.length > 0 && (
            <div className="min-h-[200px] pt-4">
              <Timeline discounts={discounts} />
            </div>
          )}

          {/* <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Bayram Döneminde Dikkat Edilmesi Gerekenler
          </h2> */}

          <div className="space-y-4">
            <p>
              30 Ağustos Zafer Bayramı döneminde şarj istasyonlarında yoğunluk yaşanması bekleniyor. 
              Bu nedenle, seyahatlerinizi planlarken aşağıdaki noktalara dikkat etmenizi öneriyoruz:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Uzun yol planlarınızı yaparken rota üzerindeki şarj istasyonlarını önceden belirleyin</li>
              <li>Yoğun saatlerde şarj için bekleme olabileceğini göz önünde bulundurun</li>
              <li>Banka kampanyalarından yararlanmak için katılım koşullarını önceden tamamlayın</li>
              <li>Şarj operatörlerinin mobil uygulamalarını güncel tutun</li>
              <li>Mümkünse gece saatlerinde şarj ederek hem yoğunluktan hem de gece tarifesinden faydalanın</li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 my-6">
            <p className="flex items-start gap-2 m-0 text-yellow-800 dark:text-yellow-300">
              <span className="mt-1 flex-shrink-0">⚡</span>
              <span>
                <strong>Tasarruf İpucu:</strong> Banka kampanyalarını şarj istasyonlarının kendi kampanyalarıyla 
                birleştirerek daha fazla tasarruf sağlayabilirsiniz. Örneğin, Akbank&apos;ın %20 indirimini 
                şarj istasyonlarının bayram özel indirimleriyle birlikte kullanabilirsiniz.
              </span>
            </p>
          </div>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Building className="h-6 w-6 text-primary" />
            Sonuç
          </h2>

          <p>
            30 Ağustos Zafer Bayramı döneminde elektrikli araç kullanıcıları için sunulan bu özel kampanyalar, 
            seyahatlerinizi daha ekonomik hale getirme fırsatı sunuyor. Özellikle banka kartı kampanyalarının 
            uzun süreli olması, bayram sonrasında da tasarruf imkanı sağlıyor. Kampanyalardan maksimum fayda 
            sağlamak için katılım koşullarını dikkatle incelemenizi ve seyahat planlarınızı önceden yapmanızı öneriyoruz.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-8">
            <p className="m-0">
              Bu yazı, yeni kampanyalar eklendikçe güncellenecektir. Güncel kampanyaları takip etmek için 
              sayfamızı düzenli olarak ziyaret edebilirsiniz.
            </p>
          </div>
        </BlogPost>
        {/* Feedback Button */}
        <div className="fixed bottom-18 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:-translate-x-0">
          <a
            href="https://form.jotform.com/251522243559961"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-message-square"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Hata Bildir & Yeni Kampanya Ekle
          </a>
        </div>
      </div>
    </BlogPostWrapper>
  );
} 
