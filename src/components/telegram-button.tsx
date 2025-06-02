import Image from "next/image"
import Link from "next/link"

export function TelegramButton() {
  return (
    <Link
      href="https://t.me/ToggSahipleri"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-4 py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div className="relative w-8 h-8">
        <Image
          src="/images/earacsahipleri.png"
          alt="Elektrikli Araç Sahipleri"
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Telegram Grubumuza Katılın</span>
      </div>
    </Link>
  )
} 