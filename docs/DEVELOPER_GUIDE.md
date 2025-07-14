# SVG AI Developer Guide

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS + Shadcn/ui
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4
- **Monitoring**: Custom solution

### Project Structure
```
svgaibackup/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-protected routes
│   ├── api/               # API endpoints
│   ├── convert/           # Converter pages
│   ├── gallery/           # Gallery pages
│   ├── learn/             # Educational content
│   └── tools/             # Free tools
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── converters/       # Converter components
│   └── gallery/          # Gallery components
├── lib/                   # Utilities and helpers
│   ├── converters/       # Converter logic
│   ├── database/         # Database utilities
│   └── utils/            # General utilities
├── public/               # Static assets
├── types/                # TypeScript types
└── migrations/           # Database migrations
```

---

## 🔧 Key Components and Utilities

### Converter System

#### Base Converter Interface
```typescript
// lib/converters/types.ts
export interface Converter {
  id: string;
  name: string;
  fromFormat: string;
  toFormat: string;
  convert: (file: File, options?: ConversionOptions) => Promise<ConversionResult>;
  validateInput: (file: File) => ValidationResult;
  defaultOptions: ConversionOptions;
}

export interface ConversionOptions {
  quality?: number;
  width?: number;
  height?: number;
  preserveAspectRatio?: boolean;
  background?: string;
  [key: string]: any;
}

export interface ConversionResult {
  success: boolean;
  output?: Blob;
  error?: string;
  metadata?: Record<string, any>;
}
```

#### Converter Registry
```typescript
// lib/converters/registry.ts
import { pngToSvgConverter } from './png-to-svg';
import { svgToPngConverter } from './svg-to-png';
// ... other converters

export const converterRegistry = new Map([
  ['png-to-svg', pngToSvgConverter],
  ['svg-to-png', svgToPngConverter],
  // ... register all 40 converters
]);

export function getConverter(id: string): Converter | null {
  return converterRegistry.get(id) || null;
}
```

#### Example Converter Implementation
```typescript
// lib/converters/png-to-svg.ts
import potrace from 'potrace';

export const pngToSvgConverter: Converter = {
  id: 'png-to-svg',
  name: 'PNG to SVG',
  fromFormat: 'png',
  toFormat: 'svg',
  
  validateInput(file: File): ValidationResult {
    if (!file.type.includes('png')) {
      return { valid: false, error: 'File must be PNG format' };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File size must be under 10MB' };
    }
    return { valid: true };
  },
  
  async convert(file: File, options?: ConversionOptions): Promise<ConversionResult> {
    try {
      const buffer = await file.arrayBuffer();
      const svg = await new Promise((resolve, reject) => {
        potrace.trace(Buffer.from(buffer), options, (err, svg) => {
          if (err) reject(err);
          else resolve(svg);
        });
      });
      
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      return { success: true, output: blob };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  defaultOptions: {
    threshold: 128,
    color: 'auto',
    background: 'transparent'
  }
};
```

### Gallery System

#### Gallery Configuration
```typescript
// app/gallery/gallery-config.ts
export interface GalleryTheme {
  id: string;
  name: string;
  slug: string;
  description: string;
  searchVolume: number;
  designs: GalleryDesign[];
  seoContent: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface GalleryDesign {
  id: string;
  title: string;
  svg: string;
  tags: string[];
  colors: string[];
  premium?: boolean;
}
```

#### Gallery Data Management
```typescript
// lib/gallery/gallery-service.ts
export class GalleryService {
  async getThemeDesigns(themeId: string): Promise<GalleryDesign[]> {
    // Fetch from database or static files
    const designs = await supabase
      .from('gallery_designs')
      .select('*')
      .eq('theme_id', themeId)
      .order('popularity', { ascending: false });
    
    return designs.data || [];
  }
  
  async searchDesigns(query: string, filters?: FilterOptions) {
    // Implement search logic
  }
  
  async getRelatedDesigns(designId: string, limit = 6) {
    // Find similar designs based on tags/colors
  }
}
```

### Database Utilities

#### Supabase Client
```typescript
// lib/database/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side client with service role
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

#### Database Types
```typescript
// types/database.types.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          credits: number;
          subscription_status: 'active' | 'canceled' | 'past_due';
          created_at: string;
        };
      };
      conversions: {
        Row: {
          id: string;
          user_id: string | null;
          converter_type: string;
          input_format: string;
          output_format: string;
          file_size: number;
          created_at: string;
        };
      };
      // ... other tables
    };
  };
}
```

### Performance Utilities

#### Image Optimization
```typescript
// lib/utils/image-optimization.ts
export async function optimizeImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to optimize')),
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
}
```

#### Caching Strategy
```typescript
// lib/utils/cache.ts
export class CacheManager {
  private cache = new Map<string, CacheEntry>();
  
  set(key: string, value: any, ttl: number = 3600000) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  clear() {
    this.cache.clear();
  }
}
```

---

## ➕ Adding New Converters

### Step 1: Create Converter Implementation
```typescript
// lib/converters/new-format-to-svg.ts
import { Converter } from './types';

export const newFormatToSvgConverter: Converter = {
  id: 'new-format-to-svg',
  name: 'NEW to SVG',
  fromFormat: 'new',
  toFormat: 'svg',
  
  validateInput(file: File) {
    // Implement validation
  },
  
  async convert(file: File, options?: ConversionOptions) {
    // Implement conversion logic
  },
  
  defaultOptions: {
    // Default conversion options
  }
};
```

### Step 2: Register Converter
```typescript
// lib/converters/registry.ts
import { newFormatToSvgConverter } from './new-format-to-svg';

export const converterRegistry = new Map([
  // ... existing converters
  ['new-format-to-svg', newFormatToSvgConverter],
]);
```

### Step 3: Add Configuration
```typescript
// app/convert/converter-config.ts
export const converterConfigs = [
  // ... existing configs
  {
    id: 'new-format-to-svg',
    slug: 'new-to-svg',
    name: 'NEW to SVG Converter',
    fromFormat: 'NEW',
    toFormat: 'SVG',
    searchVolume: 1000,
    keywords: ['new to svg', 'convert new to svg'],
    title: 'Convert NEW to SVG Online - Free NEW to SVG Converter',
    description: 'Convert NEW files to SVG format...',
  }
];
```

### Step 4: Create Tests
```typescript
// __tests__/converters/new-format-to-svg.test.ts
import { newFormatToSvgConverter } from '@/lib/converters/new-format-to-svg';

describe('NEW to SVG Converter', () => {
  it('should convert valid NEW file', async () => {
    const file = new File(['content'], 'test.new', { type: 'application/new' });
    const result = await newFormatToSvgConverter.convert(file);
    
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Blob);
    expect(result.output?.type).toBe('image/svg+xml');
  });
  
  it('should reject invalid file', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const validation = newFormatToSvgConverter.validateInput(file);
    
    expect(validation.valid).toBe(false);
  });
});
```

---

## 🎨 Adding New Gallery Themes

### Step 1: Define Theme Configuration
```typescript
// app/gallery/gallery-config.ts
export const galleryThemes = [
  // ... existing themes
  {
    id: 'new-theme',
    name: 'New Theme SVG',
    slug: 'new-theme-svg',
    description: 'Collection of new theme SVG designs',
    searchVolume: 5000,
    keywords: ['new theme svg', 'new theme vector'],
    designs: [], // Will be populated from database
  }
];
```

### Step 2: Create Theme Designs
```typescript
// scripts/seed-gallery-designs.ts
const newThemeDesigns = [
  {
    title: 'New Theme Design 1',
    svg: '<svg>...</svg>',
    tags: ['new', 'theme', 'modern'],
    colors: ['#ff0000', '#00ff00'],
    theme_id: 'new-theme'
  },
  // ... more designs
];

// Seed to database
for (const design of newThemeDesigns) {
  await supabase.from('gallery_designs').insert(design);
}
```

### Step 3: Add SEO Content
```typescript
// content/gallery/new-theme-content.ts
export const newThemeContent = {
  hero: {
    title: 'New Theme SVG Gallery',
    description: 'Browse our collection of new theme SVG designs...',
  },
  sections: [
    {
      title: 'Popular New Theme Designs',
      content: '...',
    },
    // ... more sections
  ],
  faq: [
    {
      question: 'Can I use these new theme SVGs commercially?',
      answer: '...',
    },
  ],
};
```

---

## ⚡ Performance Considerations

### Client-Side Optimization
1. **Lazy Loading**: Load converters on demand
   ```typescript
   const ConverterComponent = dynamic(
     () => import(`@/components/converters/${converterId}`),
     { loading: () => <ConverterSkeleton /> }
   );
   ```

2. **Web Workers**: Process large files off main thread
   ```typescript
   // lib/workers/converter.worker.ts
   self.addEventListener('message', async (e) => {
     const { file, options } = e.data;
     const result = await processFile(file, options);
     self.postMessage(result);
   });
   ```

3. **Memory Management**: Clean up after conversions
   ```typescript
   useEffect(() => {
     return () => {
       // Revoke object URLs
       if (outputUrl) URL.revokeObjectURL(outputUrl);
       // Clear canvas references
       canvasRef.current = null;
     };
   }, [outputUrl]);
   ```

### Server-Side Optimization
1. **Static Generation**: Pre-build all converter pages
   ```typescript
   export async function generateStaticParams() {
     return converterConfigs.map((config) => ({
       converter: config.slug,
     }));
   }
   ```

2. **ISR Strategy**: Revalidate based on traffic
   ```typescript
   export const revalidate = 3600; // 1 hour for low traffic
   // or
   export const revalidate = 300; // 5 min for high traffic
   ```

3. **Edge Caching**: Cache API responses
   ```typescript
   export const config = {
     runtime: 'edge',
   };
   
   return new Response(JSON.stringify(data), {
     headers: {
       'Cache-Control': 'public, s-maxage=3600',
     },
   });
   ```

### Database Optimization
1. **Connection Pooling**
   ```typescript
   // lib/database/pool.ts
   import { Pool } from 'pg';
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20,
     idleTimeoutMillis: 30000,
   });
   ```

2. **Query Optimization**
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_conversions_user_created 
   ON conversions(user_id, created_at DESC);
   
   CREATE INDEX idx_gallery_designs_theme_popularity 
   ON gallery_designs(theme_id, popularity DESC);
   ```

3. **Materialized Views**
   ```sql
   -- For analytics dashboards
   CREATE MATERIALIZED VIEW daily_conversion_stats AS
   SELECT 
     DATE(created_at) as date,
     converter_type,
     COUNT(*) as total_conversions,
     COUNT(DISTINCT user_id) as unique_users
   FROM conversions
   GROUP BY DATE(created_at), converter_type;
   ```

---

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// Use Jest + React Testing Library
describe('Converter Component', () => {
  it('should handle file upload', async () => {
    const { getByTestId } = render(<PngToSvgConverter />);
    const input = getByTestId('file-input');
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(getByTestId('preview')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests
```typescript
// Test API endpoints
describe('POST /api/convert/png-to-svg', () => {
  it('should convert PNG to SVG', async () => {
    const formData = new FormData();
    formData.append('file', testPngFile);
    
    const response = await fetch('/api/convert/png-to-svg', {
      method: 'POST',
      body: formData,
    });
    
    expect(response.ok).toBe(true);
    const blob = await response.blob();
    expect(blob.type).toBe('image/svg+xml');
  });
});
```

### E2E Tests
```typescript
// Using Playwright
test('complete conversion flow', async ({ page }) => {
  await page.goto('/convert/png-to-svg');
  
  // Upload file
  await page.setInputFiles('input[type="file"]', 'test.png');
  
  // Wait for conversion
  await page.waitForSelector('[data-testid="download-button"]');
  
  // Download result
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="download-button"]'),
  ]);
  
  expect(download.suggestedFilename()).toContain('.svg');
});
```

---

## 🚀 Deployment Process

### Local Development
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in API keys

# Run development server
npm run dev

# Run tests
npm test
npm run test:e2e
```

### Staging Deployment
```bash
# Deploy to staging
vercel --env preview

# Run smoke tests
npm run test:staging

# Check performance
npm run lighthouse:staging
```

### Production Deployment
```bash
# Pre-deployment checks
npm run build
npm run type-check
npm run lint
npm run test

# Deploy to production
vercel --prod

# Post-deployment verification
npm run health-check:prod
npm run test:smoke:prod
```

---

## 📚 Additional Resources

### Internal Documentation
- [API Documentation](/docs/api)
- [Database Schema](/docs/database)
- [Security Guidelines](/docs/security)
- [SEO Best Practices](/docs/seo)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Development Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Supabase Studio](https://app.supabase.com)

---

*Developer guide version: 1.0*
*Last updated: Launch preparation*
*Next review: Post-launch iteration*