import { useEffect, useState } from 'react';

/**
 * Counts down to a timestamp (ms). Pass null to switch it off.
 * This is only for display - the real expiry is enforced by Firestore rules.
 */
export function useCountdown(expiresAtMs: number | null) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (expiresAtMs === null) return;

    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAtMs]);

  const msLeft = expiresAtMs === null ? 0 : Math.max(0, expiresAtMs - now);

  return {
    secondsLeft: Math.ceil(msLeft / 1000),
    isExpired: expiresAtMs !== null && msLeft === 0,
  };
}

export function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}