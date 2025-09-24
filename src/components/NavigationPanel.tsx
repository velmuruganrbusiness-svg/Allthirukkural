import React, { useState } from 'react';
import { ThirukkuralData } from '../types';
import { ChevronDownIcon, ChevronRightIcon, XIcon, HeartIcon, TagIcon, BookOpenIcon } from './Icons';
import { uiStrings } from '../uiStrings';

type Language = 'en' | 'ta';

interface NavigationPanelProps {
    data: ThirukkuralData | null;
    onSelectAdhigaram: (index: number) => void;
    onShowFavorites: () => void;
    onShowThemes: () => void;
    onShowAllKurals: () => void;
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ data, onSelectAdhigaram, onShowFavorites, onShowThemes, onShowAllKurals, isOpen, onClose, language }) => {
    const [openPaals, setOpenPaals] = useState<number[]>([0]);
    const [openIyals, setOpenIyals] = useState<string[]>(['0-0']); 

    const togglePaal = (index: number) => {
        setOpenPaals(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleIyal = (paalIndex: number, iyalIndex: number) => {
        const key = `${paalIndex}-${iyalIndex}`;
        setOpenIyals(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };
    
    const currentStrings = uiStrings[language];

    const content = (
        <div className="h-full bg-highlight p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-lg font-bold text-accent">{currentStrings.navigation}</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                    <XIcon className="w-6 h-6"/>
                </button>
            </div>
            <div className="mb-4 border-b border-border-color pb-4">
                <button onClick={onShowFavorites} className="w-full flex items-center p-2 text-left font-semibold text-lg hover:bg-border-color/50 rounded-md transition-colors">
                    <HeartIcon className="w-5 h-5 mr-3 text-accent" />
                    <span>{currentStrings.myFavorites}</span>
                </button>
                 <button onClick={onShowAllKurals} className="w-full flex items-center p-2 text-left font-semibold text-lg hover:bg-border-color/50 rounded-md transition-colors mt-1">
                    <BookOpenIcon className="w-5 h-5 mr-3 text-accent" />
                    <span>{currentStrings.fullThirukkural}</span>
                </button>
                <button onClick={onShowThemes} className="w-full flex items-center p-2 text-left font-semibold text-lg hover:bg-border-color/50 rounded-md transition-colors mt-1">
                    <TagIcon className="w-5 h-5 mr-3 text-accent" />
                    <span>{currentStrings.exploreThemes}</span>
                </button>
            </div>
            {data && (() => {
                const navItems = [];
                let cumulativeAdhigaramCount = 0;

                for (let paalIndex = 0; paalIndex < data.paals.length; paalIndex++) {
                    const paal = data.paals[paalIndex];
                    const isPaalOpen = openPaals.includes(paalIndex);
                    
                    const iyalCount = paal.iyals.length;
                    const adhigaramCount = paal.iyals.reduce((sum, iyal) => sum + iyal.adhigarams.length, 0);

                    const iyalElements = [];
                    for (let iyalIndex = 0; iyalIndex < paal.iyals.length; iyalIndex++) {
                        const iyal = paal.iyals[iyalIndex];
                        const iyalKey = `${paalIndex}-${iyalIndex}`;
                        const isIyalOpen = openIyals.includes(iyalKey);
                        const adhigaramBaseIndex = cumulativeAdhigaramCount;

                        const adhigaramElements = [];
                        if (isIyalOpen) {
                            for (let adhigaramIndex = 0; adhigaramIndex < iyal.adhigarams.length; adhigaramIndex++) {
                                const adhigaram = iyal.adhigarams[adhigaramIndex];
                                const currentIndex = adhigaramBaseIndex + adhigaramIndex;
                                adhigaramElements.push(
                                    <li key={adhigaramIndex}>
                                        <button onClick={() => onSelectAdhigaram(currentIndex)} className="w-full text-left p-2 text-secondary-text hover:text-primary-text hover:bg-border-color/50 rounded-md transition-colors">
                                            {adhigaram.name[language]}
                                        </button>
                                    </li>
                                );
                            }
                        }
                        
                        iyalElements.push(
                            <div key={iyalKey} className="mt-1">
                                <button onClick={() => toggleIyal(paalIndex, iyalIndex)} className="w-full text-left font-semibold text-md p-2 rounded-md hover:bg-border-color/50 flex justify-between items-center">
                                    <span>{iyal.name[language]}</span>
                                    {isIyalOpen ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
                                </button>
                                {isIyalOpen && (
                                    <ul className="pl-3 border-l-2 border-accent/30 ml-2">
                                        {adhigaramElements}
                                    </ul>
                                )}
                            </div>
                        );

                        cumulativeAdhigaramCount += iyal.adhigarams.length;
                    }
                    
                    navItems.push(
                        <div key={paalIndex} className="mb-2">
                            <button onClick={() => togglePaal(paalIndex)} className="w-full p-2 rounded-md hover:bg-border-color/50 flex justify-between items-center">
                                <div className="flex flex-col text-left">
                                    <span className="font-bold text-lg">{paal.name[language]}</span>
                                    <span className="text-xs font-normal text-secondary-text">
                                        {iyalCount} {currentStrings.sections}, {adhigaramCount} {currentStrings.chapters}
                                    </span>
                                </div>
                                {isPaalOpen ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
                            </button>
                            {isPaalOpen && (
                                <div className="pl-2">
                                    {iyalElements}
                                </div>
                            )}
                        </div>
                    );
                }
                return navItems;
            })()}
        </div>
    );
    
    return (
        <>
            <div className={`fixed inset-0 z-40 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden`}>
                <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
                <div className="relative w-80 max-w-[80vw] h-full bg-highlight shadow-xl">
                    {content}
                </div>
            </div>
            <aside className="hidden lg:block fixed top-0 left-0 h-screen w-80 pt-16">
                 {content}
            </aside>
        </>
    );
};

export default NavigationPanel;
