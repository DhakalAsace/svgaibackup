import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  
  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: 'article',
      ...(post.metadata.image ? { images: [{ url: post.metadata.image }] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log(`[Single Slug Blog Page] Rendering blog post for slug: ${slug}`);
  
  // Check if this is a nested slug that should be handled by [...slug]
  if (slug.includes('/')) {
    console.log(`[Single Slug Blog Page] Redirecting nested slug to [...slug] handler`);
    // This shouldn't happen with proper routing, but just in case
    notFound();
    return null;
  }
  
  // First try to find post in custom posts
  const customPosts = [
    'best-ai-icon-tools',
    'ai-icon-maker-vs-traditional-design',
    'how-to-create-app-icons-with-ai',
    'guide-ai-icon-creation',
    'best-ai-icon-generators-compared'
  ];
  
  const isCustomPost = customPosts.includes(slug);
  let post = null;
  
  if (isCustomPost) {
    console.log(`[Single Slug Blog Page] Handling custom post: ${slug}`);
    // This is a custom page-based post
    // For these posts, we should've been redirected to the specific page already
    // by Next.js routing, but we'll handle it here just in case
    notFound();
    return null;
  } else {
    // Try to get post from MDX
    post = getBlogPostBySlug(slug);
    
    if (!post) {
      console.log(`[Single Slug Blog Page] Post not found for slug: ${slug}`);
      notFound();
      return null;
    }
    
    console.log(`[Single Slug Blog Page] Found MDX post: ${post.metadata.title}`);
  }
  
  // Generate Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.metadata.title,
    "description": post.metadata.description,
    "image": post.metadata.image || "https://svgai.org/og-blog.png",
    "datePublished": post.metadata.date,
    "dateModified": post.metadata.date,
    "author": {
      "@type": post.metadata.author?.includes(',') ? "Person" : "Organization",
      "name": post.metadata.author || "SVG AI Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SVG AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://svgai.org/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://svgai.org/blog/${slug}`
    },
    ...(post.metadata.tags && { 
      "keywords": post.metadata.tags.join(", "),
      "about": post.metadata.tags.map((tag: string) => ({
        "@type": "Thing",
        "name": tag
      }))
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container px-4 py-12 mx-auto">
      {/* Back to blog link */}
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to blog
        </Link>
      </div>
      
      {/* Post header */}
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          {post.metadata.title}
        </h1>
        
        <div className="flex items-center gap-x-4 text-sm text-muted-foreground mb-8">
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          
          {post.metadata.author && (
            <div>By {post.metadata.author}</div>
          )}
        </div>
        
        {post.metadata.image && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={post.metadata.image}
              alt={post.metadata.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.metadata.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* MDX content */}
      <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert prose-headings:font-heading prose-headings:leading-tight prose-headings:tracking-tight">
        {/* Simplified MDX rendering for now - display raw content */}
        <div dangerouslySetInnerHTML={{ __html: `<div class="markdown-content">${post.content}</div>` }} />
      </div>
    </div>
    </>
  )
}
