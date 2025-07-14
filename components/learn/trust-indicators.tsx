'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle2, RefreshCw, Award, Clock, BookOpen } from 'lucide-react'

interface TrustIndicatorsProps {
  lastReviewed?: string
  technicalLevel?: string
  readingTime: number
  updateFrequency?: string
  certifications?: string[]
  className?: string
}

export function TrustIndicators({ 
  lastReviewed, 
  technicalLevel = 'beginner',
  readingTime,
  updateFrequency = 'Monthly',
  certifications = ['W3C Compliant', 'MDN Referenced'],
  className = ''
}: TrustIndicatorsProps) {
  return (
    <Card className={`${className} bg-primary/5 border-primary/20`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Why Trust This Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fact Checked */}
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Fact-Checked & Verified</p>
              <p className="text-xs text-muted-foreground">
                All code examples tested and validated
              </p>
            </div>
          </div>
          
          {/* Update Frequency */}
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Updated {updateFrequency}</p>
              {lastReviewed && (
                <p className="text-xs text-muted-foreground">
                  Last reviewed: {new Date(lastReviewed).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          
          {/* Technical Level */}
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Level: {technicalLevel}</p>
              <p className="text-xs text-muted-foreground">
                Clear explanations for all skill levels
              </p>
            </div>
          </div>
          
          {/* Reading Time */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">{readingTime} min read</p>
              <p className="text-xs text-muted-foreground">
                Comprehensive yet concise
              </p>
            </div>
          </div>
        </div>
        
        {/* Certifications */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Standards & References</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <Badge key={cert} variant="outline" className="text-xs">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}