'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPostMetadata {
  title: string;
  description: string;
  image?: string;
  date: string;
  tags?: string[];
}

interface BlogCardProps {
  slug: string;
  metadata: BlogPostMetadata;
}

export default function BlogCardWrapper({ slug, metadata }: BlogCardProps) {
  const [error, setError] = React.useState(false);
  
  const formattedDate = new Date(metadata.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Handle nested paths for MDX posts by preserving slashes in the slug
  const blogPath = slug.includes('/') ? `/blog/${slug}` : `/blog/${slug}`;

  return (
    <Link 
      href={blogPath}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:bg-muted/50"
    >
      {metadata.image && (
        <div className="aspect-video overflow-hidden">
          <div className="w-full h-48 relative bg-muted">
            <img
              src={error ? "/placeholder.svg" : metadata.image}
              alt={metadata.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={() => setError(true)}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col justify-between flex-1 p-6">
        <div>
          <h3 className="text-xl font-semibold leading-tight tracking-tight">
            {metadata.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-muted-foreground">
            {metadata.description}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <time className="text-sm text-muted-foreground" dateTime={metadata.date}>
            {formattedDate}
          </time>
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="ml-auto flex flex-wrap gap-1">
              {metadata.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}