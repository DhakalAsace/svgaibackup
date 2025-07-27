'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'

interface CreditsUpsellModalProps {
  remainingCredits: number
  isOpen: boolean
  onClose: () => void
}

export function CreditsUpsellModal({ remainingCredits, isOpen, onClose }: CreditsUpsellModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  if (!isOpen && !isVisible) return null

  // Dynamic messaging based on remaining credits
  const getHeadline = () => {
    if (remainingCredits === 0) {
      return "You're Out of Credits!"
    } else if (remainingCredits === 1) {
      return "Last Credit Alert!"
    } else if (remainingCredits <= 2) {
      return "Running Low on Credits"
    } else {
      return "Boost Your Creative Power"
    }
  }

  const getSubheadline = () => {
    if (remainingCredits === 0) {
      return "Upgrade now to continue creating amazing SVGs and icons"
    } else if (remainingCredits === 1) {
      return "You have just 1 credit left. Get more to keep creating!"
    } else {
      return `Only ${remainingCredits} credits remaining. Never run out with a monthly plan!`
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              {remainingCredits === 0 ? (
                <Zap className="w-8 h-8 text-white" />
              ) : (
                <Sparkles className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              {getHeadline()}
            </h2>
            <p className="text-gray-400 text-lg">
              {getSubheadline()}
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Starter Plan */}
            <div className="relative bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors group">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">$13.99</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Billed $168 today • <span className="text-green-400">~3 months FREE vs monthly</span>
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6 flex-grow">
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>100 credits per month</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>All icon & SVG styles</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Credits refresh monthly</span>
                  </li>
                </ul>
                
                <Link
                  href="/pricing?plan=starter"
                  className="block w-full py-3 px-4 bg-gray-700 group-hover:bg-blue-600 text-white font-medium rounded-lg text-center transition-all"
                  onClick={handleClose}
                >
                  Get Starter
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gradient-to-b from-blue-900/20 to-gray-800 rounded-xl p-6 border-2 border-blue-500">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">$29.99</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Billed $360 today • <span className="text-green-400">~3 months FREE vs monthly</span>
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6 flex-grow">
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span><strong className="text-white">350 credits</strong> per month</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>All 11 icon & 5 SVG styles</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Extended generation history</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Priority email support</span>
                  </li>
                </ul>
                
                <Link
                  href="/pricing?plan=pro"
                  className="block w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg text-center transition-all transform hover:scale-[1.02] shadow-lg"
                  onClick={handleClose}
                >
                  Get Pro - Best Value
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom section with credit info */}
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            {remainingCredits > 0 ? (
              <p className="text-sm text-gray-400">
                <span className="text-white font-medium">{remainingCredits} credit{remainingCredits === 1 ? '' : 's'}</span> remaining. 
                {remainingCredits <= 2 
                  ? " Upgrade now to avoid interruption!"
                  : " Get unlimited creativity with a monthly plan."
                }
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                <span className="text-red-400 font-medium">No credits left!</span> Upgrade now to continue creating amazing designs.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}