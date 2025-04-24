'use client';

import React, { useState } from 'react';

interface BlogHeaderProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export default function BlogHeader({ 
  src, 
  alt, 
  fallbackSrc = "/placeholder.svg" 
}: BlogHeaderProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };
  
  return (
    <div className="aspect-video overflow-hidden rounded-lg mb-8 bg-gray-100 flex items-center justify-center">
      <img
        src={imgSrc}
        alt={alt}
        className="max-w-full max-h-full object-contain p-4"
        style={{ maxHeight: "400px" }}
        onError={handleError}
      />
    </div>
  );
}