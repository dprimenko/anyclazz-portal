import React from 'react';
import { ThemeContextProvider } from '@anyclazz/ui';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContextProvider defaultThemeName="anyclazz">
        {children}
    </ThemeContextProvider>
  );
}