import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon,
  Tags, 
  UserIcon, 
  ArrowLeft, 
  Home 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogPostProps {
  title: string;
  label: string;
  author: string;
  published: string;
  image: string;
  children: React.ReactNode;
}

export function BlogPost({
  title,
  label,
  author,
  published,
  image,
  children,
}: BlogPostProps) {
  return (
    <article className="container mx-auto max-w-4xl py-12 px-4">
      <div className="mb-8">
        <Link href="/blog" className="text-primary hover:underline mb-6 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> 
          <span>Tüm Yazılar</span>
        </Link>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge variant="outline" className="flex items-center gap-1">
            <Tags className="h-3 w-3" />
            {label}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{published}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{author}</span>
          </div>
        </div>
      </div>
      
      {image && (
        <div className="mb-10 overflow-hidden rounded-lg shadow-md relative aspect-[21/9]">
          <Image 
            src={image} 
            alt={title} 
            className="object-cover" 
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      )}
      
      <div className="prose prose-lg max-w-none prose-headings:text-primary prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-strong:font-bold prose-strong:text-primary prose-img:rounded-md prose-img:mx-auto prose-img:max-w-full prose-img:max-h-[500px] prose-img:object-contain">
        {children}
      </div>
      
      <div className="mt-16 pt-8 border-t">
        <div className="flex justify-between">
          <Link href="/blog" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            <span>Tüm Yazılara Dön</span>
          </Link>
          <Link href="/" className="text-primary hover:underline inline-flex items-center">
            <Home className="h-4 w-4 mr-2" /> 
            <span>Ana Sayfa</span>
          </Link>
        </div>
      </div>
    </article>
  );
} 