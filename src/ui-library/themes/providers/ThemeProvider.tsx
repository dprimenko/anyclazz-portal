import { type ComponentType, createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { type DefaultTheme, ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes } from '../brands';

interface ThemeContextValue {
	themeName: string;
	theme: DefaultTheme;
	switchTheme: (themeName: string) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
// @ts-ignore
const getTheme = (themeName: string): DefaultTheme => themes[themeName] ?? themes.docline;

export interface ThemeProviderProps {
	children: ReactNode;
	theme: DefaultTheme;
}

export interface ThemeContextProviderProps {
	children: ReactNode;
	defaultThemeName?: string;
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
	return (
		<StyledThemeProvider theme={theme}>
			{children}
		</StyledThemeProvider>
	);
}

export function ThemeContextProvider({ children, defaultThemeName = 'anyclazz' }: ThemeContextProviderProps) {
	const [themeName, setThemeName] = useState<string>(defaultThemeName);
	const theme = getTheme(themeName);

	const switchTheme = (newThemeName: string) => {
		setThemeName(newThemeName);
	};

	useEffect(() => {
		setThemeName(defaultThemeName);
	}, [defaultThemeName]);

	return (
		<ThemeContext.Provider value={{ themeName, theme, switchTheme }}>
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}

export const withThemeProvider = <P extends object>(WrappedComponent: ComponentType<P>) => {
	return function WithThemeProviderComponent(props: P) {
		const { themeName } = useThemeContext();
		return (
			<ThemeContextProvider defaultThemeName={themeName}>
				<WrappedComponent {...props} />
			</ThemeContextProvider>
		);
	};
};

export const useThemeContext = () => {
	const themeContext = useContext(ThemeContext);

	if (themeContext === undefined) {
		throw new Error('useThemeContext must be inside a ThemeProvider');
	}

	return themeContext;
};