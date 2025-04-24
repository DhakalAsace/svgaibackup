/**
 * Unified blog content interface for both MDX and custom page-based posts
 */

/**
 * Represents a blog post from any source in the application
 */
export interface BlogPost {
  /**
   * Unique identifier/URL path for the blog post
   */
  slug: string;
  
  /**
   * Source of the blog post content
   * - 'mdx': Content from MDX files in /content/blog/
   * - 'custom-page': Content from React pages in /app/blog/
   */
  source: 'mdx' | 'custom-page';
  
  /**
   * Common metadata for all blog posts
   */
  metadata: {
    /** Post title */
    title: string;
    
    /** Publication date in ISO format */
    date: string;
    
    /** Brief summary of the post */
    description: string;
    
    /** Optional categorization tags */
    tags?: string[];
    
    /** Optional author information */
    author?: string;
    
    /** Optional featured image path */
    image?: string;
    
    /** Whether this post should be featured */
    featured?: boolean;
  };
  
  /**
   * Raw MDX content (only present for 'mdx' source posts)
   */
  content?: string;
}