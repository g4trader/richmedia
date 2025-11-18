import { GoogleGenAI, Type } from "@google/genai";
import { OfferData } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMarketingCopy = async (courseName: string): Promise<Partial<OfferData>> => {
  const ai = getClient();

  const prompt = `
    You are a world-class copywriter for university entrance exams (Vestibular) in Brazil. 
    Create a high-conversion, urgent, and energetic banner copy for the course: "${courseName}".
    
    Requirements:
    - Headline: Maximum 6 words. Punchy.
    - Subtitle: Maximum 12 words. Benefit-driven.
    - Discount: A realistic but attractive offer (e.g., "50% OFF", "Bolsa Mérito").
    - CtaText: A strong call to action (e.g., "Inscreva-se", "Garanta sua Vaga").
    - Colors: Suggest a Tailwind CSS "from" and "to" gradient color class based on the course psychology (e.g., Medicine=Blue/Green, Law=Red/Black, Arts=Purple/Pink).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            discount: { type: Type.STRING },
            ctaText: { type: Type.STRING },
            colorFrom: { type: Type.STRING, description: "Tailwind class starting with 'from-', e.g., 'from-purple-900'" },
            colorTo: { type: Type.STRING, description: "Tailwind class starting with 'to-', e.g., 'to-purple-600'" }
          },
          required: ["headline", "subtitle", "discount", "ctaText", "colorFrom", "colorTo"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as Partial<OfferData>;

  } catch (error) {
    console.error("Error generating copy:", error);
    // Fallback data in case of error
    return {
      headline: `Estude ${courseName} Conosco`,
      subtitle: "Excelência acadêmica e futuro garantido.",
      discount: "Condições Especiais",
      ctaText: "Saiba Mais",
      colorFrom: "from-gray-900",
      colorTo: "to-gray-700"
    };
  }
};
