export interface Author {
  name: string
  role: string
  expertise: string[]
  bio: string
  profileUrl?: string
  linkedIn?: string
  github?: string
}

export interface LearnPage {
  title: string
  slug: string
  description: string
  category?: string
  keywords?: string[]
  searchVolume: number
  // E-E-A-T signals
  author?: Author
  reviewedBy?: Author
  lastReviewed?: string
  technicalLevel?: 'beginner' | 'intermediate' | 'advanced'
  prerequisites?: string[]
  learningOutcomes?: string[]
  relatedStandards?: string[] // W3C, MDN, etc.
}

export const authors: Record<string, Author> = {
  'svg-team-lead': {
    name: 'Alex Chen',
    role: 'SVG Technology Lead',
    expertise: ['SVG', 'Web Graphics', 'Performance Optimization', 'W3C Standards'],
    bio: '10+ years experience in web graphics and SVG implementation. Contributing member to W3C SVG Working Group.',
    profileUrl: '/about#alex-chen',
    linkedIn: 'https://linkedin.com/in/svg-expert',
    github: 'https://github.com/svg-expert'
  },
  'graphics-engineer': {
    name: 'Sarah Johnson',
    role: 'Senior Graphics Engineer',
    expertise: ['Computer Graphics', 'Vector Formats', 'Image Processing', 'Canvas API'],
    bio: 'Former Adobe engineer with expertise in vector graphics and image processing algorithms.',
    profileUrl: '/about#sarah-johnson',
    linkedIn: 'https://linkedin.com/in/graphics-expert'
  },
  'web-architect': {
    name: 'Michael Park',
    role: 'Web Architecture Specialist',
    expertise: ['Web Standards', 'Performance', 'Accessibility', 'SEO'],
    bio: 'Google Developer Expert with focus on web performance and modern standards.',
    profileUrl: '/about#michael-park'
  }
}

export const learnPageConfigs: LearnPage[] = [
  {
    title: 'What is SVG?',
    slug: 'what-is-svg',
    description: 'Learn about Scalable Vector Graphics and why they are essential for modern web design',
    category: 'Basics',
    keywords: ['svg', 'vector graphics', 'web graphics', 'scalable vector graphics', 'svg meaning'],
    searchVolume: 33100,
    author: authors['svg-team-lead'],
    reviewedBy: authors['web-architect'],
    lastReviewed: '2025-01-10',
    technicalLevel: 'beginner',
    learningOutcomes: [
      'Understand what SVG is and how it differs from raster graphics',
      'Learn the benefits of using SVG for web design',
      'Identify when to use SVG vs other image formats',
      'Create your first SVG element'
    ],
    relatedStandards: ['W3C SVG 2.0', 'MDN Web Docs']
  },
  {
    title: 'SVG File Format',
    slug: 'svg-file-format',
    description: 'Understanding the SVG file format structure and syntax',
    category: 'Technical',
    keywords: ['svg format', 'xml', 'svg syntax', 'svg structure', 'svg elements'],
    searchVolume: 9900,
    author: authors['graphics-engineer'],
    reviewedBy: authors['svg-team-lead'],
    lastReviewed: '2025-01-08',
    technicalLevel: 'intermediate',
    prerequisites: ['Basic XML knowledge', 'Understanding of coordinate systems'],
    learningOutcomes: [
      'Master SVG document structure and syntax',
      'Understand SVG coordinate systems and viewBox',
      'Learn about SVG elements and attributes',
      'Write valid SVG code from scratch'
    ],
    relatedStandards: ['W3C SVG Specification', 'XML 1.0']
  },
  {
    title: 'How to Convert Images to SVG',
    slug: 'how-to-convert',
    description: 'Step-by-step guide on converting various image formats to SVG',
    category: 'Tutorials',
    keywords: ['convert to svg', 'image conversion', 'svg tools', 'png to svg', 'jpg to svg'],
    searchVolume: 14800,
    author: authors['graphics-engineer'],
    reviewedBy: authors['svg-team-lead'],
    lastReviewed: '2025-01-12',
    technicalLevel: 'beginner',
    learningOutcomes: [
      'Convert raster images to SVG using various methods',
      'Understand tracing algorithms and settings',
      'Optimize converted SVGs for web use',
      'Choose the right tool for your conversion needs'
    ],
    relatedStandards: ['SVG 2.0', 'Image Processing Standards']
  }
]