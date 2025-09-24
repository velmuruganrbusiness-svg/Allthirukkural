import React from 'react';
import { Kural } from '../types';
import { uiStrings } from '../uiStrings';

type Language = 'en' | 'ta';

interface KuralOfTheDayProps {
    kural: Kural;
    onKuralClick: (kural: Kural) => void;
    language: Language;
}

const KuralOfTheDay: React.FC<KuralOfTheDayProps> = ({ kural, onKuralClick, language }) => {
    const currentStrings = uiStrings[language];
    return (
        <div className="bg-card-bg p-6 md:p-8 rounded-lg shadow-md border border-highlight">
            <h2 className="text-2xl md:text-3xl font-bold text-accent font-serif mb-4 text-center">{currentStrings.kuralOfTheDay}</h2>
            <div className="text-center mb-6">
                 <p className="text-xl md:text-2xl font-serif whitespace-pre-line leading-relaxed text-primary-text">{kural.tamil}</p>
            </div>
            <p className="text-md md:text-lg italic text-secondary-text text-center mb-6">{kural.translations.en}</p>
            <div className="text-center">
                 <button 
                    onClick={() => onKuralClick(kural)}
                    className="px-6 py-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors shadow-sm hover:shadow-md"
                >
                    {currentStrings.viewDetails}
                </button>
            </div>
        </div>
    );
};

export default KuralOfTheDay;
