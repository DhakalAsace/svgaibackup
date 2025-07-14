declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config',
      targetId: string,
      config?: {
        page_path?: string
        page_title?: string
        page_location?: string
        [key: string]: any
      }
    ) => void
  }
}

export {}