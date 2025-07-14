import React from 'react';

type BrandLogoProps = {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
};

export function BrandLogo({ width = 120, height = 40, className = '', showText = true }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width} 
        height={height} 
        viewBox="35 65 133 38"
        className="flex-shrink-0"
      >
        <path d="m45 65 2 7 8 2-8 2-2 7-2-7-8-2 8-2Z" fill="#FF7043"/>
        {showText && (
          <text x="60" y="95" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="30" fill="#4E342E">
            SVG<tspan dx="8" fill="#FF7043">AI</tspan>
          </text>
        )}
      </svg>
      
      {/* Text outside SVG is removed since it's now part of the SVG */}
    </div>
  );
}

// Full logo with background for larger displays
export function FullBrandLogo({ width = 200, height = 100, className = '' }: Omit<BrandLogoProps, 'showText'>) {
  return (
    <div className={className}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width} 
        height={height} 
        viewBox="0 0 600 550"
        className="w-full h-full"
      >
        <rect width="600" height="550" fill="#FFF8E1" rx="20" ry="20" />
        <text x="60" y="95" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="30" fill="#4E342E">
          SVG<tspan dx="8" fill="#FF7043">AI</tspan>
        </text>
        <path d="m45 65 2 7 8 2-8 2-2 7-2-7-8-2 8-2Z" fill="#FF7043"/>
      </svg>
    </div>
  );
}
