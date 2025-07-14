/**
 * SVG Animation Parser
 * 
 * This module provides utilities for parsing SVG animations,
 * extracting keyframes, calculating timing functions, and generating frame sequences
 */

/**
 * Animation timing function types
 */
export type TimingFunction = 
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'step-start'
  | 'step-end'
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`
  | `steps(${number}, ${'start' | 'end'})`

/**
 * Parsed animation data
 */
export interface ParsedAnimation {
  /** Animation name/id */
  name: string
  /** Target element selector */
  target: string
  /** Property being animated */
  property: string
  /** Animation duration in seconds */
  duration: number
  /** Animation delay in seconds */
  delay: number
  /** Number of iterations */
  iterations: number | 'infinite'
  /** Animation direction */
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  /** Timing function */
  timingFunction: TimingFunction
  /** Keyframes */
  keyframes: AnimationKeyframe[]
}

/**
 * Animation keyframe
 */
export interface AnimationKeyframe {
  /** Offset (0-1) */
  offset: number
  /** Property values at this keyframe */
  values: Record<string, string | number>
  /** Optional easing for this keyframe */
  easing?: TimingFunction
}

/**
 * Frame data for rendering
 */
export interface FrameData {
  /** Frame index */
  index: number
  /** Timestamp in seconds */
  timestamp: number
  /** SVG content for this frame */
  svg: string
  /** Active animations at this frame */
  activeAnimations: string[]
}

/**
 * Parse CSS animations from SVG
 */
export function parseCssAnimations(svgContent: string): ParsedAnimation[] {
  const animations: ParsedAnimation[] = []
  
  // Extract style content
  const styleMatch = svgContent.match(/<style[^>]*>([\s\S]*?)<\/style>/g)
  if (!styleMatch) return animations
  
  const styleContent = styleMatch.join('\n')
  
  // Parse @keyframes
  const keyframesRegex = /@keyframes\s+(\w+)\s*{([^}]+)}/g
  const keyframesMap = new Map<string, AnimationKeyframe[]>()
  
  let match
  while ((match = keyframesRegex.exec(styleContent)) !== null) {
    const [, name, content] = match
    const keyframes = parseKeyframeContent(content)
    keyframesMap.set(name, keyframes)
  }
  
  // Parse animation declarations
  const animationRegex = /\.(\w+)\s*{[^}]*animation:\s*([^;]+);/g
  
  while ((match = animationRegex.exec(styleContent)) !== null) {
    const [, className, animationValue] = match
    const parsed = parseAnimationShorthand(animationValue, keyframesMap)
    if (parsed && parsed.name) {
      animations.push({
        name: parsed.name,
        target: `.${className}`,
        property: 'transform', // Default, would need more parsing for accuracy
        duration: parsed.duration || 2,
        delay: parsed.delay || 0,
        iterations: parsed.iterations || 1,
        direction: parsed.direction || 'normal',
        timingFunction: parsed.timingFunction || 'ease',
        keyframes: parsed.keyframes || []
      })
    }
  }
  
  return animations
}

/**
 * Parse SMIL animations from SVG
 */
export function parseSmilAnimations(svgContent: string): ParsedAnimation[] {
  const animations: ParsedAnimation[] = []
  
  // Parse animate elements
  const animateRegex = /<(animate|animateTransform|animateMotion)[^>]*>/g
  let match
  
  while ((match = animateRegex.exec(svgContent)) !== null) {
    const element = match[0]
    const type = match[1]
    
    const animation = parseSmilElement(element, type)
    if (animation) {
      animations.push(animation)
    }
  }
  
  return animations
}

/**
 * Parse keyframe content
 */
function parseKeyframeContent(content: string): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = []
  const frameRegex = /([\d.]+%|from|to)\s*{([^}]+)}/g
  
  let match
  while ((match = frameRegex.exec(content)) !== null) {
    const [, offsetStr, properties] = match
    
    let offset: number
    if (offsetStr === 'from') offset = 0
    else if (offsetStr === 'to') offset = 1
    else offset = parseFloat(offsetStr) / 100
    
    const values = parseProperties(properties)
    keyframes.push({ offset, values })
  }
  
  return keyframes.sort((a, b) => a.offset - b.offset)
}

/**
 * Parse CSS properties
 */
function parseProperties(propertiesStr: string): Record<string, string | number> {
  const properties: Record<string, string | number> = {}
  const propRegex = /(\w+(?:-\w+)*)\s*:\s*([^;]+);?/g
  
  let match
  while ((match = propRegex.exec(propertiesStr)) !== null) {
    const [, property, value] = match
    properties[property] = value.trim()
  }
  
  return properties
}

/**
 * Parse animation shorthand
 */
function parseAnimationShorthand(
  shorthand: string,
  keyframesMap: Map<string, AnimationKeyframe[]>
): Partial<ParsedAnimation> | null {
  const parts = shorthand.trim().split(/\s+/)
  if (parts.length < 2) return null
  
  // Simple parsing - would need more robust implementation
  const duration = parseFloat(parts[0]) || 2
  const name = parts[1] || 'unknown'
  const timingFunction = (parts[2] || 'ease') as TimingFunction
  const delay = parseFloat(parts[3]) || 0
  const iterations = parts[4] === 'infinite' ? 'infinite' : (parseInt(parts[4]) || 1)
  const direction = (parts[5] || 'normal') as ParsedAnimation['direction']
  
  const keyframes = keyframesMap.get(name) || []
  
  return {
    name,
    duration,
    delay,
    iterations,
    direction,
    timingFunction,
    keyframes
  }
}

/**
 * Parse SMIL element
 */
function parseSmilElement(element: string, type: string): ParsedAnimation | null {
  const getAttr = (name: string): string | null => {
    const match = element.match(new RegExp(`${name}="([^"]+)"`))
    return match ? match[1] : null
  }
  
  const attributeName = getAttr('attributeName') || 'transform'
  const dur = getAttr('dur')
  const begin = getAttr('begin')
  const repeatCount = getAttr('repeatCount')
  const from = getAttr('from')
  const to = getAttr('to')
  const values = getAttr('values')
  
  if (!dur) return null
  
  const duration = parseDuration(dur)
  const delay = begin ? parseDuration(begin) : 0
  const iterations = repeatCount === 'indefinite' ? 'infinite' : (parseInt(repeatCount || '1') || 1)
  
  // Create keyframes
  const keyframes: AnimationKeyframe[] = []
  if (from && to) {
    keyframes.push(
      { offset: 0, values: { [attributeName]: from } },
      { offset: 1, values: { [attributeName]: to } }
    )
  } else if (values) {
    const valueList = values.split(';')
    valueList.forEach((value, index) => {
      keyframes.push({
        offset: index / (valueList.length - 1),
        values: { [attributeName]: value.trim() }
      })
    })
  }
  
  return {
    name: `smil_${type}_${attributeName}`,
    target: element.match(/id="([^"]+)"/) ? `#${element.match(/id="([^"]+)"/)?.[1] || 'unknown'}` : '*',
    property: attributeName,
    duration,
    delay,
    iterations,
    direction: 'normal',
    timingFunction: 'linear',
    keyframes
  }
}

/**
 * Parse duration string (e.g., "2s", "500ms")
 */
function parseDuration(durStr: string): number {
  const match = durStr.match(/([\d.]+)(s|ms)/)
  if (!match) return 0
  
  const value = parseFloat(match[1])
  return match[2] === 'ms' ? value / 1000 : value
}

/**
 * Calculate frame sequence for animations
 */
export function calculateFrameSequence(
  animations: ParsedAnimation[],
  totalDuration: number,
  frameRate: number = 30
): FrameData[] {
  const frames: FrameData[] = []
  const frameCount = Math.ceil(totalDuration * frameRate)
  const frameDuration = 1 / frameRate
  
  for (let i = 0; i < frameCount; i++) {
    const timestamp = i * frameDuration
    const activeAnimations: string[] = []
    
    // Determine which animations are active at this timestamp
    animations.forEach(animation => {
      const animTime = timestamp - animation.delay
      if (animTime >= 0 && animTime <= animation.duration) {
        activeAnimations.push(animation.name)
      }
    })
    
    frames.push({
      index: i,
      timestamp,
      svg: '', // Would be populated by frame renderer
      activeAnimations
    })
  }
  
  return frames
}

/**
 * Apply cubic bezier timing function
 */
export function cubicBezier(t: number, p1: number, p2: number, p3: number, p4: number): number {
  const cx = 3 * p1
  const bx = 3 * (p3 - p1) - cx
  const ax = 1 - cx - bx
  
  const cy = 3 * p2
  const by = 3 * (p4 - p2) - cy
  const ay = 1 - cy - by
  
  function sampleCurveX(t: number): number {
    return ((ax * t + bx) * t + cx) * t
  }
  
  function sampleCurveY(t: number): number {
    return ((ay * t + by) * t + cy) * t
  }
  
  function solveCurveX(x: number): number {
    let t2 = x
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - x
      if (Math.abs(x2) < 0.001) return t2
      const d2 = (3 * ax * t2 + 2 * bx) * t2 + cx
      if (Math.abs(d2) < 0.001) break
      t2 = t2 - x2 / d2
    }
    return t2
  }
  
  return sampleCurveY(solveCurveX(t))
}

/**
 * Apply timing function to progress
 */
export function applyTimingFunction(progress: number, timingFunction: TimingFunction): number {
  switch (timingFunction) {
    case 'linear':
      return progress
    case 'ease':
      return cubicBezier(progress, 0.25, 0.1, 0.25, 1)
    case 'ease-in':
      return cubicBezier(progress, 0.42, 0, 1, 1)
    case 'ease-out':
      return cubicBezier(progress, 0, 0, 0.58, 1)
    case 'ease-in-out':
      return cubicBezier(progress, 0.42, 0, 0.58, 1)
    case 'step-start':
      return progress >= 0 ? 1 : 0
    case 'step-end':
      return progress >= 1 ? 1 : 0
    default:
      // Handle cubic-bezier() and steps()
      if (timingFunction.startsWith('cubic-bezier')) {
        const match = timingFunction.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/)
        if (match) {
          const [, p1, p2, p3, p4] = match.map(Number)
          return cubicBezier(progress, p1, p2, p3, p4)
        }
      } else if (timingFunction.startsWith('steps')) {
        const match = timingFunction.match(/steps\((\d+),\s*(start|end)\)/)
        if (match) {
          const [, steps, position] = match
          const stepCount = parseInt(steps)
          const stepProgress = Math.floor(progress * stepCount) / stepCount
          return position === 'start' ? Math.ceil(progress * stepCount) / stepCount : stepProgress
        }
      }
      return progress
  }
}

/**
 * Get optimal frame rate based on animation complexity
 */
export function getOptimalFrameRate(animations: ParsedAnimation[]): number {
  if (animations.length === 0) return 1 // Static image
  
  // Calculate minimum frame duration needed
  let minDuration = Infinity
  animations.forEach(animation => {
    const keyframeCount = animation.keyframes.length
    if (keyframeCount > 1) {
      const frameDuration = animation.duration / (keyframeCount - 1)
      minDuration = Math.min(minDuration, frameDuration)
    }
  })
  
  // Determine frame rate (capped between 10-30 fps)
  const idealFps = 1 / minDuration
  return Math.max(10, Math.min(30, Math.round(idealFps)))
}