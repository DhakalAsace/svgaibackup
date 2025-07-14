'use client'

import { Author } from '@/app/learn/learn-config'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, CheckCircle, GraduationCap, Linkedin, Github } from 'lucide-react'

interface AuthorCardProps {
  author: Author
  role: 'author' | 'reviewer'
  lastReviewed?: string
  className?: string
}

export function AuthorCard({ author, role, lastReviewed, className = '' }: AuthorCardProps) {
  return (
    <Card className={`${className} border-primary/20`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{author.name}</h3>
                <p className="text-sm text-muted-foreground">{author.role}</p>
              </div>
              
              <div className="flex gap-2">
                {author.linkedIn && (
                  <a 
                    href={author.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${author.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {author.github && (
                  <a 
                    href={author.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${author.name}'s GitHub profile`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            
            <p className="text-sm mb-3">{author.bio}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {author.expertise.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
            
            {role === 'reviewer' && lastReviewed && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Technically reviewed on</span>
                <time dateTime={lastReviewed} className="font-medium">
                  {new Date(lastReviewed).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}
            
            {role === 'author' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Contributing expert since 2024</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}