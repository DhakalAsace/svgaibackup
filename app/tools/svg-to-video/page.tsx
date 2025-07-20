import { Metadata } from 'next'
import SVGToVideoPageClient from './svg-to-video-page-client'

const pageTitle = 'AI SVG to Video Converter (MP4 & GIF) | SVG AI';
const pageDescription = 'Convert animated SVG to MP4 or GIF video with our AI-powered tool. Create stunning, high-quality videos from your vector animations in seconds. Free to try.';
const pageUrl = 'https://svgai.org/tools/svg-to-video';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: ['svg to mp4', 'svg to video', 'svg to gif', 'svg animation to video', 'ai video generator', 'convert svg to video'],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: pageUrl,
  },
}

export default function SVGToVideoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'SVG to MP4 Converter - AI Video Generator',
        description: 'Convert SVG to MP4 video format. Transform static SVG files into dynamic MP4 animations using AI.',
        url: pageUrl,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: "WebPlatform, Online",
        offers: {
          '@type': 'Offer',
          price: '6',
          priceCurrency: 'XCR', // Using a non-standard currency code for credits
          description: '6 credits per SVG to MP4 conversion'
        },
        featureList: [
          'SVG to MP4 conversion',
          'AI-powered motion generation',
          '5-second MP4 videos',
          '1080p Full HD resolution',
          'Custom animation descriptions'
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Convert SVG to MP4 with AI',
        description: 'A step-by-step guide to converting a static SVG file into an animated MP4 video using AI.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Step 1: Upload SVG',
            text: 'Upload your static SVG file. Simple designs with distinct elements work best for AI animation.',
            url: `${pageUrl}#how-it-works`,
            image: 'https://svgai.org/images/step1-upload.png' // Placeholder - needs real image
          },
          {
            '@type': 'HowToStep',
            name: 'Step 2: Describe Motion',
            text: 'Tell the AI how you want your design to move. Be descriptive, e.g., "Make the rocket fly upwards and rotate, leaving a smoke trail."',
            url: `${pageUrl}#how-it-works`,
            image: 'https://svgai.org/images/step2-describe.png' // Placeholder - needs real image
          },
          {
            '@type': 'HowToStep',
            name: 'Step 3: Generate and Download MP4',
            text: 'The AI generates a 5-second HD MP4 video based on your prompt. This process typically takes 1-2 minutes. You can then download the result.',
            url: `${pageUrl}#how-it-works`,
            image: 'https://svgai.org/images/step3-download.png' // Placeholder - needs real image
          }
        ],
        totalTime: 'PT2M' // Estimated time: 2 minutes
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SVGToVideoPageClient />
    </>
  );
}
