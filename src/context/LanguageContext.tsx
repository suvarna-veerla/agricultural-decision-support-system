import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Language, type TranslationKey, t } from '../i18n';

interface LanguageContextType { language: Language; setLanguage: (lang: Language) => void; t: (key: TranslationKey) => string; }
const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('smartfarmer_lang');
    return (saved === 'en' || saved === 'te') ? saved : 'te';
  });
  const handleSetLanguage = useCallback((lang: Language) => { setLanguage(lang); localStorage.setItem('smartfarmer_lang', lang); }, []);
  const translate = useCallback((key: TranslationKey) => t(key, language), [language]);
  return <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translate }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
