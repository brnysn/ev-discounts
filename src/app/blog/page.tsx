"use client"

import { blogPosts } from "../data/blog-posts"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ClientAnnouncementPill } from "@/components/client-announcement-pill"
import data from "../data/data.json"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Bilgi Merkezi
          </Badge>
          <h1 className="text-3xl font-bold mb-4 md:text-4xl lg:text-5xl">
            Elektrikli Araç Dünyası
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Elektrikli araç kullanıcıları için en güncel bilgiler, ipuçları ve sektördeki yenilikler.
            Şarj stratejileri, maliyet tasarrufu ve verimli kullanım için uzman görüşlerimiz.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Card key={post.id} className="grid grid-rows-[auto_auto_1fr_auto]">
              <div className="aspect-[16/9] w-full relative overflow-hidden">
                <Link
                  href={post.url}
                  className="transition-opacity duration-200 hover:opacity-70 block h-full w-full"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    className="object-cover object-center"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3}
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </Link>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{post.label}</Badge>
                  <span className="text-sm text-muted-foreground">{post.published}</span>
                </div>
                <h2 className="text-xl font-semibold hover:underline md:text-2xl">
                  <Link href={post.url}>
                    {post.title}
                  </Link>
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.summary}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                {/* <span className="text-sm font-medium">{post.author}</span> */}
                <Link
                  href={post.url}
                  className="flex items-center text-foreground hover:underline"
                >
                  Devamını oku
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link href="/" className="text-primary hover:underline">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </main>
      
      <ClientAnnouncementPill companies={data} />
    </div>
  )
} 