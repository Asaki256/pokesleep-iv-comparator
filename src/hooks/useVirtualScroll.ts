import { useState, useEffect, useRef, useCallback } from "react";

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

  // Calculate total height (using useMemo to avoid recalculation)
  const totalHeight = totalItems * itemHeight;

  // Calculate visible range
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  );
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // Generate array of visible item indices (useMemo to avoid recreation)
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(i);
  }

  // Calculate offset for positioning
  const offsetY = startIndex * itemHeight;

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index: number) => {
      if (containerRef.current) {
        const targetScrollTop = Math.max(
          0,
          Math.min(index * itemHeight, totalHeight - containerHeight)
        );
        containerRef.current.scrollTop = targetScrollTop;
        setScrollTop(targetScrollTop);
      }
    },
    [itemHeight, totalHeight, containerHeight]
  );

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Reset scroll position when total items change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
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
