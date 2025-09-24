import React, { useMemo, useState } from 'react';
import { useThemes } from '../hooks/useThemes';
import { Kural } from '../types';
import { uiStrings } from '../uiStrings';
import KuralList from './KuralList';

interface ThemesPageProps {
    allKurals: Kural[];
    onKuralClick: (kural: Kural) => void;
    language: 'en' | 'ta';
}

const ThemesPage: React.FC<ThemesPageProps> = ({ allKurals, onKuralClick, language }) => {
    const { themes: themeStore } = useThemes();
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const currentStrings = uiStrings[language];

    const { uniqueThemes, themeToKuralMap } = useMemo(() => {
        const themeMap: { [theme: string]: number[] } = {};
        Object.entries(themeStore).forEach(([kuralNumStr, themes]) => {
            const kuralNum = parseInt(kuralNumStr, 10);
            // FIX: Add a type guard to ensure `themes` is an array before calling `forEach`.
            // The value comes from localStorage and could be malformed, and this check also
            // satisfies the TypeScript compiler, which inferred `themes` as `unknown`.
            if (Array.isArray(themes)) {
                themes.forEach(theme => {
                    if (!themeMap[theme]) {
                        themeMap[theme] = [];
                    }
                    themeMap[theme].push(kuralNum);
                });
            }
        });
        const unique = Object.keys(themeMap).sort((a, b) => a.localeCompare(b));
        return { uniqueThemes: unique, themeToKuralMap: themeMap };
    }, [themeStore]);
    
    const kuralsForSelectedTheme = useMemo(() => {
        if (!selectedTheme || !themeToKuralMap[selectedTheme]) return [];
        const kuralNumbers = themeToKuralMap[selectedTheme];
        return allKurals.filter(kural => kuralNumbers.includes(kural.number));
    }, [selectedTheme, allKurals, themeToKuralMap]);

    if (selectedTheme) {
        return (
            <div>
                <button onClick={() => setSelectedTheme(null)} className="mb-4 px-4 py-2 bg-highlight rounded-md hover:bg-border-color/50 transition-colors">&larr; {currentStrings.themesPageTitle}</button>
                <KuralList
                    kurals={kuralsForSelectedTheme}
                    onKuralClick={onKuralClick}
                    title={selectedTheme}
                    language={language}
                />
            </div>
        );
    }
    
    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-md border border-highlight">
            <h2 className="text-3xl font-bold text-accent font-serif mb-2 text-center">{currentStrings.themesPageTitle}</h2>
            <p className="text-secondary-text text-center mb-6">{currentStrings.themesPageDescription}</p>

            {uniqueThemes.length > 0 ? (
                <div className="flex flex-wrap gap-3 justify-center">
                    {uniqueThemes.map(theme => (
                        <button
                            key={theme}
                            onClick={() => setSelectedTheme(theme)}
                            className="px-4 py-2 bg-highlight border border-border-color text-primary-text rounded-full hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 shadow-sm"
                        >
                            {theme} <span className="text-xs opacity-70">({themeToKuralMap[theme].length})</span>
                        </button>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-10">
                    <p className="text-secondary-text">{currentStrings.noThemesGenerated}</p>
                </div>
            )}
        </div>
    );
};

export default ThemesPage;
