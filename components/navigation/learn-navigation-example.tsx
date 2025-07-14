/**
 * Example implementation of the learn navigation components
 * This file demonstrates how to integrate the navigation components into your pages
 */

import { 
  LearnNavigation, 
  LearnBreadcrumb, 
  RelatedArticles,
  LearnMegaMenu,
  LearnMobileNav
} from './learn-navigation'

// Example 1: Learn Index Page Implementation
export function LearnIndexPageExample() {
  // Control search volume visibility with environment variable
  const showSearchVolume = process.env.NODE_ENV === 'development' || 
                          process.env.NEXT_PUBLIC_SHOW_SEARCH_VOLUME === 'true'

  return (
    <div className="container mx-auto px-4 py-8">
      <LearnBreadcrumb />
      
      <h1 className="mb-8 text-3xl font-bold">Learn Center</h1>
      
      <LearnNavigation showSearchVolume={showSearchVolume} />
    </div>
  )
}

// Example 2: Individual Learn Page Implementation
export function LearnArticlePageExample({ slug, title }: { slug: string; title: string }) {
  const showSearchVolume = process.env.NODE_ENV === 'development'

  return (
    <div className="container mx-auto px-4 py-8">
      <LearnBreadcrumb currentPage={{ slug, title }} />
      
      <article>
        <h1 className="mb-8 text-3xl font-bold">{title}</h1>
        
        {/* Article content here */}
        
        <RelatedArticles 
          currentSlug={slug} 
          maxItems={4}
          showSearchVolume={showSearchVolume}
        />
      </article>
    </div>
  )
}

// Example 3: Navbar Integration with Mega Menu
export function NavbarWithLearnMegaMenuExample() {
  const showSearchVolume = process.env.NODE_ENV === 'development'

  return (
    <nav className="flex items-center space-x-6">
      {/* Other nav items */}
      
      <div className="group relative">
        <button className="px-4 py-2 hover:text-primary">
          Learn
        </button>
        
        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
          <LearnMegaMenu showSearchVolume={showSearchVolume} />
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="lg:hidden">
        <LearnMobileNav showSearchVolume={showSearchVolume} />
      </div>
    </nav>
  )
}

// Example 4: Admin Dashboard with Search Volumes
export function AdminLearnNavigationExample() {
  // Always show search volumes in admin view
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 rounded-lg bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          Admin View: Search volumes are displayed for SEO optimization
        </p>
      </div>
      
      <LearnNavigation showSearchVolume={true} />
    </div>
  )
}