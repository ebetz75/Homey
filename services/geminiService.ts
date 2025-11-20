import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Category, ItemType } from "../types";

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeItemImage = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = getAiClient();
  
  let cleanBase64 = base64Image;
  let mimeType = "image/jpeg";

  if (base64Image.includes(",")) {
    const parts = base64Image.split(",");
    cleanBase64 = parts[1];
    const mimeMatch = parts[0].match(/:(.*?);/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }
  }

  const prompt = `
    Analyze this home inventory item.
    1. Identify the item.
    2. Estimate conservative resale value (USD).
    3. Categorize it (${Object.values(Category).join(', ')}).
    4. Guess the Room it belongs in (e.g. Kitchen, Living Room, Garage).
    5. Determine if it is "Personal Property" (Moves with owner, e.g. sofa, TV) or a "Fixture" (Stays with house, e.g. Chandelier, Built-in Oven, Water Heater).
    6. Assess condition.
    7. Brief description.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            room: { type: Type.STRING, description: "e.g. Kitchen, Bedroom" },
            type: { type: Type.STRING, enum: [ItemType.PERSONAL, ItemType.FIXTURE] },
            estimatedValue: { type: Type.NUMBER },
            description: { type: Type.STRING },
            condition: { type: Type.STRING }
          },
          required: ["name", "category", "room", "type", "estimatedValue", "description", "condition"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
