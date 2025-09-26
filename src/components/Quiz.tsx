import React, { useState, useEffect, useCallback } from 'react';
import { Kural } from '../types';
import { uiStrings } from '../uiStrings';
import { TrophyIcon } from './Icons';

type Language = 'en' | 'ta';

interface QuizProps {
    aramKurals: Kural[];
    language: Language;
}

interface QuizQuestion {
    kural: Kural;
    options: Kural[];
    correctAnswerNumber: number;
}

const shuffleArray = (array: Kural[]): Kural[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const Quiz: React.FC<QuizProps> = ({ aramKurals, language }) => {
    const currentStrings = uiStrings[language];
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const generateQuestions = useCallback(() => {
        if (aramKurals.length < 4) return; // Not enough Kurals to generate a question with 3 wrong options.
        
        const shuffledKurals = shuffleArray(aramKurals);
        const selectedKurals = shuffledKurals.slice(0, 10);

        const questions = selectedKurals.map(correctKural => {
            const otherKurals = shuffledKurals.filter(k => k.number !== correctKural.number);
            const wrongOptions = shuffleArray(otherKurals).slice(0, 3);
            const options = shuffleArray([correctKural, ...wrongOptions]);

            return {
                kural: correctKural,
                options: options,
                correctAnswerNumber: correctKural.number
            };
        });

        setQuizQuestions(questions);
    }, [aramKurals]);

    useEffect(() => {
        generateQuestions();
    }, [generateQuestions]);

    const handleAnswerClick = (selectedKural: Kural) => {
        if (selectedAnswer !== null) return; // Prevent multiple clicks

        const correct = selectedKural.number === quizQuestions[currentQuestionIndex].correctAnswerNumber;
        setSelectedAnswer(selectedKural.number);
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex < quizQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setQuizEnded(true);
            }
        }, 1500);
    };
    
    const handlePlayAgain = () => {
        generateQuestions();
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizEnded(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    if (quizQuestions.length === 0) {
        return <div>Loading Quiz...</div>;
    }
    
    if (quizEnded) {
        return (
            <div className="text-center py-10 bg-card-bg p-6 rounded-lg shadow-xl border border-highlight flex flex-col items-center animate-fade-in">
                <TrophyIcon className="w-24 h-24 text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold text-accent font-serif mb-2">{currentStrings.quizResults}</h2>
                <p className="text-xl text-secondary-text mb-4">{currentStrings.victoryMessage}</p>
                <p className="text-4xl font-bold text-primary-text my-4">
                    {currentStrings.yourScore}: {score} / {quizQuestions.length}
                </p>
                <button 
                    onClick={handlePlayAgain}
                    className="mt-6 px-8 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors shadow-sm hover:shadow-md text-lg font-semibold"
                >
                    {currentStrings.playAgain}
                </button>
            </div>
        );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];

    const getButtonClass = (kuralNumber: number) => {
        if (selectedAnswer === null) {
            return 'bg-highlight hover:bg-border-color/50';
        }
        if (kuralNumber === currentQuestion.correctAnswerNumber) {
            return 'bg-green-500 text-white';
        }
        if (kuralNumber === selectedAnswer) {
            return 'bg-red-500 text-white';
        }
        return 'bg-highlight opacity-60';
    };

    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-md border border-highlight">
            <h2 className="text-3xl font-bold text-accent font-serif mb-4 text-center">{currentStrings.quizTitle}</h2>
            <div className="mb-6 text-center text-secondary-text font-semibold">
                {currentStrings.question} {currentQuestionIndex + 1} {currentStrings.of} {quizQuestions.length}
            </div>
            
            <div className="text-center mb-6">
                <p className="text-lg text-primary-text mb-2">{currentStrings.whichKural}</p>
                 <p className="text-2xl font-serif whitespace-pre-line leading-relaxed text-primary-text">{currentQuestion.kural.tamil}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map(option => (
                    <button
                        key={option.number}
                        onClick={() => handleAnswerClick(option)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-lg text-left transition-all duration-300 transform ${getButtonClass(option.number)} ${selectedAnswer === null ? 'hover:scale-105' : ''}`}
                    >
                        <p className="italic text-secondary-text">{option.translations[language]}</p>
                    </button>
                ))}
            </div>
             {isCorrect !== null && (
                <div className={`mt-6 text-center text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? currentStrings.correct : currentStrings.wrong}
                </div>
            )}
        </div>
    );
};

export default Quiz;