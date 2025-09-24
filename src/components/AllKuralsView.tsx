import React, { useMemo } from 'react';
import { ThirukkuralData, Kural } from '../types';
import { uiStrings } from '../uiStrings';

type Language = 'en' | 'ta';

interface AllKuralsViewProps {
    data: ThirukkuralData;
    onKuralClick: (kural: Kural) => void;
    language: Language;
}

const AllKuralsView: React.FC<AllKuralsViewProps> = ({ data, onKuralClick, language }) => {
    const currentStrings = uiStrings[language];

    const allAdhigarams = useMemo(() => {
        const adhigarams: { name: string; id: string }[] = [];
        let adhigaramIndex = 0;
        data.paals.forEach((paal) => {
            paal.iyals.forEach((iyal) => {
                iyal.adhigarams.forEach((adhigaram) => {
                    adhigarams.push({
                        name: `${adhigaramIndex + 1}. ${adhigaram.name[language]}`,
                        id: `adhigaram-${adhigaramIndex}`
                    });
                    adhigaramIndex++;
                });
            });
        });
        return adhigarams;
    }, [data, language]);

    const handleJumpToChapter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const adhigaramId = e.target.value;
        if (adhigaramId) {
            const element = document.getElementById(adhigaramId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };
    
    let adhigaramCounter = 0;

    return (
        <div>
            <div className="sticky top-[68px] z-20 bg-background/90 backdrop-blur-md py-3 mb-6">
                <select
                    onChange={handleJumpToChapter}
                    className="w-full p-3 border border-border-color rounded-lg bg-highlight text-primary-text focus:ring-2 focus:ring-accent/50 focus:outline-none transition-shadow"
                    defaultValue=""
                    aria-label={currentStrings.jumpToChapter}
                >
                    <option value="" disabled>{currentStrings.jumpToChapter}</option>
                    {allAdhigarams.map(adhigaram => (
                        <option key={adhigaram.id} value={adhigaram.id}>
                            {adhigaram.name}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="space-y-12">
                {data.paals.map((paal) => (
                    <section key={paal.name.en}>
                        <h2 className="text-4xl font-bold text-accent font-serif mb-6 pb-2 border-b-2 border-accent/20">{paal.name[language]}</h2>
                        {paal.iyals.map((iyal) => (
                            <section key={iyal.name.en} className="mb-8">
                                <h3 className="text-3xl font-semibold text-primary-text font-serif mb-6">{iyal.name[language]}</h3>
                                {iyal.adhigarams.map((adhigaram) => {
                                    const adhigaramId = `adhigaram-${adhigaramCounter}`;
                                    adhigaramCounter++;
                                    return (
                                        <section 
                                            key={adhigaram.name.en} 
                                            id={adhigaramId} 
                                            className="mb-8 pl-4 border-l-4 border-highlight scroll-mt-40"
                                        >
                                            <h4 className="text-2xl font-semibold text-secondary-text font-serif mb-4">{adhigaram.name[language]}</h4>
                                            <div className="space-y-4">
                                                {adhigaram.kurals.map((kural) => (
                                                    <div 
                                                        key={kural.number} 
                                                        onClick={() => onKuralClick(kural)}
                                                        className="p-4 bg-card-bg rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-highlight"
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-semibold text-accent">Kural {kural.number}</span>
                                                        </div>
                                                        <p className="font-serif text-lg whitespace-pre-line leading-relaxed">{kural.tamil}</p>
                                                        <p className="text-secondary-text mt-1">{kural.translations.en}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}
                            </section>
                        ))}
                    </section>
                ))}
            </div>
        </div>
    );
};

export default AllKuralsView;
