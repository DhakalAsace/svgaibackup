import { useEffect } from 'react';

export function usePromptRestoration(
  setPrompt: (prompt: string) => void,
  setStyle: (style: string) => void,
  setSize: (size: string) => void,
  setAspectRatio: (ratio: string) => void
) {
  useEffect(() => {
    // Attempt to restore prompt if it was saved in sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const shouldRestore = urlParams.get('preservePrompt') === 'true';

    // Restore if URL param present OR pendingPrompt exists in storage
    if (shouldRestore || sessionStorage.getItem('pendingPrompt')) {
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