import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface IdeaAnalysis {
  marketDemandScore: number;
  successProbability: number;
  fundingPotential: number;
  competitors: Array<{ name: string; pricing: string; audience: string; strengths: string; weaknesses: string }>;
  targetAudience: string;
  monetization: string[];
  risks: string[];
  suggestions: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  roadmap: Array<{ step: string; description: string }>;
  mvpFeatures: string[];
  businessModel: string;
  suggestedNames: string[];
  pitchDeck: {
    problem: string;
    solution: string;
    marketSize: string;
    businessModel: string;
    competition: string;
  };
}

export async function analyzeIdea(title: string, description: string): Promise<IdeaAnalysis> {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
    Analyze the following startup idea.
    Provide a comprehensive validation and analysis in JSON format.
    Include scores (1-100) for market demand, success probability, and funding potential.
    List 3-5 competitors with details (pricing, audience, strengths, weaknesses).
    Define the target audience and monetization strategies.
    List potential risks and improvement suggestions.
    Provide a SWOT analysis.
    Generate a 5-step roadmap to build the idea.
    Suggest 5 MVP features.
    Recommend a business model.
    Suggest 5 creative startup names.
    Create a brief pitch deck outline (problem, solution, market size, business model, competition).
  `;

  const prompt = `
    Title: ${title}
    Description: ${description}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          marketDemandScore: { type: Type.NUMBER },
          successProbability: { type: Type.NUMBER },
          fundingPotential: { type: Type.NUMBER },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                pricing: { type: Type.STRING },
                audience: { type: Type.STRING },
                strengths: { type: Type.STRING },
                weaknesses: { type: Type.STRING }
              }
            }
          },
          targetAudience: { type: Type.STRING },
          monetization: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          mvpFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
          businessModel: { type: Type.STRING },
          suggestedNames: { type: Type.ARRAY, items: { type: Type.STRING } },
          pitchDeck: {
            type: Type.OBJECT,
            properties: {
              problem: { type: Type.STRING },
              solution: { type: Type.STRING },
              marketSize: { type: Type.STRING },
              businessModel: { type: Type.STRING },
              competition: { type: Type.STRING }
            }
          }
        },
        required: ["marketDemandScore", "successProbability", "fundingPotential", "competitors", "targetAudience", "monetization", "risks", "suggestions", "swot", "roadmap", "mvpFeatures", "businessModel", "suggestedNames", "pitchDeck"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
