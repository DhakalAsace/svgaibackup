"use client"

import { useState } from "react"
import { CheckCircle, Circle, Lock, Trophy, Star, ArrowRight, BookOpen, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LearningModule {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  lessons: {
    id: string
    title: string
    slug: string
    completed?: boolean
    locked?: boolean
  }[]
  quiz?: {
    id: string
    title: string
    questions: number
  }
  certificate?: boolean
}

interface LearningPathProps {
  modules: LearningModule[]
  title?: string
  description?: string
  onLessonComplete?: (moduleId: string, lessonId: string) => void
}

export function LearningPath({
  modules,
  title = "SVG Mastery Learning Path",
  description = "Follow our structured curriculum to master SVG from basics to advanced techniques",
  onLessonComplete
}: LearningPathProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(modules[0]?.id || null)
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "achievements">("curriculum")

  // Calculate progress
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = modules.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.completed).length, 0
  )
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Calculate module progress
  const getModuleProgress = (module: LearningModule) => {
    const completed = module.lessons.filter(l => l.completed).length
    return (completed / module.lessons.length) * 100
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const achievements = [
    { 
      id: "first-steps",
      title: "First Steps",
      description: "Complete your first lesson",
      earned: completedLessons >= 1,
      icon: Star
    },
    {
      id: "halfway",
      title: "Halfway There",
      description: "Complete 50% of the curriculum",
      earned: progressPercentage >= 50,
      icon: Zap
    },
    {
      id: "svg-master",
      title: "SVG Master",
      description: "Complete the entire learning path",
      earned: progressPercentage === 100,
      icon: Trophy
    }
  ]

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        
        {/* Overall Progress */}
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>SVG fundamentals and syntax</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Creating and manipulating shapes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Advanced animations and effects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Optimization techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Real-world applications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Format</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Interactive Lessons</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Code Playgrounds</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Quizzes</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Downloadable Resources</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Certificates</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Commitment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-2xl font-bold">~10 hours</p>
                  <p className="text-sm text-muted-foreground">Total duration</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p>• Self-paced learning</p>
                  <p>• Mobile-friendly</p>
                  <p>• Lifetime access</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ready to start learning?</h3>
                  <p className="text-muted-foreground">
                    Begin with the fundamentals and work your way up to advanced techniques.
                  </p>
                </div>
                <Button size="lg" onClick={() => setActiveTab("curriculum")}>
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Curriculum Tab */}
        <TabsContent value="curriculum" className="space-y-4 mt-6">
          {modules.map((module, moduleIndex) => {
            const isExpanded = expandedModule === module.id
            const moduleProgress = getModuleProgress(module)
            const isLocked = moduleIndex > 0 && getModuleProgress(modules[moduleIndex - 1]) < 100

            return (
              <Card key={module.id} className={cn(isLocked && "opacity-60")}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => !isLocked && setExpandedModule(isExpanded ? null : module.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {isLocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : moduleProgress === 100 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        {module.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {module.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {module.duration}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {module.lessons.length} lessons
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {Math.round(moduleProgress)}%
                      </div>
                      <Progress value={moduleProgress} className="w-20 h-2 mt-1" />
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && !isLocked && (
                  <CardContent className="space-y-3 pt-0">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isLessonLocked = lessonIndex > 0 && !module.lessons[lessonIndex - 1].completed

                      return (
                        <Link
                          key={lesson.id}
                          href={isLessonLocked ? "#" : `/learn/${lesson.slug}`}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border transition-colors",
                            !isLessonLocked && "hover:bg-accent",
                            isLessonLocked && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={(e) => {
                            if (isLessonLocked) {
                              e.preventDefault()
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {isLessonLocked ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : lesson.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          {!isLessonLocked && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Link>
                      )
                    })}

                    {module.quiz && (
                      <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{module.quiz.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {module.quiz.questions} questions
                              </p>
                            </div>
                            <Button size="sm" variant="secondary">
                              Take Quiz
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              
              return (
                <Card 
                  key={achievement.id}
                  className={cn(
                    "transition-all",
                    achievement.earned 
                      ? "border-primary bg-primary/5" 
                      : "opacity-60"
                  )}
                >
                  <CardContent className="pt-6 text-center">
                    <Icon 
                      className={cn(
                        "h-12 w-12 mx-auto mb-3",
                        achievement.earned ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <Badge className="mt-3" variant="default">
                        Earned!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {progressPercentage === 100 && (
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-muted-foreground mb-4">
                  You've completed the entire SVG learning path. You're now an SVG master!
                </p>
                <Button size="lg">
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}