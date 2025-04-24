'use client';

import React, { useState } from 'react';

interface ClientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function ClientImage({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/placeholder.svg'
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.log(`Image error loading: ${src}, using fallback: ${fallbackSrc}`);
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}