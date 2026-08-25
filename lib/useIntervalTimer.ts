"use client";

import { useEffect, useRef } from "react";

const MAX_DELTA_MS = 100;

/**
 * Drives animation state off setInterval instead of requestAnimationFrame or
 * CSS @keyframes/transitions — both of which Brave throttles aggressively.
 * Delta time between ticks is clamped so a throttled/backgrounded tab can't
 * report a huge jump and skip an animation's visible steps.
 */
export function useIntervalTimer(onTick: (deltaMs: number) => void, tickMs = 30) {
  const callbackRef = useRef(onTick);
  callbackRef.current = onTick;
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    lastRef.current = null;
    const id = setInterval(() => {
      const now = Date.now();
      const last = lastRef.current ?? now;
      const delta = Math.min(now - last, MAX_DELTA_MS);
      lastRef.current = now;
      callbackRef.current(delta);
    }, tickMs);
    return () => clearInterval(id);
  }, [tickMs]);
}
