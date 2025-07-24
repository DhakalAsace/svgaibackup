/**
 * Web Worker Manager for Image Tracing
 * Manages Web Worker lifecycle and provides async interface
 */

interface TracingJob {
  id: string;
  resolve: (result: string) => void;
  reject: (error: Error) => void;
  progressCallback?: (progress: number) => void;
}

interface WorkerMessage {
  type: 'READY' | 'PROGRESS' | 'COMPLETE' | 'ERROR';
  jobId?: string;
  progress?: number;
  result?: string;
  error?: string;
  processingTime?: number;
}

export class ImageTracerWorkerManager {
  private worker: Worker | null = null;
  private jobs = new Map<string, TracingJob>();
  private isReady = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize the worker
   */
  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      try {
        // Create worker from public directory
        this.worker = new Worker('/workers/image-tracer-worker.js');
        
        this.worker.onmessage = (e) => {
          this.handleWorkerMessage(e.data);
        };
        
        this.worker.onerror = (error) => {
          console.error('Worker error:', error);
          reject(new Error('Failed to initialize image tracing worker'));
        };
        
        // Set timeout for worker initialization
        const timeout = setTimeout(() => {
          reject(new Error('Worker initialization timeout'));
        }, 10000);
        
        // Wait for ready message
        const originalHandler = this.worker.onmessage;
        this.worker.onmessage = (e) => {
          if (e.data.type === 'READY') {
            clearTimeout(timeout);
            this.isReady = true;
            this.worker!.onmessage = originalHandler;
            resolve();
          }
        };
        
      } catch (error) {
        reject(error);
      }
    });

    return this.initPromise;
  }

  /**
   * Handle messages from worker
   */
  private handleWorkerMessage(message: WorkerMessage) {
    const { type, jobId } = message;
    
    if (!jobId) return;
    
    const job = this.jobs.get(jobId);
    if (!job) return;
    
    switch (type) {
      case 'PROGRESS':
        if (job.progressCallback && message.progress !== undefined) {
          job.progressCallback(message.progress);
        }
        break;
        
      case 'COMPLETE':
        if (message.result) {
          console.info(`Image tracing completed in ${message.processingTime}ms (Web Worker)`);
          job.resolve(message.result);
        } else {
          job.reject(new Error('No result from worker'));
        }
        this.jobs.delete(jobId);
        break;
        
      case 'ERROR':
        job.reject(new Error(message.error || 'Unknown worker error'));
        this.jobs.delete(jobId);
        break;
    }
  }

  /**
   * Trace image using Web Worker
   */
  async traceImage(
    dataUrl: string,
    options: any,
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    // Initialize worker if needed
    if (!this.isReady) {
      await this.init();
    }
    
    if (!this.worker) {
      throw new Error('Worker not available');
    }
    
    return new Promise((resolve, reject) => {
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store job
      this.jobs.set(jobId, {
        id: jobId,
        resolve,
        reject,
        progressCallback
      });
      
      // Send job to worker
      this.worker!.postMessage({
        type: 'TRACE_IMAGE',
        data: {
          dataUrl,
          options,
          jobId
        }
      });
      
      // Set timeout for job
      setTimeout(() => {
        if (this.jobs.has(jobId)) {
          this.jobs.delete(jobId);
          reject(new Error('Image tracing timeout'));
        }
      }, 120000); // 2 minute timeout
    });
  }

  /**
   * Check if worker is available
   */
  isWorkerSupported(): boolean {
    return typeof Worker !== 'undefined';
  }

  /**
   * Terminate worker
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.initPromise = null;
    }
    
    // Reject any pending jobs
    this.jobs.forEach(job => {
      job.reject(new Error('Worker terminated'));
    });
    this.jobs.clear();
  }
}

// Singleton instance
export const imageTracerWorkerManager = new ImageTracerWorkerManager();