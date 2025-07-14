/**
 * React Error Boundary for Converter Components
 * 
 * Provides graceful error handling and recovery UI for converter failures.
 * Includes retry mechanisms, fallback strategies, and user-friendly messaging.
 */

import React, { Component, ReactNode, ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { 
  ConverterError, 
  FileValidationError,
  FileSizeError,
  UnsupportedFormatError,
  SecurityError,
  getUserFriendlyError,
  ERROR_MESSAGES
} from '@/lib/converters/errors'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
  isolate?: boolean
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCount: number
  showDetails: boolean
  lastResetKeys?: Array<string | number>
}

/**
 * Main Error Boundary Component for Converters
 */
export class ConverterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      showDetails: false,
      lastResetKeys: props.resetKeys
    }
  }
  
  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    // Reset error boundary when resetKeys change
    if (props.resetKeys && state.lastResetKeys) {
      const hasChanged = props.resetKeys.some(
        (key, index) => key !== state.lastResetKeys![index]
      )
      
      if (hasChanged) {
        return {
          hasError: false,
          error: null,
          errorInfo: null,
          lastResetKeys: props.resetKeys
        }
      }
    }
    
    return null
  }
  
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0,
      showDetails: false
    }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Converter Error Boundary caught:', error, errorInfo)
    }
    
    // Update state with error info
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    })
  }
  
  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }
  
  getErrorMessage(): string {
    const { error } = this.state
    
    if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR
    
    // Use user-friendly error messages
    return getUserFriendlyError(error)
  }
  
  getRecoverySuggestions(): string[] {
    const { error } = this.state
    const suggestions: string[] = []
    
    if (error instanceof FileSizeError) {
      suggestions.push('Try compressing your file before converting')
      suggestions.push('Use an image editor to reduce dimensions')
      suggestions.push('Convert in smaller batches if handling multiple files')
    } else if (error instanceof UnsupportedFormatError) {
      suggestions.push('Check that your file extension matches the actual format')
      suggestions.push('Try converting to a different format first')
      suggestions.push('Ensure the file is not corrupted')
    } else if (error instanceof SecurityError) {
      suggestions.push('Remove any scripts or external references from the file')
      suggestions.push('Use a trusted file source')
      suggestions.push('Check file permissions')
    } else if (error instanceof FileValidationError) {
      suggestions.push('Verify the file is not corrupted')
      suggestions.push('Try opening the file in its native application')
      suggestions.push('Re-save the file in its original format')
    } else {
      suggestions.push('Refresh the page and try again')
      suggestions.push('Check your internet connection')
      suggestions.push('Try with a different file')
    }
    
    return suggestions
  }
  
  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }
      
      const errorMessage = this.getErrorMessage()
      const suggestions = this.getRecoverySuggestions()
      const { error, errorInfo, errorCount, showDetails } = this.state
      const isConverterError = error instanceof ConverterError
      
      return (
        <div className="w-full max-w-2xl mx-auto p-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Conversion Error</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">{errorMessage}</p>
              
              {/* Recovery suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Try these solutions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={this.handleReset}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    onClick={this.toggleDetails}
                    size="sm"
                    variant="ghost"
                    className="gap-2"
                  >
                    {showDetails ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show Details
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Error details (dev mode) */}
              {showDetails && process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-auto">
                  <p className="font-semibold mb-2">Error Details:</p>
                  <p className="mb-2">Type: {error.name}</p>
                  {isConverterError && (
                    <p className="mb-2">Code: {(error as ConverterError).code}</p>
                  )}
                  <p className="mb-2">Message: {error.message}</p>
                  {errorInfo && (
                    <>
                      <p className="font-semibold mt-3 mb-2">Component Stack:</p>
                      <pre className="whitespace-pre-wrap">
                        {errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                  <p className="mt-3">Error Count: {errorCount}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )
    }
    
    return this.props.children
  }
}

/**
 * Lightweight error boundary for isolated components
 */
export class IsolatedErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Isolated Error:', error, errorInfo)
    }
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center text-gray-500">
          <p>Something went wrong. Please refresh and try again.</p>
        </div>
      )
    }
    
    return this.props.children
  }
}

/**
 * Hook to reset error boundary from child components
 */
export function useErrorBoundaryReset() {
  const [resetKey, setResetKey] = React.useState(0)
  
  const reset = React.useCallback(() => {
    setResetKey(prev => prev + 1)
  }, [])
  
  return { resetKey, reset }
}

/**
 * HOC to wrap components with error boundary
 */
export function withConverterErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <ConverterErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ConverterErrorBoundary>
  )
  
  WrappedComponent.displayName = `withConverterErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}