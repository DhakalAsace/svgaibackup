'use client'

import React, { createContext, useContext } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponentsMap } from '@/mdx-components';
import { MdxSvgP } from '@/components/mdx-custom-components';
import Image from 'next/image';

export const SVGContext = createContext(false);

export const useSVG = () => useContext(SVGContext);

const SvgAwareMDXProvider = ({ children }: { children: React.ReactNode }) => {
  const isInsideSVG = useSVG();
  
  const components = {
    ...mdxComponentsMap,
    p: isInsideSVG ? MdxSvgP : mdxComponentsMap.p,
    // Add other components that might be problematic inside SVG
  };

  return <MDXProvider components={components}>{children}</MDXProvider>;
};

export const MdxImage = ({ src, alt }: { src: string, alt: string }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      className="w-full h-auto rounded-lg shadow-lg my-8"
    />
  );
};

export default SvgAwareMDXProvider;