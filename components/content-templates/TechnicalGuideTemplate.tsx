"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  BookOpen, 
  Code2, 
  Terminal, 
  Package, 
  GitBranch, 
  Wrench, 
  Bug, 
  TestTube, 
  Rocket, 
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Info,
  Lightbulb
} from "lucide-react"
import Link from "next/link"
import { CodeExample, CodeExampleProps } from "@/components/keyword-components/CodeExample"

// Type definitions for technical guide content
export interface TechnicalGuideTemplateProps {
  // Meta information
  title: string
  description: string
  keywords: string[]
  technology: {
    name: string
    version?: string
    logo?: ReactNode
  }
  
  // Guide content sections
  overview: TechnicalOverview
  prerequisites: Prerequisite[]
  environmentSetup: EnvironmentSetup
  coreConcepts: CoreConcept[]
  implementationGuide: ImplementationStep[]
  frameworkSpecific?: FrameworkSpecificGuide[]
  performanceOptimization?: PerformanceSection
  debugging?: DebuggingSection
  testing?: TestingSection
  deployment?: DeploymentSection
  additionalResources?: Resource[]
  
  // Optional sections
  versionCompatibility?: VersionCompatibility[]
  buildToolIntegration?: BuildToolGuide[]
  codePlayground?: CodePlaygroundConfig
  githubExamples?: GithubExample[]
  troubleshooting?: TroubleshootingItem[]
}

export interface TechnicalOverview {
  introduction: string
  whenToUse: string[]
  whenNotToUse?: string[]
  keyBenefits: string[]
  limitations?: string[]
}

export interface Prerequisite {
  label: string
  description: string
  link?: string
  required: boolean
}

export interface EnvironmentSetup {
  steps: SetupStep[]
  verificationCommand?: CodeExampleProps
}

export interface SetupStep {
  title: string
  description: string
  codeExample?: CodeExampleProps
  note?: string
}

export interface CoreConcept {
  title: string
  description: string
  codeExample?: CodeExampleProps
  diagram?: ReactNode
  keyPoints?: string[]
}

export interface ImplementationStep {
  stepNumber: number
  title: string
  description: string
  codeExamples: CodeExampleProps
  explanation?: string
  commonMistakes?: string[]
  bestPractices?: string[]
}

export interface FrameworkSpecificGuide {
  framework: "react" | "vue" | "angular" | "svelte" | "nextjs" | "nuxt" | "remix"
  considerations: string[]
  codeExample: CodeExampleProps
  specificTips?: string[]
}

export interface PerformanceSection {
  metrics: PerformanceMetric[]
  optimizationTips: OptimizationTip[]
  benchmarks?: Benchmark[]
}

export interface PerformanceMetric {
  name: string
  description: string
  targetValue: string
  measurementCode?: CodeExampleProps
}

export interface OptimizationTip {
  title: string
  impact: "high" | "medium" | "low"
  difficulty: "easy" | "medium" | "hard"
  description: string
  implementation?: CodeExampleProps
}

export interface Benchmark {
  scenario: string
  results: { [key: string]: string }
  conclusion: string
}

export interface DebuggingSection {
  commonIssues: DebugIssue[]
  debuggingTools: DebugTool[]
  loggingStrategy?: CodeExampleProps
}

export interface DebugIssue {
  issue: string
  symptoms: string[]
  solution: string
  codeExample?: CodeExampleProps
}

export interface DebugTool {
  name: string
  description: string
  installation?: string
  usage: CodeExampleProps
}

export interface TestingSection {
  testingStrategy: string
  unitTests?: CodeExampleProps
  integrationTests?: CodeExampleProps
  e2eTests?: CodeExampleProps
  coverageTargets?: CoverageTarget[]
}

export interface CoverageTarget {
  metric: string
  target: string
  reasoning: string
}

export interface DeploymentSection {
  platforms: DeploymentPlatform[]
  cicdExample?: CodeExampleProps
  environmentVariables?: EnvironmentVariable[]
  preDeploymentChecklist?: string[]
}

export interface DeploymentPlatform {
  name: string
  advantages: string[]
  configuration: CodeExampleProps
  estimatedCost?: string
}

export interface EnvironmentVariable {
  name: string
  description: string
  required: boolean
  example: string
}

export interface Resource {
  title: string
  type: "documentation" | "video" | "course" | "tool" | "library"
  url: string
  description: string
  isPaid?: boolean
}

export interface VersionCompatibility {
  version: string
  status: "stable" | "beta" | "deprecated"
  notes: string
  breakingChanges?: string[]
}

export interface BuildToolGuide {
  tool: "webpack" | "vite" | "parcel" | "rollup" | "esbuild"
  configuration: CodeExampleProps
  plugins?: string[]
}

export interface CodePlaygroundConfig {
  enabled: boolean
  defaultCode: string
  dependencies?: string[]
  embedUrl?: string
}

export interface GithubExample {
  title: string
  description: string
  url: string
  stars?: number
  lastUpdated?: string
}

export interface TroubleshootingItem {
  problem: string
  possibleCauses: string[]
  solutions: string[]
  relatedIssues?: string[]
}

export default function TechnicalGuideTemplate({
  title,
  description,
  keywords,
  technology,
  overview,
  prerequisites,
  environmentSetup,
  coreConcepts,
  implementationGuide,
  frameworkSpecific,
  performanceOptimization,
  debugging,
  testing,
  deployment,
  additionalResources,
  versionCompatibility,
  buildToolIntegration,
  codePlayground,
  githubExamples,
  troubleshooting
}: TechnicalGuideTemplateProps) {
  
  const renderPrerequisiteIcon = (required: boolean) => {
    return required ? (
      <AlertCircle className="h-4 w-4 text-orange-500" />
    ) : (
      <Info className="h-4 w-4 text-blue-500" />
    )
  }

  const renderImpactBadge = (impact: "high" | "medium" | "low") => {
    const colors = {
      high: "destructive",
      medium: "secondary",
      low: "outline"
    } as const
    
    return <Badge variant={colors[impact]}>{impact.toUpperCase()} IMPACT</Badge>
  }

  const renderDifficultyBadge = (difficulty: "easy" | "medium" | "hard") => {
    const colors = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800"
    }
    
    return (
      <Badge className={colors[difficulty]}>
        {difficulty.toUpperCase()}
      </Badge>
    )
  }

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                {technology.logo}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
                  {technology.version && (
                    <Badge variant="secondary" className="text-sm">
                      Version {technology.version}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xl opacity-90 max-w-3xl">{description}</p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Technical Overview</h2>
          </div>
          
          <div className="prose prose-lg max-w-none mb-8">
            <p>{overview.introduction}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  When to Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {overview.whenToUse.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {overview.whenNotToUse && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    When Not to Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {overview.whenNotToUse.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {overview.keyBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {overview.limitations && (
              <Card>
                <CardHeader>
                  <CardTitle>Limitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {overview.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Prerequisites</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {prerequisites.map((prereq, index) => (
              <Card key={index} className={prereq.required ? "border-orange-200" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    {renderPrerequisiteIcon(prereq.required)}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{prereq.label}</h3>
                      <p className="text-sm text-gray-600 mb-2">{prereq.description}</p>
                      {prereq.link && (
                        <Link 
                          href={prereq.link}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Learn more
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                    {prereq.required && (
                      <Badge variant="outline" className="text-xs">
                        REQUIRED
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Environment Setup */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Environment Setup</h2>
          </div>

          <div className="space-y-8">
            {environmentSetup.steps.map((step, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-semibold mb-3">
                  Step {index + 1}: {step.title}
                </h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                {step.codeExample && (
                  <div className="mb-4">
                    <CodeExample {...step.codeExample} />
                  </div>
                )}
                
                {step.note && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{step.note}</AlertDescription>
                  </Alert>
                )}
              </div>
            ))}

            {environmentSetup.verificationCommand && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Verify Installation</h3>
                <CodeExample {...environmentSetup.verificationCommand} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Concepts */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Code2 className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Core Concepts</h2>
          </div>

          <div className="space-y-12">
            {coreConcepts.map((concept, index) => (
              <div key={index}>
                <h3 className="text-2xl font-semibold mb-4">{concept.title}</h3>
                <p className="text-lg text-gray-600 mb-6">{concept.description}</p>
                
                {concept.diagram && (
                  <div className="mb-6 bg-white rounded-lg p-6 border">
                    {concept.diagram}
                  </div>
                )}
                
                {concept.codeExample && (
                  <div className="mb-6">
                    <CodeExample {...concept.codeExample} />
                  </div>
                )}
                
                {concept.keyPoints && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {concept.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Implementation Guide</h2>
          </div>

          <div className="space-y-16">
            {implementationGuide.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-12 top-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {step.stepNumber}
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  
                  <div className="mb-6">
                    <CodeExample {...step.codeExamples} />
                  </div>
                  
                  {step.explanation && (
                    <div className="mb-6 bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold mb-2">Explanation</h4>
                      <p className="text-gray-700">{step.explanation}</p>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {step.commonMistakes && (
                      <Card className="border-red-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            Common Mistakes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {step.commonMistakes.map((mistake, mistakeIndex) => (
                              <li key={mistakeIndex} className="flex items-start gap-2">
                                <span className="text-red-600">•</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    
                    {step.bestPractices && (
                      <Card className="border-green-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Best Practices
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {step.bestPractices.map((practice, practiceIndex) => (
                              <li key={practiceIndex} className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>{practice}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Specific Considerations */}
      {frameworkSpecific && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Framework-Specific Implementation</h2>
            </div>

            <Tabs defaultValue={frameworkSpecific[0].framework}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                {frameworkSpecific.map((fw) => (
                  <TabsTrigger key={fw.framework} value={fw.framework}>
                    {fw.framework.charAt(0).toUpperCase() + fw.framework.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {frameworkSpecific.map((fw) => (
                <TabsContent key={fw.framework} value={fw.framework} className="mt-8">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Considerations for {fw.framework}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {fw.considerations.map((consideration, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{consideration}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <CodeExample {...fw.codeExample} />

                    {fw.specificTips && (
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Pro Tips</AlertTitle>
                        <AlertDescription>
                          <ul className="mt-2 space-y-1">
                            {fw.specificTips.map((tip, index) => (
                              <li key={index}>• {tip}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      )}

      {/* Performance Optimization */}
      {performanceOptimization && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <Rocket className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Performance Optimization</h2>
            </div>

            <div className="space-y-8">
              {/* Performance Metrics */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Performance Metrics</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {performanceOptimization.metrics.map((metric, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-2">{metric.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                        <Badge variant="outline">Target: {metric.targetValue}</Badge>
                        {metric.measurementCode && (
                          <div className="mt-4">
                            <CodeExample {...metric.measurementCode} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Optimization Tips */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Optimization Strategies</h3>
                <div className="space-y-6">
                  {performanceOptimization.optimizationTips.map((tip, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                          <div className="flex gap-2">
                            {renderImpactBadge(tip.impact)}
                            {renderDifficultyBadge(tip.difficulty)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{tip.description}</p>
                        {tip.implementation && (
                          <CodeExample {...tip.implementation} />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Benchmarks */}
              {performanceOptimization.benchmarks && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Performance Benchmarks</h3>
                  <div className="space-y-4">
                    {performanceOptimization.benchmarks.map((benchmark, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{benchmark.scenario}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead>Result</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(benchmark.results).map(([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell>{key}</TableCell>
                                  <TableCell>{value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <p className="mt-4 text-sm text-gray-600">
                            <strong>Conclusion:</strong> {benchmark.conclusion}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Debugging & Troubleshooting */}
      {debugging && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <Bug className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Debugging & Troubleshooting</h2>
            </div>

            <div className="space-y-8">
              {/* Common Issues */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Common Issues & Solutions</h3>
                <div className="space-y-4">
                  {debugging.commonIssues.map((issue, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          {issue.issue}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Symptoms</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {issue.symptoms.map((symptom, symptomIndex) => (
                                <li key={symptomIndex}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Solution</h4>
                            <p className="text-gray-600">{issue.solution}</p>
                          </div>
                          
                          {issue.codeExample && (
                            <div className="mt-4">
                              <CodeExample {...issue.codeExample} />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Debugging Tools */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Debugging Tools</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {debugging.debuggingTools.map((tool, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{tool.description}</p>
                        {tool.installation && (
                          <Alert className="mb-4">
                            <Terminal className="h-4 w-4" />
                            <AlertDescription>
                              <code className="text-sm">{tool.installation}</code>
                            </AlertDescription>
                          </Alert>
                        )}
                        <CodeExample {...tool.usage} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Logging Strategy */}
              {debugging.loggingStrategy && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Logging Strategy</h3>
                  <CodeExample {...debugging.loggingStrategy} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Testing */}
      {testing && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <TestTube className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Testing Strategies</h2>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Testing Philosophy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{testing.testingStrategy}</p>
                </CardContent>
              </Card>

              <Tabs defaultValue="unit">
                <TabsList>
                  <TabsTrigger value="unit">Unit Tests</TabsTrigger>
                  <TabsTrigger value="integration">Integration Tests</TabsTrigger>
                  <TabsTrigger value="e2e">E2E Tests</TabsTrigger>
                </TabsList>

                {testing.unitTests && (
                  <TabsContent value="unit" className="mt-6">
                    <CodeExample {...testing.unitTests} />
                  </TabsContent>
                )}

                {testing.integrationTests && (
                  <TabsContent value="integration" className="mt-6">
                    <CodeExample {...testing.integrationTests} />
                  </TabsContent>
                )}

                {testing.e2eTests && (
                  <TabsContent value="e2e" className="mt-6">
                    <CodeExample {...testing.e2eTests} />
                  </TabsContent>
                )}
              </Tabs>

              {testing.coverageTargets && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Coverage Targets</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Reasoning</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testing.coverageTargets.map((target, index) => (
                        <TableRow key={index}>
                          <TableCell>{target.metric}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{target.target}</Badge>
                          </TableCell>
                          <TableCell>{target.reasoning}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Production Deployment */}
      {deployment && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <Rocket className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Production Deployment</h2>
            </div>

            <div className="space-y-8">
              {/* Deployment Platforms */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Deployment Platforms</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {deployment.platforms.map((platform, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {platform.name}
                          {platform.estimatedCost && (
                            <Badge variant="secondary">{platform.estimatedCost}</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Advantages</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {platform.advantages.map((advantage, advIndex) => (
                                <li key={advIndex}>{advantage}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Configuration</h4>
                            <CodeExample {...platform.configuration} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CI/CD Example */}
              {deployment.cicdExample && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">CI/CD Pipeline</h3>
                  <CodeExample {...deployment.cicdExample} />
                </div>
              )}

              {/* Environment Variables */}
              {deployment.environmentVariables && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Environment Variables</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variable</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Example</TableHead>
                        <TableHead>Required</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deployment.environmentVariables.map((envVar, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {envVar.name}
                            </code>
                          </TableCell>
                          <TableCell>{envVar.description}</TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {envVar.example}
                            </code>
                          </TableCell>
                          <TableCell>
                            {envVar.required ? (
                              <Badge variant="destructive">Yes</Badge>
                            ) : (
                              <Badge variant="secondary">No</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pre-deployment Checklist */}
              {deployment.preDeploymentChecklist && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pre-deployment Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {deployment.preDeploymentChecklist.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Version Compatibility */}
      {versionCompatibility && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Version Compatibility</h2>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Breaking Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versionCompatibility.map((version, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {version.version}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          version.status === "stable"
                            ? "default"
                            : version.status === "beta"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {version.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{version.notes}</TableCell>
                    <TableCell>
                      {version.breakingChanges && (
                        <ul className="list-disc list-inside">
                          {version.breakingChanges.map((change, changeIndex) => (
                            <li key={changeIndex} className="text-sm">
                              {change}
                            </li>
                          ))}
                        </ul>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* Build Tool Integration */}
      {buildToolIntegration && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Build Tool Integration</h2>
            
            <Tabs defaultValue={buildToolIntegration[0].tool}>
              <TabsList className="grid grid-cols-5 w-full">
                {buildToolIntegration.map((build) => (
                  <TabsTrigger key={build.tool} value={build.tool}>
                    {build.tool.charAt(0).toUpperCase() + build.tool.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {buildToolIntegration.map((build) => (
                <TabsContent key={build.tool} value={build.tool} className="mt-6">
                  <div className="space-y-4">
                    <CodeExample {...build.configuration} />
                    
                    {build.plugins && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recommended Plugins</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1">
                            {build.plugins.map((plugin, index) => (
                              <li key={index}>{plugin}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      )}

      {/* GitHub Examples */}
      {githubExamples && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">GitHub Examples</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {githubExamples.map((example, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{example.title}</span>
                      {example.stars && (
                        <Badge variant="secondary">⭐ {example.stars}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{example.description}</p>
                    <div className="flex items-center justify-between">
                      <Link
                        href={example.url}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View on GitHub
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      {example.lastUpdated && (
                        <span className="text-sm text-gray-500">
                          Updated: {example.lastUpdated}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Troubleshooting */}
      {troubleshooting && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Troubleshooting Guide</h2>
            
            <div className="space-y-6">
              {troubleshooting.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.problem}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Possible Causes</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {item.possibleCauses.map((cause, causeIndex) => (
                            <li key={causeIndex}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Solutions</h4>
                        <ol className="list-decimal list-inside space-y-1 text-gray-600">
                          {item.solutions.map((solution, solutionIndex) => (
                            <li key={solutionIndex}>{solution}</li>
                          ))}
                        </ol>
                      </div>
                      
                      {item.relatedIssues && (
                        <div>
                          <h4 className="font-semibold mb-2">Related Issues</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {item.relatedIssues.map((issue, issueIndex) => (
                              <li key={issueIndex}>
                                <Link
                                  href={issue}
                                  className="text-blue-600 hover:underline"
                                >
                                  {issue}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Resources */}
      {additionalResources && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Additional Resources</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalResources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{resource.type}</Badge>
                      {resource.isPaid && (
                        <Badge variant="secondary">PAID</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <Link
                      href={resource.url}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View Resource
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}