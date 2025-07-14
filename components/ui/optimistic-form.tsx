"use client"

import { useState, useTransition } from "react"
import { Spinner } from "@/components/ui/loading"
import { cn } from "@/lib/utils"

interface OptimisticFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (formData: FormData) => Promise<void>
  optimisticUpdate?: () => void
  loadingMessage?: string
}

export function OptimisticForm({
  children,
  onSubmit,
  optimisticUpdate,
  loadingMessage = "Saving...",
  className,
  ...props
}: OptimisticFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      // Apply optimistic update immediately
      optimisticUpdate?.()
      
      try {
        await onSubmit(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
        // TODO: Revert optimistic update on error
      }
    })
  }
  
  return (
    <form
      {...props}
      className={cn("relative", className)}
      onSubmit={handleSubmit}
    >
      {isPending && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-muted-foreground">{loadingMessage}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}
      
      {children}
    </form>
  )
}