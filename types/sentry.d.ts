declare module '@sentry/nextjs' {
  export interface SentryConfig {
    dsn: string
    environment?: string
    tracesSampleRate?: number
    integrations?: any[]
    beforeSend?: (event: any, hint: any) => any
    [key: string]: any
  }
  
  export function init(config: SentryConfig): void
  export function captureException(error: Error | string, context?: any): string
  export function withScope(callback: (scope: any) => void): void
  export function setContext(key: string, context: any): void
  export function setTag(key: string, value: string): void
  export function setUser(user: { id?: string; email?: string; [key: string]: any } | null): void
  
  export const ErrorBoundary: any
  export const withSentry: any
}