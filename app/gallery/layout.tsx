import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Free SVG Gallery - Download Popular SVG Icons & Images",
    template: "%s | SVG AI Gallery"
  },
  description: "Browse and download free SVG icons, images, and graphics. Popular collections including hearts, stars, animals, and more. Create custom versions with AI.",
  openGraph: {
    title: "Free SVG Gallery - Download Popular SVG Icons & Images",
    description: "Browse and download free SVG icons, images, and graphics. Popular collections including hearts, stars, animals, and more.",
    type: "website",
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}