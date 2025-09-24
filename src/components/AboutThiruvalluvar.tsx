import React from 'react';
import { uiStrings } from '../uiStrings';


type Language = 'en' | 'ta';

interface AboutThiruvalluvarProps {
    language: Language;
}

const AboutThiruvalluvar: React.FC<AboutThiruvalluvarProps> = ({ language }) => {
    const content = uiStrings[language];
    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-md border border-highlight flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-accent font-serif mb-6 text-center">{content.aboutThiruvalluvarTitle}</h2>
            <img 
                src="/public/assets/thiruvalluvar.svg" 
                width="150" 
                height="150" 
                alt="A portrait of the poet Thiruvalluvar"
                className="object-cover rounded-full mb-6 border-4 border-accent/20 shadow-lg"
             />
            <div className="space-y-4 text-secondary-text leading-relaxed text-center">
                <p>{content.thiruvalluvarP1}</p>
                <p>{content.thiruvalluvarP2}</p>
            </div>
        </div>
    );
};

export default AboutThiruvalluvar;