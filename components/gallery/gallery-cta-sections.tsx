import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Video, Palette, ArrowRight, Wand2, Play } from "lucide-react"

interface PrimaryCTAProps {
  theme: string
  position?: "after-hero" | "mid-content" | "bottom"
}

export function PrimaryGalleryCTA({ theme, position = "after-hero" }: PrimaryCTAProps) {
  const messages = {
    "after-hero": {
      title: "Create Your Own Custom SVGs with AI",
      subtitle: `Don't see the perfect ${theme}? Generate unique SVG designs tailored to your needs in seconds.`,
      cta: "Start Creating Now"
    },
    "mid-content": {
      title: "Need Something More Specific?",
      subtitle: `Our AI can generate unlimited custom ${theme} designs based on your exact specifications.`,
      cta: "Try AI Generator"
    },
    "bottom": {
      title: "Create Unlimited Custom Designs",
      subtitle: "Join thousands using AI to generate professional SVGs instantly.",
      cta: "Get Started Free"
    }
  }

  const content = messages[position]

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              {content.title}
            </h3>
            <p className="text-muted-foreground">{content.subtitle}</p>
          </div>
          <Link href="/" className="shrink-0">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600">
              {content.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

interface SecondaryCTAProps {
  theme: string
}

export function SecondaryGalleryCTA({ theme }: SecondaryCTAProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
              <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Transform These SVGs into Stunning Videos
            </h3>
            <p className="text-muted-foreground">
              Bring your {theme} to life with smooth animations and professional video effects.
            </p>
          </div>
          <Link href="/tools/svg-to-video" className="shrink-0">
            <Button size="lg" variant="outline" className="gap-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-black">
              Create Animated Videos
              <Play className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

interface TertiaryCTAProps {
  theme: string
}

export function TertiaryGalleryCTA({ theme }: TertiaryCTAProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
              <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Need Custom Icons? Try Our AI Icon Generator
            </h3>
            <p className="text-muted-foreground">
              Perfect for app icons, logos, and UI elements. Generate exactly what you need.
            </p>
          </div>
          <Link href="/ai-icon-generator" className="shrink-0">
            <Button size="lg" variant="outline" className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-black">
              Generate Custom Icons
              <Wand2 className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

interface InlineCTAProps {
  message: string
  buttonText: string
  href: string
  icon?: React.ReactNode
}

export function InlineGalleryCTA({ message, buttonText, href, icon }: InlineCTAProps) {
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{message}</span>
      <Link href={href} className="font-medium text-primary hover:underline inline-flex items-center gap-1">
        {buttonText}
        {icon || <ArrowRight className="h-3 w-3" />}
      </Link>
    </div>
  )
}