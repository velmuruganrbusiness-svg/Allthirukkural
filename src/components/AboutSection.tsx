import React from 'react';
import { uiStrings } from '../uiStrings';

type Language = 'en' | 'ta';

interface AboutSectionProps {
    language: Language;
}

const aboutContent = {
    en: {
        title: "About the Thirukkural",
        p1: "The Thirukkural, or 'Sacred Couplets', is a timeless Tamil classic authored by the revered poet and philosopher Thiruvalluvar. Comprising 1,330 couplets (kurals), it is one of the most important works in Tamil literature.",
        p2_1: "The text is structured into three books: ",
        aram: "Aram",
        aram_desc: " (Virtue), ",
        porul: "Porul",
        porul_desc: " (Wealth), and ",
        inbam: "Inbam",
        inbam_desc: " (Love). These books provide a comprehensive guide to an ethical, prosperous, and loving life, making its wisdom universally applicable and relevant even today.",
        p3: "This digital archive is dedicated to making the profound wisdom of the Thirukkural accessible to a global audience, with multiple translations and commentaries to explore its rich depth.",
    },
    ta: {
        title: "திருக்குறள் பற்றி",
        p1: "திருக்குறள், அல்லது 'புனித ஈரடிகள்', போற்றப்படும் கவிஞரும் தத்துவஞானியுமான திருவள்ளுவரால் இயற்றப்பட்ட ஒரு காலத்தால் அழியாத தமிழ் செவ்வியல் படைப்பாகும். 1,330 ஈரடிகளைக் (குறள்கள்) கொண்ட இது, தமிழ் இலக்கியத்தின் மிக முக்கியமான படைப்புகளில் ஒன்றாகும்.",
        p2_1: "இந்நூல் ",
        aram: "அறம்",
        aram_desc: ", ",
        porul: "பொருள்",
        porul_desc: ", மற்றும் ",
        inbam: "இன்பம்",
        inbam_desc: " என மூன்று பால்களாகப் பிரிக்கப்பட்டுள்ளது. இந்த பால்கள் ஒரு நெறிமுறை, வளமான மற்றும் அன்பான வாழ்க்கைக்கு ஒரு விரிவான வழிகாட்டியை வழங்குகின்றன, அதன் ஞானத்தை உலகளவில் பொருந்தக்கூடியதாகவும் இன்றும் பொருத்தமானதாகவும் ஆக்குகின்றன.",
        p3: "இந்த டிஜிட்டல் காப்பகம், திருக்குறளின் ஆழ்ந்த ஞானத்தை உலகளாவிய பார்வையாளர்களுக்குக் கிடைக்கச் செய்வதற்காக அர்ப்பணிக்கப்பட்டுள்ளது, அதன் செழுமையான ஆழத்தை ஆராய பல மொழிபெயர்ப்புகள் மற்றும் உரைகளுடன்.",
    }
}

const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
    const content = aboutContent[language];
    const strings = uiStrings[language];
    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-md border border-highlight flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-accent font-serif mb-6 text-center">{content.title}</h2>
            <div className="space-y-4 text-secondary-text leading-relaxed text-center">
                <p>{content.p1}</p>
                <p>
                    {content.p2_1}
                    <strong className="font-semibold text-primary-text">{content.aram}</strong>
                    {content.aram_desc}
                    <strong className="font-semibold text-primary-text">{content.porul}</strong>
                    {content.porul_desc}
                    <strong className="font-semibold text-primary-text">{content.inbam}</strong>
                    {content.inbam_desc}
                </p>
            </div>
            
            <div className="mt-8 text-left">
                <h3 className="text-xl font-bold text-primary-text font-serif mb-4 text-center">{strings.aboutTableTitle}</h3>
                <div className="overflow-x-auto rounded-lg border border-highlight">
                    <table className="w-full min-w-full text-sm">
                        <thead className="bg-highlight">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold text-primary-text text-left">{strings.colSection}</th>
                                <th scope="col" className="px-4 py-3 font-semibold text-primary-text text-left">{strings.colTamilName}</th>
                                <th scope="col" className="px-4 py-3 font-semibold text-primary-text text-center">{strings.colChapters}</th>
                                <th scope="col" className="px-4 py-3 font-semibold text-primary-text text-center">{strings.colKurals}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-highlight bg-card-bg">
                            <tr>
                                <td className="px-4 py-3 text-secondary-text">{aboutContent.en.aram}</td>
                                <td className="px-4 py-3 text-secondary-text">{aboutContent.ta.aram}</td>
                                <td className="px-4 py-3 text-secondary-text text-center">38</td>
                                <td className="px-4 py-3 text-secondary-text text-center">380</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-secondary-text">{aboutContent.en.porul}</td>
                                <td className="px-4 py-3 text-secondary-text">{aboutContent.ta.porul}</td>
                                <td className="px-4 py-3 text-secondary-text text-center">70</td>
                                <td className="px-4 py-3 text-secondary-text text-center">700</td>
                            </tr>
                             <tr>
                                <td className="px-4 py-3 text-secondary-text">{aboutContent.en.inbam}</td>
                                <td className="px-4 py-3 text-secondary-text">{aboutContent.ta.inbam}</td>
                                <td className="px-4 py-3 text-secondary-text text-center">25</td>
                                <td className="px-4 py-3 text-secondary-text text-center">250</td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-highlight">
                            <tr>
                                <th scope="row" colSpan={2} className="px-4 py-3 text-left font-semibold text-primary-text">{strings.total}</th>
                                <td className="px-4 py-3 font-semibold text-primary-text text-center">133</td>
                                <td className="px-4 py-3 font-semibold text-primary-text text-center">1,330</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
