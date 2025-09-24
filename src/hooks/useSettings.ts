import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'sepia';
export type FontSize = 'sm' | 'md' | 'lg';

const THEME_KEY = 'thirukkural_theme';
const FONT_SIZE_KEY = 'thirukkural_font_size';

export const useSettings = () => {
    const [theme, setThemeState] = useState<Theme>('light');
    const [fontSize, setFontSizeState] = useState<FontSize>('md');

    useEffect(() => {
        const storedTheme = localStorage.getItem(THEME_KEY) as Theme;
        const storedFontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize;
        
        if (storedTheme && ['light', 'dark', 'sepia'].includes(storedTheme)) {
            setThemeState(storedTheme);
        }
        
        if (storedFontSize && ['sm', 'md', 'lg'].includes(storedFontSize)) {
            setFontSizeState(storedFontSize);
        }
    }, []);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    }, []);
    
    const setFontSize = useCallback((newSize: FontSize) => {
        setFontSizeState(newSize);
        localStorage.setItem(FONT_SIZE_KEY, newSize);
    }, []);

    useEffect(() => {
        const body = document.body;
        const root = document.documentElement;

        // Apply theme class
        body.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
        body.classList.add(`theme-${theme}`);
        
        // Apply font size class
        root.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
        root.classList.add(`font-size-${fontSize}`);

    }, [theme, fontSize]);

    return { theme, setTheme, fontSize, setFontSize };
};
