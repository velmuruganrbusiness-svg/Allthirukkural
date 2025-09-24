import React from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { uiStrings } from '../uiStrings';

export type Theme = 'light' | 'dark' | 'sepia';
export type FontSize = 'sm' | 'md' | 'lg';

interface SettingsPanelProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    language: 'en' | 'ta';
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ theme, setTheme, fontSize, setFontSize, language, onClose }) => {
    const currentStrings = uiStrings[language];
    
    const getActiveClasses = (isActive: boolean) => {
        return isActive ? 'bg-accent text-white' : 'bg-highlight hover:bg-border-color/50';
    };

    return (
        <div 
            className="absolute top-full right-0 mt-2 w-64 bg-card-bg rounded-lg shadow-2xl border border-border-color z-50 p-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-secondary-text mb-2">{currentStrings.theme}</h3>
                <div className="flex justify-around bg-highlight p-1 rounded-lg">
                     <button
                        onClick={() => setTheme('light')}
                        className={`w-full flex justify-center items-center p-2 rounded-md transition-colors ${getActiveClasses(theme === 'light')}`}
                        aria-label={currentStrings.light}
                    >
                        <SunIcon className="w-5 h-5 mr-1"/> {currentStrings.light}
                    </button>
                     <button
                        onClick={() => setTheme('dark')}
                        className={`w-full flex justify-center items-center p-2 rounded-md transition-colors ${getActiveClasses(theme === 'dark')}`}
                        aria-label={currentStrings.dark}
                    >
                        <MoonIcon className="w-5 h-5 mr-1" /> {currentStrings.dark}
                    </button>
                     <button
                        onClick={() => setTheme('sepia')}
                        className={`w-full p-2 rounded-md transition-colors ${getActiveClasses(theme === 'sepia')}`}
                        aria-label={currentStrings.sepia}
                    >
                       {currentStrings.sepia}
                    </button>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-secondary-text mb-2">{currentStrings.fontSize}</h3>
                 <div className="flex justify-around bg-highlight p-1 rounded-lg">
                     <button
                        onClick={() => setFontSize('sm')}
                        className={`w-full p-2 rounded-md transition-colors font-semibold ${getActiveClasses(fontSize === 'sm')}`}
                    >
                        A
                    </button>
                     <button
                        onClick={() => setFontSize('md')}
                        className={`w-full p-2 rounded-md transition-colors font-semibold text-lg ${getActiveClasses(fontSize === 'md')}`}
                    >
                        A
                    </button>
                     <button
                        onClick={() => setFontSize('lg')}
                        className={`w-full p-2 rounded-md transition-colors font-semibold text-xl ${getActiveClasses(fontSize === 'lg')}`}
                    >
                        A
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
