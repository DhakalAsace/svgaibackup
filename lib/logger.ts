/**
 * Structured Logger Utility
 * 
 * This module provides a structured logging system to replace direct console.log usage.
 * It adds context, timestamps, and sanitizes sensitive data in production environments.
 * 
 * NOTICE: This module uses sanitize-utils.ts for data sanitization to avoid circular
 * dependencies with error-handler.ts.
 */

// Import the shared sanitization utility
import { sanitizeData } from './sanitize-utils';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  includeSensitive?: boolean;
}

/**
 * Logger class for structured, secure logging
 */
export class Logger {
  private namespace: string;
  private isDevelopment: boolean;
  
  constructor(namespace: string) {
    this.namespace = namespace;
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }
  
  /**
   * Masks sensitive data in objects to prevent leaking credentials or PII in logs
   * Uses the shared sanitization utility to avoid circular dependencies
   */
  private maskSensitiveData(data: any): any {
    return sanitizeData(data);
  }
  
  /**
   * Creates a structured log entry
   */
  private createLogEntry(level: LogLevel, message: string, data?: any, options: LogOptions = {}) {
    const timestamp = new Date().toISOString();
    
    // Mask sensitive data in production
    const processedData = this.isDevelopment || options.includeSensitive 
      ? data 
      : this.maskSensitiveData(data);
      
    return {
      timestamp,
      level,
      namespace: this.namespace,
      message,
      ...(processedData !== undefined ? { data: processedData } : {})
    };
  }
  
  /**
   * Debug level log - only shown in development
   */
  debug(message: string, data?: any, options?: LogOptions) {
    if (this.isDevelopment) {
      console.debug(JSON.stringify(this.createLogEntry('debug', message, data, options)));
    }
  }
  
  /**
   * Info level log - shown in all environments
   */
  info(message: string, data?: any, options?: LogOptions) {
    console.info(JSON.stringify(this.createLogEntry('info', message, data, options)));
  }
  
  /**
   * Warning level log
   */
  warn(message: string, data?: any, options?: LogOptions) {
    console.warn(JSON.stringify(this.createLogEntry('warn', message, data, options)));
  }
  
  /**
   * Error level log
   */
  error(message: string, data?: any, options?: LogOptions) {
    console.error(JSON.stringify(this.createLogEntry('error', message, data, options)));
  }
}

/**
 * Factory function to create loggers for specific modules
 * @param namespace - The module or component name for context
 */
export function createLogger(namespace: string): Logger {
  return new Logger(namespace);
}
