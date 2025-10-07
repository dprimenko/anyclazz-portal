import React, { useState, useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [ThemeContextProvider, setThemeContextProvider] = useState<any>(null);

  useEffect(() => {
    import('@anyclazz/ui').then((module) => {
      setThemeContextProvider(() => module.ThemeContextProvider);
    });
  }, []);

  if (!ThemeContextProvider) {
    return <>{children}</>;
  }

  return (
    <ThemeContextProvider defaultThemeName="anyclazz">
      {children}
    </ThemeContextProvider>
  );
}