import { GoogleGenAI } from "@google/genai";

const AI_MODEL = "gemini-3.6-flash";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateAiResponse = async (input: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: input,
  });

  return response.text ?? "";
};

export default ai;
