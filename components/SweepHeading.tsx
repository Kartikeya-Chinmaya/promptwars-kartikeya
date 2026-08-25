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
      // rootMargin shrinks the bottom of the intersection root so an element
      // sitting right at the initial fold (barely visible on page load, no
      // real scroll yet) doesn't count as "in view" — it has to be pulled
      // meaningfully into the viewport by an actual scroll first.
      { threshold: 0.4, rootMargin: "0px 0px -15% 0px" },
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
