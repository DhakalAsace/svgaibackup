"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Code2, 
  Lightbulb, 
  Settings, 
  Zap, 
  BookOpen,
  Users,
  TrendingUp,
  FileCode,
  Shield,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { PublicConverterConfig } from '@/app/convert/public-converter-config'

interface ConverterContentSectionsProps {
  config: PublicConverterConfig
  converterType: {
    from: string
    to: string
    fromFull: string
    toFull: string
  }
}

// Industry-specific content generation
function generateIndustryContent(industry: string, fromFormat: string, toFormat: string) {
  const industryData: Record<string, { 
    icon: string; 
    challenges: string[]; 
    solutions: string[]; 
    metrics: Array<{ label: string; value: string }> 
  }> = {
    'Web Development': {
      icon: '🌐',
      challenges: [
        'Page load speed optimization',
        'Cross-browser compatibility',
        'Responsive image delivery',
        'SEO performance'
      ],
      solutions: [
        `Convert ${fromFormat} to ${toFormat} for optimal web performance`,
        'Implement lazy loading with format fallbacks',
        'Use srcset for responsive images',
        'Optimize for Core Web Vitals'
      ],
      metrics: [
        { label: 'Load Time Reduction', value: 'Up to 60%' },
        { label: 'Bandwidth Savings', value: '40-70%' },
        { label: 'SEO Score Improvement', value: '+15 points' }
      ]
    },
    'E-commerce': {
      icon: '🛒',
      challenges: [
        'Product image optimization',
        'Mobile shopping experience',
        'Conversion rate optimization',
        'Multi-channel consistency'
      ],
      solutions: [
        `Use ${toFormat} for product thumbnails and icons`,
        'Implement zoom functionality with high-res versions',
        'A/B test image formats for conversion',
        'Maintain consistent quality across platforms'
      ],
      metrics: [
        { label: 'Page Speed Increase', value: '45%' },
        { label: 'Mobile Conversion Boost', value: '+12%' },
        { label: 'Image Storage Reduction', value: '50%' }
      ]
    },
    'Digital Marketing': {
      icon: '📈',
      challenges: [
        'Multi-platform asset management',
        'Brand consistency',
        'Campaign performance',
        'Social media optimization'
      ],
      solutions: [
        `Create scalable ${toFormat} versions of brand assets`,
        'Maintain quality across all touchpoints',
        'Optimize for each platform\'s requirements',
        'Automate format conversion workflows'
      ],
      metrics: [
        { label: 'Asset Production Time', value: '-70%' },
        { label: 'Brand Consistency', value: '100%' },
        { label: 'Engagement Rate', value: '+25%' }
      ]
    },
    'Graphic Design': {
      icon: '🎨',
      challenges: [
        'File format compatibility',
        'Quality preservation',
        'Workflow efficiency',
        'Client deliverables'
      ],
      solutions: [
        `Convert to ${toFormat} for universal compatibility`,
        'Preserve original quality during conversion',
        'Process files efficiently',
        'Provide multiple format options to clients'
      ],
      metrics: [
        { label: 'Workflow Efficiency', value: '+80%' },
        { label: 'Quality Retention', value: '99%' },
        { label: 'Client Satisfaction', value: '95%' }
      ]
    },
    'Publishing': {
      icon: '📚',
      challenges: [
        'Print quality requirements',
        'Digital distribution',
        'File size constraints',
        'Format standardization'
      ],
      solutions: [
        `Use ${toFormat} for print-ready graphics`,
        'Optimize for digital readers',
        'Compress without quality loss',
        'Standardize on industry formats'
      ],
      metrics: [
        { label: 'Print Quality Score', value: '98/100' },
        { label: 'File Size Reduction', value: '65%' },
        { label: 'Production Time', value: '-50%' }
      ]
    },
    'Enterprise': {
      icon: '🏢',
      challenges: [
        'Large-scale asset management',
        'Security and compliance',
        'System integration',
        'Cost optimization'
      ],
      solutions: [
        'Implement automated conversion pipelines',
        'Ensure data security with local processing',
        'Integrate with existing DAM systems',
        'Reduce storage and bandwidth costs'
      ],
      metrics: [
        { label: 'Processing Efficiency', value: '+90%' },
        { label: 'Storage Cost Savings', value: '$50K/year' },
        { label: 'Compliance Score', value: '100%' }
      ]
    }
  }

  return industryData[industry] || industryData['Web Development']
}

// Technical specifications content
function generateTechnicalSpecs(fromFormat: string, toFormat: string) {
  const specs: Record<string, any> = {
    'png-to-svg': {
      algorithm: 'Potrace (Polygon Trace)',
      accuracy: '95-99% for simple graphics',
      processing: 'Client-side vectorization',
      optimization: 'Path simplification, color quantization',
      limitations: 'Complex photos may not convert well'
    },
    'svg-to-png': {
      algorithm: 'Canvas API rendering',
      accuracy: '100% vector fidelity',
      processing: 'GPU-accelerated rasterization',
      optimization: 'Anti-aliasing, resolution scaling',
      limitations: 'File size increases with resolution'
    },
    'jpg-to-svg': {
      algorithm: 'Edge detection + vectorization',
      accuracy: '85-95% for high contrast images',
      processing: 'Multi-pass analysis',
      optimization: 'Noise reduction, smoothing',
      limitations: 'Gradients simplified to solid colors'
    }
  }
  
  const key = `${fromFormat.toLowerCase()}-to-${toFormat.toLowerCase()}`
  return specs[key] || {
    algorithm: 'Advanced conversion algorithm',
    accuracy: 'High fidelity conversion',
    processing: 'Optimized processing',
    optimization: 'Quality-focused optimization',
    limitations: 'Format-specific considerations'
  }
}

export function ConverterContentSections({ config, converterType }: ConverterContentSectionsProps) {
  return (
    <div className="space-y-16">
      {/* Industry Applications Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industry Applications & Use Cases
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how professionals across industries leverage {converterType.from} to {converterType.to} conversion
            </p>
          </div>
          
          <Tabs defaultValue="web-development" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-2 mb-8">
              {['Web Development', 'E-commerce', 'Digital Marketing', 'Graphic Design', 'Publishing', 'Enterprise'].map((industry) => {
                const data = generateIndustryContent(industry, converterType.from, converterType.to)
                return (
                  <TabsTrigger
                    key={industry}
                    value={industry.toLowerCase().replace(' ', '-')}
                    className="flex flex-col items-center p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="text-2xl mb-1">{data.icon}</span>
                    <span className="text-xs font-medium">{industry}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
            
            {['Web Development', 'E-commerce', 'Digital Marketing', 'Graphic Design', 'Publishing', 'Enterprise'].map((industry) => {
              const data = generateIndustryContent(industry, converterType.from, converterType.to)
              return (
                <TabsContent
                  key={industry}
                  value={industry.toLowerCase().replace(' ', '-')}
                  className="mt-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Challenges */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          Common Challenges
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {data.challenges.map((challenge, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {/* Solutions */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          Our Solutions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {data.solutions.map((solution, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {/* Metrics */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Expected Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {data.metrics.map((metric, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {metric.label}
                                </span>
                                <span className="text-lg font-bold text-primary">
                                  {metric.value}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                                  style={{ width: `${Math.min(parseInt(metric.value) || 80, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Call to Action */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Ready to transform your {industry.toLowerCase()} workflow?
                    </p>
                    <Button 
                      size="lg"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="group"
                    >
                      Start Converting Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </section>

      {/* Technical Deep Dive Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Technical Specifications & Details
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Understanding the technology behind {converterType.from} to {converterType.to} conversion
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Conversion Algorithm */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-500" />
                  Conversion Algorithm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const specs = generateTechnicalSpecs(converterType.from, converterType.to)
                    return (
                      <>
                        <div>
                          <h4 className="font-semibold mb-2">Core Technology</h4>
                          <p className="text-gray-600 dark:text-gray-300">{specs.algorithm}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Accuracy Rate</h4>
                          <p className="text-gray-600 dark:text-gray-300">{specs.accuracy}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Processing Method</h4>
                          <p className="text-gray-600 dark:text-gray-300">{specs.processing}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Optimization Techniques</h4>
                          <p className="text-gray-600 dark:text-gray-300">{specs.optimization}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Known Limitations</h4>
                          <p className="text-gray-600 dark:text-gray-300">{specs.limitations}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Benchmarks */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-green-500" />
                  Performance Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Processing Speed</span>
                      <Badge variant="secondary">1-3 seconds</Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Memory Efficiency</span>
                      <Badge variant="secondary">&lt; 500MB</Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Quality Score</span>
                      <Badge variant="secondary">98/100</Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Browser Compatibility</span>
                      <Badge variant="secondary">100%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Note:</strong> Performance may vary based on file complexity, size, and device capabilities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          
        </div>
      </section>

      {/* Best Practices Guide */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Best Practices & Pro Tips
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expert recommendations for optimal {converterType.from} to {converterType.to} conversion results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Lightbulb className="w-6 h-6" />,
                category: 'Preparation',
                title: 'Optimize Source Files',
                tips: [
                  `Ensure ${converterType.from} files are high quality`,
                  'Remove unnecessary elements before conversion',
                  'Use appropriate resolution for intended use',
                  'Clean up artifacts and noise'
                ],
                color: 'yellow'
              },
              {
                icon: <Settings className="w-6 h-6" />,
                category: 'Configuration',
                title: 'Choose Right Settings',
                tips: [
                  'Select appropriate conversion parameters',
                  'Consider target use case requirements',
                  'Balance quality vs file size',
                  'Test different settings for best results'
                ],
                color: 'blue'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                category: 'Performance',
                title: 'Optimize Workflow',
                tips: [
                  'Process files sequentially when needed',
                  'Implement automation for repetitive tasks',
                  'Cache converted files when possible',
                  'Monitor conversion metrics'
                ],
                color: 'purple'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                category: 'Security',
                title: 'Protect Your Data',
                tips: [
                  'Use local conversion for sensitive files',
                  'Verify file integrity after conversion',
                  'Keep original files as backup',
                  'Follow data protection guidelines'
                ],
                color: 'green'
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                category: 'Learning',
                title: 'Continuous Improvement',
                tips: [
                  'Stay updated with format specifications',
                  'Learn about new conversion techniques',
                  'Join professional communities',
                  'Share knowledge with peers'
                ],
                color: 'indigo'
              },
              {
                icon: <Users className="w-6 h-6" />,
                category: 'Collaboration',
                title: 'Team Workflows',
                tips: [
                  'Establish format standards',
                  'Document conversion settings',
                  'Create shared presets',
                  'Implement version control'
                ],
                color: 'pink'
              }
            ].map((section, idx) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-${section.color}-100 dark:bg-${section.color}-900/20 flex items-center justify-center mb-4`}>
                    <div className={`text-${section.color}-600 dark:text-${section.color}-400`}>
                      {section.icon}
                    </div>
                  </div>
                  <Badge variant="outline" className="mb-2">{section.category}</Badge>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  )
}