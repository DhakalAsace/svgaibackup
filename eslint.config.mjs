import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores
  {
    ignores: [
      '.next/**', 
      '.next-build/**',
      'node_modules/**', 
      '.vercel/**', 
      'out/**',
      'public/pdf.worker.min.js',
      'public/pdf.worker.min.js.old',
      'public/*.worker.js',
      'public/*.worker.min.js'
    ]
  },
  
  // Extend Next.js core web vitals configuration
  ...compat.extends('next/core-web-vitals'),
  
  // Custom rules configuration
  {
    rules: {
      // React rules
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/display-name': 'off',
      
      // Next.js rules  
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'prefer-const': 'warn'
    }
  }
];

export default eslintConfig;