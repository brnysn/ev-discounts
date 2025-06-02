import { BlogPost } from "@/components/ui/blog-post"
import { BlogStructuredData } from "@/components/ui/blog-structured-data"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  Percent, 
  Zap,
  Building,
  Calendar,
  CreditCard
} from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"
import { CanonicalWrapper } from "@/components/canonical-wrapper"
import campaigns from "@/app/data/campaigns.json"


export const metadata: Metadata = {
  title: "Kurban Bayramında Elektrikli Araç Şarj Kampanyaları | Şarj Kampanya",
  description: "Kurban Bayramında elektrikli araç şarj istasyonlarının özel kampanyaları, banka kartı indirimleri ve avantajlı fırsatlar hakkında detaylı bilgi.",
  keywords: ["Kurban Bayramı şarj kampanyaları", "bayram indirimleri", "elektrikli araç şarj", "Ziraat Bankası bayram kampanyası", "Akbank şarj indirimi", "bayramda şarj istasyonu", "EV şarj kampanyaları"],
  openGraph: {
    title: "Kurban Bayramında Elektrikli Araç Şarj Kampanyaları",
    description: "Kurban Bayramında elektrikli araç şarj istasyonlarının özel kampanyaları, banka kartı indirimleri ve avantajlı fırsatlar hakkında detaylı bilgi.",
    url: "https://sarjkampanya.com/blog/kurban-bayrami-2025",
    type: "article",
    publishedTime: "2025-06-01",
    authors: ["Yasin Baran"],
    images: [
      {
        url: "https://sarjkampanya.com/images/posts/kurban-2025.webp",
        width: 1200,
        height: 630,
        alt: "Kurban Bayramı Elektrikli Araç Şarj Kampanyaları",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kurban Bayramında Elektrikli Araç Şarj Kampanyaları | Şarj Kampanya",
    description: "Kurban Bayramında elektrikli araç şarj istasyonlarının özel kampanyaları, banka kartı indirimleri ve avantajlı fırsatlar hakkında detaylı bilgi.",
    images: ["https://sarjkampanya.com/images/posts/kurban-2025.webp"],
  },
  alternates: {
    canonical: "https://sarjkampanya.com/blog/kurban-bayrami-2025",
  },
}

export default function KurbanBayrami2025() {
  // Find Akbank and Ziraat campaigns
  const akbankCampaign = campaigns.find(c => c.company.name === "Akbank")
  const ziraatCampaign = campaigns.find(c => c.company.name === "Ziraat Bankası")
  
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50 [&_html]:scroll-pt-8">
        <CanonicalWrapper canonicalUrl="https://sarjkampanya.com/blog/kurban-bayrami-2025" />
        <BlogStructuredData 
          title="Kurban Bayramında Elektrikli Araç Şarj Kampanyaları | Sarj Kampanya"
          description="Kurban Bayramında elektrikli araç şarj istasyonlarının özel kampanyaları, banka kartı indirimleri ve avantajlı fırsatlar hakkında detaylı bilgi."
          datePublished="2025-06-01"
          imageUrl="https://sarjkampanya.com/images/posts/kurban-2025.webp"
          authorName="Yasin Baran"
          canonicalUrl="https://sarjkampanya.com/blog/kurban-bayrami-2025"
        />
        <BlogPost
          title="Kurban Bayramında Elektrikli Araç Şarj Kampanyaları"
          label="Kampanyalar"
          published="1 Haziran 2025"
          image="/images/posts/kurban-2025.webp"
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Calendar className="h-6 w-6 text-primary" />
            Kurban Bayramı&apos;nda Elektrikli Araç Şarj İstasyonlarının Özel Kampanyaları
          </h2>
          
          <p>
            2025 Kurban Bayramı döneminde (6-9 Haziran), Türkiye&apos;nin önde gelen bankaları ve elektrikli araç şarj istasyonu operatörleri, 
            elektrikli araç kullanıcılarına özel indirimler ve avantajlı fırsatlar sunuyor. Bu yazımızda, bayram süresince 
            faydalanabileceğiniz tüm kampanyaları detaylı olarak inceleyeceğiz.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300 font-medium">
              <span className="mt-1 flex-shrink-0">📢</span>
              <span>Bayram boyunca geçerli olacak tüm kampanyalar bu sayfada güncellenecektir. Takipte kalın!</span>
            </p>
          </div>

          {/* RHG Enertürk Campaign Section */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Image 
                src="/images/chargers/rhg-enerturk.svg" 
                alt="RHG Enertürk Logo"
                width={500}
                height={140}
                style={{ height: '140px' }}
                className="object-contain"
                unoptimized
              />
            </div>

            <h3 className="text-xl font-semibold mb-3">RHG Enertürk Bayram Özel %30 İndirim</h3>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Kampanya Süresi:</span> 
                <span>2-9 Haziran 2025 (Kurban Bayramı boyunca)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-600" />
                <span className="font-medium">İndirim Oranı:</span>
                <span className="text-green-600 font-semibold">%30</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">DC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Normal Tarife</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺10.60</span>
                    <span className="font-bold text-green-600">₺7.42 / kWh</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Bayram boyunca tüm DC şarj noktalarında %30 indirim
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">AC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Normal Tarife</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺8.40</span>
                    <span className="font-bold text-green-600">₺5.88 / kWh</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Bayram boyunca tüm AC şarj noktalarında %30 indirim
                </div>
              </div>
            </div>

            {/* Bank Discounts for RHG Enertürk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              <a 
                href="#akbank-campaign" 
                className="transition-transform hover:scale-[1.02]"
              >
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                  <div className="h-12 relative mb-2">
                    <Image 
                      src={akbankCampaign?.company.logo || ''}
                      alt="Akbank Logo"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DC Şarj Fiyatları</span>
                    <div>
                      <span className="text-red-500 line-through mr-2">₺7.42</span>
                      <span className="font-bold text-green-600">₺5.94 / kWh</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">AC Şarj Fiyatları</span>
                    <div>
                      <span className="text-red-500 line-through mr-2">₺5.88</span>
                      <span className="font-bold text-green-600">₺4.70 / kWh</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-2 rounded-md">
                    RHG Enertürk istasyonlarında Akbank banka kartı ile %20 ek indirim
                  </div>
                </div>
              </a>
              
              <a 
                href="#ziraat-campaign" 
                className="transition-transform hover:scale-[1.02]"
              >
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                  <div className="h-12 relative mb-2">
                    <Image 
                      src={ziraatCampaign?.company.logo || ''}
                      alt="Ziraat Bankası Logo"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DC Şarj Fiyatları</span>
                    <div>
                      <span className="text-red-500 line-through mr-2">₺7.42</span>
                      <span className="font-bold text-green-600">₺6.68 / kWh</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">AC Şarj Fiyatları</span>
                    <div>
                      <span className="text-red-500 line-through mr-2">₺5.88</span>
                      <span className="font-bold text-green-600">₺5.29 / kWh</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-2 rounded-md">
                    RHG Enertürk istasyonlarında Ziraat kredi kartı ile %10 ek indirim
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Voltgo Campaign Section */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Image 
                src="/images/chargers/voltgo.png" 
                alt="Voltgo Logo"
                width={500}
                height={140}
                style={{ height: '140px' }}
                className="object-contain"
                unoptimized
              />
            </div>

            <h3 className="text-xl font-semibold mb-3">Voltgo Bayram Özel %50 İndirim</h3>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Kampanya Süresi:</span> 
                <span>6-9 Haziran 2025 (Kurban Bayramı boyunca)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-600" />
                <span className="font-medium">İndirim Oranı:</span>
                <span className="text-green-600 font-semibold">%50</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">DC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Normal Tarife</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺9.75</span>
                    <span className="font-bold text-green-600">₺4.88 / kWh</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Bayram boyunca tüm DC şarj noktalarında %50 indirim
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-semibold mb-2">AC Şarj Fiyatları</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Normal Tarife</span>
                  <div>
                    <span className="text-red-500 line-through mr-2">₺6.99</span>
                    <span className="font-bold text-green-600">₺3.50 / kWh</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Bayram boyunca tüm AC şarj noktalarında %50 indirim
                </div>
              </div>
            </div>

            {/* Bank Discounts for Voltgo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              <a 
                href="#akbank-campaign" 
                className="transition-transform hover:scale-[1.02]"
              >
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                  <div className="h-12 relative mb-2">
                    <Image 
                      src={akbankCampaign?.company.logo || ''}
                      alt="Akbank Logo"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DC Şarj Fiyatları</span>
                    <div>
                      <span className="text-red-500 line-through mr-2">₺4.88</span>
                      <span className="font-bold text-green-600">₺3.90 / kWh</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">AC Şarj Fiyatları</span>
                    <div>
                      <span className="text-red-500 line-through mr-2">₺3.50</span>
                      <span className="font-bold text-green-600">₺2.80 / kWh</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-2 rounded-md">
                    Voltgo istasyonlarında Akbank banka kartı ile %20 ek indirim
                  </div>
                </div>
              </a>
              
              <a 
                href="#ziraat-campaign" 
                className="transition-transform hover:scale-[1.02]"
              >
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                  <div className="h-12 relative mb-2">
                    <Image 
                      src={ziraatCampaign?.company.logo || ''}
                      alt="Ziraat Bankası Logo"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DC Şarj Fiyatları</span>
                    <div>
                      <span className="text-red-500 line-through mr-2">₺4.88</span>
                      <span className="font-bold text-green-600">₺4.39 / kWh</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">AC Şarj Fiyatları</span>
                    <div>
                      <span className="text-red-500 line-through mr-2">₺3.50</span>
                      <span className="font-bold text-green-600">₺3.15 / kWh</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-2 rounded-md">
                    Voltgo istasyonlarında Ziraat kredi kartı ile %10 ek indirim
                  </div>
                </div>
              </a>
            </div>
          </div>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
            Banka Kartları ile Ek İndirimler
          </h2>

          {/* Akbank Campaign Section */}
          <div 
            id="akbank-campaign" 
            className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm scroll-mt-16"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-[500px] h-[140px]">
                <Image 
                  src={akbankCampaign?.company.logo || ''}
                  alt="Akbank Logo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">Akbank %20 İade Kampanyası</h3>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Kampanya Süresi:</span> 
                <span>1 Mayıs - 30 Haziran 2025 (Bayramda da Geçerli)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-600" />
                <span className="font-medium">İade Oranı:</span>
                <span className="text-green-600 font-semibold">%20</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Kampanya Koşulları</h4>
              <ul className="list-disc pl-5 space-y-1">
                {akbankCampaign?.campaign.conditions.map((condition, index) => (
                  <li key={index} className="text-sm">{condition}</li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 mt-4 mb-6">
              <p className="flex items-start gap-2 m-0 text-green-800 dark:text-green-300">
                <span className="mt-1 flex-shrink-0">💡</span>
                <span>
                  <strong>Önemli Not:</strong> Akbank kampanyası tüm şarj istasyonlarında geçerlidir ve bayram süresince de devam etmektedir.
                </span>
              </p>
            </div>

            <div className="text-center">
              <a 
                href={akbankCampaign?.campaign.links.details}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Kampanya Detayları
                <span className="text-lg">↗</span>
              </a>
            </div>
          </div>

          {/* Ziraat Bankası Campaign Section */}
          <div 
            id="ziraat-campaign" 
            className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm scroll-mt-16"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-[500px] h-[140px]">
                <Image 
                  src={ziraatCampaign?.company.logo || ''}
                  alt="Ziraat Bankası Logo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">Ziraat Bankası %10 İndirim ve 500 TL Bankkart Lira</h3>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Kampanya Süresi:</span> 
                <span>12 Mayıs - 30 Haziran 2025 (Bayramda da Geçerli)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-600" />
                <span className="font-medium">İndirim ve Kazanım:</span>
                <span className="text-green-600 font-semibold">%10 İndirim + 500 TL&apos;ye kadar Bankkart Lira</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Kampanya Koşulları</h4>
              <ul className="list-disc pl-5 space-y-1">
                {ziraatCampaign?.campaign.conditions.map((condition, index) => (
                  <li key={index} className="text-sm">{condition}</li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4 mb-6">
              <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300">
                <span className="mt-1 flex-shrink-0">💡</span>
                <span>
                  <strong>Önemli Not:</strong> 250 TL ve üzeri tek seferlik ödemelerde geçerlidir. Katılım için Bankkart Mobil veya bankkart.com.tr üzerinden kampanyaya katılım sağlanmalıdır.
                </span>
              </p>
            </div>

            <div className="text-center">
              <a 
                href={ziraatCampaign?.campaign.links.details}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Kampanya Detayları
                <span className="text-lg">↗</span>
              </a>
            </div>
          </div>

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Zap className="h-6 w-6 text-primary" />
            Bayram Döneminde Dikkat Edilmesi Gerekenler
          </h2>

          <div className="space-y-4">
            <p>
              Kurban Bayramı döneminde şarj istasyonlarında yoğunluk yaşanması bekleniyor. 
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
            2025 Kurban Bayramı döneminde elektrikli araç kullanıcıları için sunulan bu özel kampanyalar, 
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
      </div>
    </BlogPostWrapper>
  );
} 
