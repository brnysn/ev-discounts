import { BlogNavbar } from "@/components/blog-navbar"

// Simple layout without client components to avoid hydration errors
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BlogNavbar />
      {children}
    </>
  )
} 