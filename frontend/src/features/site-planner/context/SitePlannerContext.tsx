import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SitePlannerContextType {
  is3D: boolean;
  setIs3D: (value: boolean) => void;
}

const SitePlannerContext = createContext<SitePlannerContextType | undefined>(undefined);

export const SitePlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [is3D, setIs3D] = useState(false);

  return (
    <SitePlannerContext.Provider value={{ is3D, setIs3D }}>
      {children}
    </SitePlannerContext.Provider>
  );
};

export const useSitePlannerContext = () => {
  const context = useContext(SitePlannerContext);
  if (context === undefined) {
    throw new Error('useSitePlannerContext must be used within a SitePlannerProvider');
  }
  return context;
};
