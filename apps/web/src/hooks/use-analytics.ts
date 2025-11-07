'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from '@/i18n/routing';

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
}

/**
 * Custom analytics hook for behavioral tracking
 */
export function useAnalytics() {
  const pathname = usePathname();

  // Track page view
  useEffect(() => {
    trackEvent('page_view', {
      page: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    });
  }, [pathname]);

  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        page: pathname,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
      timestamp: Date.now(),
    };

    // Send to analytics endpoint
    if (typeof window !== 'undefined') {
      // Store locally for session analysis
      const sessionEvents = JSON.parse(
        sessionStorage.getItem('analytics_events') || '[]'
      );
      sessionEvents.push(analyticsEvent);
      sessionStorage.setItem('analytics_events', JSON.stringify(sessionEvents));

      // Send to backend (async, non-blocking)
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsEvent),
      }).catch(err => console.error('Analytics error:', err));
    }
  }, [pathname]);

  const trackProductView = useCallback((productId: string, productName: string) => {
    trackEvent('product_view', {
      product_id: productId,
      product_name: productName,
    });
  }, [trackEvent]);

  const trackCTAClick = useCallback((ctaName: string, ctaLocation: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, formData?: Record<string, any>) => {
    trackEvent('form_submit', {
      form_name: formName,
      ...formData,
    });
  }, [trackEvent]);

  const trackChatbotOpen = useCallback(() => {
    trackEvent('chatbot_open');
  }, [trackEvent]);

  return {
    trackEvent,
    trackProductView,
    trackCTAClick,
    trackFormSubmit,
    trackChatbotOpen,
  };
}

/**
 * Hook for tracking time spent on page
 */
export function usePageDuration() {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;

      // Track if user spent more than 5 seconds
      if (duration > 5000) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'page_duration',
            properties: {
              duration,
              page: window.location.pathname,
            },
            timestamp: Date.now(),
          }),
        }).catch(err => console.error('Analytics error:', err));
      }
    };
  }, []);
}
