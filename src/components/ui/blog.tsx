import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
}

interface BlogProps {
  tagline: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  posts: Post[];
}

const Blog = ({
  tagline = "En Son Yazılar",
  heading = "Blog Yazıları",
  description = "Elektrikli araç kullanıcıları için en güncel bilgiler, ipuçları ve sektördeki yenilikler. Şarj stratejileri, maliyet tasarrufu ve verimli kullanım için uzman görüşlerimizi takip edin.",
  buttonText = "Tüm yazıları görüntüle",
  buttonUrl = "/blog",
  posts = [],
}: BlogProps) => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:gap-8">
          <div className="mx-auto max-w-2xl text-center">
            {tagline && (
              <p className="font-medium text-primary">{tagline}</p>
            )}
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {heading}
            </h2>
            {description && (
              <p className="mt-4 text-muted-foreground md:text-lg">
                {description}
              </p>
            )}
            {buttonText && buttonUrl && (
              <div className="mt-6 flex justify-center">
                <Button asChild variant="outline">
                  <a href={buttonUrl}>
                    {buttonText} <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post, index) => (
            <Card key={post.id} className="grid grid-rows-[auto_auto_1fr_auto] text-left">
              <div className="aspect-[16/9] w-full relative overflow-hidden">
                <a
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
                    unoptimized
                  />
                </a>
              </div>
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  <a href={post.url}>
                    {post.title}
                  </a>
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.summary}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={post.url}
                  className="flex items-center text-foreground hover:underline"
                >
                  Devamını oku
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog, type Post }; 