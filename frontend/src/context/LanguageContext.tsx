import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '../i18n/locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Hook to access the current language, setter, and translation function.
 *
 * @throws {Error} If used outside a `LanguageProvider`.
 * @returns `{ language, setLanguage, t }` — the current language, a setter, and the i18n translation function.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * Context provider that manages the active language and exposes
 * a `t(key)` translation function to all descendants.
 *
 * @param props.children - Child components that can consume language context.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
