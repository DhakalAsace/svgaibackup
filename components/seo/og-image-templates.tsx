import React from 'react';

// OG Image dimensions: 1200x630 (Facebook/Twitter standard)
interface OGImageTemplateProps {
  converterTitle: string;
  fromFormat: string;
  toFormat: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
}

// Base template for all converter OG images
export function ConverterOGImageTemplate({
  converterTitle,
  fromFormat,
  toFormat,
  description,
  priority = 'medium'
}: OGImageTemplateProps) {
  // Gradient direction based on priority
  const gradientId = `gradient-${fromFormat}-${toFormat}`;
  const isPrimary = priority === 'high';
  
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="100%" stopColor={isPrimary ? "#FFF3E0" : "#F5F5F5"} />
        </linearGradient>
        
        {/* Shadow filter */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#4E342E" floodOpacity="0.1"/>
        </filter>
        
        {/* Icon glow effect */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main background */}
      <rect width="1200" height="630" fill={`url(#${gradientId})`} />
      
      {/* Brand accent line */}
      <rect x="0" y="0" width="6" height="630" fill="#FF7043" />
      
      {/* Brand logo area */}
      <g transform="translate(60, 40)">
        {/* SVG AI icon */}
        <g filter="url(#glow)">
          <path d="m0 0 4 14 16 4-16 4-4 14-4-14-16-4 16-4Z" fill="#FF7043"/>
        </g>
        
        {/* Brand text */}
        <text x="40" y="25" fontSize="32" fontWeight="700" fill="#4E342E">
          SVG<tspan fill="#FF7043">AI</tspan>
        </text>
      </g>
      
      {/* Main conversion arrow and formats */}
      <g transform="translate(400, 250)">
        {/* From format */}
        <rect x="-120" y="-40" width="100" height="80" rx="12" fill="#4E342E" filter="url(#shadow)" />
        <text x="-70" y="8" fontSize="28" fontWeight="600" fill="white" textAnchor="middle">
          {fromFormat}
        </text>
        
        {/* Conversion arrow */}
        <g fill="#FF7043">
          <path d="M-10 -8 L10 0 L-10 8 Z" />
          <rect x="-10" y="-2" width="20" height="4" />
        </g>
        
        {/* To format */}
        <rect x="20" y="-40" width="100" height="80" rx="12" fill="#FF7043" filter="url(#shadow)" />
        <text x="70" y="8" fontSize="28" fontWeight="600" fill="white" textAnchor="middle">
          {toFormat}
        </text>
      </g>
      
      {/* Main title */}
      <text x="600" y="400" fontSize="48" fontWeight="700" fill="#4E342E" textAnchor="middle">
        {converterTitle}
      </text>
      
      {/* Description */}
      <text x="600" y="450" fontSize="24" fontWeight="400" fill="#4E342E" textAnchor="middle" opacity="0.8">
        {description}
      </text>
      
      {/* Free badge */}
      <g transform="translate(1000, 500)">
        <rect x="-80" y="-25" width="160" height="50" rx="25" fill="#00B894" filter="url(#shadow)" />
        <text x="0" y="8" fontSize="20" fontWeight="600" fill="white" textAnchor="middle">
          FREE TOOL
        </text>
      </g>
      
      {/* Bottom website URL */}
      <text x="1140" y="610" fontSize="18" fontWeight="500" fill="#4E342E" textAnchor="end" opacity="0.7">
        svgai.org
      </text>
    </svg>
  );
}

// High-priority converter OG images
export function PngToSvgOGImage() {
  return (
    <ConverterOGImageTemplate
      converterTitle="PNG to SVG Converter"
      fromFormat="PNG"
      toFormat="SVG"
      description="Convert raster images to scalable vectors"
      priority="high"
    />
  );
}

export function SvgToPngOGImage() {
  return (
    <ConverterOGImageTemplate
      converterTitle="SVG to PNG Converter"
      fromFormat="SVG"
      toFormat="PNG"
      description="Export vectors as high-quality images"
      priority="high"
    />
  );
}

export function SvgConverterOGImage() {
  return (
    <ConverterOGImageTemplate
      converterTitle="SVG Converter"
      fromFormat="ANY"
      toFormat="SVG"
      description="Universal tool for vector conversion"
      priority="high"
    />
  );
}

export function JpgToSvgOGImage() {
  return (
    <ConverterOGImageTemplate
      converterTitle="JPG to SVG Converter"
      fromFormat="JPG"
      toFormat="SVG"
      description="Transform photos into vector graphics"
      priority="high"
    />
  );
}

// Medium-priority converter OG images
export function ImageToSvgOGImage() {
  return (
    <ConverterOGImageTemplate
      converterTitle="Image to SVG Converter"
      fromFormat="IMG"
      toFormat="SVG"
      description="Convert any image format to SVG"
      priority="medium"
    />
  );
}

export function SvgToJpgOGImage() {
  return (
    <ConverterOGImageTemplate
      converterTitle="SVG to JPG Converter"
      fromFormat="SVG"
      toFormat="JPG"
      description="Export vectors as JPEG images"
      priority="medium"
    />
  );
}

export function JpegToSvgOGImage() {
  return (
    <ConverterOGImageTemplate
      converterTitle="JPEG to SVG Converter"
      fromFormat="JPEG"
      toFormat="SVG"
      description="Convert JPEG photos to vectors"
      priority="medium"
    />
  );
}

export function SvgToPdfOGImage() {
  return (
    <ConverterOGImageTemplate
      converterTitle="SVG to PDF Converter"
      fromFormat="SVG"
      toFormat="PDF"
      description="Create print-ready PDF documents"
      priority="medium"
    />
  );
}

// Converter OG Image mapping function
export function getConverterOGImage(urlSlug: string): React.JSX.Element | null {
  const ogImageMap: Record<string, () => React.JSX.Element> = {
    'png-to-svg': PngToSvgOGImage,
    'svg-to-png': SvgToPngOGImage,
    'svg-converter': SvgConverterOGImage,
    'jpg-to-svg': JpgToSvgOGImage,
    'image-to-svg': ImageToSvgOGImage,
    'svg-to-jpg': SvgToJpgOGImage,
    'jpeg-to-svg': JpegToSvgOGImage,
    'svg-to-pdf': SvgToPdfOGImage,
  };

  const ImageComponent = ogImageMap[urlSlug];
  return ImageComponent ? <ImageComponent /> : null;
}

// Generate dynamic OG image for any converter
export function generateConverterOGImage(
  urlSlug: string,
  fromFormat: string,
  toFormat: string,
  title: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
): React.JSX.Element {
  // Try to get specific component first
  const specificImage = getConverterOGImage(urlSlug);
  if (specificImage) {
    return specificImage;
  }

  // Fallback to dynamic generation
  const description = `Convert ${fromFormat} files to ${toFormat} format`;
  
  return (
    <ConverterOGImageTemplate
      converterTitle={title}
      fromFormat={fromFormat}
      toFormat={toFormat}
      description={description}
      priority={priority}
    />
  );
}

// Tool page OG Image template
interface ToolOGImageTemplateProps {
  toolName: string;
  description: string;
  features: string[];
  isPremium?: boolean;
}

export function ToolOGImageTemplate({
  toolName,
  description,
  features,
  isPremium = false
}: ToolOGImageTemplateProps) {
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <defs>
        <linearGradient id="tool-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="100%" stopColor={isPremium ? "#FFE0B2" : "#F5F5F5"} />
        </linearGradient>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#4E342E" floodOpacity="0.15"/>
        </filter>
        
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2" fill="#FF7043" opacity="0.1" />
          <circle cx="25" cy="25" r="2" fill="#FF7043" opacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background with pattern */}
      <rect width="1200" height="630" fill="url(#tool-gradient)" />
      <rect width="1200" height="630" fill="url(#dots)" />
      
      {/* Brand accent line */}
      <rect x="0" y="0" width="6" height="630" fill="#FF7043" />
      
      {/* Brand logo */}
      <g transform="translate(60, 40)">
        <path d="m0 0 4 14 16 4-16 4-4 14-4-14-16-4 16-4Z" fill="#FF7043"/>
        <text x="40" y="25" fontSize="32" fontWeight="700" fill="#4E342E">
          SVG<tspan fill="#FF7043">AI</tspan>
        </text>
      </g>
      
      {/* Tool icon */}
      <g transform="translate(150, 200)">
        <rect width="120" height="120" rx="24" fill="#FF7043" filter="url(#shadow)" />
        <path d="M60 40 L40 60 L60 80 L80 60 Z M40 60 L40 80 L60 100 L80 80 L80 60" 
          fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </g>
      
      {/* Tool name */}
      <text x="320" y="260" fontSize="52" fontWeight="700" fill="#4E342E">
        {toolName}
      </text>
      
      {/* Description */}
      <text x="320" y="310" fontSize="26" fontWeight="400" fill="#4E342E" opacity="0.8">
        {description}
      </text>
      
      {/* Features */}
      <g transform="translate(320, 360)">
        {features.slice(0, 3).map((feature, index) => (
          <g key={index} transform={`translate(0, ${index * 40})`}>
            <circle cx="10" cy="10" r="4" fill="#00B894" />
            <text x="30" y="16" fontSize="20" fill="#4E342E">
              {feature}
            </text>
          </g>
        ))}
      </g>
      
      {/* Badge */}
      <g transform="translate(950, 500)">
        <rect x="-80" y="-25" width="160" height="50" rx="25" 
          fill={isPremium ? "#FFB300" : "#00B894"} filter="url(#shadow)" />
        <text x="0" y="8" fontSize="20" fontWeight="600" fill="white" textAnchor="middle">
          {isPremium ? "PREMIUM" : "FREE TOOL"}
        </text>
      </g>
      
      {/* Website URL */}
      <text x="1140" y="610" fontSize="18" fontWeight="500" fill="#4E342E" textAnchor="end" opacity="0.7">
        svgai.org
      </text>
    </svg>
  );
}

// Learn page OG Image template
interface LearnOGImageTemplateProps {
  title: string;
  category: string;
  readTime: string;
  topics: string[];
}

export function LearnOGImageTemplate({
  title,
  category,
  readTime,
  topics
}: LearnOGImageTemplateProps) {
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <defs>
        <linearGradient id="learn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3F2FD" />
          <stop offset="100%" stopColor="#FFF8E1" />
        </linearGradient>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#4E342E" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="1200" height="630" fill="url(#learn-gradient)" />
      
      {/* Decorative elements */}
      <circle cx="1100" cy="100" r="150" fill="#FF7043" opacity="0.05" />
      <circle cx="100" cy="530" r="100" fill="#2196F3" opacity="0.05" />
      
      {/* Brand accent line */}
      <rect x="0" y="0" width="6" height="630" fill="#2196F3" />
      
      {/* Brand logo */}
      <g transform="translate(60, 40)">
        <path d="m0 0 4 14 16 4-16 4-4 14-4-14-16-4 16-4Z" fill="#FF7043"/>
        <text x="40" y="25" fontSize="32" fontWeight="700" fill="#4E342E">
          SVG<tspan fill="#FF7043">AI</tspan> Learn
        </text>
      </g>
      
      {/* Category badge */}
      <g transform="translate(60, 120)">
        <rect width="180" height="40" rx="20" fill="#2196F3" />
        <text x="90" y="26" fontSize="18" fontWeight="600" fill="white" textAnchor="middle">
          {category}
        </text>
      </g>
      
      {/* Title */}
      <text x="60" y="240" fontSize="48" fontWeight="700" fill="#4E342E" style={{ maxWidth: '1080px' }}>
        <tspan x="60" dy="0">{title.slice(0, 40)}</tspan>
        {title.length > 40 && <tspan x="60" dy="60">{title.slice(40, 80)}</tspan>}
      </text>
      
      {/* Topics */}
      <g transform="translate(60, 360)">
        <text fontSize="22" fontWeight="600" fill="#4E342E" opacity="0.9">
          Learn about:
        </text>
        {topics.slice(0, 3).map((topic, index) => (
          <g key={index} transform={`translate(20, ${40 + index * 35})`}>
            <rect x="-4" y="-20" width="8" height="24" rx="4" fill="#FF7043" />
            <text x="20" y="0" fontSize="20" fill="#4E342E" opacity="0.8">
              {topic}
            </text>
          </g>
        ))}
      </g>
      
      {/* Read time */}
      <g transform="translate(1000, 80)">
        <rect x="-70" y="-20" width="140" height="40" rx="20" fill="#4E342E" opacity="0.1" />
        <text x="0" y="5" fontSize="18" fontWeight="500" fill="#4E342E" textAnchor="middle">
          {readTime} read
        </text>
      </g>
      
      {/* Website URL */}
      <text x="1140" y="610" fontSize="18" fontWeight="500" fill="#4E342E" textAnchor="end" opacity="0.7">
        svgai.org/learn
      </text>
    </svg>
  );
}

// Gallery page OG Image template
interface GalleryOGImageTemplateProps {
  theme: string;
  title: string;
  description: string;
  exampleCount: number;
  previewShapes?: Array<{ type: 'circle' | 'rect' | 'path', props: any }>;
}

export function GalleryOGImageTemplate({
  theme,
  title,
  description,
  exampleCount,
  previewShapes = []
}: GalleryOGImageTemplateProps) {
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <defs>
        <linearGradient id="gallery-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCE4EC" />
          <stop offset="100%" stopColor="#FFF8E1" />
        </linearGradient>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#4E342E" floodOpacity="0.15"/>
        </filter>
        
        <clipPath id="gallery-grid">
          <rect x="700" y="150" width="420" height="330" rx="12" />
        </clipPath>
      </defs>
      
      {/* Background */}
      <rect width="1200" height="630" fill="url(#gallery-gradient)" />
      
      {/* Brand accent line */}
      <rect x="0" y="0" width="6" height="630" fill="#E91E63" />
      
      {/* Brand logo */}
      <g transform="translate(60, 40)">
        <path d="m0 0 4 14 16 4-16 4-4 14-4-14-16-4 16-4Z" fill="#FF7043"/>
        <text x="40" y="25" fontSize="32" fontWeight="700" fill="#4E342E">
          SVG<tspan fill="#FF7043">AI</tspan> Gallery
        </text>
      </g>
      
      {/* Title */}
      <text x="60" y="200" fontSize="56" fontWeight="700" fill="#4E342E">
        {title}
      </text>
      
      {/* Description */}
      <text x="60" y="250" fontSize="24" fontWeight="400" fill="#4E342E" opacity="0.8">
        {description}
      </text>
      
      {/* Theme badge */}
      <g transform="translate(60, 300)">
        <rect width="200" height="50" rx="25" fill="#E91E63" filter="url(#shadow)" />
        <text x="100" y="32" fontSize="20" fontWeight="600" fill="white" textAnchor="middle">
          {theme.toUpperCase()}
        </text>
      </g>
      
      {/* Example count */}
      <text x="60" y="410" fontSize="22" fill="#4E342E" opacity="0.7">
        {exampleCount}+ Free SVG Examples
      </text>
      
      {/* Gallery preview grid */}
      <g clipPath="url(#gallery-grid)">
        <rect x="700" y="150" width="420" height="330" fill="white" opacity="0.9" />
        {/* Grid lines */}
        <line x1="840" y1="150" x2="840" y2="480" stroke="#4E342E" strokeOpacity="0.1" strokeWidth="2" />
        <line x1="980" y1="150" x2="980" y2="480" stroke="#4E342E" strokeOpacity="0.1" strokeWidth="2" />
        <line x1="700" y1="260" x2="1120" y2="260" stroke="#4E342E" strokeOpacity="0.1" strokeWidth="2" />
        <line x1="700" y1="370" x2="1120" y2="370" stroke="#4E342E" strokeOpacity="0.1" strokeWidth="2" />
        
        {/* Preview shapes in grid cells */}
        {previewShapes.length > 0 ? (
          previewShapes.slice(0, 9).map((shape, index) => {
            const col = index % 3;
            const row = Math.floor(index / 3);
            const x = 700 + col * 140 + 70;
            const y = 150 + row * 110 + 55;
            
            if (shape.type === 'circle') {
              return <circle key={index} cx={x} cy={y} {...shape.props} />;
            } else if (shape.type === 'rect') {
              return <rect key={index} x={x - 30} y={y - 30} {...shape.props} />;
            } else if (shape.type === 'path') {
              return <path key={index} transform={`translate(${x}, ${y})`} {...shape.props} />;
            }
            return null;
          })
        ) : (
          /* Default preview shapes */
          <>
            <circle cx="770" cy="205" r="30" fill="#FF7043" opacity="0.6" />
            <rect x="880" y="175" width="60" height="60" rx="8" fill="#2196F3" opacity="0.6" />
            <path d="M0,-30 L26,15 L-26,15 Z" transform="translate(1050, 205)" fill="#4CAF50" opacity="0.6" />
            <rect x="740" y="285" width="60" height="60" rx="30" fill="#9C27B0" opacity="0.6" />
            <circle cx="910" cy="315" r="30" fill="#FF5722" opacity="0.6" />
            <path d="M0,0 L20,-20 L40,0 L20,20 Z" transform="translate(1030, 315)" fill="#00BCD4" opacity="0.6" />
            <path d="M0,0 L30,0 L15,26 Z" transform="translate(755, 425)" fill="#FFC107" opacity="0.6" />
            <circle cx="910" cy="425" r="30" fill="#E91E63" opacity="0.6" />
            <rect x="1020" y="395" width="60" height="60" rx="12" fill="#795548" opacity="0.6" />
          </>
        )}
      </g>
      
      {/* CTA */}
      <g transform="translate(700, 520)">
        <rect width="180" height="50" rx="25" fill="#00B894" filter="url(#shadow)" />
        <text x="90" y="32" fontSize="20" fontWeight="600" fill="white" textAnchor="middle">
          Browse Gallery
        </text>
      </g>
      
      {/* Website URL */}
      <text x="1140" y="610" fontSize="18" fontWeight="500" fill="#4E342E" textAnchor="end" opacity="0.7">
        svgai.org/gallery
      </text>
    </svg>
  );
}

// AI Generation OG Image template
export function AIGenerationOGImageTemplate() {
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <defs>
        <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7043" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#FFF8E1" />
          <stop offset="100%" stopColor="#FF7043" stopOpacity="0.15" />
        </linearGradient>
        
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#4E342E" floodOpacity="0.2"/>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="1200" height="630" fill="url(#ai-gradient)" />
      
      {/* Neural network decoration */}
      <g opacity="0.1">
        <circle cx="200" cy="200" r="8" fill="#FF7043" />
        <circle cx="350" cy="150" r="8" fill="#FF7043" />
        <circle cx="500" cy="200" r="8" fill="#FF7043" />
        <circle cx="350" cy="250" r="8" fill="#FF7043" />
        <line x1="200" y1="200" x2="350" y2="150" stroke="#FF7043" strokeWidth="2" />
        <line x1="200" y1="200" x2="350" y2="250" stroke="#FF7043" strokeWidth="2" />
        <line x1="350" y1="150" x2="500" y2="200" stroke="#FF7043" strokeWidth="2" />
        <line x1="350" y1="250" x2="500" y2="200" stroke="#FF7043" strokeWidth="2" />
      </g>
      
      {/* Brand accent line */}
      <rect x="0" y="0" width="6" height="630" fill="#FF7043" />
      
      {/* Brand logo */}
      <g transform="translate(60, 40)">
        <g filter="url(#glow)">
          <path d="m0 0 4 14 16 4-16 4-4 14-4-14-16-4 16-4Z" fill="#FF7043"/>
        </g>
        <text x="40" y="25" fontSize="32" fontWeight="700" fill="#4E342E">
          SVG<tspan fill="#FF7043">AI</tspan>
        </text>
      </g>
      
      {/* Main title */}
      <text x="600" y="200" fontSize="64" fontWeight="700" fill="#4E342E" textAnchor="middle">
        AI-Powered SVG Generation
      </text>
      
      {/* Subtitle */}
      <text x="600" y="260" fontSize="28" fontWeight="400" fill="#4E342E" opacity="0.8" textAnchor="middle">
        Create unique vector graphics with artificial intelligence
      </text>
      
      {/* Feature boxes */}
      <g transform="translate(150, 340)">
        {/* Text to SVG */}
        <g>
          <rect width="280" height="120" rx="16" fill="white" filter="url(#shadow)" />
          <text x="140" y="50" fontSize="24" fontWeight="600" fill="#4E342E" textAnchor="middle">
            Text to SVG
          </text>
          <text x="140" y="80" fontSize="18" fill="#4E342E" opacity="0.7" textAnchor="middle">
            Describe and generate
          </text>
        </g>
        
        {/* Custom Styles */}
        <g transform="translate(310, 0)">
          <rect width="280" height="120" rx="16" fill="white" filter="url(#shadow)" />
          <text x="140" y="50" fontSize="24" fontWeight="600" fill="#4E342E" textAnchor="middle">
            Custom Styles
          </text>
          <text x="140" y="80" fontSize="18" fill="#4E342E" opacity="0.7" textAnchor="middle">
            Unique artistic outputs
          </text>
        </g>
        
        {/* Instant Results */}
        <g transform="translate(620, 0)">
          <rect width="280" height="120" rx="16" fill="white" filter="url(#shadow)" />
          <text x="140" y="50" fontSize="24" fontWeight="600" fill="#4E342E" textAnchor="middle">
            Instant Results
          </text>
          <text x="140" y="80" fontSize="18" fill="#4E342E" opacity="0.7" textAnchor="middle">
            Generate in seconds
          </text>
        </g>
      </g>
      
      {/* CTA Button */}
      <g transform="translate(510, 520)">
        <rect x="-90" y="-25" width="180" height="50" rx="25" fill="#FF7043" filter="url(#shadow)" />
        <text x="0" y="8" fontSize="20" fontWeight="600" fill="white" textAnchor="middle">
          Try AI Generator
        </text>
      </g>
      
      {/* Website URL */}
      <text x="1140" y="610" fontSize="18" fontWeight="500" fill="#4E342E" textAnchor="end" opacity="0.7">
        svgai.org
      </text>
    </svg>
  );
}