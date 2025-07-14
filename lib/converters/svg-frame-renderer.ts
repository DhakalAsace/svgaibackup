/**
 * SVG Frame Renderer
 * 
 * This module provides utilities for rendering SVG frames with animations applied
 */

import { ParsedAnimation, AnimationKeyframe, applyTimingFunction } from './svg-animation-parser'

/**
 * Apply animations to SVG for a specific timestamp
 */
export function renderSvgFrame(
  svgContent: string,
  animations: ParsedAnimation[],
  timestamp: number
): string {
  let modifiedSvg = svgContent
  
  // Apply each animation
  animations.forEach(animation => {
    const animTime = timestamp - animation.delay
    
    // Check if animation is active
    if (animTime < 0 || animTime > animation.duration * (animation.iterations === 'infinite' ? 1 : animation.iterations)) {
      return
    }
    
    // Calculate current iteration and progress
    const iterationDuration = animation.duration
    const currentIteration = Math.floor(animTime / iterationDuration)
    const iterationProgress = (animTime % iterationDuration) / iterationDuration
    
    // Apply direction
    let progress = iterationProgress
    if (animation.direction === 'reverse') {
      progress = 1 - progress
    } else if (animation.direction === 'alternate') {
      progress = currentIteration % 2 === 0 ? progress : 1 - progress
    } else if (animation.direction === 'alternate-reverse') {
      progress = currentIteration % 2 === 0 ? 1 - progress : progress
    }
    
    // Apply timing function
    const easedProgress = applyTimingFunction(progress, animation.timingFunction)
    
    // Interpolate keyframes
    const interpolatedValues = interpolateKeyframes(animation.keyframes, easedProgress)
    
    // Apply values to SVG
    modifiedSvg = applyAnimationValues(modifiedSvg, animation.target, interpolatedValues)
  })
  
  return modifiedSvg
}

/**
 * Interpolate between keyframes
 */
function interpolateKeyframes(
  keyframes: AnimationKeyframe[],
  progress: number
): Record<string, string | number> {
  if (keyframes.length === 0) return {}
  if (keyframes.length === 1) return keyframes[0].values
  
  // Find surrounding keyframes
  let fromIndex = 0
  let toIndex = keyframes.length - 1
  
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].offset && progress <= keyframes[i + 1].offset) {
      fromIndex = i
      toIndex = i + 1
      break
    }
  }
  
  const fromKeyframe = keyframes[fromIndex]
  const toKeyframe = keyframes[toIndex]
  
  // Calculate local progress between keyframes
  const localProgress = (progress - fromKeyframe.offset) / (toKeyframe.offset - fromKeyframe.offset)
  
  // Apply keyframe-specific easing if available
  const easedLocalProgress = toKeyframe.easing 
    ? applyTimingFunction(localProgress, toKeyframe.easing)
    : localProgress
  
  // Interpolate values
  const interpolated: Record<string, string | number> = {}
  
  for (const property in fromKeyframe.values) {
    const fromValue = fromKeyframe.values[property]
    const toValue = toKeyframe.values[property]
    
    if (typeof fromValue === 'number' && typeof toValue === 'number') {
      // Numeric interpolation
      interpolated[property] = fromValue + (toValue - fromValue) * easedLocalProgress
    } else {
      // String interpolation (color, transform, etc.)
      interpolated[property] = interpolateStringValue(
        String(fromValue),
        String(toValue),
        easedLocalProgress
      )
    }
  }
  
  return interpolated
}

/**
 * Interpolate string values (colors, transforms, etc.)
 */
function interpolateStringValue(from: string, to: string, progress: number): string {
  // Handle color interpolation
  if (from.startsWith('#') && to.startsWith('#')) {
    return interpolateColor(from, to, progress)
  }
  
  // Handle transform interpolation
  if (from.includes('(') && to.includes('(')) {
    return interpolateTransform(from, to, progress)
  }
  
  // Default: return target value at 50% progress
  return progress < 0.5 ? from : to
}

/**
 * Interpolate hex colors
 */
function interpolateColor(from: string, to: string, progress: number): string {
  const fromRgb = hexToRgb(from)
  const toRgb = hexToRgb(to)
  
  if (!fromRgb || !toRgb) return from
  
  const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * progress)
  const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * progress)
  const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * progress)
  
  return rgbToHex(r, g, b)
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Interpolate transform values
 */
function interpolateTransform(from: string, to: string, progress: number): string {
  // Extract transform function and values
  const fromMatch = from.match(/(\w+)\(([^)]+)\)/)
  const toMatch = to.match(/(\w+)\(([^)]+)\)/)
  
  if (!fromMatch || !toMatch || fromMatch[1] !== toMatch[1]) {
    return progress < 0.5 ? from : to
  }
  
  const funcName = fromMatch[1]
  const fromValues = fromMatch[2].split(/[\s,]+/).map(v => parseFloat(v))
  const toValues = toMatch[2].split(/[\s,]+/).map(v => parseFloat(v))
  
  if (fromValues.length !== toValues.length) {
    return progress < 0.5 ? from : to
  }
  
  // Interpolate values
  const interpolatedValues = fromValues.map((fromVal, i) => {
    const toVal = toValues[i]
    return fromVal + (toVal - fromVal) * progress
  })
  
  // Reconstruct transform
  return `${funcName}(${interpolatedValues.join(' ')})`
}

/**
 * Apply animation values to SVG elements
 */
function applyAnimationValues(
  svgContent: string,
  targetSelector: string,
  values: Record<string, string | number>
): string {
  // This is a simplified implementation
  // In a real implementation, we'd use a proper DOM parser
  
  let modifiedSvg = svgContent
  
  // Handle transform property specially
  if (values.transform) {
    const transformValue = String(values.transform)
    
    // Apply to elements matching selector
    if (targetSelector.startsWith('.')) {
      // Class selector
      const className = targetSelector.slice(1)
      const regex = new RegExp(`class="[^"]*${className}[^"]*"[^>]*`, 'g')
      modifiedSvg = modifiedSvg.replace(regex, (match) => {
        if (match.includes('transform=')) {
          return match.replace(/transform="[^"]*"/, `transform="${transformValue}"`)
        } else {
          return match + ` transform="${transformValue}"`
        }
      })
    } else if (targetSelector.startsWith('#')) {
      // ID selector
      const id = targetSelector.slice(1)
      const regex = new RegExp(`id="${id}"[^>]*`, 'g')
      modifiedSvg = modifiedSvg.replace(regex, (match) => {
        if (match.includes('transform=')) {
          return match.replace(/transform="[^"]*"/, `transform="${transformValue}"`)
        } else {
          return match + ` transform="${transformValue}"`
        }
      })
    }
  }
  
  // Handle other properties
  for (const [property, value] of Object.entries(values)) {
    if (property === 'transform') continue
    
    // Apply style properties
    const styleValue = `${property}: ${value}`
    
    if (targetSelector.startsWith('.')) {
      const className = targetSelector.slice(1)
      const regex = new RegExp(`class="[^"]*${className}[^"]*"[^>]*`, 'g')
      modifiedSvg = modifiedSvg.replace(regex, (match) => {
        if (match.includes('style=')) {
          return match.replace(/style="([^"]*)"/, `style="$1; ${styleValue}"`)
        } else {
          return match + ` style="${styleValue}"`
        }
      })
    }
  }
  
  return modifiedSvg
}

/**
 * Generate inline CSS for animated SVG
 */
export function generateAnimationCss(animations: ParsedAnimation[]): string {
  const cssRules: string[] = []
  
  animations.forEach(animation => {
    if (!animation.name.startsWith('smil_')) {
      // Generate @keyframes rule
      const keyframesRule = `@keyframes ${animation.name} {
${animation.keyframes.map(kf => {
  const offset = kf.offset * 100
  const properties = Object.entries(kf.values)
    .map(([prop, val]) => `  ${prop}: ${val};`)
    .join('\n')
  return `  ${offset}% {\n${properties}\n  }`
}).join('\n')}
}`
      
      // Generate animation rule
      const animationRule = `${animation.target} {
  animation: ${animation.duration}s ${animation.timingFunction} ${animation.delay}s ${animation.iterations} ${animation.direction} ${animation.name};
}`
      
      cssRules.push(keyframesRule, animationRule)
    }
  })
  
  return cssRules.join('\n\n')
}