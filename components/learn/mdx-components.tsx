'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  AlertCircle, 
  Info, 
  Lightbulb, 
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  FileCode
} from 'lucide-react'

// Callout Component
interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'error'
  title?: string
  children: React.ReactNode
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    tip: <Lightbulb className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />
  }

  const iconColors = {
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    tip: 'bg-green-500',
    error: 'bg-red-500'
  }

  return (
    <div className={cn('callout', `callout-${type}`)}>
      <div className={cn('callout-icon', iconColors[type])}>
        {icons[type]}
      </div>
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {children}
      </div>
    </div>
  )
}

// Code Block with Copy Button
interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
}

export function CodeBlock({ children, language = 'text', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block-wrapper">
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-t-lg border-b border-gray-700">
          <FileCode className="w-4 h-4" />
          <span className="font-mono">{filename}</span>
        </div>
      )}
      <div className="relative">
        <pre className={cn(
          "overflow-x-auto p-4 bg-gray-900 text-gray-100 rounded-lg",
          filename && "rounded-t-none"
        )}>
          <code className={`language-${language}`}>{children}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="code-copy-button"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Step-by-Step Guide Component
interface StepGuideProps {
  children: React.ReactNode
}

export function StepGuide({ children }: StepGuideProps) {
  return <div className="step-guide">{children}</div>
}

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="step-item">
      <div className="step-number">{number}</div>
      <div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {children}
        </div>
      </div>
    </div>
  )
}

// Feature Comparison Table
interface FeatureTableProps {
  headers: string[]
  rows: (string | boolean | React.ReactNode)[][]
}

export function FeatureTable({ headers, rows }: FeatureTableProps) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {typeof cell === 'boolean' ? (
                    cell ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// FAQ Accordion Component
interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="my-12">
      {items.map((item, index) => (
        <div key={index} className="faq-item">
          <button
            className="faq-question"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span>{item.question}</span>
            {openIndex === index ? (
              <ChevronDown className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            )}
          </button>
          {openIndex === index && (
            <div className="faq-answer">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link?: {
    href: string
    text: string
  }
}

export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <div className="feature-card-icon">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      {link && (
        <a 
          href={link.href}
          className="inline-flex items-center text-primary hover:underline text-sm font-medium"
        >
          {link.text}
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      )}
    </div>
  )
}

// Interactive Demo Component
interface DemoProps {
  title: string
  children: React.ReactNode
}

export function Demo({ title, children }: DemoProps) {
  return (
    <div className="my-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Code className="w-5 h-5" />
        {title}
      </h3>
      <div>{children}</div>
    </div>
  )
}