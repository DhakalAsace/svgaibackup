import { PngToSvgOGImage, SvgToPngOGImage, getConverterOGImage } from './og-image-templates';

// Test component to verify OG image system works correctly
export function OGImageTestPreview() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">OG Image Preview Tests</h2>
      
      {/* Test specific components */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">High Priority Converters</h3>
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">PNG to SVG</h4>
          <div className="w-full max-w-2xl">
            <PngToSvgOGImage />
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">SVG to PNG</h4>
          <div className="w-full max-w-2xl">
            <SvgToPngOGImage />
          </div>
        </div>
      </div>
      
      {/* Test dynamic lookup */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dynamic Lookup Test</h3>
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">jpg-to-svg (via lookup)</h4>
          <div className="w-full max-w-2xl">
            {getConverterOGImage('jpg-to-svg')}
          </div>
        </div>
      </div>

      {/* API URLs for reference */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">API Endpoints</h3>
        <div className="space-y-1 text-sm font-mono bg-gray-100 p-4 rounded">
          <div>/api/og-image/png-to-svg</div>
          <div>/api/og-image/svg-to-png</div>
          <div>/api/og-image/jpg-to-svg</div>
          <div>/api/og-image/svg-converter</div>
        </div>
      </div>
    </div>
  );
}

// Component to show OG metadata for debugging
export function OGImageMetadataDebug({ converterSlug }: { converterSlug: string }) {
  const ogImageUrl = `https://svgai.org/api/og-image/${converterSlug}`;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium mb-2">OG Image Metadata for {converterSlug}:</h4>
      <div className="space-y-1 text-sm">
        <div><strong>URL:</strong> {ogImageUrl}</div>
        <div><strong>Width:</strong> 1200px</div>
        <div><strong>Height:</strong> 630px</div>
        <div><strong>Type:</strong> image/png</div>
      </div>
      
      {/* Preview iframe */}
      <div className="mt-4">
        <img 
          src={ogImageUrl} 
          alt={`OG Image for ${converterSlug}`}
          className="border rounded max-w-sm"
        />
      </div>
    </div>
  );
}