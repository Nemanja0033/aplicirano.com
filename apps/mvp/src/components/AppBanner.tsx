"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";

export default function TopBanner() {
  const t = useTranslations("Banner");
  const version = "v1.0.0";
  const STORAGE_KEY = `topBannerHidden_${version}`;

  const [hidden, setHidden] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Refs for measuring text width
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  // animation state
  const [animationName, setAnimationName] = useState<string | null>(null);
  const [animationDuration, setAnimationDuration] = useState<number>(0);

  // Read localStorage once on mount to avoid SSR/hydration issues
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "true") {
        setHidden(true);
      }
    } catch {
      // ignore localStorage errors (e.g., private mode)
    } finally {
      setInitialized(true);
    }
  }, [STORAGE_KEY]);

  // Persist immediately when user dismisses banner
  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setHidden(true);
  }, [STORAGE_KEY]);

  // Create a unique animation name and inject keyframes based on measured widths
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    const textEl = textRef.current;

    if (!container || !textEl) return;

    const handleResize = () => {
      const containerWidth = container.getBoundingClientRect().width;
      const textWidth = textEl.getBoundingClientRect().width;

      // Only animate when text is wider than container and on small screens
      const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;
      if (!isSmallScreen || textWidth <= containerWidth) {
        // remove animation if present
        setAnimationName(null);
        setAnimationDuration(0);
        return;
      }

      // compute duration: px / speed(px per sec)
      const speed = 60; // px per second, tweak for UX
      const distance = textWidth + containerWidth; // total distance to scroll
      const duration = Math.max(6, distance / speed); // minimum 6s

      // generate unique name
      const name = `marquee_${Math.random().toString(36).slice(2, 9)}`;

      // keyframes: translateX from 0 to -50% when duplicating content
      // We'll animate the inner wrapper from 0 to -50% (since we duplicate text)
      const keyframes = `
        @keyframes ${name} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `;

      // inject style tag
      const styleTag = document.createElement("style");
      styleTag.setAttribute("data-marquee", name);
      styleTag.innerHTML = keyframes;
      document.head.appendChild(styleTag);

      // cleanup old style tags (optional)
      const prev = document.querySelectorAll(`style[data-marquee]`);
      if (prev.length > 1) {
        // keep the latest only
        prev.forEach((el, idx) => {
          if (idx < prev.length - 1) el.remove();
        });
      }

      setAnimationName(name);
      setAnimationDuration(duration);
    };

    // initial measurement
    handleResize();

    // re-measure on resize
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      // remove injected style on unmount
      const tag = document.querySelector(`style[data-marquee]`);
      if (tag) tag.remove();
    };
  }, [t, version]);

  // If not initialized yet, don't render to avoid flicker
  if (!initialized || hidden) return null;

  const message = t("message", { version });

  return (
    <div className="w-full flex text-white justify-center items-center top-0 z-[9999] h-[30px] fixed bg-purple-500">
      <div className="max-w-6xl w-full px-4 flex items-center justify-center relative overflow-hidden" ref={containerRef}>
        {/* Desktop / large screens: centered static text */}
        <div className="hidden sm:flex w-full justify-center">
          <span className="text-xs text-center">{message}</span>
        </div>

        {/* Small screens: animated horizontal scrolling (marquee) */}
        <div
          className="flex sm:hidden w-full items-center"
          aria-hidden={false}
          style={{
            // ensure the wrapper hides overflow and positions inner content
            overflow: "hidden",
          }}
        >
          {/* inner animated track: duplicate content twice for seamless loop */}
          <div
            ref={textRef}
            className="flex whitespace-nowrap"
            style={{
              // when animationName is set, apply animation to this wrapper's parent (we'll wrap duplicates)
              width: "auto",
            }}
          >
            {/* Animated track wrapper */}
            <div
              className="flex"
              style={{
                // duplicate content inline
                display: "inline-flex",
                gap: "2rem",
                // apply animation if available
                animationName: animationName ?? undefined,
                animationDuration: animationName ? `${animationDuration}s` : undefined,
                animationTimingFunction: animationName ? "linear" : undefined,
                animationIterationCount: animationName ? "infinite" : undefined,
                willChange: "transform",
              }}
            >
              <span className="text-xs">{message}</span>
              <span className="text-xs">{message}</span>
            </div>
          </div>
        </div>

        <button
          aria-label={t("dismiss_button")}
          onClick={dismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-90 hover:opacity-100 rounded p-1"
        >
          <span className="sr-only">{t("dismiss_button")}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 8.586L15.293 3.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707A1 1 0 014.707 3.293L10 8.586z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
