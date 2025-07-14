"use client"

import { useState } from "react"
import { CheckCircle, XCircle, RefreshCw, Trophy, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface QuizProps {
  title?: string
  description?: string
  questions: QuizQuestion[]
  onComplete?: (score: number, totalQuestions: number) => void
}

export function SVGQuiz({ 
  title = "Test Your SVG Knowledge",
  description = "Challenge yourself with our interactive SVG quiz!",
  questions,
  onComplete
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false))
  const [quizComplete, setQuizComplete] = useState(false)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === question.correctAnswer
    if (isCorrect && !answered[currentQuestion]) {
      setScore(score + 1)
    }

    const newAnswered = [...answered]
    newAnswered[currentQuestion] = true
    setAnswered(newAnswered)
    
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
      onComplete?.(score, questions.length)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswered(new Array(questions.length).fill(false))
    setQuizComplete(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage === 100) return "Perfect score! You're an SVG expert! 🎉"
    if (percentage >= 80) return "Great job! You have strong SVG knowledge! 🌟"
    if (percentage >= 60) return "Good work! Keep learning to master SVG! 📚"
    if (percentage >= 40) return "Nice try! Check out our learn guides to improve! 💪"
    return "Keep practicing! Our tutorials can help you learn more! 🚀"
  }

  if (quizComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <CardDescription className="text-lg mt-2">
            You scored {score} out of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="text-lg">{getScoreMessage()}</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={handleRestart} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild>
              <a href="/learn">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn More
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>{title}</CardTitle>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>Score: {score}/{questions.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          <RadioGroup 
            value={selectedAnswer?.toString()} 
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            disabled={showResult}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === question.correctAnswer
                const showCorrect = showResult && isCorrect
                const showIncorrect = showResult && isSelected && !isCorrect

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg border transition-colors",
                      showCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
                      showIncorrect && "border-red-500 bg-red-50 dark:bg-red-950",
                      !showResult && isSelected && "border-primary bg-accent"
                    )}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                    {showCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        </div>

        {showResult && (
          <div className={cn(
            "p-4 rounded-lg",
            selectedAnswer === question.correctAnswer
              ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
              : "bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800"
          )}>
            <p className="font-semibold mb-2">
              {selectedAnswer === question.correctAnswer ? "Correct! ✅" : "Not quite right 💡"}
            </p>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1)
              setSelectedAnswer(null)
              setShowResult(false)
            }
          }}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {!showResult ? (
          <Button 
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}