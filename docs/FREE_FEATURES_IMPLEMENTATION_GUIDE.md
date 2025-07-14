# Free Features Implementation Guide

## Quick-Win Free Converters Using Open Source Libraries

### 1. SVG to PNG/JPG Converter (Client-Side)

```typescript
// lib/converters/svg-to-raster.ts
export async function svgToPng(svgString: string, width = 1024, height = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = width;
    canvas.height = height;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert'));
      }, 'image/png');
    };
    
    img.onerror = reject;
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
  });
}

export async function svgToJpg(svgString: string, width = 1024, height = 1024, quality = 0.9): Promise<Blob> {
  // Similar implementation but with 'image/jpeg' and quality parameter
}
```

### 2. SVG to React Component Converter

```typescript
// lib/converters/svg-to-react.ts
import { transform } from '@svgr/core';

export async function svgToReact(svgString: string, componentName = 'MyIcon'): Promise<string> {
  const jsCode = await transform(
    svgString,
    {
      plugins: ['@svgr/plugin-jsx', '@svgr/plugin-prettier'],
      icon: true,
      typescript: true,
    },
    { componentName }
  );
  
  return jsCode;
}
```

### 3. PNG/JPG to SVG (Basic Tracing)

```typescript
// lib/converters/raster-to-svg.ts
import potrace from 'potrace';

export function pngToSvg(buffer: Buffer, options = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    potrace.trace(buffer, {
      threshold: 128,
      color: 'black',
      background: 'transparent',
      ...options
    }, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });
}

export function jpgToSvg(buffer: Buffer, options = {}): Promise<string> {
  // Same as PNG but might need preprocessing
  return pngToSvg(buffer, options);
}
```

### 4. SVG Optimizer (Free with Limits)

```typescript
// lib/converters/svg-optimizer.ts
import { optimize } from 'svgo';

export function optimizeSvg(svgString: string): string {
  const result = optimize(svgString, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            cleanupNumbericValues: {
              floatPrecision: 2
            }
          }
        }
      }
    ]
  });
  
  return result.data;
}
```

## API Routes Implementation

### Free Converter API Route

```typescript
// app/api/convert/free/route.ts
import { NextRequest } from 'next/server';
import { ratelimit } from '@/lib/rate-limit';
import { addWatermark } from '@/lib/watermark';

const FREE_CONVERTERS = {
  'svg-to-png': svgToPng,
  'svg-to-jpg': svgToJpg,
  'png-to-svg': pngToSvg,
  'svg-to-react': svgToReact,
  'optimize-svg': optimizeSvg
};

export async function POST(req: NextRequest) {
  const identifier = getIdentifier(req); // IP or user ID
  
  // Rate limiting: 10 free conversions per day
  const { success } = await ratelimit.limit(identifier, {
    requests: 10,
    window: '1d'
  });
  
  if (!success) {
    return new Response('Daily limit reached. Upgrade to Pro for unlimited conversions!', { 
      status: 429 
    });
  }
  
  const { input, from, to } = await req.json();
  const converterKey = `${from}-to-${to}`;
  
  if (!FREE_CONVERTERS[converterKey]) {
    return new Response('Invalid conversion type', { status: 400 });
  }
  
  try {
    let result = await FREE_CONVERTERS[converterKey](input);
    
    // Add watermark for free users
    if (!req.headers.get('Authorization')) {
      result = await addWatermark(result, { 
        text: 'Created with SVG AI - svg-ai.app',
        position: 'bottom-right'
      });
    }
    
    // Track conversion
    await trackConversion(identifier, converterKey, 'free');
    
    return new Response(result, {
      headers: {
        'Content-Type': getContentType(to),
        'X-Remaining-Conversions': String(10 - usageCount)
      }
    });
  } catch (error) {
    return new Response('Conversion failed', { status: 500 });
  }
}
```

## Landing Page Components

### Converter Page Template

```tsx
// app/convert/[converter]/page.tsx
import { ConverterForm } from '@/components/converter-form';
import { ConverterExamples } from '@/components/converter-examples';
import { FAQ } from '@/components/faq';

export default function ConverterPage({ params }) {
  const { converter } = params;
  const [from, to] = converter.split('-to-');
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* SEO-Optimized Header */}
      <h1 className="text-4xl font-bold mb-4">
        Free {from.toUpperCase()} to {to.toUpperCase()} Converter
      </h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Convert {from.toUpperCase()} files to {to.toUpperCase()} instantly. 
        No signup required. 100% free for basic conversions.
      </p>
      
      {/* Main Converter */}
      <ConverterForm from={from} to={to} />
      
      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">🚀 Instant Conversion</h3>
          <p>Process files in seconds with our optimized converter</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">🔒 Privacy First</h3>
          <p>Files processed locally, never stored on our servers</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">✨ Pro Features</h3>
          <p>Remove watermarks and get premium features</p>
        </div>
      </div>
      
      {/* Examples */}
      <ConverterExamples from={from} to={to} />
      
      {/* CTA for Paid Features */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg mt-12">
        <h2 className="text-2xl font-bold mb-4">Need Advanced Features?</h2>
        <ul className="mb-6 space-y-2">
          <li>✓ No watermarks</li>
          <li>✓ Batch conversion</li>
          <li>✓ API access</li>
          <li>✓ Priority processing</li>
        </ul>
        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold">
          Upgrade to Pro →
        </button>
      </div>
      
      {/* FAQ */}
      <FAQ items={getConverterFAQ(from, to)} />
    </div>
  );
}

// Generate static params for all free converters
export function generateStaticParams() {
  return [
    { converter: 'svg-to-png' },
    { converter: 'svg-to-jpg' },
    { converter: 'png-to-svg' },
    { converter: 'jpg-to-svg' },
    { converter: 'svg-to-react' },
    { converter: 'svg-to-pdf' },
  ];
}
```

### Converter Form Component

```tsx
// components/converter-form.tsx
'use client';

import { useState } from 'react';
import { Upload, Download, Loader2 } from 'lucide-react';

export function ConverterForm({ from, to }) {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const handleConvert = async () => {
    if (!file) return;
    
    setConverting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('from', from);
    formData.append('to', to);
    
    try {
      const response = await fetch('/api/convert/free', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          // Show upgrade modal
          showUpgradeModal();
          return;
        }
        throw new Error('Conversion failed');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);
      
      // Track successful conversion
      trackEvent('conversion_completed', { from, to });
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Conversion failed. Please try again.');
    } finally {
      setConverting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Dropzone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drop your {from.toUpperCase()} file here or{' '}
          <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
            browse
            <input
              type="file"
              className="hidden"
              accept={getAcceptTypes(from)}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max file size: 5MB (Free plan)
        </p>
      </div>
      
      {/* File Preview */}
      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      )}
      
      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!file || converting}
        className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {converting ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Converting...
          </>
        ) : (
          <>
            Convert to {to.toUpperCase()}
          </>
        )}
      </button>
      
      {/* Result */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">
              Conversion complete!
            </span>
            <a
              href={result}
              download={`converted.${to}`}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </div>
          
          {/* Preview for supported formats */}
          {['png', 'jpg', 'svg'].includes(to) && (
            <div className="mt-4">
              <img
                src={result}
                alt="Conversion result"
                className="max-w-full h-auto rounded"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Rate Limiting Setup

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 d'),
  analytics: true,
  prefix: 'svgai:free-converter',
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(
    identifier
  );
  
  return {
    success,
    limit,
    reset,
    remaining,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(reset).toISOString(),
    }
  };
}
```

## SEO & Landing Page Optimization

```typescript
// app/convert/[converter]/metadata.ts
export function generateMetadata({ params }) {
  const { converter } = params;
  const [from, to] = converter.split('-to-');
  
  return {
    title: `Free ${from.toUpperCase()} to ${to.toUpperCase()} Converter | SVG AI`,
    description: `Convert ${from.toUpperCase()} to ${to.toUpperCase()} online for free. No signup required. Fast, secure, and easy to use. Try our converter now!`,
    keywords: [
      `${from} to ${to}`,
      `convert ${from} to ${to}`,
      `${from} to ${to} converter`,
      `free ${from} to ${to}`,
      `online ${from} to ${to}`,
    ],
    openGraph: {
      title: `Free ${from.toUpperCase()} to ${to.toUpperCase()} Converter`,
      description: `Convert your ${from.toUpperCase()} files to ${to.toUpperCase()} format instantly`,
      type: 'website',
    },
    alternates: {
      canonical: `https://svg-ai.app/convert/${converter}`,
    },
  };
}
```

## Structured Data for SEO

```typescript
// components/converter-structured-data.tsx
export function ConverterStructuredData({ from, to }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${from.toUpperCase()} to ${to.toUpperCase()} Converter`,
    url: `https://svg-ai.app/convert/${from}-to-${to}`,
    description: `Free online tool to convert ${from} files to ${to} format`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Instant conversion',
      'No file upload required',
      'Privacy-focused',
      'No registration needed',
    ],
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

## Deployment Checklist

1. **Install Dependencies**
   ```bash
   npm install @svgr/core potrace svgo sharp
   npm install @upstash/ratelimit @upstash/redis
   ```

2. **Environment Variables**
   ```env
   UPSTASH_REDIS_REST_URL=your_url
   UPSTASH_REDIS_REST_TOKEN=your_token
   ```

3. **Create Landing Pages**
   - `/convert/svg-to-png`
   - `/convert/svg-to-jpg`
   - `/convert/png-to-svg`
   - `/convert/svg-to-react`

4. **Update Navigation**
   - Add "Free Tools" dropdown
   - Link to converter pages

5. **Analytics Setup**
   - Track conversion events
   - Monitor rate limits
   - Track upgrade conversions

This implementation provides a solid foundation for free conversion tools that will drive traffic while encouraging upgrades to paid features.