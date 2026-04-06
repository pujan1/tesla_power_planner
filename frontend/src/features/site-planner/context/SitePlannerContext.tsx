import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SitePlannerContextType {
  is3D: boolean;
  setIs3D: (value: boolean) => void;
  isManualMode: boolean;
  setIsManualMode: (value: boolean) => void;
}


const SitePlannerContext = createContext<SitePlannerContextType | undefined>(undefined);

/**
 * Context provider for the site planner's global UI state (e.g., 2D/3D toggle).
 *
 * @param props.children - Child components that can consume planner context.
 */
export const SitePlannerProvider = ({ children }: { children: ReactNode }) => {
  const [is3D, setIs3D] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  return (
    <SitePlannerContext.Provider value={{ is3D, setIs3D, isManualMode, setIsManualMode }}>
      {children}
    </SitePlannerContext.Provider>
  );
};


/**
 * Hook to access the site planner's global UI state (`is3D`, `setIs3D`).
 *
 * @throws {Error} If used outside a `SitePlannerProvider`.
 * @returns `{ is3D, setIs3D }` — the current view mode and its setter.
 */
export const useSitePlannerContext = () => {
  const context = useContext(SitePlannerContext);
  if (context === undefined) {
    throw new Error('useSitePlannerContext must be used within a SitePlannerProvider');
  }
  return context;
};
