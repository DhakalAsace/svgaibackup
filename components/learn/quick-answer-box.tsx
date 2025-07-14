'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Zap } from 'lucide-react'

interface QuickAnswerBoxProps {
  question: string
  answer: string
  className?: string
}

export function QuickAnswerBox({ question, answer, className = '' }: QuickAnswerBoxProps) {
  return (
    <Card className={`${className} border-2 border-primary/30 bg-primary/5`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
            <p className="font-medium text-primary mb-2">{question}</p>
            <p className="text-base leading-relaxed">{answer}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}