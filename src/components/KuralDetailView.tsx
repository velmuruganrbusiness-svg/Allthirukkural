import React, { useState, useEffect } from 'react';
import { Kural } from '../types';
import { getThemesForKural } from '../services/geminiService';
import { HeartIcon, HeartIconSolid, LoaderIcon, ShareIcon, SparklesIcon, XIcon, SpeakerIcon, InfoIcon } from './Icons';
import { uiStrings } from '../uiStrings';
import { useThemes } from '../hooks/useThemes';

type Language = 'en' | 'ta';

interface KuralDetailViewProps {
    kural: Kural;
    onClose: () => void;
    isFavorite: boolean;
    onToggleFavorite: (kuralNumber: number) => void;
    language: Language;
}

const KuralDetailView: React.FC<KuralDetailViewProps> = ({ kural, onClose, isFavorite, onToggleFavorite, language }) => {
    const [activeTab, setActiveTab] = useState('translations');
    const [themes, setThemes] = useState<string[]>([]);
    const [isLoadingThemes, setIsLoadingThemes] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addThemesForKural } = useThemes();
    const currentStrings = uiStrings[language];
    const [isAudioSupported, setIsAudioSupported] = useState(false);
    const [hasTamilVoice, setHasTamilVoice] = useState(false);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setIsAudioSupported(true);
            const checkVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    const tamilVoice = voices.find(voice => voice.lang === 'ta-IN');
                    setHasTamilVoice(!!tamilVoice);
                    // Once we have the voices, we don't need the listener anymore for this component instance.
                    window.speechSynthesis.onvoiceschanged = null;
                }
            };
            
            window.speechSynthesis.onvoiceschanged = checkVoices;
            checkVoices(); // Initial check in case voices are already loaded

            return () => {
                // Cleanup listener when component unmounts
                if (window.speechSynthesis) {
                    window.speechSynthesis.onvoiceschanged = null;
                }
            };
        }
    }, []);

    const handleGenerateThemes = async () => {
        setIsLoadingThemes(true);
        setError(null);
        try {
            const result = await getThemesForKural(kural);
            setThemes(result.themes);
            addThemesForKural(kural.number, result.themes);
        } catch (err) {
            setError(currentStrings.themesError);
            console.error(err);
        } finally {
            setIsLoadingThemes(false);
        }
    };
    
    const handleShare = () => {
        const shareText = `Kural ${kural.number}:\n\n${kural.tamil}\n\nEnglish: ${kural.translations.en}\n\nExplore more at Thirukkural: The Eternal Wisdom`;
        if (navigator.share) {
            navigator.share({
                title: `Thirukkural - Kural ${kural.number}`,
                text: shareText,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText).then(() => alert(currentStrings.copiedToClipboard));
        }
    }

    const handlePlayAudio = () => {
        if (!isAudioSupported) {
            alert('Sorry, your browser does not support text-to-speech.');
            return;
        }

        // The warning is shown based on the state determined by useEffect
        if (!hasTamilVoice && !sessionStorage.getItem('tamilVoiceWarning')) {
            alert('A Tamil (ta-IN) voice may not be installed on your system. Pronunciation might be incorrect or silent. Please check your OS text-to-speech settings.');
            sessionStorage.setItem('tamilVoiceWarning', 'true');
        }

        const text = kural.tamil.replace(/\n/g, ' ');
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        const tamilVoice = voices.find(voice => voice.lang === 'ta-IN');
        
        if (tamilVoice) {
            utterance.voice = tamilVoice;
        } else {
            // Fallback to lang property, letting the browser try to match
            utterance.lang = 'ta-IN';
        }

        utterance.rate = 0.9;
        window.speechSynthesis.cancel(); // Cancel any previous speech
        window.speechSynthesis.speak(utterance);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-card-bg text-primary-text rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-border-color flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-accent font-serif -mb-1">{kural.adhigaramName[language]}</h2>
                        <span className="text-md font-semibold text-secondary-text">{currentStrings.kural} {kural.number}</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <button onClick={handlePlayAudio} aria-label={currentStrings.listen} className="p-2 rounded-full hover:bg-highlight text-secondary-text hover:text-accent transition-colors">
                            <SpeakerIcon className="w-5 h-5"/>
                        </button>
                        {isAudioSupported && (
                            <div className="tooltip tooltip-header cursor-help p-1">
                                <InfoIcon className="w-5 h-5 text-secondary-text/80" />
                                <span className="tooltiptext">{currentStrings.audioInfo}</span>
                            </div>
                        )}
                        <button onClick={handleShare} className="p-2 rounded-full hover:bg-highlight text-secondary-text hover:text-accent transition-colors"><ShareIcon className="w-5 h-5"/></button>
                        <button onClick={() => onToggleFavorite(kural.number)} className="p-2 rounded-full hover:bg-highlight text-secondary-text hover:text-accent transition-colors">
                            {isFavorite ? <HeartIconSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-highlight"><XIcon className="w-6 h-6"/></button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                     <div className="mb-6 flex justify-center overflow-x-auto">
                        <div className="text-2xl font-serif leading-relaxed text-primary-text py-2">
                            {kural.tamil.split('\n').map((line, index) => (
                                <p key={index} className="whitespace-nowrap">{line}</p>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex border-b border-border-color flex-wrap">
                            <button onClick={() => setActiveTab('translations')} className={`px-4 py-2 text-lg font-semibold ${activeTab === 'translations' ? 'text-accent border-b-2 border-accent' : 'text-secondary-text'}`}>{currentStrings.translations}</button>
                            <button onClick={() => setActiveTab('commentaries')} className={`px-4 py-2 text-lg font-semibold ${activeTab === 'commentaries' ? 'text-accent border-b-2 border-accent' : 'text-secondary-text'}`}>{currentStrings.commentaries}</button>
                        </div>
                        <div className="pt-4">
                            {activeTab === 'translations' && (
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-semibold text-primary-text mb-1">{currentStrings.english}</p>
                                        <p className="text-lg italic text-secondary-text">{kural.translations.en}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-primary-text mb-1">{currentStrings.tamil}</p>
                                        <p className="text-lg italic text-secondary-text">{kural.translations.ta}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-primary-text mb-1">{currentStrings.hindi}</p>
                                        <p className="text-lg italic text-secondary-text">{kural.translations.hi}</p>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'commentaries' && (() => {
                                const allCommentaries = [...kural.commentaries.ta, ...kural.commentaries.en];
                                if (allCommentaries.length === 0) {
                                    return (
                                        <div className="text-center py-8 px-4 bg-highlight rounded-lg">
                                            <p className="text-secondary-text">{currentStrings.noCommentaries}</p>
                                        </div>
                                    );
                                }
                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {allCommentaries.map((c, i) => (
                                            <div key={i} className="bg-background p-3 rounded-md border border-border-color">
                                                <p className="font-semibold text-primary-text">{c.author}</p>
                                                <p className="text-secondary-text">{c.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <div className="bg-highlight p-4 rounded-lg">
                        <button onClick={handleGenerateThemes} disabled={isLoadingThemes} className="w-full flex items-center justify-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors disabled:bg-gray-400">
                           {isLoadingThemes ? <LoaderIcon className="w-5 h-5 animate-spin mr-2" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                           {isLoadingThemes ? currentStrings.generating : currentStrings.generateThemes}
                        </button>
                        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                        {themes.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-primary-text mb-2">{currentStrings.thematicTags}:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {themes.map((theme, index) => (
                                        <span key={index} className="px-3 py-1 bg-card-bg border border-border-color text-secondary-text rounded-full text-sm">{theme}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KuralDetailView;
