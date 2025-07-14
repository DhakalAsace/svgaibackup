import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const ogImages = [
    // Converter examples
    { title: 'PNG to SVG Converter', url: `${baseUrl}/api/og-image/png-to-svg` },
    { title: 'SVG to PNG Converter', url: `${baseUrl}/api/og-image/svg-to-png` },
    { title: 'JPG to SVG Converter', url: `${baseUrl}/api/og-image/jpg-to-svg` },
    
    // Tool examples
    { title: 'SVG Editor', url: `${baseUrl}/api/og?type=tool&name=SVG Editor&desc=Edit and create SVG graphics online&feat=Real-time preview&feat=Code editor&feat=Export options` },
    { title: 'SVG Optimizer', url: `${baseUrl}/api/og?type=tool&name=SVG Optimizer&desc=Reduce SVG file size without quality loss&feat=Instant optimization&feat=Batch processing&feat=Advanced settings` },
    { title: 'SVG to Video (Premium)', url: `${baseUrl}/api/og?type=tool&name=SVG to Video&desc=Convert animated SVG to MP4 video&feat=HD export&feat=Custom timing&feat=Multiple formats&premium=true` },
    
    // Learn examples
    { title: 'What is SVG?', url: `${baseUrl}/api/og?type=learn&title=What is SVG? Complete Guide to Scalable Vector Graphics&cat=Fundamentals&time=10 min&topic=SVG basics&topic=File format&topic=Browser support` },
    { title: 'SVG Animation', url: `${baseUrl}/api/og?type=learn&title=SVG Animation Tutorial: From Basics to Advanced&cat=Animation&time=15 min&topic=SMIL animation&topic=CSS animation&topic=JavaScript control` },
    
    // Gallery examples
    { title: 'Heart SVG Gallery', url: `${baseUrl}/api/og?type=gallery&theme=Hearts&title=Heart SVG Collection&desc=Beautiful heart designs for any project&count=100` },
    { title: 'Hello Kitty SVG', url: `${baseUrl}/api/og?type=gallery&theme=Characters&title=Hello Kitty SVG Graphics&desc=Cute character designs and illustrations&count=50` },
    
    // AI Generation
    { title: 'AI SVG Generator', url: `${baseUrl}/api/og?type=ai` },
    
    // Default
    { title: 'SVG AI Homepage', url: `${baseUrl}/api/og` },
  ];
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>OG Image Preview - SVG AI</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            margin: 0;
          }
          h1 {
            color: #4E342E;
            text-align: center;
            margin-bottom: 40px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
            gap: 40px;
            max-width: 1400px;
            margin: 0 auto;
          }
          .card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .card h3 {
            margin: 0;
            padding: 20px;
            background: #FFF8E1;
            color: #4E342E;
            font-size: 18px;
          }
          .card img {
            width: 100%;
            height: auto;
            display: block;
          }
          .card .url {
            padding: 12px 20px;
            background: #f5f5f5;
            font-family: monospace;
            font-size: 12px;
            color: #666;
            word-break: break-all;
          }
          .meta-tags {
            padding: 20px;
            background: #f9f9f9;
            border-top: 1px solid #eee;
          }
          .meta-tags h4 {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
          }
          .meta-tags pre {
            margin: 0;
            padding: 12px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 11px;
            overflow-x: auto;
          }
          .test-links {
            padding: 20px;
            background: #FFF8E1;
            text-align: center;
            margin-bottom: 40px;
            border-radius: 8px;
          }
          .test-links a {
            color: #FF7043;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 500;
          }
          .test-links a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>SVG AI - Open Graph Image Preview</h1>
        
        <div class="test-links">
          <strong>Test with:</strong>
          <a href="https://www.opengraph.xyz/" target="_blank">OpenGraph.xyz</a>
          <a href="https://cards-dev.twitter.com/validator" target="_blank">Twitter Card Validator</a>
          <a href="https://developers.facebook.com/tools/debug/" target="_blank">Facebook Debugger</a>
          <a href="https://www.linkedin.com/post-inspector/" target="_blank">LinkedIn Inspector</a>
        </div>
        
        <div class="grid">
          ${ogImages.map(({ title, url }) => `
            <div class="card">
              <h3>${title}</h3>
              <img src="${url}" alt="${title}" loading="lazy" />
              <div class="url">${url}</div>
              <div class="meta-tags">
                <h4>Meta Tags Example:</h4>
                <pre>&lt;meta property="og:image" content="${url}" /&gt;
&lt;meta property="og:image:width" content="1200" /&gt;
&lt;meta property="og:image:height" content="630" /&gt;
&lt;meta property="og:image:alt" content="${title}" /&gt;
&lt;meta name="twitter:card" content="summary_large_image" /&gt;
&lt;meta name="twitter:image" content="${url}" /&gt;</pre>
              </div>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `;
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}