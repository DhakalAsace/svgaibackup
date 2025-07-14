'use client';

import { useEffect, useState, CSSProperties } from 'react';
import Navbar from './navbar';

/**
 * Client component wrapper for the Navbar
 * This component:
 * 1. Only renders the Navbar on the client side after mounting
 * 2. Provides a placeholder with matching dimensions during SSR
 * 3. Prevents hydration mismatches by controlling when the Navbar renders
 */
export function NavbarWrapper() {
  // Use state to track client-side mounting
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state to true after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Show placeholder during SSR and initial render
  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full h-20 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-20"></div>
      </header>
    );
  }
  
  // Only render the full Navbar on the client after mounting
  return <Navbar />;
}

// Thumbnail component for blog listing
export function BlogThumbnail({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
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

// Header image component for blog posts
export function BlogHeaderImage({ 
  src, 
  alt, 
  fallbackSrc = "/placeholder.svg", 
  className = "max-w-full max-h-full object-contain p-4", 
  style,
}: { 
  src: string; 
  alt: string; 
  fallbackSrc?: string;
  className?: string; 
  style?: CSSProperties;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    if (!hasError && fallbackSrc) {
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