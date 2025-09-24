import { useState, useCallback, useEffect } from 'react';

const THEMES_KEY = 'thirukkural_themes';

interface ThemeStore {
    [kuralNumber: number]: string[];
}

export const useThemes = () => {
    const [themes, setThemes] = useState<ThemeStore>({});

    useEffect(() => {
        try {
            const storedThemes = localStorage.getItem(THEMES_KEY);
            if (storedThemes) {
                setThemes(JSON.parse(storedThemes));
            }
        } catch (error) {
            console.error("Could not load themes from localStorage", error);
        }
    }, []);

    const addThemesForKural = useCallback((kuralNumber: number, newThemes: string[]) => {
        setThemes(prevThemes => {
            const updatedThemes = {
                ...prevThemes,
                [kuralNumber]: newThemes
            };
            
            try {
                localStorage.setItem(THEMES_KEY, JSON.stringify(updatedThemes));
            } catch (error) {
                console.error("Could not save themes to localStorage", error);
            }
            
            return updatedThemes;
        });
    }, []);

    return { themes, addThemesForKural };
};
