import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  // Prevent indexing with X-Robots-Tag header as well
  other: {
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
  },
}

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}