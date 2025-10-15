import { GoogleGenAI } from "@google/genai";
import type { Sale } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getBusinessInsights(data: Sale[]): Promise<string> {
  const model = "gemini-2.5-flash";
  
  const simplifiedData = data.slice(0, 50).map(d => ({
    date: d.date,
    product: d.product,
    category: d.category,
    region: d.region,
    revenue: d.revenue
  }));

  const prompt = `
    You are a professional business intelligence analyst.
    Based on the following JSON data of recent sales, provide a concise analysis in Arabic.
    Your analysis should be 3-4 bullet points.
    - Identify the top-performing product or category.
    - Point out any significant trends in revenue or sales over time.
    - Highlight the most profitable region.
    - Conclude with one scannable, actionable recommendation for the business manager.

    Your entire response MUST be in Arabic.

    Data:
    ${JSON.stringify(simplifiedData)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "عذرًا، لم نتمكن من إنشاء التحليلات في الوقت الحالي.";
  }
}

export async function getInsightForQuery(data: Sale[], query: string): Promise<string> {
  const model = "gemini-2.5-flash";
  
  const simplifiedData = data.slice(0, 100).map(d => ({
    date: d.date,
    product: d.product,
    category: d.category,
    region: d.region,
    revenue: d.revenue,
    customerName: d.customer.name,
    unitsSold: d.unitsSold
  }));

  const prompt = `
    You are a helpful business intelligence assistant.
    A user is asking a question about their sales data.
    Provide a clear and concise answer in Arabic based on the data provided.
    
    User's Question: "${query}"

    Your entire response MUST be in Arabic.

    Sales Data (JSON format):
    ${JSON.stringify(simplifiedData)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for query:", error);
    throw new Error("عذرًا، لم نتمكن من معالجة سؤالك في الوقت الحالي.");
  }
}
