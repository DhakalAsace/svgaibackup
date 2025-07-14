"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, Code, Palette, Layers, Zap, Trophy, Download, Play, TrendingUp } from 'lucide-react'
import { LearningPath } from '@/components/learn/learning-path'
import { SVGQuiz } from '@/components/learn/svg-quiz'
import { DownloadableResources, sampleResources } from '@/components/learn/downloadable-resources'
import { SVGPlayground, playgroundExamples } from '@/components/learn/svg-playground'
import { svgQuizQuestions, learningModules } from '@/lib/learn/quiz-questions'

const learnPages = [
  {
    title: 'What is SVG?',
    description: 'Complete guide to understanding SVG format, its benefits, and use cases',
    href: '/learn/what-is-svg',
    icon: BookOpen,
    searches: 33100,
    category: 'fundamentals',
    difficulty: 'beginner',
  },
  {
    title: 'SVG File Format',
    description: 'Deep dive into the SVG file format structure and specifications',
    href: '/learn/svg-file-format',
    icon: FileText,
    searches: 9900,
    category: 'fundamentals',
    difficulty: 'intermediate',
  },
  {
    title: 'SVG File Guide',
    description: 'Everything you need to know about working with SVG files',
    href: '/learn/svg-file',
    icon: FileText,
    searches: 14800,
    category: 'fundamentals',
    difficulty: 'beginner',
  },
  {
    title: 'Convert SVG to PNG on Windows',
    description: 'Step-by-step guide for Windows users to convert SVG to PNG',
    href: '/learn/convert-svg-to-png-windows',
    icon: Code,
    searches: 1900,
    category: 'conversion',
    difficulty: 'beginner',
  },
  {
    title: 'Convert PNG to SVG',
    description: 'Learn how to convert raster PNG images to vector SVG format',
    href: '/learn/convert-png-to-svg',
    icon: Layers,
    searches: 1590,
    category: 'conversion',
    difficulty: 'intermediate',
  },
  {
    title: 'Batch Convert SVG to PNG',
    description: 'Efficiently convert multiple SVG files to PNG format at once',
    href: '/learn/batch-svg-to-png',
    icon: Layers,
    searches: 1600,
    category: 'conversion',
    difficulty: 'advanced',
  },
  {
    title: 'Best SVG Converters',
    description: 'Comprehensive comparison of the best SVG conversion tools',
    href: '/learn/best-svg-converters',
    icon: Zap,
    searches: 1600,
    category: 'tools',
    difficulty: 'beginner',
  },
  {
    title: 'SVG CSS Animation',
    description: 'Create stunning animations using CSS with SVG elements',
    href: '/learn/svg-css-animation',
    icon: Palette,
    searches: 590,
    category: 'animation',
    difficulty: 'intermediate',
  },
  {
    title: 'React Native SVG Animation',
    description: 'Guide to implementing SVG animations in React Native apps',
    href: '/learn/react-native-svg-animation',
    icon: Code,
    searches: 390,
    category: 'animation',
    difficulty: 'advanced',
  },
]

export default function LearnHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'path' | 'playground' | 'quiz' | 'resources'>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Topics', count: learnPages.length },
    { id: 'fundamentals', name: 'Fundamentals', count: learnPages.filter(p => p.category === 'fundamentals').length },
    { id: 'conversion', name: 'Conversion', count: learnPages.filter(p => p.category === 'conversion').length },
    { id: 'animation', name: 'Animation', count: learnPages.filter(p => p.category === 'animation').length },
    { id: 'tools', name: 'Tools', count: learnPages.filter(p => p.category === 'tools').length },
  ]

  const filteredPages = selectedCategory === 'all' 
    ? learnPages 
    : learnPages.filter(page => page.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">SVG Learning Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master SVG with our comprehensive learning platform. Interactive tutorials, 
            hands-on playgrounds, quizzes, and downloadable resources.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{learnPages.length}</div>
                <p className="text-sm text-muted-foreground">Learn Guides</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-muted-foreground">Certificates</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Play className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">20+</div>
                <p className="text-sm text-muted-foreground">Interactive Examples</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Download className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">15+</div>
                <p className="text-sm text-muted-foreground">Free Resources</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="path">Learning Path</TabsTrigger>
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                  <Badge variant="secondary" className="ml-2">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Learn Pages Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPages
                .sort((a, b) => b.searches - a.searches)
                .map((page) => {
                  const Icon = page.icon
                  return (
                    <Link key={page.href} href={page.href}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Icon className="h-8 w-8 text-primary" />
                            <div className="flex items-center gap-2">
                              <Badge className={getDifficultyColor(page.difficulty)} variant="secondary">
                                {page.difficulty}
                              </Badge>
                              {page.searches > 5000 && (
                                <TrendingUp className="h-4 w-4 text-orange-500" />
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-xl">{page.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {page.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {page.searches.toLocaleString()} searches/mo
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{page.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
            </div>
          </TabsContent>

          {/* Learning Path Tab */}
          <TabsContent value="path" className="mt-6">
            <LearningPath 
              modules={learningModules}
              onLessonComplete={(moduleId, lessonId) => {
                console.log(`Completed: ${moduleId} - ${lessonId}`)
              }}
            />
          </TabsContent>

          {/* Playground Tab */}
          <TabsContent value="playground" className="mt-6 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Interactive SVG Playground</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experiment with SVG code in real-time. Edit the code on the left and see instant results on the right.
              </p>
            </div>

            <SVGPlayground 
              title="Try Basic Shapes"
              description="Start with simple SVG shapes and see how they work"
              examples={playgroundExamples.basic}
            />

            <SVGPlayground 
              title="Explore Animations"
              description="Learn how to animate SVG elements"
              examples={playgroundExamples.animation}
              initialCode={playgroundExamples.animation[0].code}
            />

            <SVGPlayground 
              title="Advanced Techniques"
              description="Experiment with gradients, filters, and advanced features"
              examples={playgroundExamples.advanced}
              initialCode={playgroundExamples.advanced[0].code}
            />
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="mt-6 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Challenge yourself with our interactive quizzes and track your progress.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>SVG Fundamentals Quiz</CardTitle>
                  <CardDescription>
                    Test your understanding of SVG basics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <Badge>5 Questions</Badge>
                    <Badge className={getDifficultyColor('beginner')}>Beginner</Badge>
                  </div>
                  <SVGQuiz 
                    title="SVG Fundamentals"
                    description="Test your knowledge of SVG basics"
                    questions={svgQuizQuestions.whatIsSvg}
                    onComplete={(score, total) => {
                      console.log(`Quiz completed: ${score}/${total}`)
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SVG File Format Quiz</CardTitle>
                  <CardDescription>
                    Challenge yourself with technical questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <Badge>5 Questions</Badge>
                    <Badge className={getDifficultyColor('intermediate')}>Intermediate</Badge>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/learn/svg-file-format#quiz">
                      Start Quiz
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6">
            <DownloadableResources 
              resources={sampleResources}
              title="Free SVG Learning Resources"
              description="Download cheatsheets, templates, and code examples to accelerate your learning"
            />
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Create Your Own SVGs?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Put your knowledge into practice with our AI-powered SVG generator. 
                Create custom icons, logos, and illustrations in seconds.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/ai-icon-generator">
                    Try AI Icon Generator
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/convert">
                    Browse Free Tools
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}