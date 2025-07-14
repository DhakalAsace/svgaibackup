// Centralized converter content data
// Import all converter-specific content modules

import { pngToSvgContent } from './png-to-svg'
import { svgToPngContent } from './svg-to-png'

// Type for converter content data
export interface DetailedConverterContent {
  title: string
  introduction: string
  extendedIntroduction: string
  whyConvert: {
    mainReasons: Array<{
      title: string
      description: string
    }>
  }
  technicalDetails: any
  detailedTutorial: any
  commonProblems: Array<{
    problem: string
    symptoms: string[]
    solutions: string[]
  }>
  industryApplications: any[]
  optimizationStrategies: any
  toolsComparison: any
  codeExamples?: any
  faqs: Array<{
    question: string
    answer: string
  }>
  metadata: {
    lastUpdated: string
    author: string
    category: string
    readingTime: string
    difficulty: string
  }
}

// Map of converter IDs to their detailed content
export const converterContentMap: Record<string, DetailedConverterContent> = {
  'png-to-svg': pngToSvgContent,
  'svg-to-png': svgToPngContent,
  // Additional converters will be added by sub-agents
  'jpg-to-svg': {
    title: "JPG to SVG Converter: Transform Photos into Scalable Vectors",
    introduction: "Converting JPG images to SVG format presents unique challenges and opportunities. This guide covers advanced techniques for transforming photographic content into vector graphics.",
    extendedIntroduction: "JPG (JPEG) is the most common format for digital photography, using lossy compression to achieve small file sizes. Converting these raster images to vector SVG format requires sophisticated algorithms and often artistic interpretation. While perfect conversion of complex photos isn't always possible, many use cases benefit from JPG to SVG transformation.",
    whyConvert: {
      mainReasons: [
        {
          title: "Logo Extraction from Photos",
          description: "Extract and vectorize logos from photographs, marketing materials, or scanned documents for scalable reproduction."
        },
        {
          title: "Artistic Interpretation",
          description: "Transform photographs into stylized vector illustrations for unique visual effects and artistic applications."
        },
        {
          title: "Technical Drawing Recovery",
          description: "Convert scanned technical drawings or diagrams from JPG format into editable vector graphics."
        },
        {
          title: "Scalability Requirements",
          description: "Create infinitely scalable versions of important visual elements originally captured as photographs."
        }
      ]
    },
    technicalDetails: {},
    detailedTutorial: {},
    commonProblems: [],
    industryApplications: [],
    optimizationStrategies: {},
    toolsComparison: {},
    faqs: [
      {
        question: "Can I convert any JPG photo to SVG?",
        answer: "While technically possible, not all JPG photos are suitable for SVG conversion. Simple images with clear subjects, limited colors, and defined edges convert best. Complex photographs with many gradients, textures, and fine details will result in very large, impractical SVG files. Consider whether vector format truly benefits your specific use case."
      }
    ],
    metadata: {
      lastUpdated: "2024-01-25",
      author: "SVG AI Team",
      category: "Image Conversion",
      readingTime: "10 minutes",
      difficulty: "Advanced"
    }
  },
  'svg-converter': {
    title: "Universal SVG Converter: Your Complete Guide to SVG Format Conversion",
    introduction: "The ultimate resource for converting to and from SVG format. This comprehensive guide covers all aspects of SVG conversion across 40+ formats.",
    extendedIntroduction: "SVG (Scalable Vector Graphics) has become the standard for web graphics, offering infinite scalability, small file sizes, and dynamic capabilities. Our universal SVG converter handles conversions between SVG and all major image formats, providing a one-stop solution for your vector graphics needs.",
    whyConvert: {
      mainReasons: [
        {
          title: "Format Flexibility",
          description: "Work seamlessly between different image formats based on project requirements and platform constraints."
        },
        {
          title: "Workflow Integration",
          description: "Integrate vector graphics into existing workflows that may require specific formats."
        },
        {
          title: "Quality Preservation",
          description: "Maintain image quality when moving between vector and raster formats."
        },
        {
          title: "Universal Compatibility",
          description: "Ensure your graphics work across all platforms, devices, and applications."
        }
      ]
    },
    technicalDetails: {},
    detailedTutorial: {},
    commonProblems: [],
    industryApplications: [],
    optimizationStrategies: {},
    toolsComparison: {},
    faqs: [
      {
        question: "Which format should I convert to SVG?",
        answer: "The best format to convert to SVG depends on your source image. Simple graphics with solid colors (PNG, GIF) convert well. Vector formats (AI, EPS, PDF) often convert perfectly. Photographs (JPG, WebP) require artistic interpretation. Choose based on your quality requirements and intended use."
      }
    ],
    metadata: {
      lastUpdated: "2024-01-25",
      author: "SVG AI Team",
      category: "Image Conversion",
      readingTime: "15 minutes",
      difficulty: "Intermediate"
    }
  }
}

// Helper function to get content for a specific converter
export function getDetailedConverterContent(converterId: string): DetailedConverterContent | null {
  return converterContentMap[converterId] || null
}

// Helper function to check if detailed content exists
export function hasDetailedContent(converterId: string): boolean {
  return converterId in converterContentMap
}

// Get all converter IDs with detailed content
export function getConvertersWithContent(): string[] {
  return Object.keys(converterContentMap)
}