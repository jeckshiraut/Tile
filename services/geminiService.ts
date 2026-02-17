import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateSuggestions = async (inputText: string, task: 'title' | 'desc' | 'tags' | 'rewrite'): Promise<string> => {
  if (!apiKey) {
    return "Please configure your API Key to use AI features.";
  }

  const model = "gemini-3-flash-preview";
  
  let prompt = "";
  switch(task) {
    case 'title':
      prompt = `Generate 5 catchy, high-CTR YouTube video titles based on this topic or text. Keep them under 60 characters if possible. Use emojis sparingly. Text: "${inputText}"`;
      break;
    case 'desc':
      prompt = `Write a compelling YouTube video description (first 3 lines) including keywords for SEO based on: "${inputText}". Focus on the hook.`;
      break;
    case 'tags':
      prompt = `Generate a comma-separated list of 15 high-ranking YouTube tags for: "${inputText}". Return ONLY the tags, separated by commas.`;
      break;
    case 'rewrite':
      prompt = `Rewrite the following text to be more engaging, witty, and suitable for a YouTube community post or comment. Add relevant emojis. Text: "${inputText}"`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "No suggestions generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating suggestions. Please try again later.";
  }
};