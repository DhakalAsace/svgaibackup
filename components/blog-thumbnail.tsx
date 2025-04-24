'use client';

import { useState } from 'react';

interface BlogThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export default function BlogThumbnail({ src, alt, className = "" }: BlogThumbnailProps) {
  const [error, setError] = useState(false);
  
  return (
    <img
      src={error ? "/placeholder.svg" : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}