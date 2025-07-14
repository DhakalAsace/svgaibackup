"use client"

import { useState } from "react"

interface PromptTextProps {
  text: string
  maxLength?: number
}

export function PromptText({ text, maxLength = 60 }: PromptTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // If text is shorter than maxLength, just return it
  if (text.length <= maxLength) {
    return <span>{text}</span>
  }

  // Otherwise, truncate and add "See more" button
  const truncatedText = isExpanded ? text : `${text.substring(0, maxLength)}...`

  return (
    <span className="inline-flex items-center gap-1">
      {truncatedText}
      <button 
        className="p-0 h-auto text-xs font-medium text-slate-700 hover:text-slate-900 bg-transparent border-none cursor-pointer" // Improved contrast
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "See less" : "See more"}
      </button>
    </span>
  )
}
