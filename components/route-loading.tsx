"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ProgressBar } from "@/components/ui/loading"
import { cn } from "@/lib/utils"

export function RouteLoading() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    // Reset on route change
    setIsLoading(false)
    setProgress(0)
  }, [pathname])
  
  useEffect(() => {
    let timer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout
    
    const handleStart = () => {
      setIsLoading(true)
      setProgress(10)
      
      // Simulate progress
      let currentProgress = 10
      progressTimer = setInterval(() => {
        currentProgress += Math.random() * 10
        if (currentProgress > 90) currentProgress = 90
        setProgress(currentProgress)
      }, 200)
    }
    
    const handleComplete = () => {
      clearInterval(progressTimer)
      setProgress(100)
      
      timer = setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 200)
    }
    
    // Listen to route change events
    const handleRouteChange = () => {
      handleStart()
      // Simulate route completion
      setTimeout(handleComplete, 500)
    }
    
    // Add event listeners for navigation
    window.addEventListener("beforeunload", handleStart)
    
    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
      window.removeEventListener("beforeunload", handleStart)
    }
  }, [])
  
  if (!isLoading) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <ProgressBar 
        value={progress} 
        className={cn(
          "h-1 transition-opacity duration-200",
          progress === 100 && "opacity-0"
        )} 
      />
    </div>
  )
}