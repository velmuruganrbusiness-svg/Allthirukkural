import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon, SearchIcon, SettingsIcon, LanguageSwapIcon } from './Icons';
import { uiStrings } from '../uiStrings';
import SettingsPanel, { Theme, FontSize } from './SettingsPanel';

type Language = 'en' | 'ta';

interface HeaderProps {
    onSearch: (query: string) => void;
    onToggleNav: () => void;
    onHomeClick: () => void;
    language: Language;
    setLanguage: (language: Language) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onSearch, onToggleNav, onHomeClick, language, setLanguage,
    theme, setTheme, fontSize, setFontSize 
}) => {
    const [query, setQuery] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md shadow-sm border-b border-border-color">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={onToggleNav} className="lg:hidden mr-2 p-2 rounded-full hover:bg-highlight">
                         <MenuIcon className="h-6 w-6 text-primary-text" />
                    </button>
                    <h1 onClick={onHomeClick} className="text-xl md:text-2xl font-bold text-accent cursor-pointer font-serif">
                        {uiStrings[language].headerTitle}
                    </h1>
                </div>
                
                <div className="flex-1 flex justify-center px-4">
                    <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={uiStrings[language].searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 bg-highlight border border-border-color rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-primary-text"
                        />
                         <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <SearchIcon className="w-5 h-5 text-secondary-text" />
                        </div>
                    </form>
                </div>

                <div className="flex items-center space-x-2">
                     <button 
                        onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                        className="flex items-center space-x-2 px-3 py-1.5 border border-accent text-accent rounded-full text-sm hover:bg-accent/10 transition-colors font-semibold"
                    >
                        <LanguageSwapIcon className="w-5 h-5" />
                        <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
                    </button>
                    <div className="relative" ref={settingsRef}>
                        <button 
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                            className="p-2 rounded-full hover:bg-highlight"
                            aria-label="Settings"
                        >
                            <SettingsIcon className="w-6 h-6 text-primary-text" />
                        </button>
                        {isSettingsOpen && (
                            <SettingsPanel 
                                theme={theme}
                                setTheme={setTheme}
                                fontSize={fontSize}
                                setFontSize={setFontSize}
                                language={language}
                                onClose={() => setIsSettingsOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;