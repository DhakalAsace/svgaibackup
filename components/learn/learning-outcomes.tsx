'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, CheckCircle, AlertCircle } from 'lucide-react'

interface LearningOutcomesProps {
  outcomes: string[]
  prerequisites?: string[]
  className?: string
}

export function LearningOutcomes({ outcomes, prerequisites, className = '' }: LearningOutcomesProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Prerequisites */}
      {prerequisites && prerequisites.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Learning Outcomes */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {outcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}