export interface Translation {
    en: string;
    hi: string;
    ta: string;
}

export interface Commentary {
    author: string;
    text: string;
}

export interface KuralTranslations {
    en: string;
    hi: string;
    ta: string; // Modern prose translation
}

export interface Kural {
    number: number;
    adhigaramName: Translation; // Changed from string to support translations
    tamil: string; // The original couplet
    translations: KuralTranslations;
    commentaries: {
        ta: Commentary[];
        en: Commentary[];
    };
}

export interface Adhigaram {
    name: Translation;
    kurals: Kural[];
}

export interface Iyal {
    name: Translation;
    adhigarams: Adhigaram[];
}

export interface Paal {
    name: Translation;
    iyals: Iyal[];
}

export interface ThirukkuralData {
    paals: Paal[];
}
