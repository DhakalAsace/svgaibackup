import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { 
  ToolOGImageTemplate, 
  LearnOGImageTemplate, 
  GalleryOGImageTemplate,
  AIGenerationOGImageTemplate 
} from '@/components/seo/og-image-templates';
export const runtime = 'edge';
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'default';
    // Tool page OG image
    if (type === 'tool') {
      const toolName = searchParams.get('name') || 'SVG Tool';
      const description = searchParams.get('desc') || 'Professional SVG editing tool';
      const features = searchParams.getAll('feat') || ['Fast conversion', 'High quality', 'Free to use'];
      const isPremium = searchParams.get('premium') === 'true';
      return new ImageResponse(
        <ToolOGImageTemplate
          toolName={toolName}
          description={description}
          features={features}
          isPremium={isPremium}
        />,
        {
          width: 1200,
          height: 630,
        }
      );
    }
    // Learn page OG image
    if (type === 'learn') {
      const title = searchParams.get('title') || 'Learn About SVG';
      const category = searchParams.get('cat') || 'Tutorial';
      const readTime = searchParams.get('time') || '5 min';
      const topics = searchParams.getAll('topic') || ['SVG basics', 'Vector graphics', 'Web optimization'];
      return new ImageResponse(
        <LearnOGImageTemplate
          title={title}
          category={category}
          readTime={readTime}
          topics={topics}
        />,
        {
          width: 1200,
          height: 630,
        }
      );
    }
    // Gallery page OG image
    if (type === 'gallery') {
      const theme = searchParams.get('theme') || 'Abstract';
      const title = searchParams.get('title') || 'SVG Gallery';
      const description = searchParams.get('desc') || 'Browse our collection of free SVG graphics';
      const exampleCount = parseInt(searchParams.get('count') || '50', 10);
      return new ImageResponse(
        <GalleryOGImageTemplate
          theme={theme}
          title={title}
          description={description}
          exampleCount={exampleCount}
        />,
        {
          width: 1200,
          height: 630,
        }
      );
    }
    // AI Generation OG image
    if (type === 'ai') {
      return new ImageResponse(
        <AIGenerationOGImageTemplate />,
        {
          width: 1200,
          height: 630,
        }
      );
    }
    // Default OG image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF8E1',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #FF7043 0%, transparent 50%), radial-gradient(circle at 75% 75%, #FF7043 0%, transparent 50%)',
            backgroundSize: '100% 100%',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: '#FF7043',
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              }}
            />
            <div style={{ fontSize: 72, fontWeight: 700, color: '#4E342E' }}>
              SVG<span style={{ color: '#FF7043' }}>AI</span>
            </div>
          </div>
          {/* Tagline */}
          <div style={{ fontSize: 32, color: '#4E342E', opacity: 0.8 }}>
            AI-Powered SVG Tools & Converters
          </div>
          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: 40,
              marginTop: 60,
            }}
          >
            <div
              style={{
                padding: '20px 40px',
                backgroundColor: '#00B894',
                color: 'white',
                borderRadius: 25,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              40+ Free Tools
            </div>
            <div
              style={{
                padding: '20px 40px',
                backgroundColor: '#FF7043',
                color: 'white',
                borderRadius: 25,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              AI Generation
            </div>
            <div
              style={{
                padding: '20px 40px',
                backgroundColor: '#2196F3',
                color: 'white',
                borderRadius: 25,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Learn SVG
            </div>
          </div>
          {/* URL */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 24,
              color: '#4E342E',
              opacity: 0.7,
            }}
          >
            svgai.org
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    // Fallback error image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF8E1',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 700, color: '#4E342E' }}>
            SVG<span style={{ color: '#FF7043' }}>AI</span>
          </div>
          <div style={{ fontSize: 24, color: '#4E342E', opacity: 0.8, marginTop: 20 }}>
            Free SVG Tools & Converters
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}