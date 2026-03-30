/**
 * Analytics integration component.
 * 
 * Using Plausible Analytics (privacy-friendly, no cookies).
 * Self-hosted or cloud: https://plausible.io
 * 
 * To enable:
 * 1. Create Plausible account (or self-host)
 * 2. Add your domain: oneprompt.gr
 * 3. Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN in .env
 * 
 * Alternative: Umami (https://umami.is) — also privacy-friendly, self-hostable.
 */

import Script from "next/script";

export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}

/**
 * Track custom events (e.g., newsletter signup, article read completion)
 * 
 * Usage in components:
 *   import { trackEvent } from '@/components/Analytics';
 *   trackEvent('newsletter_signup', { source: 'footer' });
 */
export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible(name, { props });
  }
}
