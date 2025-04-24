'use client';

import React from 'react';
import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  tags?: string[];
}

export default function BlogCard({
  slug,
  title,
  description,
  image,
  date,
  tags = []
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Directly use img tag instead of BlogImage for simplicity
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:bg-muted/50"
    >
      <div className="aspect-video overflow-hidden">
        <div className="w-full h-48 relative bg-muted">
          <img
            src={image}
            alt={title}
            className="object-cover transition-transform group-hover:scale-105 w-full h-full"
            onError={(e) => {
              e.currentTarget.onerror = null; // Prevent infinite loop
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      </div>
      
      <div className="flex flex-col justify-between flex-1 p-6">
        <div>
          <h3 className="text-xl font-semibold leading-tight tracking-tight">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <time className="text-sm text-muted-foreground" dateTime={date}>
            {formattedDate}
          </time>
          {tags.length > 0 && (
            <div className="ml-auto flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
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