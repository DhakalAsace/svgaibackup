// Barrel export for all keyword-specific components
// These components are designed for use in MDX content for learn pages

export { default as FormatExplanation } from './FormatExplanation'
export type { FormatExplanationProps } from './FormatExplanation'

export { default as ConversionGuide } from './ConversionGuide'
export type { ConversionGuideProps } from './ConversionGuide'

export { default as ToolComparison } from './ToolComparison'
export type { ToolComparisonProps, ComparisonTool } from './ToolComparison'

export { default as AnimationTutorial } from './AnimationTutorial'
export type { AnimationTutorialProps } from './AnimationTutorial'

export { CodeExample } from './CodeExample'
export type { CodeExampleProps, CodeExample as CodeExampleType } from './CodeExample'

export { WindowsSpecific } from './WindowsSpecific'
export type { WindowsSpecificProps } from './WindowsSpecific'

// Re-export sub-components from WindowsSpecific for direct use
export { CommandBlock, Step, FilePath, KeyboardShortcut } from './WindowsSpecific'
export type { 
  CommandBlockProps, 
  StepProps, 
  FilePathProps, 
  KeyboardShortcutProps 
} from './WindowsSpecific'