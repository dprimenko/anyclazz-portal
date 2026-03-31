import { createContext, useContext, type FC, type ReactNode } from 'react';
import type { ui } from './ui';

// null means "no LanguageProvider in the tree" — components will fall back to cookie/default
export const LanguageContext = createContext<keyof typeof ui | null>(null);

export const LanguageProvider: FC<{ lang: keyof typeof ui; children: ReactNode }> = ({ lang, children }) => (
    <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>
);

export function useLanguageContext(): keyof typeof ui | null {
    return useContext(LanguageContext);
}
