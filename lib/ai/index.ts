import { GoogleGenAI } from "@google/genai";

// NOTE: this module talks to the Gemini API using a secret key and must
// only ever be imported from server-side code (API routes, server
// actions, etc). Importing it from a client component/hook would bundle
// the SDK — and the key resolution logic — into client JS.

const AI_MODEL = "gemini-2.5-flash";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateAiResponse = async (input: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: input,
  });

  return response.text ?? "";
};

export default ai;
