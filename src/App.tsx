import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Kural, ThirukkuralData, Paal, Iyal } from './types';
import Header from './components/Header';
import NavigationPanel from './components/NavigationPanel';
import KuralList from './components/KuralList';
import KuralDetailView from './components/KuralDetailView';
import KuralOfTheDay from './components/KuralOfTheDay';
import { useFavorites } from './hooks/useFavorites';
import AboutSection from './components/AboutSection';
import AboutThiruvalluvar from './components/AboutThiruvalluvar';
import { uiStrings } from './uiStrings';
import ThemesPage from './components/ThemesPage';
import { LoaderIcon } from './components/Icons';
import Breadcrumb from './components/Breadcrumb';
import { useSettings } from './hooks/useSettings';
import AllKuralsView from './components/AllKuralsView';
import Footer from './components/Footer';

/**
 * Calculates the Levenshtein distance between two strings.
 * This is a measure of the difference between two sequences.
 * @param a The first string.
 * @param b The second string.
 * @returns The Levenshtein distance.
 */
const levenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
        matrix[0][i] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j - 1][i] + 1,     // deletion
                matrix[j][i - 1] + 1,     // insertion
                matrix[j - 1][i - 1] + cost // substitution
            );
        }
    }

    return matrix[b.length][a.length];
};


type Language = 'en' | 'ta';
type ViewMode = 'home' | 'list' | 'favorites' | 'themes' | 'allKurals';

const App: React.FC = () => {
    const [data, setData] = useState<ThirukkuralData | null>(null);
    const [selectedAdhigaramIndex, setSelectedAdhigaramIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedKural, setSelectedKural] = useState<Kural | null>(null);
    const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
    const [language, setLanguage] = useState<Language>('ta');
    const [viewMode, setViewMode] = useState<ViewMode>('home');
    const { favorites, toggleFavorite } = useFavorites();
    const { theme, setTheme, fontSize, setFontSize } = useSettings();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const files = ['/public/data/aram.json', '/public/data/aram2.json', '/public/data/aram3.json', '/public/data/aram4.json', '/public/data/porul.json', '/public/data/inbam.json'];
                const responses = await Promise.all(files.map(file => fetch(file).catch(e => {
                    console.warn(`Could not fetch ${file}, skipping. Error: ${e.message}`);
                    return null; // Return null for failed fetches
                })));

                const successfulResponses = responses.filter(res => res && res.ok);

                if (successfulResponses.length === 0 && responses.length > 0) {
                     throw new Error(`Failed to fetch any Thirukkural data.`);
                }
                
                const jsonData: ThirukkuralData[] = await Promise.all(successfulResponses.map(res => res!.json()));

                // Intelligent merging of data from multiple files
                const paalMap = new Map<string, Paal>();

                for (const dataChunk of jsonData) {
                    if (!dataChunk || !dataChunk.paals) continue;
                    for (const paal of dataChunk.paals) {
                        if (!paalMap.has(paal.name.en)) {
                            // If paal doesn't exist, create it with a deep copy of its structure
                            paalMap.set(paal.name.en, JSON.parse(JSON.stringify(paal)));
                        } else {
                            // If paal exists, merge its iyals
                            const existingPaal = paalMap.get(paal.name.en)!;
                            const iyalMap = new Map<string, Iyal>(existingPaal.iyals.map(i => [i.name.en, i]));

                            for (const iyal of paal.iyals) {
                                if (!iyalMap.has(iyal.name.en)) {
                                    // If iyal doesn't exist in the paal, add a deep copy
                                    existingPaal.iyals.push(JSON.parse(JSON.stringify(iyal)));
                                } else {
                                    // If iyal exists, merge adhigarams into it
                                    const existingIyal = iyalMap.get(iyal.name.en)!;
                                    existingIyal.adhigarams.push(...iyal.adhigarams);
                                }
                            }
                        }
                    }
                }
                
                const combinedData: ThirukkuralData = {
                    paals: Array.from(paalMap.values())
                };

                setData(combinedData);
            } catch (err) {
                console.error("Failed to load data", err);
            }
        };

        fetchAllData();
    }, []);
    
    useEffect(() => {
        document.title = uiStrings[language].siteTitle;
    }, [language]);


    const allKurals = useMemo(() => {
        if (!data) return [];
        return data.paals.flatMap(p => p.iyals.flatMap(i => i.adhigarams.flatMap(a => a.kurals)));
    }, [data]);

    const favoriteKurals = useMemo(() => {
        return allKurals.filter(kural => favorites.includes(kural.number));
    }, [favorites, allKurals]);

    const kuralOfTheDay = useMemo<Kural | null>(() => {
        if (allKurals.length > 0) {
            // Use date for a stable "Kural of the Day"
            const dayIndex = new Date().getDate() % allKurals.length;
            return allKurals[dayIndex];
        }
        return null;
    }, [allKurals]);

    const filteredKurals = useMemo(() => {
        if (!searchQuery) return [];
        const lowerCaseQuery = searchQuery.toLowerCase();

        // Exact number search
        if (!isNaN(Number(lowerCaseQuery))) {
            const kural = allKurals.find(k => k.number === Number(lowerCaseQuery));
            return kural ? [kural] : [];
        }

        const queryWords = lowerCaseQuery.split(/\s+/).filter(Boolean);
        if (queryWords.length === 0) return [];

        const results = allKurals.map(kural => {
            const searchableText = [
                kural.tamil,
                kural.translations.en,
                kural.translations.hi,
                kural.translations.ta,
                kural.adhigaramName.en,
                kural.adhigaramName.ta
            ].join(' ').toLowerCase();

            // Boost score for direct substring match of the whole query
            if (searchableText.includes(lowerCaseQuery)) {
                const startIndex = searchableText.indexOf(lowerCaseQuery);
                // Lower start index is more relevant. Score is highly boosted.
                return { kural, score: -100 + startIndex * 0.01 };
            }

            let totalDistance = 0;
            let matches = 0;

            const textWords = [...new Set(searchableText.split(/\s+/))]; // Use unique words for performance

            queryWords.forEach(queryWord => {
                let minDistanceForQueryWord = Infinity;
                
                for (const textWord of textWords) {
                    // Prioritize substring matches for individual words
                    if (textWord.includes(queryWord)) {
                        minDistanceForQueryWord = 0;
                        break; 
                    }
                    const distance = levenshteinDistance(queryWord, textWord);
                    if (distance < minDistanceForQueryWord) {
                        minDistanceForQueryWord = distance;
                    }
                }
                
                // Allow about 1 typo for every 4 characters
                const threshold = Math.max(1, Math.floor(queryWord.length / 4));
                if (minDistanceForQueryWord <= threshold) {
                    totalDistance += minDistanceForQueryWord;
                    matches++;
                }
            });

            if (matches === 0) return { kural, score: Infinity };

            // Score favors more matched words and lower average distance
            const matchRatio = matches / queryWords.length;
            const averageDistance = totalDistance / matches;
            
            // Heavily penalize for not matching all words
            const score = (1 - matchRatio) * 10 + averageDistance;

            return { kural, score };
        });

        return results
            .filter(item => item.score !== Infinity)
            .sort((a, b) => a.score - b.score)
            .map(item => item.kural);

    }, [searchQuery, allKurals]);

    const currentAdhigaram = useMemo(() => {
        if (selectedAdhigaramIndex === null || !data) return null;
        let adhigaramCount = 0;
        for (const paal of data.paals) {
            for (const iyal of paal.iyals) {
                if (selectedAdhigaramIndex < adhigaramCount + iyal.adhigarams.length) {
                    return iyal.adhigarams[selectedAdhigaramIndex - adhigaramCount];
                }
                adhigaramCount += iyal.adhigarams.length;
            }
        }
        return null;
    }, [selectedAdhigaramIndex, data]);
    
    const handleClearSelection = useCallback(() => {
        setSelectedAdhigaramIndex(null);
        setSearchQuery('');
        setViewMode('home');
    }, []);

    const handleSearch = useCallback((query: string) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            setSearchQuery(trimmedQuery);
            setSelectedAdhigaramIndex(null);
            setViewMode('list');
        } else {
            handleClearSelection();
        }
    }, [handleClearSelection]);

    const handleSelectAdhigaram = useCallback((index: number) => {
        setSelectedAdhigaramIndex(index);
        setSearchQuery('');
        setIsNavOpen(false);
        setViewMode('list');
    }, []);
    
    const handleSelectKural = useCallback((kural: Kural) => {
        setSelectedKural(kural);
    }, []);

    const handleShowFavorites = useCallback(() => {
        setViewMode('favorites');
        setIsNavOpen(false);
        setSearchQuery('');
        setSelectedAdhigaramIndex(null);
    }, []);
    
    const handleShowThemes = useCallback(() => {
        setViewMode('themes');
        setIsNavOpen(false);
        setSearchQuery('');
        setSelectedAdhigaramIndex(null);
    }, []);
    
    const handleShowAllKurals = useCallback(() => {
        setViewMode('allKurals');
        setIsNavOpen(false);
        setSearchQuery('');
        setSelectedAdhigaramIndex(null);
    }, []);

    const breadcrumbPath = useMemo(() => {
        if (!data) return [];
        
        const homeItem = { label: uiStrings[language].home, onClick: handleClearSelection };
    
        switch(viewMode) {
            case 'home':
                return []; // No breadcrumbs on home
            case 'favorites':
                return [homeItem, { label: uiStrings[language].myFavorites }];
            case 'themes':
                return [homeItem, { label: uiStrings[language].exploreThemes }];
            case 'allKurals':
                return [homeItem, { label: uiStrings[language].fullThirukkural }];
            case 'list':
                if (searchQuery) {
                    return [homeItem, { label: uiStrings[language].searchResultsTitle }];
                }
                if (selectedAdhigaramIndex !== null) {
                    let adhigaramCount = 0;
                    for (const paal of data.paals) {
                        for (const iyal of paal.iyals) {
                            if (selectedAdhigaramIndex < adhigaramCount + iyal.adhigarams.length) {
                                const adhigaram = iyal.adhigarams[selectedAdhigaramIndex - adhigaramCount];
                                return [
                                    homeItem,
                                    { label: paal.name[language] },
                                    { label: iyal.name[language] },
                                    { label: adhigaram.name[language] }
                                ];
                            }
                            adhigaramCount += iyal.adhigarams.length;
                        }
                    }
                }
                return [];
            default:
                return [];
        }
    }, [data, language, viewMode, searchQuery, selectedAdhigaramIndex, handleClearSelection]);


    const renderMainContent = () => {
        if (!data) {
            return (
                <div className="flex justify-center items-center h-64">
                    <LoaderIcon className="w-12 h-12 animate-spin text-accent" />
                </div>
            );
        }

        switch (viewMode) {
            case 'favorites':
                if (favoriteKurals.length === 0) {
                    return (
                         <div className="text-center py-10 bg-card-bg p-6 rounded-lg shadow-md border border-highlight">
                            <h2 className="text-2xl font-semibold mb-2">{uiStrings[language].noFavoritesTitle}</h2>
                            <p className="text-secondary-text">{uiStrings[language].noFavoritesDescription}</p>
                        </div>
                    );
                }
                return (
                    <KuralList
                        kurals={favoriteKurals}
                        onKuralClick={handleSelectKural}
                        title={uiStrings[language].myFavorites}
                        language={language}
                    />
                );
            case 'themes':
                return (
                    <ThemesPage 
                        allKurals={allKurals}
                        onKuralClick={handleSelectKural}
                        language={language}
                    />
                );
            case 'allKurals':
                return (
                    <AllKuralsView 
                        data={data}
                        onKuralClick={handleSelectKural}
                        language={language}
                    />
                );
            case 'list':
                 return (
                     <KuralList 
                        kurals={searchQuery ? filteredKurals : currentAdhigaram?.kurals || []} 
                        onKuralClick={handleSelectKural}
                        title={searchQuery 
                            ? `${uiStrings[language].searchResultsFor} "${searchQuery}"` 
                            : currentAdhigaram?.name[language]}
                        language={language}
                    />
                 );
            case 'home':
            default:
                return (
                    <div className="space-y-8">
                        {kuralOfTheDay && <KuralOfTheDay kural={kuralOfTheDay} onKuralClick={handleSelectKural} language={language} />}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <AboutSection language={language} />
                            <AboutThiruvalluvar language={language} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen font-sans text-primary-text bg-background">
            <Header 
                onSearch={handleSearch} 
                onToggleNav={() => setIsNavOpen(!isNavOpen)} 
                onHomeClick={handleClearSelection}
                language={language}
                setLanguage={setLanguage}
                theme={theme}
                setTheme={setTheme}
                fontSize={fontSize}
                setFontSize={setFontSize}
            />
            <div className="flex flex-col flex-1">
                <div className="flex flex-1">
                    <NavigationPanel 
                        data={data} 
                        onSelectAdhigaram={handleSelectAdhigaram}
                        onShowFavorites={handleShowFavorites}
                        onShowThemes={handleShowThemes}
                        onShowAllKurals={handleShowAllKurals}
                        isOpen={isNavOpen}
                        onClose={() => setIsNavOpen(false)}
                        language={language}
                    />
                    <main className="flex-1 p-4 md:p-8 transition-all duration-300 lg:ml-80">
                        <Breadcrumb items={breadcrumbPath} />
                        {renderMainContent()}
                        <Footer />
                    </main>
                </div>
            </div>
            {selectedKural && (
                <KuralDetailView 
                    kural={selectedKural} 
                    onClose={() => setSelectedKural(null)}
                    isFavorite={favorites.includes(selectedKural.number)}
                    onToggleFavorite={toggleFavorite}
                    language={language}
                />
            )}
        </div>
    );
};

export default App;