'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  status?: string; // e.g., "Loading libraries...", "Processing image..."
  isVisible: boolean;
  estimatedTime?: number; // in seconds
  error?: boolean;
}

export function ConverterProgressBar({
  progress,
  status,
  isVisible,
  estimatedTime,
  error = false,
}: ProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Smooth animation to target progress
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);

      // Show success animation when complete
      if (progress >= 100 && !error) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
      }

      return () => clearTimeout(timer);
    } else {
      // Reset when hidden
      setAnimatedProgress(0);
      setShowSuccess(false);
    }
  }, [progress, isVisible, error]);

  if (!isVisible) return null;

  return (
    <div className="w-full mt-4 mb-4 animate-in fade-in duration-300">
      {/* Progress bar container */}
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {status || 'Processing...'}
          </span>
          <div className="flex items-center gap-2">
            {estimatedTime && estimatedTime > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ~{estimatedTime}s remaining
              </span>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(animatedProgress)}%
            </span>
          </div>
        </div>

        {/* Progress bar background */}
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          {/* Progress bar fill */}
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden',
              {
                'bg-gradient-to-r from-blue-500 to-blue-600': !error && !showSuccess,
                'bg-gradient-to-r from-red-500 to-red-600': error,
                'bg-gradient-to-r from-green-500 to-green-600': showSuccess,
              }
            )}
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer effect */}
            {!error && animatedProgress < 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}

            {/* Success pulse */}
            {showSuccess && (
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            )}
          </div>
        </div>

        {/* Progress stages indicators */}
        <div className="flex justify-between mt-1">
          {['Start', 'Loading', 'Processing', 'Finalizing', 'Complete'].map((stage, index) => {
            const stageProgress = index * 25;
            const isActive = animatedProgress >= stageProgress;
            return (
              <div
                key={stage}
                className={cn(
                  'text-xs transition-colors duration-300',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-400 dark:text-gray-600'
                )}
              >
                {stage}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1">
          Conversion failed. Please try again.
        </div>
      )}
    </div>
  );
}

// Add shimmer animation to globals.css or here via style tag
const shimmerStyle = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerStyle;
  document.head.appendChild(style);
}