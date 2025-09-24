import React from 'react';
import { Kural } from '../types';
import { uiStrings } from '../uiStrings';

type Language = 'en' | 'ta';

interface KuralListProps {
    kurals: Kural[];
    onKuralClick: (kural: Kural) => void;
    title?: string;
    language: Language;
}

const KuralList: React.FC<KuralListProps> = ({ kurals, onKuralClick, title, language }) => {
    const currentStrings = uiStrings[language];
    if (kurals.length === 0 && title?.startsWith(currentStrings.searchResultsFor)) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                <p className="text-secondary-text">{currentStrings.noResultsFound}</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {title && <h2 className="text-3xl font-bold text-accent font-serif mb-6 pb-2 border-b-2 border-accent/20">{title}</h2>}
            {kurals.map((kural) => (
                <div 
                    key={kural.number} 
                    onClick={() => onKuralClick(kural)}
                    className="p-4 bg-card-bg rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-highlight"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-accent">Kural {kural.number}</span>
                        <span className="text-sm text-secondary-text">{kural.adhigaramName[language]}</span>
                    </div>
                    <p className="font-serif text-lg whitespace-pre-line leading-relaxed">{kural.tamil}</p>
                    <p className="text-secondary-text mt-1">{kural.translations.en}</p>
                </div>
            ))}
        </div>
    );
};

export default KuralList;
