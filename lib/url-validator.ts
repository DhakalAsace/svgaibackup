/**
 * URL Validator Utility
 * 
 * This module provides functionality to validate URLs to prevent
 * Server-Side Request Forgery (SSRF) attacks by ensuring URLs
 * point only to allowed domains and not to internal resources.
 */

/**
 * Checks if a URL is safe to fetch from, preventing SSRF attacks.
 * It validates that the URL:
 * 1. Uses http/https protocols only
 * 2. Points to an allowed domain
 * 3. Does not point to internal IP addresses or localhost
 * 
 * @param url - The URL to validate
 * @param allowedDomains - List of allowed domains to fetch from
 * @returns Boolean indicating if the URL is safe
 */
export function isUrlSafe(url: string, allowedDomains: string[]): boolean {
  try {
    // Parse the URL
    const parsedUrl = new URL(url);
    
    // Only allow http/https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false;
    }
    
    // Check if hostname is in the allowlist
    const isAllowedDomain = allowedDomains.some(domain => 
      parsedUrl.hostname === domain || 
      parsedUrl.hostname.endsWith(`.${domain}`)
    );
    
    if (!isAllowedDomain) {
      return false;
    }
    
    // Prevent localhost access in various forms
    if (
      parsedUrl.hostname === 'localhost' ||
      parsedUrl.hostname === '127.0.0.1' ||
      parsedUrl.hostname === '[::1]'
    ) {
      return false;
    }
    
    // Block private IP ranges
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = parsedUrl.hostname.match(ipv4Pattern);
    
    if (match) {
      const [, a, b] = match.map(Number);
      
      // Check for common private IP ranges
      if (
        a === 10 || // 10.0.0.0/8
        (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
        (a === 192 && b === 168) || // 192.168.0.0/16
        (a === 169 && b === 254) || // 169.254.0.0/16 (Link-local)
        a === 127 // 127.0.0.0/8 (Loopback)
      ) {
        return false;
      }
    }
    
    // Check for IPv6 localhost
    const ipv6Localhost = /^(::)?[fF][eE]80:/;
    if (ipv6Localhost.test(parsedUrl.hostname)) {
      return false;
    }
    
    // Additional check for domain fronting
    // Ensure hostname doesn't contain suspicious subdomains
    const suspiciousSubdomains = ['localhost', 'internal', 'intranet', 'admin', 'console'];
    if (suspiciousSubdomains.some(subdomain => 
      parsedUrl.hostname.includes(`.${subdomain}.`) || 
      parsedUrl.hostname.startsWith(`${subdomain}.`)
    )) {
      return false;
    }
    
    return true;
  } catch (error) {
    // URL parsing failed, reject as unsafe
    return false;
  }
}
