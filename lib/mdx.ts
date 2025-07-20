import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from './blog-types'
import { createLogger } from '@/lib/logger'

const logger = createLogger('mdx')

/**
 * Legacy type for backward compatibility
 * @deprecated Use BlogPost from blog-types.ts instead
 */
type Metadata = {
  title: string
  date: string
  description: string
  tags?: string[]
  author?: string
  image?: string
  slug: string
  featured?: boolean
}

/**
 * Base directory for blog content
 */
const BLOG_DIR = path.join(process.cwd(), 'content/blog')

/**
 * Base directory for learn content
 */
const LEARN_DIR = path.join(process.cwd(), 'content/learn')

// For debugging - enable to log additional information
const DEBUG = false

// Helper function to log debug info
function debug(...args: any[]) {
  if (DEBUG) {
    console.log('[MDX Debug]', ...args)
  }
}

/**
 * Normalize a file path across operating systems
 * Handles both Windows and Unix path separators
 */
function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

/**
 * Helper function to recursively get all files in a directory with error handling
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      logger.warn(`Directory not found: ${dirPath}`);
      debug(`Directory path ${dirPath} does not exist`);
      debug(`Current working directory: ${process.cwd()}`);
      return arrayOfFiles;
    }
    
    debug(`Reading directory: ${dirPath}`);
    
    // Read directory contents
    const files = fs.readdirSync(dirPath);
    debug(`Found ${files.length} items in ${dirPath}:`, files);
    
    // Process each file/directory
    files.forEach((file) => {
      try {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          // Recursively process subdirectories
          debug(`${fullPath} is a directory, processing recursively...`);
          arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
          // Add file to result array
          debug(`Adding file to result array: ${fullPath}`);
          arrayOfFiles.push(fullPath);
        }
      } catch (error) {
        console.error(`Error processing file ${file} in ${dirPath}:`, error);
        debug(`Error details:`, error);
      }
    });
    
    return arrayOfFiles;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    debug(`Error details:`, error);
    return arrayOfFiles;
  }
}

/**
 * Ensures the blog directory exists, creating it if needed
 */
export function ensureBlogDirExists(): void {
  try {
    const contentDir = path.join(process.cwd(), 'content');
    
    // Create content directory if it doesn't exist
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir);
      console.log(`Created content directory: ${contentDir}`);
    }
    
    // Create blog directory if it doesn't exist
    if (!fs.existsSync(BLOG_DIR)) {
      fs.mkdirSync(BLOG_DIR);
      console.log(`Created blog directory: ${BLOG_DIR}`);
    }
  } catch (error) {
    console.error('Error ensuring blog directory exists:', error);
  }
}

/**
 * Get all blog post files recursively
 * Returns paths relative to BLOG_DIR
 */
export function getBlogPostFiles(): string[] {
  ensureBlogDirExists();
  
  try {
    const allFiles = getAllFiles(BLOG_DIR);
    
    // Filter for markdown files and normalize paths
    return allFiles
      .filter((file) => /\.(md|mdx)$/i.test(file)) // Case-insensitive extension matching
      .map((file) => {
        const relativePath = path.relative(BLOG_DIR, file);
        return normalizePath(relativePath); // Normalize path separators
      });
  } catch (error) {
    console.error('Error getting blog post files:', error);
    return [];
  }
}

/**
 * Get blog post by slug (slug includes subdirectory path)
 * Handles various path formats and encodings
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    debug(`Getting blog post for slug: "${slug}"`);
    
    // Handle URL encoding in slug (%2F → /) and trim any whitespace
    const decodedSlug = decodeURIComponent(slug).trim();
    debug(`Decoded slug: "${decodedSlug}"`);
    
    // Normalize path separators for slug and remove any file extension
    const realSlug = normalizePath(decodedSlug).replace(/\.(md|mdx)$/i, '');
    debug(`Normalized slug: "${realSlug}"`);
    
    // Try with .mdx extension first (preferred)
    let filePath = path.join(BLOG_DIR, `${realSlug}.mdx`);
    debug(`Trying .mdx path: ${filePath}`);
    let fileExists = fs.existsSync(filePath);
    
    // If .mdx doesn't exist, try .md extension
    if (!fileExists) {
      filePath = path.join(BLOG_DIR, `${realSlug}.md`);
      debug(`Trying .md path: ${filePath}`);
      fileExists = fs.existsSync(filePath);
    }
    
    // Handle case insensitivity issues on some file systems
    if (!fileExists) {
      debug(`File not found with exact match, trying case-insensitive search`);
      // Try to find the file regardless of case
      const dir = path.dirname(path.join(BLOG_DIR, realSlug));
      const basename = path.basename(realSlug);
      
      debug(`Looking in directory: ${dir} for basename: ${basename}`);
      
      try {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          debug(`Files in directory:`, files);
          
          const matchingFile = files.find(file => 
            file.toLowerCase() === `${basename}.mdx`.toLowerCase() || 
            file.toLowerCase() === `${basename}.md`.toLowerCase()
          );
          
          if (matchingFile) {
            filePath = path.join(dir, matchingFile);
            debug(`Found case-insensitive match: ${filePath}`);
            fileExists = true;
          }
        } else {
          debug(`Directory ${dir} doesn't exist`);
        }
      } catch (error) {
        console.error(`Error looking for case-insensitive match for ${realSlug}:`, error);
        debug(`Error details:`, error);
      }
    }
    
    // Exit if file still doesn't exist
    if (!fileExists) {
      logger.warn(`Blog post not found at path: ${filePath}`);
      debug(`No file found for slug: ${realSlug}`);
      return null;
    }
    
    debug(`Reading file: ${filePath}`);
    
    // Read and parse the file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    debug(`Parsed frontmatter:`, data);
    
    // Validate required metadata fields
    if (!data.title) {
      logger.warn(`Blog post at ${filePath} is missing a title`);
      debug(`Missing title, adding placeholder`);
      data.title = "Untitled Post";
    }
    
    if (!data.date) {
      logger.warn(`Blog post at ${filePath} is missing a date`);
      debug(`Missing date, using file stats instead`);
      // Use file stats date as fallback
      try {
        const stats = fs.statSync(filePath);
        data.date = stats.mtime.toISOString();
        debug(`Using mtime: ${data.date}`);
      } catch (e) {
        data.date = new Date().toISOString();
        debug(`Using current date: ${data.date}`);
      }
    }
    
    if (!data.description) {
      logger.warn(`Blog post at ${filePath} is missing a description`);
      debug(`Missing description, generating from content`);
      // Use first paragraph of content as fallback
      const firstParagraph = content.split('\n\n')[0]
        .replace(/^#+\s+.*$/m, '') // Remove headings
        .replace(/[*_`]/g, '')     // Remove markdown formatting
        .trim();
        
      data.description = firstParagraph.length > 160 
        ? firstParagraph.substring(0, 157) + '...'
        : firstParagraph;
        
      debug(`Generated description: ${data.description}`);
    }
    
    // Build the BlogPost object with correct source type
    const blogPost = {
      slug: realSlug,
      source: 'mdx' as const,
      metadata: {
        ...data,
        slug: realSlug,
      } as Metadata,
      content,
    };
    
    debug(`Successfully loaded blog post: ${realSlug}`);
    return blogPost;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    debug(`Error details:`, error);
    return null;
  }
}

// Get all blog posts with metadata
export function getAllBlogPosts() {
  debug('Getting all blog posts...');
  
  try {
    const files = getBlogPostFiles() // Now gets relative paths like 'subdir/file.mdx'
    debug(`Found ${files.length} blog post files:`, files);
    
    const posts = files
      .map((file) => {
        try {
          // Slug is the relative path without the extension, normalize slashes
          const normalizedFile = file.replace(/\\/g, '/');
          const slug = normalizedFile.replace(/\.mdx?$/, '');
          
          debug(`Processing file: ${file}, normalized slug: ${slug}`);
          
          // Get the post using the normalized slug
          const post = getBlogPostBySlug(slug);
          
          if (!post) {
            debug(`No post found for slug: ${slug}`);
            return null;
          }
          
          // Ensure the metadata object includes the correct slug
          return {
            slug: post.slug, // Use the slug returned by getBlogPostBySlug
            source: 'mdx' as const,
            metadata: post.metadata, // Use metadata returned by getBlogPostBySlug
          };
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
          return null;
        }
      })
      .filter(Boolean)
      .sort((post1, post2) => {
        // Handle potential undefined dates gracefully
        const date1 = post1?.metadata?.date ? new Date(post1.metadata.date).getTime() : 0;
        const date2 = post2?.metadata?.date ? new Date(post2.metadata.date).getTime() : 0;
        // Fallback to 0 if date is invalid or missing
        return (isNaN(date2) ? 0 : date2) - (isNaN(date1) ? 0 : date1); // Sort newest first
      });
    
    debug(`Processed ${posts.length} blog posts successfully`);
    return posts as { slug: string; source: 'mdx'; metadata: Metadata }[];
  } catch (error) {
    console.error('Error in getAllBlogPosts:', error);
    return []; // Return empty array on error to prevent app crash
  }
}

// Get featured blog posts
export function getFeaturedBlogPosts(count = 3) {
  const posts = getAllBlogPosts()
  return posts
    .filter((post) => post.metadata.featured)
    .slice(0, count)
}

// Get blog post tags
export function getBlogPostTags() {
  const posts = getAllBlogPosts()
  const tags = new Set<string>()
  
  posts.forEach((post) => {
    if (post.metadata.tags) {
      post.metadata.tags.forEach((tag) => tags.add(tag))
    }
  })
  
  return Array.from(tags)
}

// Get blog posts by tag
export function getBlogPostsByTag(tag: string) {
  const posts = getAllBlogPosts()
  return posts.filter((post) => 
    post.metadata.tags && post.metadata.tags.includes(tag)
  )
}

/**
 * Ensures the learn directory exists, creating it if needed
 */
export function ensureLearnDirExists(): void {
  try {
    const contentDir = path.join(process.cwd(), 'content');
    
    // Create content directory if it doesn't exist
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir);
      console.log(`Created content directory: ${contentDir}`);
    }
    
    // Create learn directory if it doesn't exist
    if (!fs.existsSync(LEARN_DIR)) {
      fs.mkdirSync(LEARN_DIR);
      console.log(`Created learn directory: ${LEARN_DIR}`);
    }
  } catch (error) {
    console.error('Error ensuring learn directory exists:', error);
  }
}

/**
 * Get all learn content files
 * Returns paths relative to LEARN_DIR
 */
export function getLearnContentFiles(): string[] {
  ensureLearnDirExists();
  
  try {
    const allFiles = getAllFiles(LEARN_DIR);
    
    // Filter for markdown files and normalize paths
    return allFiles
      .filter((file) => /\.(md|mdx)$/i.test(file))
      .map((file) => {
        const relativePath = path.relative(LEARN_DIR, file);
        return normalizePath(relativePath);
      });
  } catch (error) {
    console.error('Error getting learn content files:', error);
    return [];
  }
}

/**
 * Get learn content by slug
 */
export function getLearnContentBySlug(slug: string): BlogPost | null {
  try {
    debug(`Getting learn content for slug: "${slug}"`);
    
    // Handle URL encoding in slug
    const decodedSlug = decodeURIComponent(slug).trim();
    debug(`Decoded slug: "${decodedSlug}"`);
    
    // Normalize path separators for slug and remove any file extension
    const realSlug = normalizePath(decodedSlug).replace(/\.(md|mdx)$/i, '');
    debug(`Normalized slug: "${realSlug}"`);
    
    // Try with .mdx extension first (preferred)
    let filePath = path.join(LEARN_DIR, `${realSlug}.mdx`);
    debug(`Trying .mdx path: ${filePath}`);
    let fileExists = fs.existsSync(filePath);
    
    // If .mdx doesn't exist, try .md extension
    if (!fileExists) {
      filePath = path.join(LEARN_DIR, `${realSlug}.md`);
      debug(`Trying .md path: ${filePath}`);
      fileExists = fs.existsSync(filePath);
    }
    
    // Exit if file doesn't exist
    if (!fileExists) {
      logger.warn(`Learn content not found at path: ${filePath}`);
      debug(`No file found for slug: ${realSlug}`);
      return null;
    }
    
    debug(`Reading file: ${filePath}`);
    
    // Read and parse the file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    debug(`Parsed frontmatter:`, data);
    
    // Validate required metadata fields
    if (!data.title) {
      logger.warn(`Learn content at ${filePath} is missing a title`);
      data.title = "Untitled Learn Content";
    }
    
    if (!data.date) {
      logger.warn(`Learn content at ${filePath} is missing a date`);
      const stats = fs.statSync(filePath);
      data.date = stats.mtime.toISOString();
    }
    
    if (!data.description) {
      logger.warn(`Learn content at ${filePath} is missing a description`);
      const firstParagraph = content.split('\n\n')[0]
        .replace(/^#+\s+.*$/m, '')
        .replace(/[*_`]/g, '')
        .trim();
      data.description = firstParagraph.length > 160 
        ? firstParagraph.substring(0, 157) + '...'
        : firstParagraph;
    }
    
    // Build the content object
    return {
      slug: realSlug,
      source: 'mdx' as const,
      metadata: {
        ...data,
        slug: realSlug,
      } as Metadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading learn content ${slug}:`, error);
    return null;
  }
}

/**
 * Get all MDX files from a specific directory (blog or learn)
 */
export function getAllMdxFiles(type: 'blog' | 'learn' = 'blog') {
  if (type === 'learn') {
    return getAllLearnContent();
  }
  return getAllBlogPosts();
}

/**
 * Get MDX content by slug from a specific directory
 */
export function getMdxBySlug(type: 'blog' | 'learn', slug: string) {
  if (type === 'learn') {
    return getLearnContentBySlug(slug);
  }
  return getBlogPostBySlug(slug);
}

/**
 * Get all learn content with metadata
 */
export function getAllLearnContent() {
  debug('Getting all learn content...');
  
  try {
    const files = getLearnContentFiles();
    debug(`Found ${files.length} learn content files:`, files);
    
    const content = files
      .map((file) => {
        try {
          const normalizedFile = file.replace(/\\/g, '/');
          const slug = normalizedFile.replace(/\.mdx?$/, '');
          
          debug(`Processing file: ${file}, normalized slug: ${slug}`);
          
          const post = getLearnContentBySlug(slug);
          
          if (!post) {
            debug(`No content found for slug: ${slug}`);
            return null;
          }
          
          return {
            slug: post.slug,
            source: 'mdx' as const,
            metadata: post.metadata,
          };
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
          return null;
        }
      })
      .filter(Boolean)
      .sort((post1, post2) => {
        const date1 = post1?.metadata?.date ? new Date(post1.metadata.date).getTime() : 0;
        const date2 = post2?.metadata?.date ? new Date(post2.metadata.date).getTime() : 0;
        return (isNaN(date2) ? 0 : date2) - (isNaN(date1) ? 0 : date1);
      });
    
    debug(`Processed ${content.length} learn content items successfully`);
    return content as { slug: string; source: 'mdx'; metadata: Metadata }[];
  } catch (error) {
    console.error('Error in getAllLearnContent:', error);
    return [];
  }
}
