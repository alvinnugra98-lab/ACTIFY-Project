
import { GoogleGenAI } from "@google/genai";
import { EmployeeActingData } from "../types";

export const generateActingSummary = async (data: EmployeeActingData[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const stats = {
    total: data.length,
    active: data.filter(d => d.status === 'ACTIVE').length,
    expiring: data.filter(d => d.status === 'EXPIRING SOON').length,
    expired: data.filter(d => d.status === 'EXPIRED').length,
  };

  const depts = Array.from(new Set(data.map(d => d.dept)));
  const deptCount = depts.length;

  const prompt = `
    You are the AI engine for "ACTIFY", a premium talent monitoring platform.
    Analyze this employee acting (temporary assignment) report:
    - Total Hits (Acting): ${stats.total}
    - Playing Now (Active): ${stats.active}
    - Ending Soon (Next 30 days): ${stats.expiring}
    - Finished/Archived (Expired): ${stats.expired}
    - Total Departments on Stage: ${deptCount}

    Employee Highlights:
    ${data.slice(0, 5).map(e => `- ${e.name} (${e.dept}): ${e.status}`).join('\n')}

    Provide a high-energy, professional executive summary in Indonesian. 
    Use a modern "corporate cool" tone. Focus on immediate actions for "Expiring Soon" talent.
    Keep it under 120 words and use clear bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Insight feed currently unavailable.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Failed to sync AI insights. Check connection.";
  }
};
