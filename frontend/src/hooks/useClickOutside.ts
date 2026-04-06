import { useEffect, RefObject } from 'react';

/**
 * Invokes `callback` when a mousedown event occurs outside the element
 * referenced by `ref`. Only active when `enabled` is true.
 *
 * @param ref      - React ref attached to the element to monitor.
 * @param callback - Function to call when an outside click is detected.
 * @param enabled  - Whether the listener is currently active.
 *
 * @example
 * ```tsx
 * const wrapperRef = useRef<HTMLDivElement>(null);
 * useClickOutside(wrapperRef, () => setIsOpen(false), isOpen);
 * ```
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, enabled]);
};
