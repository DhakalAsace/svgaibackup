# Task 1: Signup Flow Modification

## Objective
Modify the generation flow to show a signup modal immediately when users click generate, preserving their prompt and allowing them to continue after signup.

## Current State Analysis
- Anonymous users get 1 free generation total
- Modal shows AFTER generation completes
- Prompt is not preserved through signup flow
- Users must re-enter prompt after signup

## Required Changes

### 1. Modify Hero Component (`/components/hero.tsx`)

**Location**: Lines 127-305 in `handleGenerate` function

**Changes Required**:
```typescript
// Replace lines 130-149 with:
const handleGenerate = async () => {
  if (!prompt.trim()) return

  // NEW: Check if user is signed in BEFORE generating
  if (!userId) {
    // Store prompt in sessionStorage for preservation
    sessionStorage.setItem('pendingPrompt', prompt);
    sessionStorage.setItem('pendingStyle', style);
    sessionStorage.setItem('pendingSize', size);
    sessionStorage.setItem('pendingAspectRatio', aspectRatio);
    
    // Show signup modal immediately
    setIsSoftPrompt(false);
    setShowSignupModal(true);
    return;
  }

  // For authenticated users, check credit balance
  if (userGenerations && !isSubscribed) {
    if (userGenerations.used >= userGenerations.limit) {
      setShowUpgradeModal(true);
      return;
    }
  }

  // Continue with existing generation logic...
  setIsGenerating(true)
  // ... rest of the function remains the same
```

### 2. Modify Icon Generator Hero (`/app/ai-icon-generator/hero-section.tsx`)

**Location**: Lines 100-230 in `handleGenerate` function

**Apply same changes as above** - Check authentication before generation, store prompt in sessionStorage.

### 3. Update Signup Modal (`/components/auth/generation-signup-modal.tsx`)

**Location**: Add new prop and modify redirect behavior

**Changes Required**:
```typescript
interface GenerationSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationsUsed: number;
  isSoftPrompt?: boolean;
  onContinueAsGuest?: () => void;
  isAuthenticated?: boolean;
  isSubscribed?: boolean;
  preservePrompt?: boolean; // NEW PROP
}

// In handleSignup function (line 35):
const handleSignup = () => {
  onClose();
  // Include preservePrompt flag in URL
  const url = preservePrompt 
    ? '/signup?returnUrl=/&preservePrompt=true' 
    : '/signup?returnUrl=/';
  router.push(url);
};

// Same for handleLogin (line 40)
```

### 4. Add Prompt Restoration Logic

**Create new file**: `/hooks/use-prompt-restoration.ts`

```typescript
import { useEffect } from 'react';

export function usePromptRestoration(
  setPrompt: (prompt: string) => void,
  setStyle: (style: string) => void,
  setSize: (size: string) => void,
  setAspectRatio: (ratio: string) => void
) {
  useEffect(() => {
    // Check if we should restore prompt
    const urlParams = new URLSearchParams(window.location.search);
    const shouldRestore = urlParams.get('preservePrompt') === 'true';
    
    if (shouldRestore) {
      const pendingPrompt = sessionStorage.getItem('pendingPrompt');
      const pendingStyle = sessionStorage.getItem('pendingStyle');
      const pendingSize = sessionStorage.getItem('pendingSize');
      const pendingAspectRatio = sessionStorage.getItem('pendingAspectRatio');
      
      if (pendingPrompt) {
        setPrompt(pendingPrompt);
        if (pendingStyle) setStyle(pendingStyle);
        if (pendingSize) setSize(pendingSize);
        if (pendingAspectRatio) setAspectRatio(pendingAspectRatio);
        
        // Clean up
        sessionStorage.removeItem('pendingPrompt');
        sessionStorage.removeItem('pendingStyle');
        sessionStorage.removeItem('pendingSize');
        sessionStorage.removeItem('pendingAspectRatio');
        
        // Remove param from URL
        urlParams.delete('preservePrompt');
        const newUrl = window.location.pathname + 
          (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [setPrompt, setStyle, setSize, setAspectRatio]);
}
```

### 5. Import and Use Hook in Components

**In `/components/hero.tsx`** (after line 43):
```typescript
import { usePromptRestoration } from '@/hooks/use-prompt-restoration';

// Inside component (after state declarations):
usePromptRestoration(setPrompt, setStyle, setSize, setAspectRatio);
```

**In `/app/ai-icon-generator/hero-section.tsx`** (similar location):
```typescript
import { usePromptRestoration } from '@/hooks/use-prompt-restoration';

// Inside component:
usePromptRestoration(setPrompt, setStyle, setSize, setAspectRatio);
```

### 6. Update Auth Callback Route

**File**: `/app/auth/callback/route.ts`

**Add logic to preserve the preservePrompt parameter through OAuth flow**:
```typescript
// Before redirect, check for preservePrompt in stored redirect path
const redirectPath = localStorage.getItem('authRedirectPath') || '/dashboard';
const preservePrompt = redirectPath.includes('preservePrompt=true');

// Construct final redirect URL
let finalRedirect = redirectTo || '/dashboard';
if (preservePrompt && !finalRedirect.includes('preservePrompt')) {
  finalRedirect += (finalRedirect.includes('?') ? '&' : '?') + 'preservePrompt=true';
}
```

## Testing Checklist
1. [ ] Anonymous user enters prompt and clicks generate
2. [ ] Signup modal appears immediately (not after generation)
3. [ ] User signs up via email
4. [ ] After signup confirmation, user returns to home with prompt pre-filled
5. [ ] User can immediately generate without re-entering prompt
6. [ ] Test same flow with Google OAuth
7. [ ] Test with icon generator page
8. [ ] Verify prompt is cleared from sessionStorage after use

## Rollback Plan
1. Remove prompt restoration hook usage
2. Revert handleGenerate functions to original
3. Remove preservePrompt prop from signup modal
4. Delete use-prompt-restoration.ts file

## Success Metrics
- Zero prompt loss during signup flow
- Reduced friction in user journey
- Higher conversion from anonymous to registered users