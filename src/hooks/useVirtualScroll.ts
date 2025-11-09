import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export interface VirtualScrollOptions {
  /** Total number of items */
  totalItems: number;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the viewport/container in pixels */
  containerHeight: number;
  /** Number of items to render above/below visible area (buffer) */
  overscan?: number;
}

export interface VirtualScrollResult {
  /** Index of first visible item */
  startIndex: number;
  /** Index of last visible item */
  endIndex: number;
  /** Items currently visible (with overscan) */
  visibleItems: number[];
  /** Total height of the scrollable content */
  totalHeight: number;
  /** Offset for positioning visible items */
  offsetY: number;
  /** Ref to attach to scrollable container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Scroll to specific index */
  scrollToIndex: (index: number) => void;
  /** Current scroll position */
  scrollTop: number;
}

/**
 * Custom hook for virtual scrolling implementation
 * Optimizes rendering of large lists by only rendering visible items
 */
export function useVirtualScroll({
  totalItems,
  itemHeight,
  containerHeight,
  overscan = 3,
}: VirtualScrollOptions): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate total height
  const totalHeight = useMemo(() => totalItems * itemHeight, [totalItems, itemHeight]);

  // Calculate visible range
  const startIndex = useMemo(
    () => Math.max(0, Math.floor(scrollTop / itemHeight) - overscan),
    [scrollTop, itemHeight, overscan]
  );

  const endIndex = useMemo(
    () => Math.min(totalItems - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan),
    [scrollTop, containerHeight, itemHeight, totalItems, overscan]
  );

  // Generate array of visible item indices (memoized to prevent unnecessary re-renders)
  const visibleItems = useMemo(() => {
    const items: number[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push(i);
    }
    console.log('[VirtualScroll] Recalculating visibleItems:', items.length, 'items from', startIndex, 'to', endIndex);
    return items;
  }, [startIndex, endIndex]);

  // Calculate offset for positioning
  const offsetY = useMemo(() => startIndex * itemHeight, [startIndex, itemHeight]);

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index: number) => {
      if (containerRef.current) {
        const targetScrollTop = Math.max(
          0,
          Math.min(index * itemHeight, totalHeight - containerHeight)
        );
        containerRef.current.scrollTop = targetScrollTop;
        // Update state immediately
        setScrollTop(targetScrollTop);
      }
    },
    [itemHeight, totalHeight, containerHeight]
  );

  // Attach scroll listener using useEffect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const newScrollTop = target.scrollTop;
      console.log('[VirtualScroll] Scroll event:', newScrollTop);
      // Directly update state on every scroll event
      setScrollTop(newScrollTop);
    };

    // Set initial scroll position
    setScrollTop(container.scrollTop);

    // Use passive listener for better scroll performance
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty deps - attach once on mount

  // Reset scroll position when total items change
  useEffect(() => {
    setScrollTop(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [totalItems]);

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    containerRef,
    scrollToIndex,
    scrollTop,
  };
}
