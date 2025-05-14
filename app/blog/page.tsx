import React from 'react'
import { getAllBlogPosts } from '@/lib/mdx'
import BlogCardWrapper from '@/components/blog-card-wrapper'

// Define our custom page-based blog posts
const customPosts = [
  {
    slug: 'best-ai-icon-tools',
    metadata: {
      title: '10 Best AI Icon Tools That Will Transform Your Design Process',
      description: 'Discover the 10 best AI icon tools in 2025! Compare features, pricing, pros & cons of IconifyAI, Recraft, Fotor & more. Find the perfect fit + a top free SVG option!',
      image: '/blog/custom/ai-icon-tools-comparison.svg',
      date: new Date().toISOString(),
      tags: ['AI Icon Tools', 'Vector Graphics', 'SVG']
    }
  },
  {
    slug: 'ai-icon-maker-vs-traditional-design',
    metadata: {
      title: 'AI Icon Maker vs Traditional Design: Which Delivers Better Results?',
      description: 'AI icon maker vs traditional design: which is better? Compare speed, cost, customization, and quality. See when to use AI (like SVG AI for free SVGs) and when traditional methods shine.',
      image: '/blog/custom/ai-vs-traditional-design.svg',
      date: new Date().toISOString(),
      tags: ['AI Icon Maker', 'Traditional Design', 'SVG']
    }
  },
  {
    slug: 'how-to-create-app-icons-with-ai',
    metadata: {
      title: 'How to Create Perfect App Icons with AI: Step-by-Step Tutorial',
      description: 'Learn how to create perfect app icons with an AI App Icon Generator! Step-by-step guide covering prompts, styles, platform rules & using tools like SVG AI for free SVG icons.',
      image: '/svg-examples/app-icons-with-ai-custom.svg',
      date: new Date().toISOString(),
      tags: ['App Icons', 'AI Generation', 'SVG']
    }
  },
  {
    slug: 'guide-ai-icon-creation',
    metadata: {
      title: 'The Complete Guide to AI Icon Creation: Tools, Tips, and Techniques',
      description: 'Master AI icon creation! This complete guide covers tools, advanced prompt techniques, styles, refining SVG icons (with SVG AI), and future trends. Elevate your design process!',
      image: '/svg-examples/ai-icon-creation-guide-custom.svg',
      date: new Date().toISOString(),
      tags: ['AI Icon Creation', 'Prompt Engineering', 'SVG']
    }
  },
  {
    slug: 'best-ai-icon-generators-compared',
    metadata: {
      title: '7 Best AI Icon Generators Compared: Find Your Perfect Tool',
      description: 'Compare the 7 best AI icon generators of 2025. Detailed analysis of features, pricing, output quality & more. Find which one offers the best SVG support, customization & value!',
      image: '/blog/custom/best-ai-icon-generators.svg',
      date: new Date().toISOString(),
      tags: ['AI Icon Generators', 'Comparison', 'SVG']
    }
  }
];

export default function BlogPage() {
  // Fetch both MDX posts and include custom page-based posts
  const mdxPosts = getAllBlogPosts();
  
  // Add source property to custom posts to match MDX posts structure
  const customPostsWithSource = customPosts.map(post => ({
    ...post,
    source: 'custom-page' as const
  }));
  
  // Combine MDX posts with our custom page-based posts
  const allPosts = [...mdxPosts, ...customPostsWithSource];
  
  // Sort all posts by date (newest first)
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Insights, tutorials, and updates about SVG AI generation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <BlogCardWrapper 
              key={post.slug} 
              slug={post.slug}
              metadata={post.metadata}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-semibold">No blog posts yet</h3>
            <p className="mt-2 text-muted-foreground">Check back soon for new content!</p>
          </div>
        )}
      </div>
    </div>
  )
}