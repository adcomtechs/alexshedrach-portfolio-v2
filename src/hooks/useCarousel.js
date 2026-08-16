"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

// ─────────────────────────────────────────────────────────────────────────────
// useCarousel
//
// Local hook — not shared because no other component in the project uses
// this exact carousel engine (fixed card count, auto-advance, loop).
//
// State machine:
//   slide          — current slide index (0-based)
//   animatingRef   — guard against slide-change collisions during transition
//   intervalRef    — handle for the auto-advance timer
//   slideRef       — always-current slide index accessible inside closures
//
// The advance() function is the single mutation point for slide state.
// All public methods (prev, next, goToSlide) call advance().
// ─────────────────────────────────────────────────────────────────────────────

export function useCarousel(totalItems, itemsPerSlide, autoInterval) {
  const totalSlides = Math.ceil(totalItems / itemsPerSlide);
  const [slide, setSlide] = useState(0);
  const reduced = usePrefersReducedMotion();
  const intervalRef = useRef(null);
  const animatingRef = useRef(false);
  const slideRef = useRef(slide);

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  const advance = useCallback((targetIndex) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setSlide(targetIndex);
    setTimeout(() => {
      animatingRef.current = false;
    }, 560);
  }, []);

  const goToSlide = useCallback(
    (index) => {
      if (index !== slideRef.current) advance(index);
    },
    [advance],
  );

  const prev = useCallback(
    () => advance(Math.max(0, slideRef.current - 1)),
    [advance],
  );

  const next = useCallback(
    () => advance((slideRef.current + 1) % totalSlides),
    [advance, totalSlides],
  );

  const stopAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const startAuto = useCallback(() => {
    if (reduced) return;
    stopAuto();
    intervalRef.current = setInterval(
      () => advance((slideRef.current + 1) % totalSlides),
      autoInterval,
    );
  }, [reduced, totalSlides, autoInterval, advance, stopAuto]);

  // Start on mount, stop on unmount
  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  // Pause when tab is hidden — avoids runaway timer in background tabs
  useEffect(() => {
    const handler = () => (document.hidden ? stopAuto() : startAuto());
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [startAuto, stopAuto]);

  return {
    currentSlide: slide,
    totalSlides,
    goToSlide,
    prev,
    next,
    progressKey: slide,
    stopAuto,
    startAuto,
  };
}
