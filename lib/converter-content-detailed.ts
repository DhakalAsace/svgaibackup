// Detailed content generation for specific converters
// This file will be used by sub-agents to create unique 2000+ word content

import { ConverterConfig } from '@/app/convert/converter-config'

export interface DetailedConverterContent {
  // Extended introduction (300+ words)
  extendedIntroduction: string
  
  // Detailed format explanations (400+ words each)
  detailedFormatInfo: {
    fromFormat: {
      history: string
      technicalSpecs: string
      advantages: string[]
      disadvantages: string[]
      commonApplications: string[]
    }
    toFormat: {
      history: string
      technicalSpecs: string
      advantages: string[]
      disadvantages: string[]
      commonApplications: string[]
    }
  }
  
  // Comprehensive use cases (500+ words)
  detailedUseCases: Array<{
    title: string
    scenario: string
    challenge: string
    solution: string
    outcome: string
    tips: string[]
  }>
  
  // Step-by-step tutorial (400+ words)
  detailedTutorial: {
    preparation: string[]
    mainSteps: Array<{
      title: string
      description: string
      substeps: string[]
      commonMistakes: string[]
      proTips: string[]
    }>
    postConversion: string[]
  }
  
  // Advanced techniques (300+ words)
  advancedTechniques: Array<{
    technique: string
    description: string
    whenToUse: string
    example: string
  }>
  
  // Troubleshooting guide (400+ words)
  troubleshootingGuide: Array<{
    issue: string
    symptoms: string[]
    causes: string[]
    solutions: Array<{
      method: string
      steps: string[]
    }>
    prevention: string
  }>
  
  // Industry-specific guides (500+ words)
  industryGuides: Array<{
    industry: string
    overview: string
    specificNeeds: string[]
    bestPractices: string[]
    caseStudy: {
      company: string
      challenge: string
      implementation: string
      results: string
    }
  }>
  
  // Comparison with alternatives (300+ words)
  alternativeComparison: Array<{
    alternative: string
    description: string
    prosVsCurrent: string[]
    consVsCurrent: string[]
    whenToChoose: string
  }>
  
  // Future trends (200+ words)
  futureTrends: {
    currentState: string
    emergingTechnologies: string[]
    predictions: string[]
    preparationTips: string[]
  }
}

// Content templates for sub-agents to expand upon
export const contentTemplates = {
  pngToSvg: {
    keywords: ['png to svg', 'convert png to svg', 'png to vector', 'png vectorization'],
    uniqueAngles: [
      'Vectorization algorithms comparison',
      'Color reduction techniques',
      'Preserving transparency in conversion',
      'Batch processing workflows',
      'Integration with design tools'
    ]
  },
  svgToPng: {
    keywords: ['svg to png', 'convert svg to png', 'svg rasterization', 'svg to raster'],
    uniqueAngles: [
      'Resolution optimization for different screens',
      'Anti-aliasing techniques',
      'Preserving SVG animations as static images',
      'Batch export for multiple sizes',
      'Web performance optimization'
    ]
  },
  jpgToSvg: {
    keywords: ['jpg to svg', 'jpeg to svg', 'photo to vector', 'jpg vectorization'],
    uniqueAngles: [
      'Photo tracing techniques',
      'Handling complex gradients',
      'Optimizing for print vs web',
      'Logo extraction from photos',
      'Artistic effects and stylization'
    ]
  },
  // Add more converter-specific templates...
}

// Sub-agent instructions generator
export function generateSubAgentInstructions(converters: ConverterConfig[]): string {
  const converterList = converters.map(c => `- ${c.title} (${c.searchVolume} searches/month)`).join('\n')
  
  return `
CRITICAL: First read /mnt/a/svgaibackup/rules.txt and adhere to all rules.

Create comprehensive, SEO-optimized content for these converters:
${converterList}

Requirements:
1. Generate 2000+ words of unique, valuable content for each converter
2. Include all sections from the DetailedConverterContent interface
3. Target the specific keywords: ${converters.map(c => c.keywords.join(', ')).join('; ')}
4. Write in a professional, helpful tone that builds trust
5. Include specific examples, case studies, and real-world applications
6. Add technical details that demonstrate expertise
7. Create content that answers user search intent comprehensively

For each converter:
- Research the specific formats involved
- Understand common conversion challenges
- Provide actionable solutions and tips
- Include industry-specific use cases
- Add troubleshooting for common issues

Return a TypeScript object with all content sections filled out completely.
Focus on providing genuine value that helps users understand and complete their conversion tasks successfully.
`
}

// Helper to generate related converters list
export function generateRelatedConverters(
  currentConverter: ConverterConfig,
  allConverters: ConverterConfig[]
): Array<{ title: string; description: string; href: string }> {
  return allConverters
    .filter(c => {
      // Related if they share a format or have similar use cases
      return c.id !== currentConverter.id && (
        c.fromFormat === currentConverter.fromFormat ||
        c.toFormat === currentConverter.toFormat ||
        c.fromFormat === currentConverter.toFormat ||
        c.toFormat === currentConverter.fromFormat
      )
    })
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 6)
    .map(c => ({
      title: c.title,
      description: c.metaDescription,
      href: `/convert/${c.urlSlug}`
    }))
}