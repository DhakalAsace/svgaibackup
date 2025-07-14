declare module 'dompurify' {
  interface DOMPurifyI {
    sanitize(source: string | Node): string;
    sanitize(source: string | Node, config: Config & { RETURN_DOM_FRAGMENT?: false | undefined; RETURN_DOM?: false | undefined }): string;
    sanitize(source: string | Node, config: Config & { RETURN_DOM_FRAGMENT: true }): DocumentFragment;
    sanitize(source: string | Node, config: Config & { RETURN_DOM: true }): HTMLElement;
    sanitize(source: string | Node, config: Config): string | HTMLElement | DocumentFragment;
    
    addHook(entryPoint: 'beforeSanitizeElements' | 'uponSanitizeElement' | 'afterSanitizeElements' | 'beforeSanitizeAttributes' | 'uponSanitizeAttribute' | 'afterSanitizeAttributes' | 'beforeSanitizeShadowDOM' | 'uponSanitizeShadowNode' | 'afterSanitizeShadowDOM', hook: (currentNode: any, data: any, config: any) => void): void;
    removeHook(entryPoint: 'beforeSanitizeElements' | 'uponSanitizeElement' | 'afterSanitizeElements' | 'beforeSanitizeAttributes' | 'uponSanitizeAttribute' | 'afterSanitizeAttributes' | 'beforeSanitizeShadowDOM' | 'uponSanitizeShadowNode' | 'afterSanitizeShadowDOM'): void;
    removeHooks(entryPoint: 'beforeSanitizeElements' | 'uponSanitizeElement' | 'afterSanitizeElements' | 'beforeSanitizeAttributes' | 'uponSanitizeAttribute' | 'afterSanitizeAttributes' | 'beforeSanitizeShadowDOM' | 'uponSanitizeShadowNode' | 'afterSanitizeShadowDOM'): void;
    removeAllHooks(): void;
    
    isSupported: boolean;
    version: string;
    removed: any[];
    isValidAttribute(tag: string, attr: string, value: string): boolean;
    
    clearConfig(): void;
    setConfig(config: Config): void;
  }

  interface Config {
    ADD_ATTR?: string[] | undefined;
    ADD_DATA_URI_TAGS?: string[] | undefined;
    ADD_TAGS?: string[] | undefined;
    ADD_URI_SAFE_ATTR?: string[] | undefined;
    ALLOW_ARIA_ATTR?: boolean | undefined;
    ALLOW_DATA_ATTR?: boolean | undefined;
    ALLOW_UNKNOWN_PROTOCOLS?: boolean | undefined;
    ALLOWED_ATTR?: string[] | undefined;
    ALLOWED_TAGS?: string[] | undefined;
    ALLOWED_URI_REGEXP?: RegExp | undefined;
    FORBID_ATTR?: string[] | undefined;
    FORBID_CONTENTS?: string[] | undefined;
    FORBID_TAGS?: string[] | undefined;
    FORCE_BODY?: boolean | undefined;
    KEEP_CONTENT?: boolean | undefined;
    NAMESPACE?: string | undefined;
    PARSER_MEDIA_TYPE?: string | undefined;
    RETURN_DOM?: boolean | undefined;
    RETURN_DOM_FRAGMENT?: boolean | undefined;
    RETURN_TRUSTED_TYPE?: boolean | undefined;
    SAFE_FOR_TEMPLATES?: boolean | undefined;
    SANITIZE_DOM?: boolean | undefined;
    USE_PROFILES?: false | { mathMl?: boolean | undefined; svg?: boolean | undefined; svgFilters?: boolean | undefined; html?: boolean | undefined } | undefined;
    WHOLE_DOCUMENT?: boolean | undefined;
    IN_PLACE?: boolean | undefined;
  }

  const DOMPurify: DOMPurifyI;
  export = DOMPurify;
}