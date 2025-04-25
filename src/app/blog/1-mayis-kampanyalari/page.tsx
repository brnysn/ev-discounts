"use client"

import { BlogPost } from "@/components/ui/blog-post"
import { blogPosts } from "@/app/data/blog-posts"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"
import { 
  Percent, 
  Zap,
} from "lucide-react"

export default function MayisKampanyalari() {
  const post = blogPosts.find(post => post.id === "post-5")
  
  if (!post) {
    return <div>Blog yazısı bulunamadı</div>
  }
  
  return (
    <BlogPostWrapper>
      <div className="min-h-screen bg-gray-50">
        <BlogPost
          title={post.title}
          label={post.label}
          published={post.published}
          image={post.image}
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Percent className="h-6 w-6 text-primary" />
            1 Mayıs&apos;ta Elektrikli Araç Şarj İstasyonlarının Özel Kampanyaları
          </h2>
          
          <p>
            Emek ve Dayanışma Günü olan 1 Mayıs&apos;ta, Türkiye&apos;deki önde gelen elektrikli araç şarj istasyonu operatörleri, elektrikli araç kullanıcılarına özel indirimler ve fırsatlar sunuyor. Bu kampanyalar hem işçi bayramını kutlamak hem de elektrikli araç kullanımını teşvik etmek amacıyla düzenleniyor. Peki bu özel günde hangi şarj operatörleri ne tür avantajlar sunuyor? Hepsini bu yazımızda derledik.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
            <p className="flex items-start gap-2 m-0 text-blue-800 dark:text-blue-300 font-medium">
              <span className="mt-1 flex-shrink-0">📢</span>
              <span>Açıklanan Tüm 1 Mayıs Şarj Kampanyaları Aşağıda Sizin İçin Listelenecek — En güncel fırsatları buradan takip edebilirsiniz!</span>
            </p>
          </div>
          
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 mt-6">
            <span>🗂</span> 1 Mayıs Şarj Kampanyaları Listesi
          </h3>
          
          <p className="italic text-gray-600 mb-6">
            Aşağıda açıklanan tüm kampanyalar anlık olarak güncellenecek.
          </p>
          
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