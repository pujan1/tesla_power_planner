import { useState, useEffect } from 'react';

/**
 * Reusable hook to detect if a specific media query matches the current viewport.
 * 
 * @param query - The media query string (e.g., '(max-width: 1024px)').
 * @returns Boolean indicating if the media query matches.
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 1024px)');
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};
