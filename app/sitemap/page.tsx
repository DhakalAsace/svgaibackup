import { Metadata } from 'next'
import Link from 'next/link'
import { generateMetaTags, generateBreadcrumbSchema } from '@/lib/seo/technical-seo'
import { converterConfigs } from '@/app/convert/converter-config'
import { getAllGalleryThemes } from '@/app/gallery/gallery-config'
import { getAllMdxFiles } from '@/lib/mdx'

export const metadata: Metadata = generateMetaTags({
  title: 'Sitemap - All Pages | SVG AI',
  description: 'Complete sitemap of SVG AI - Browse all converters, galleries, learn articles, and tools',
  path: '/sitemap'
})

export default function HtmlSitemap() {
  const converters = converterConfigs
    .filter(c => c.isSupported)
    .sort((a, b) => b.searchVolume - a.searchVolume)
  
  const galleries = getAllGalleryThemes()
    .sort((a, b) => b.searchVolume - a.searchVolume)
  
  const learnArticles = getAllMdxFiles('learn')
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://svgai.org' },
    { name: 'Sitemap', url: 'https://svgai.org/sitemap' }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="container max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
        
        {/* Main Pages */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Main Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/ai-icon-generator" className="hover:text-blue-600">AI Icon Generator</Link>
            <Link href="/animate" className="hover:text-blue-600">SVG Animation Tool</Link>
            <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          </div>
        </section>

        {/* Converters Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            SVG Converters ({converters.length} tools)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {converters.map(converter => (
              <Link 
                key={converter.id}
                href={`/convert/${converter.urlSlug}`}
                className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-blue-600 hover:underline">
                  {converter.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {converter.searchVolume.toLocaleString()} monthly searches
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            SVG Galleries ({galleries.length} themes)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleries.map(gallery => (
              <Link 
                key={gallery.slug}
                href={`/gallery/${gallery.slug}`}
                className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-blue-600 hover:underline">
                  {gallery.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {gallery.searchVolume.toLocaleString()} monthly searches
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Learn Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Learn Articles ({learnArticles.length} guides)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learnArticles.map(article => (
              <Link 
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-blue-600 hover:underline">
                  {article.metadata.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {article.metadata.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Free Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              href="/tools/svg-editor"
              className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium text-blue-600 hover:underline">SVG Editor</h3>
              <p className="text-sm text-gray-600">Edit SVG code with syntax highlighting</p>
            </Link>
            <Link 
              href="/tools/svg-optimizer"
              className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium text-blue-600 hover:underline">SVG Optimizer</h3>
              <p className="text-sm text-gray-600">Reduce SVG file size without quality loss</p>
            </Link>
            <Link 
              href="/tools/svg-to-video"
              className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium text-blue-600 hover:underline">SVG to Video</h3>
              <p className="text-sm text-gray-600">Export animated SVGs as video files</p>
            </Link>
          </div>
        </section>

        {/* Footer Links */}
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-blue-600">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-blue-600">Cookie Policy</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact Us</Link>
          </div>
        </section>
      </div>
    </>
  )
}