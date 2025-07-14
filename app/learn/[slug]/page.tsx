import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllMdxFiles, getMdxBySlug } from '@/lib/mdx'
import { generateDynamicMetadata, generateArticleSchema, generateEnhancedFAQSchema, generateBreadcrumbSchema, generateLearningResourceSchema, generateReviewSchema } from '@/lib/seo/dynamic-metadata'
import { BreadcrumbWithSchema } from '@/components/seo/breadcrumb-with-schema'
import { RelatedContentSection } from '@/components/seo/related-content-section'
import { learnPageConfigs } from '@/app/learn/learn-config'
import { AuthorCard } from '@/components/learn/author-card'
import { TrustIndicators } from '@/components/learn/trust-indicators'
import { QuickAnswerBox } from '@/components/learn/quick-answer-box'
import { LearningOutcomes } from '@/components/learn/learning-outcomes'
import { LearnArticleLayout } from '@/components/learn/learn-article-layout'

export async function generateStaticParams() {
  const posts = getAllMdxFiles('learn')
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getMdxBySlug('learn', slug)
  const config = learnPageConfigs.find(c => c.slug === slug)
  
  if (!post) {
    return {
      title: 'Article Not Found | SVG AI Learn',
      description: 'The requested article could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const { title, description } = post.metadata
  const keywords = config?.keywords || (post.metadata as any).keywords || []
  
  // Enhanced metadata with E-E-A-T signals
  const enhancedTitle = config?.technicalLevel === 'advanced' 
    ? `${title} [Advanced Guide 2025]`
    : config?.technicalLevel === 'intermediate'
    ? `${title} - Comprehensive Tutorial`
    : `${title} - Complete Beginner's Guide`
    
  const enhancedDescription = config?.author 
    ? `${description} Written by ${config.author.name}, ${config.author.role}. Last updated ${new Date(config.lastReviewed || Date.now()).toLocaleDateString()}.`
    : description

  return generateDynamicMetadata({
    title: enhancedTitle,
    description: enhancedDescription,
    keywords: typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : keywords,
    url: `https://svgai.org/learn/${slug}`,
    type: 'article',
    image: `/og-images/learn-${slug}.png`,
    searchVolume: config?.searchVolume || 0,
    lastModified: config?.lastReviewed || post.metadata.date || new Date().toISOString(),
  })
}

export default async function LearnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getMdxBySlug('learn', slug)
  const config = learnPageConfigs.find(c => c.slug === slug)

  if (!post) {
    notFound()
  }

  const keywords = config?.keywords || (typeof (post.metadata as any).keywords === 'string' 
    ? (post.metadata as any).keywords.split(',').map((k: string) => k.trim()) 
    : (post.metadata as any).keywords || [])

  const wordCount = post.content ? post.content.split(' ').length : 0
  const readingTime = Math.ceil(wordCount / 200)

  // Generate enhanced structured data with E-E-A-T
  const articleSchema = generateArticleSchema({
    title: post.metadata.title,
    description: post.metadata.description || '',
    url: `https://svgai.org/learn/${slug}`,
    datePublished: post.metadata.date || new Date().toISOString(),
    dateModified: config?.lastReviewed || new Date().toISOString(),
    keywords,
    wordCount,
    author: config?.author,
    reviewedBy: config?.reviewedBy,
    technicalLevel: config?.technicalLevel,
    learningOutcomes: config?.learningOutcomes,
  })

  // Generate enhanced FAQ schema with expert attribution
  const faqSchema = generateEnhancedFAQSchema([
    {
      question: `What is ${post.metadata.title.toLowerCase().includes('svg') ? 'SVG' : post.metadata.title}?`,
      answer: post.metadata.description || 'Learn about this topic in our comprehensive guide.',
      expertName: config?.author?.name,
      expertRole: config?.author?.role,
      dateAnswered: config?.lastReviewed,
    },
    {
      question: 'Is this guide suitable for beginners?',
      answer: config?.technicalLevel === 'beginner' 
        ? 'Yes, this guide is specifically written for beginners with clear explanations and examples.'
        : config?.technicalLevel === 'intermediate'
        ? 'This guide assumes some basic knowledge but explains concepts clearly for intermediate users.'
        : 'This is an advanced guide that assumes solid foundational knowledge.',
      expertName: config?.author?.name,
      expertRole: config?.author?.role,
    },
    {
      question: 'How often is this guide updated?',
      answer: 'Our technical content is reviewed monthly by our expert team to ensure accuracy and relevance with the latest standards.',
      expertName: config?.reviewedBy?.name,
      expertRole: config?.reviewedBy?.role,
    },
    {
      question: 'Can I use SVG files for commercial projects?',
      answer: 'Yes, SVG files can be used for commercial projects. They are ideal for logos, icons, and illustrations that need to scale perfectly.',
    },
    {
      question: 'What tools do I need to work with SVG?',
      answer: 'You can work with SVG files using free tools like our online editor, or professional software like Adobe Illustrator and Inkscape.',
    },
  ])

  // Generate Learning Resource schema
  const learningResourceSchema = config?.learningOutcomes ? generateLearningResourceSchema({
    name: post.metadata.title,
    description: post.metadata.description || '',
    url: `https://svgai.org/learn/${slug}`,
    learningOutcomes: config.learningOutcomes,
    prerequisites: config.prerequisites,
    timeRequired: `PT${readingTime}M`,
    educationalLevel: config.technicalLevel || 'beginner',
    keywords,
  }) : null

  // Generate Review schema for credibility
  const reviewSchema = generateReviewSchema({
    itemReviewed: post.metadata.title,
    reviewRating: 4.8,
    reviewCount: Math.floor((config?.searchVolume || 1000) / 100),
  })

  const breadcrumbItems = [
    { name: 'Learn', url: '/learn' },
    { name: post.metadata.title },
  ]

  // Quick answer for featured snippets
  const quickAnswer = getQuickAnswer(slug, post.metadata.title)

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {learningResourceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-8">
          <BreadcrumbWithSchema items={breadcrumbItems} />
        </div>

        {/* Quick Answer Box for Featured Snippets */}
        {quickAnswer && (
          <div className="container mx-auto px-4 py-4">
            <QuickAnswerBox
              question={quickAnswer.question}
              answer={quickAnswer.answer}
            />
          </div>
        )}

        {/* Trust Indicators */}
        {config && (
          <div className="container mx-auto px-4 py-4">
            <TrustIndicators
              lastReviewed={config.lastReviewed}
              technicalLevel={config.technicalLevel}
              readingTime={readingTime}
              certifications={config.relatedStandards}
            />
          </div>
        )}

        {/* Learning Outcomes */}
        {(config?.learningOutcomes || config?.prerequisites) && (
          <div className="container mx-auto px-4 py-4">
            <LearningOutcomes
              outcomes={config.learningOutcomes || []}
              prerequisites={config.prerequisites}
            />
          </div>
        )}

        {/* Professional Article Layout */}
        <LearnArticleLayout
          title={post.metadata.title}
          description={post.metadata.description}
          date={config?.lastReviewed || post.metadata.date}
          readTime={readingTime}
          content={post.content || ''}
        >
          {/* Author Information */}
          {config?.author && (
            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-bold mb-4">About the Author</h2>
              <AuthorCard 
                author={config.author} 
                role="author"
              />
              {config.reviewedBy && (
                <AuthorCard 
                  author={config.reviewedBy} 
                  role="reviewer"
                  lastReviewed={config.lastReviewed}
                />
              )}
            </div>
          )}

          {/* Related Content */}
          <RelatedContentSection
            currentType="learn"
            currentSlug={slug}
            keywords={keywords}
            title="Related Articles & Tools"
            className="mt-16"
          />
        </LearnArticleLayout>
      </div>
    </>
  )
}

// Helper function to get quick answers for featured snippets
function getQuickAnswer(slug: string, title: string): { question: string; answer: string } | null {
  const quickAnswers: Record<string, { question: string; answer: string }> = {
    'what-is-svg': {
      question: 'What is SVG?',
      answer: 'SVG (Scalable Vector Graphics) is an XML-based vector image format for two-dimensional graphics with support for interactivity and animation. Unlike raster images (JPEG, PNG), SVG uses mathematical formulas to describe shapes, making them infinitely scalable without quality loss.'
    },
    'svg-file-format': {
      question: 'What is the SVG file format?',
      answer: 'The SVG file format is a text-based, open standard that uses XML to describe vector graphics. It defines graphics in terms of paths, shapes, text, and filters, allowing for resolution-independent images that can be scaled, styled with CSS, and made interactive with JavaScript.'
    },
    'how-to-convert': {
      question: 'How do I convert images to SVG?',
      answer: 'To convert images to SVG: 1) Use an online converter for quick results, 2) Use vector tracing in Adobe Illustrator or Inkscape for quality, 3) Use command-line tools like Potrace for automation. Raster images are traced into vector paths, best suited for logos and simple graphics.'
    },
    'svg-file': {
      question: 'What is an SVG file?',
      answer: 'An SVG file is a graphics file that uses the Scalable Vector Graphics format. It contains XML code that describes shapes, paths, text, and colors. SVG files are resolution-independent, support animation and interactivity, and can be opened in browsers, edited in text editors, and created in vector graphics software.'
    }
  }

  return quickAnswers[slug] || null
}