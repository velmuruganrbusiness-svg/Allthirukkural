import { GoogleGenAI, Type } from "@google/genai";
import { Kural } from "../types";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API key for Gemini not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        themes: {
            type: Type.ARRAY,
            description: "A list of 3-5 relevant thematic keywords or short phrases for the provided text.",
            items: {
                type: Type.STRING
            }
        }
    }
};


export const getThemesForKural = async (kural: Kural): Promise<{ themes: string[] }> => {
    if(!API_KEY) {
        // Simulate a delay and return mock data if API key is not available
        await new Promise(res => setTimeout(res, 1000));
        return { themes: ["Virtue", "Learning", "Wisdom (Mock)"] };
    }

    const prompt = `
        Analyze the following ancient Tamil couplet (Thirukkural) and its English translation. 
        Identify the core themes and concepts.
        
        Original Tamil:
        ${kural.tamil}

        English Translation:
        ${kural.translations.en}
        
        Based on this, generate a list of 3-5 relevant thematic keywords or short phrases.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (parsed && Array.isArray(parsed.themes)) {
            return parsed;
        } else {
            throw new Error("Invalid JSON structure in AI response.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate themes from AI.");
    }
};
