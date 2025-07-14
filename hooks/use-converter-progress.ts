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
  loadingLibraries: { progress: 20, status: 'Loading libraries...' },
  validating: { progress: 30, status: 'Validating input...' },
  processing: { progress: 50, status: 'Processing image...' },
  converting: { progress: 70, status: 'Converting format...' },
  optimizing: { progress: 85, status: 'Optimizing output...' },
  finalizing: { progress: 95, status: 'Finalizing...' },
  complete: { progress: 100, status: 'Complete!' },
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
    // Map progress values to stages
    if (progress <= 0.1) {
      updateProgressStage('validating');
    } else if (progress <= 0.3) {
      updateProgressStage('loadingLibraries');
    } else if (progress <= 0.5) {
      updateProgressStage('processing');
    } else if (progress <= 0.7) {
      updateProgressStage('converting');
    } else if (progress <= 0.9) {
      updateProgressStage('optimizing');
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
  if (!fileSize) return 5; // Default 5 seconds
  
  // Estimate based on file size (rough approximation)
  const sizeMB = fileSize / (1024 * 1024);
  if (sizeMB < 1) return 3;
  if (sizeMB < 5) return 5;
  if (sizeMB < 10) return 8;
  if (sizeMB < 20) return 12;
  return 15;
}

function calculateRemainingTime(currentProgress: number, elapsedSeconds: number): number {
  if (currentProgress === 0 || currentProgress >= 100) return 0;
  
  const estimatedTotal = elapsedSeconds / (currentProgress / 100);
  const remaining = Math.max(0, estimatedTotal - elapsedSeconds);
  
  return Math.round(remaining);
}