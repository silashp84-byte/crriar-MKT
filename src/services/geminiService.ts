import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MarketingBrief {
  productName: string;
  description: string;
  targetAudience: string;
  tone: string;
  platform: "Instagram" | "Facebook" | "LinkedIn" | "Twitter/X" | "Google Ads" | "Email Marketing";
  objective: string;
}

export interface AdCampaign {
  headline: string;
  bodyCopy: string;
  cta: string;
  hashtags: string[];
  imagePrompt: string;
  strategy: string;
}

export async function generateMarketingCampaign(brief: MarketingBrief): Promise<AdCampaign> {
  const systemInstruction = `You are a world-class marketing copywriter and creative director. 
  Create a professional marketing campaign based on the provided brief. 
  Focus on high conversion, emotional resonance, and platform-specific formatting.
  
  For the imagePrompt, provide a highly detailed description that can be used by an AI image generator to create a professional ad visual for this specific product.`;

  const prompt = `Product Name: ${brief.productName}
  Description: ${brief.description}
  Target Audience: ${brief.targetAudience}
  Tone: ${brief.tone}
  Platform: ${brief.platform}
  Objective: ${brief.objective}
  
  Generate a complete marketing campaign in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: "Catches attention immediately" },
          bodyCopy: { type: Type.STRING, description: "Detailed ad copy following AIDA framework" },
          cta: { type: Type.STRING, description: "Clear call to action" },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant audience tags" },
          imagePrompt: { type: Type.STRING, description: "Detailed visual concept description" },
          strategy: { type: Type.STRING, description: "Why this works for the target audience" }
        },
        required: ["headline", "bodyCopy", "cta", "hashtags", "imagePrompt", "strategy"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as AdCampaign;
}
