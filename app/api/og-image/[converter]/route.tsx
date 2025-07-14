import { ImageResponse } from 'next/og';
import { getConverterBySlug } from '@/app/convert/converter-config';
import { generateConverterOGImage } from '@/components/seo/og-image-templates';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ converter: string }> }
) {
  try {
    const { converter: converterSlug } = await params;
    const converterConfig = getConverterBySlug(converterSlug);

    if (!converterConfig) {
      // Return a generic SVG AI OG image for unknown converters
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
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 700, color: '#4E342E' }}>
              SVG<span style={{ color: '#FF7043' }}>AI</span>
            </div>
            <div style={{ fontSize: 24, color: '#4E342E', opacity: 0.8, marginTop: 20 }}>
              Free SVG Conversion Tools
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Generate the SVG OG image component
    const ogImageComponent = generateConverterOGImage(
      converterConfig.urlSlug,
      converterConfig.fromFormat,
      converterConfig.toFormat,
      converterConfig.title,
      converterConfig.priority
    );

    // Convert the React SVG component to a format compatible with ImageResponse
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
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Brand accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 6,
              height: '100%',
              backgroundColor: '#FF7043',
            }}
          />
          
          {/* Brand logo */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#FF7043',
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              }}
            />
            <div style={{ fontSize: 32, fontWeight: 700, color: '#4E342E' }}>
              SVG<span style={{ color: '#FF7043' }}>AI</span>
            </div>
          </div>

          {/* Main conversion area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              marginTop: -50,
            }}
          >
            {/* From format */}
            <div
              style={{
                width: 100,
                height: 80,
                backgroundColor: '#4E342E',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(78, 52, 46, 0.2)',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 600, color: 'white' }}>
                {converterConfig.fromFormat}
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                fontSize: 40,
                color: '#FF7043',
                fontWeight: 700,
              }}
            >
              →
            </div>

            {/* To format */}
            <div
              style={{
                width: 100,
                height: 80,
                backgroundColor: '#FF7043',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(255, 112, 67, 0.2)',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 600, color: 'white' }}>
                {converterConfig.toFormat}
              </div>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#4E342E',
              textAlign: 'center',
              marginTop: 60,
              maxWidth: 900,
            }}
          >
            {converterConfig.title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: '#4E342E',
              opacity: 0.8,
              textAlign: 'center',
              marginTop: 20,
              maxWidth: 800,
            }}
          >
            {converterConfig.metaDescription.split('.')[0]}
          </div>

          {/* Free badge */}
          <div
            style={{
              position: 'absolute',
              bottom: 100,
              right: 120,
              backgroundColor: '#00B894',
              color: 'white',
              padding: '12px 32px',
              borderRadius: 25,
              fontSize: 20,
              fontWeight: 600,
              boxShadow: '0 4px 8px rgba(0, 184, 148, 0.2)',
            }}
          >
            FREE TOOL
          </div>

          {/* Website URL */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              right: 60,
              fontSize: 18,
              color: '#4E342E',
              opacity: 0.7,
              fontWeight: 500,
            }}
          >
            svgai.org
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Use system fonts for better edge runtime compatibility
        fonts: [],
      }
    );
  } catch (e: any) {
    console.log(`Failed to generate OG image: ${e.message}`);
    
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
            Free SVG Conversion Tools
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