'use client';

import { useState } from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function BlogImage({
  src, 
  alt, 
  fallbackSrc = "/placeholder.svg",
  className = "max-w-full max-h-full object-contain p-4",
  style = { maxHeight: "400px" }
}: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.log(`Image failed to load: ${src}, using fallback: ${fallbackSrc}`);
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}