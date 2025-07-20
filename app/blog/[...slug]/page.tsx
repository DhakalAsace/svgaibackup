import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { BlogHeaderImage } from '@/components/client-wrappers';
import { mdxComponentsMap } from '@/mdx-components';
import { MdxSvgP } from '@/components/mdx-custom-components';
import SvgAwareMDXProvider, { SVGContext } from '@/components/mdx/mdx-provider';

// Generate static params for all blog posts, including nested paths
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }));
}

// Generate metadata for the blog post using the slug array
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = slug.join('/');
  const post = getBlogPostBySlug(fullSlug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: 'article',
      url: `/blog/${fullSlug}`,
      ...(post.metadata.image ? { images: [{ url: post.metadata.image }] } : {}),
    },
  };
}

// Page component accepting the slug array
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const fullSlug = slug.join('/');
  
  // Filter out requests for SVG files
  if (fullSlug.endsWith('.svg')) {
    notFound();
  }

  const post = getBlogPostBySlug(fullSlug);

  if (!post) {
    notFound();
  }
  
  // Compile MDX content with custom components
  const { content } = await compileMDX({
    source: post.content!,
    components: {
      ...mdxComponentsMap,
      svg: (props: React.SVGProps<SVGSVGElement>) => (
        <SVGContext.Provider value={true}>
          <svg {...props} />
        </SVGContext.Provider>
      ),
      p: MdxSvgP,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
  });

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
      "@id": `https://svgai.org/blog/${fullSlug}`
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
      <SvgAwareMDXProvider>
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
              <BlogHeaderImage
                src={post.metadata.image}
                alt={post.metadata.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* MDX content */}
        <article className="max-w-3xl mx-auto prose prose-gray dark:prose-invert prose-headings:font-heading prose-headings:leading-tight prose-headings:tracking-tight">
          {content}
        </article>
      </div>
    </SvgAwareMDXProvider>
    </>
  );
}
