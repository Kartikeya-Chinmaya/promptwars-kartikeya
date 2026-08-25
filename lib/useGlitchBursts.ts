"use client";

import { useRef, useState } from "react";
import { useIntervalTimer } from "./useIntervalTimer";

/**
 * Toggles a boolean on/off in short randomized bursts, driven entirely by
 * the setInterval-based timer loop (no CSS keyframes, no rAF). Fires a
 * couple of quick bursts right after mount, then settles into a steady
 * 2s cooldown between ambient bursts.
 */
export function useGlitchBursts() {
  const [glitching, setGlitching] = useState(false);
  const phase = useRef({ elapsed: 0, duration: 400, on: false, introBursts: 2 });

  useIntervalTimer((delta) => {
    const p = phase.current;
    p.elapsed += delta;
    if (p.elapsed < p.duration) return;
    p.elapsed = 0;
    p.on = !p.on;
    setGlitching(p.on);

    if (p.on) {
      p.duration = 80 + Math.random() * 70;
    } else if (p.introBursts > 0) {
      p.introBursts -= 1;
      p.duration = 180 + Math.random() * 220;
    } else {
      p.duration = 2000;
    }
  }, 30);

  return glitching;
}
