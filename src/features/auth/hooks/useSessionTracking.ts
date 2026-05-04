import { useEffect } from 'react';

const SESSION_TRACKED_KEY = 'ac_session_tracked';

/**
 * Fires POST /api/v1/me/session once per browser session to enable
 * Klaviyo re-engagement flows. Uses sessionStorage so it only runs
 * on first mount, not on every page navigation.
 */
export function useSessionTracking(accessToken: string | undefined): void {
  useEffect(() => {
    if (!accessToken) return;
    if (sessionStorage.getItem(SESSION_TRACKED_KEY)) return;

    sessionStorage.setItem(SESSION_TRACKED_KEY, '1');

    fetch('/api/v1/me/session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }).catch(() => {
      // Fire-and-forget: remove flag so it retries on next page load
      sessionStorage.removeItem(SESSION_TRACKED_KEY);
    });
  }, [accessToken]);
}
