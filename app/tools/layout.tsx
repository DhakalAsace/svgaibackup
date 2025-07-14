import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | SVG AI Tools',
    default: 'Free SVG Tools',
  },
  description: 'Professional SVG tools including editor, optimizer, and converters. Free and premium tools for all your SVG needs.',
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}