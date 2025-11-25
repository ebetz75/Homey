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
    Analyze this image of a home inventory item. 
    1. Identify the item name.
    2. Categorize it into one of: ${Object.values(Category).join(', ')}.
    3. Determine the room it is likely in (e.g. Kitchen, Living Room, Garage).
    4. Classify type as either "Personal Property (Moves)" or "Fixture (Stays with Home)".
    5. Estimate a conservative resale value in USD (number only).
    6. Provide a brief description (including brand/model if visible).
    7. Assess condition (New, Like New, Good, Fair, Poor).

    Return raw JSON.
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
        systemInstruction: "You are an expert home insurance adjuster and appraiser. You accurately identify items, estimate values, and categorize home inventory from images.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            room: { type: Type.STRING },
            type: { type: Type.STRING },
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
    
    // Clean up response if needed (sometimes models wrap in ```json)
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
