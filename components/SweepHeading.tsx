"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useIntervalTimer } from "@/lib/useIntervalTimer";

const SWEEP_DURATION_MS = 260;

export function SweepHeading({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [widthPct, setWidthPct] = useState(0);
  const elapsed = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useIntervalTimer((delta) => {
    if (!triggered || elapsed.current >= SWEEP_DURATION_MS) return;
    elapsed.current += delta;
    setWidthPct(Math.min(100, (elapsed.current / SWEEP_DURATION_MS) * 100));
  }, 16);

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <span
        className="block bg-accent mt-1"
        style={{ width: `${widthPct}%`, height: "3px" }}
      />
    </span>
  );
}
