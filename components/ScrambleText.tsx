"use client";

import { useEffect, useRef, useState } from "react";
import { useIntervalTimer } from "@/lib/useIntervalTimer";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#01";
const DURATION_MS = 500;

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const running = useRef(false);
  const elapsed = useRef(0);
  const revealedOnce = useRef(false);

  function start() {
    running.current = true;
    elapsed.current = 0;
  }

  useIntervalTimer((delta) => {
    if (!running.current) return;
    elapsed.current += delta;
    const progress = Math.min(1, elapsed.current / DURATION_MS);
    const revealCount = Math.floor(progress * text.length);

    let next = "";
    for (let i = 0; i < text.length; i++) {
      next += text[i] === " " || i < revealCount ? text[i] : randomChar();
    }
    setDisplay(next);

    if (progress >= 1) {
      running.current = false;
      setDisplay(text);
    }
  }, 35);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealedOnce.current) {
          revealedOnce.current = true;
          start();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className} onMouseEnter={start}>
      {display}
    </span>
  );
}
