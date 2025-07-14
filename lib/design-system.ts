// Unified Design System for SVG AI
// Professional styling constants and utility functions

export const colors = {
  // Brand colors - consistent with existing palette
  primary: {
    orange: '#FF7043',
    orangeLight: '#FFA726',
    brown: '#4E342E',
    brownLight: '#6D4C41',
  },
  // Background gradients
  gradients: {
    hero: 'from-[#FFF8F6] via-white to-[#F3E5F5]',
    section: 'from-[#FFF8F6] to-gray-50',
    card: 'from-gray-50 to-white',
    premium: 'from-[#FF7043] to-[#FFA726]',
  },
  // UI colors
  ui: {
    background: '#FFFFFF',
    backgroundMuted: '#FAFAFA',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    textPrimary: '#4E342E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
  },
  // Status colors
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  }
}

export const spacing = {
  // Consistent spacing scale
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  xxl: '4rem',     // 64px
  xxxl: '6rem',    // 96px
}

export const typography = {
  // Font sizes with consistent scale
  fontSize: {
    xs: 'text-xs',     // 12px
    sm: 'text-sm',     // 14px
    base: 'text-base', // 16px
    lg: 'text-lg',     // 18px
    xl: 'text-xl',     // 20px
    '2xl': 'text-2xl', // 24px
    '3xl': 'text-3xl', // 30px
    '4xl': 'text-4xl', // 36px
    '5xl': 'text-5xl', // 48px
    '6xl': 'text-6xl', // 60px
  },
  fontWeight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
  lineHeight: {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
  }
}

export const effects = {
  // Consistent shadow effects
  shadow: {
    sm: 'shadow-sm',
    base: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },
  // Border radius
  radius: {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  },
  // Transitions
  transition: {
    all: 'transition-all',
    shadow: 'transition-shadow',
    colors: 'transition-colors',
    transform: 'transition-transform',
  },
  // Hover effects
  hover: {
    scale: 'hover:scale-105',
    shadow: 'hover:shadow-lg',
    shadowXl: 'hover:shadow-xl',
    brighten: 'hover:brightness-110',
  }
}

export const components = {
  // Consistent component styles
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-gray-100',
    hover: 'hover:shadow-lg transition-shadow',
    premium: 'bg-gradient-to-br from-[#FFF8F6] to-white border-orange-200',
  },
  button: {
    primary: 'bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all',
    secondary: 'bg-white text-[#4E342E] border border-gray-200 font-semibold rounded-lg hover:bg-gray-50 transition-all',
    outline: 'border-[#FF7043] text-[#FF7043] hover:bg-[#FFF0E6] font-semibold rounded-lg transition-all',
  },
  input: {
    base: 'w-full rounded-md border-gray-300 focus:border-[#FF7043] focus:ring-[#FF7043]',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  },
  select: {
    base: 'w-full rounded-md border-gray-300 focus:border-[#FF7043] focus:ring-[#FF7043]',
  },
  label: {
    base: 'text-sm font-medium text-[#4E342E]',
    muted: 'text-sm text-gray-600',
  },
  section: {
    padding: 'py-16 lg:py-20',
    container: 'container mx-auto px-4 max-w-6xl',
  }
}

export const animations = {
  // Subtle, professional animations
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  duration: {
    fast: 'duration-200',
    normal: 'duration-300',
    slow: 'duration-500',
  }
}

// Utility functions for consistent styling
export const getCardStyles = (variant: 'default' | 'premium' | 'hover' = 'default') => {
  const base = components.card.base
  const variants = {
    default: base,
    premium: `${base} ${components.card.premium}`,
    hover: `${base} ${components.card.hover}`,
  }
  return variants[variant]
}

export const getButtonStyles = (variant: 'primary' | 'secondary' | 'outline' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  }
  return `${components.button[variant]} ${sizeClasses[size]}`
}

export const getSectionStyles = (background: 'white' | 'muted' | 'gradient' = 'white') => {
  const backgrounds = {
    white: 'bg-white',
    muted: 'bg-[#FAFAFA]',
    gradient: `bg-gradient-to-br ${colors.gradients.section}`,
  }
  return `${components.section.padding} ${backgrounds[background]}`
}

// Export design tokens for use in Tailwind config
export const designTokens = {
  colors: {
    primary: colors.primary.orange,
    'primary-light': colors.primary.orangeLight,
    'primary-dark': colors.primary.brown,
    'primary-darker': colors.primary.brownLight,
  },
  spacing: {
    'section-y': spacing.xxl,
    'container-x': spacing.sm,
    'card-p': spacing.lg,
  },
  borderRadius: {
    card: '0.75rem', // 12px
    button: '0.5rem', // 8px
    input: '0.375rem', // 6px
  }
}