"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export function SweepHeading({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <span className={`sweep-underline ${inView ? "in-view" : ""}`} />
    </span>
  );
}
