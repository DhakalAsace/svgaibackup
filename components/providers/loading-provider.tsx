"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { LoadingOverlay } from "@/components/ui/loading"

interface LoadingContextType {
  showLoading: (message?: string) => void
  hideLoading: () => void
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingState, setLoadingState] = useState<{
    isLoading: boolean
    message?: string
  }>({ isLoading: false })
  
  const showLoading = useCallback((message?: string) => {
    setLoadingState({ isLoading: true, message })
  }, [])
  
  const hideLoading = useCallback(() => {
    setLoadingState({ isLoading: false })
  }, [])
  
  return (
    <LoadingContext.Provider
      value={{
        showLoading,
        hideLoading,
        isLoading: loadingState.isLoading,
      }}
    >
      {children}
      {loadingState.isLoading && (
        <LoadingOverlay
          fullScreen
          message={loadingState.message}
        />
      )}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}