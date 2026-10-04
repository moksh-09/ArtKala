"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // If IntersectionObserver is not supported, reveal immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Check if already in viewport on mount (e.g. above the fold)
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "40px 0px" }
    );

    observer.observe(node);

    // Failsafe timer: ensure elements are revealed after 800ms regardless
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 800);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [threshold]);

  return { ref, isRevealed };
}
