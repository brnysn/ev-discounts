"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

interface FaqSectionProps {
  heading?: string;
  description?: string;
  items?: FaqItem[];
  className?: string;
}

const defaultFaqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "sarjkampanya.com nedir?",
    answer: (
      <p>
        sarjkampanya.com, Elektrikli araç şarj istasyonu firmalarının güncel fiyatlarını, kampanyalarını ve avantajlarını karşılaştırabileceğiniz bağımsız bir platformdur. Hedefimiz, elektrikli araç kullanıcılarının en uygun şarj seçeneğini kolayca bulmalarını sağlamaktır.
      </p>
    ),
  },
  {
    id: "faq-2",
    question: "Sitede listelenen veriler ne kadar günceldir?",
    answer: (
      <p>
        Veriler, şarj firmalarının resmi web siteleri ve uygulamaları üzerinden düzenli olarak kontrol edilerek güncellenmektedir. Kampanyalarda anlık değişiklikler olabileceği için, seçtiğiniz istasyonun uygulaması üzerinden doğrulama yapmanızı öneririz.
      </p>
    ),
  },
  {
    id: "faq-3",
    question: "Hangi firmaların kampanyaları burada yer alıyor?",
    answer: (
      <div>
        <p className="mb-2">
          Şu anda sitemizde Türkiye&apos;nin önde gelen şarj ağı firmalarına ait bilgiler bulunmaktadır:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>ZES (Zorlu Energy Solutions)</li>
          <li>Eşarj</li>
          <li>Sharz.net</li>
          <li>Trugo</li>
          <li>ve diğer bölgesel sağlayıcılar…</li>
        </ul>
        <p className="mt-2">
          Sürekli olarak yeni firmaları ve kampanyaları eklemeye devam ediyoruz.
        </p>
      </div>
    ),
  },
  {
    id: "faq-4",
    question: "Kampanyalar sadece TOGG araçları için mi geçerli?",
    answer: (
      <p>
        Hayır. Platformda yer alan kampanyalar, farklı marka ve modeller için geçerli olabilir. Bazı kampanyalar marka ya da üyelik şartı gerektirebilir. Detaylar her kampanyanın açıklamasında belirtilir.
      </p>
    ),
  },
  {
    id: "faq-5",
    question: "Mobil uygulamanız var mı?",
    answer: (
      <div>
        <p className="mb-2">
          Şu anda sadece web üzerinden hizmet veriyoruz. Ancak çok yakında iOS ve Android uygulamalarımız da kullanıma sunulacak.
        </p>
        <p className="mb-2">
          Bu arada, sarjkampanya.com web sitesini cep telefonunuza kolayca uygulama gibi ekleyerek kullanabilirsiniz:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Android cihazlar: Chrome&apos;da siteyi açın → sağ üstteki üç noktaya dokunun → &quot;Ana ekrana ekle&quot; seçeneğini seçin.</li>
          <li>iPhone cihazlar: Safari&apos;de siteyi açın → alt menüde paylaş simgesine dokunun → &quot;Ana Ekrana Ekle&quot; seçeneğine dokunun.</li>
        </ul>
        <p className="mt-2">
          Bu şekilde siteyi ana ekranınızdan tek dokunuşla açabilirsiniz.
        </p>
      </div>
    ),
  },
  {
    id: "faq-6",
    question: "Yakınımdaki şarj istasyonlarını görebilir miyim?",
    answer: (
      <p>
        Evet. Filtreleme bölümünde konumunuzu seçerek veya şehir bazlı arama yaparak bölgenizdeki şarj istasyonlarını ve kampanyaları kolayca görüntüleyebilirsiniz.
      </p>
    ),
  },
  {
    id: "faq-7",
    question: "Kişisel verilerim güvende mi?",
    answer: (
      <p>
        Evet. Kullanıcı gizliliğine büyük önem veriyoruz. Sitemizde çerezler ve analiz araçları yalnızca kullanıcı deneyimini iyileştirmek amacıyla kullanılmaktadır. Herhangi bir kişisel bilgi ya da ödeme verisi toplanmaz.
      </p>
    ),
  },
  {
    id: "faq-8",
    question: "Yeni kampanyalardan nasıl haberdar olabilirim?",
    answer: (
      <div>
        <p className="mb-2">
          Şu anda e-posta bülteni sistemimiz geliştirme aşamasındadır. Aynı şekilde mobil uygulamamız da yapım sürecindedir.
        </p>
        <p className="mb-2">
          Yakında yayınlanacak uygulamamızla birlikte, push bildirimler aracılığıyla size özel kampanya uyarıları alabileceksiniz. Ayrıca e-posta aboneliğiyle de bilgilendirme alabileceksiniz.
        </p>
        <p>
          O zamana kadar, bizi sosyal medya hesaplarımızdan takip edebilir ya da siteyi düzenli olarak ziyaret ederek kampanyaları manuel olarak kontrol edebilirsiniz.
        </p>
      </div>
    ),
  },
  {
    id: "faq-9",
    question: "Sitede sadece şarj istasyonları mı yer alıyor, başka kampanyalar da olacak mı?",
    answer: (
      <div>
        <p className="mb-2">
          Hayır, sadece şarj istasyonları değil! Yakında elektrikli araç şarjı ile ilgili kampanya sunan bankalar, kredi kartları ve özel markalar da sitemize eklenecek.
        </p>
        <p className="mb-2">
          Örneğin:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Belirli bankaların kredi kartlarıyla yapılan şarj ödemelerinde indirim</li>
          <li>Elektrikli araçlara özel taksitli ödeme kampanyaları</li>
          <li>Şarj aboneliklerinde bankalara özel avantajlar</li>
        </ul>
        <p className="mt-2">
          Tüm bu fırsatları tek bir platform üzerinden karşılaştırmalı olarak takip edebileceksiniz.
        </p>
      </div>
    ),
  },
];

export function FaqSection({
  heading = "Sıkça Sorulan Sorular",
  description = "Elektrikli araç şarj istasyonları ve şarj kampanyaları hakkında en çok sorulan sorular.",
  items = defaultFaqItems,
  className,
}: FaqSectionProps) {
  return (
    <section className={`py-16 ${className || ""}`} id="sss">
      <div className="container space-y-8">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
          <div className="flex justify-center mb-4">
            <MessageCircleQuestion className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full lg:max-w-4xl divide-y"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="py-1">
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-80 cursor-pointer">
                <div className="font-medium sm:py-0.5 lg:py-1 lg:text-lg text-left">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-0.5 lg:mb-1">
                <div className="text-muted-foreground lg:text-base">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
} 