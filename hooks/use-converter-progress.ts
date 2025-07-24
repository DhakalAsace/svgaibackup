'use client';

import { useState, useCallback, useRef } from 'react';

interface ProgressState {
  progress: number;
  status: string;
  isVisible: boolean;
  estimatedTime?: number;
  error: boolean;
}

interface ProgressStage {
  progress: number;
  status: string;
}

const PROGRESS_STAGES: Record<string, ProgressStage> = {
  initializing: { progress: 5, status: 'Initializing...' },
  loadingLibraries: { progress: 15, status: 'Loading processing libraries...' },
  validating: { progress: 25, status: 'Validating image format...' },
  downscaling: { progress: 35, status: 'Optimizing image size...' },
  workerInit: { progress: 40, status: 'Starting background processor...' },
  processing: { progress: 50, status: 'Converting to vector format...' },
  workerProcessing: { progress: 70, status: 'Processing in background thread...' },
  converting: { progress: 80, status: 'Finalizing vector paths...' },
  optimizing: { progress: 90, status: 'Optimizing output...' },
  finalizing: { progress: 95, status: 'Preparing download...' },
  complete: { progress: 100, status: 'Conversion complete!' },
};

export function useConverterProgress() {
  const [state, setState] = useState<ProgressState>({
    progress: 0,
    status: '',
    isVisible: false,
    estimatedTime: undefined,
    error: false,
  });

  const startTimeRef = useRef<number>(0);
  const fileSizeRef = useRef<number>(0);

  // Start progress tracking
  const startProgress = useCallback((fileSize?: number) => {
    startTimeRef.current = Date.now();
    fileSizeRef.current = fileSize || 0;
    
    setState({
      progress: 0,
      status: PROGRESS_STAGES.initializing.status,
      isVisible: true,
      estimatedTime: estimateTime(fileSize),
      error: false,
    });
  }, []);

  // Update progress with predefined stage
  const updateProgressStage = useCallback((stage: keyof typeof PROGRESS_STAGES) => {
    const stageData = PROGRESS_STAGES[stage];
    if (!stageData) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const remainingTime = calculateRemainingTime(stageData.progress, elapsed);

    setState(prev => ({
      ...prev,
      progress: stageData.progress,
      status: stageData.status,
      estimatedTime: remainingTime,
    }));
  }, []);

  // Update with custom progress
  const updateProgress = useCallback((progress: number, status?: string) => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const remainingTime = calculateRemainingTime(progress, elapsed);

    setState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
      status: status || prev.status,
      estimatedTime: remainingTime,
    }));
  }, []);

  // Report progress (for converter callbacks)
  const reportProgress = useCallback((progress: number) => {
    // Map progress values to Web Worker-aware stages
    if (progress <= 0.1) {
      updateProgressStage('validating');
    } else if (progress <= 0.2) {
      updateProgressStage('loadingLibraries');
    } else if (progress <= 0.25) {
      updateProgressStage('downscaling');
    } else if (progress <= 0.3) {
      updateProgressStage('workerInit');
    } else if (progress <= 0.5) {
      updateProgressStage('processing');
    } else if (progress <= 0.8) {
      updateProgressStage('workerProcessing');
    } else if (progress <= 0.9) {
      updateProgressStage('converting');
    } else if (progress < 1) {
      updateProgressStage('finalizing');
    } else {
      updateProgressStage('complete');
    }
  }, [updateProgressStage]);

  // Complete progress
  const completeProgress = useCallback(() => {
    setState(prev => ({
      ...prev,
      progress: 100,
      status: PROGRESS_STAGES.complete.status,
      estimatedTime: 0,
    }));

    // Hide after a delay
    setTimeout(() => {
      setState(prev => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  // Error state
  const setError = useCallback((errorMessage?: string) => {
    setState(prev => ({
      ...prev,
      error: true,
      status: errorMessage || 'Conversion failed',
    }));

    // Hide after a delay
    setTimeout(() => {
      setState(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  }, []);

  // Reset progress
  const resetProgress = useCallback(() => {
    setState({
      progress: 0,
      status: '',
      isVisible: false,
      estimatedTime: undefined,
      error: false,
    });
  }, []);

  return {
    ...state,
    startProgress,
    updateProgressStage,
    updateProgress,
    reportProgress,
    completeProgress,
    setError,
    resetProgress,
  };
}

// Helper functions
function estimateTime(fileSize?: number): number {
  if (!fileSize) return 4; // Default 4 seconds with Web Worker optimization
  
  // Estimate based on file size (optimized for Web Worker processing)
  const sizeMB = fileSize / (1024 * 1024);
  if (sizeMB < 0.5) return 2;  // Very small files
  if (sizeMB < 1) return 3;    // Small files
  if (sizeMB < 3) return 4;    // Medium files  
  if (sizeMB < 5) return 6;    // Large files
  if (sizeMB < 10) return 8;   // Very large files (will be downscaled)
  if (sizeMB < 20) return 10;  // Extremely large files (will be heavily downscaled)
  return 12; // Maximum estimate
}

function calculateRemainingTime(currentProgress: number, elapsedSeconds: number): number {
  if (currentProgress === 0 || currentProgress >= 100) return 0;
  
  const estimatedTotal = elapsedSeconds / (currentProgress / 100);
  const remaining = Math.max(0, estimatedTotal - elapsedSeconds);
  
  return Math.round(remaining);
}