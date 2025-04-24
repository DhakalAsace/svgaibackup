'use client';

import { useState } from 'react';

interface BlogHeaderImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function BlogHeaderImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className = "max-w-full max-h-full object-contain p-4",
  style = { maxHeight: "400px" }
}: BlogHeaderImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
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