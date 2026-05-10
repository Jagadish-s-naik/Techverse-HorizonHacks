import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface DriverContext {
  crop: string;
  district: string;
  trend: string;
  ma7: number;
  weatherSummary: string;
  headlines: string[];
  language?: string;
}

export async function generateDriverBullets(context: DriverContext): Promise<string[]> {
  const prompt = `
    You are an agricultural market analyst explaining price movements to farmers.
    
    Data:
    - Crop: ${context.crop}
    - Region: ${context.district}, India
    - Current price trend: ${context.trend}
    - 7-day average price: ₹${context.ma7}/kg
    - Weather: ${context.weatherSummary}
    - News: ${context.headlines.join('; ')}
    
    Generate exactly 3 bullet points explaining WHY prices are likely to move this way.
    Each bullet must:
    - Be one sentence, under 15 words
    - Start with the cause, end with the price effect
    - Use plain language a farmer would understand
    - Be in English
    
    Return only a JSON array of 3 strings. No preamble.
  `;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Using high-performance Groq model
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      try {
        return JSON.parse(content);
      } catch (e) {
        console.warn('Failed to parse Groq response as JSON:', content);
      }
    }
    return ['Supply and demand changes', 'Weather impacts', 'Market conditions'];
  } catch (error) {
    console.error('Error generating driver bullets:', error);
    return ['Supply and demand changes', 'Weather impacts', 'Market conditions']; // Fallback
  }
}

export interface RecommendationContext {
  crop: string;
  mandi: string;
  trend: string;
  confidence: number;
  price_low: number;
  price_high: number;
  todayPrice: number;
  has_storage: boolean;
  land_acres: number;
  language?: string;
}

export async function generateTailoredRecommendation(context: RecommendationContext): Promise<any> {
  const prompt = `
    You are an expert agricultural advisor for Indian farmers.
    
    Data:
    - Crop: ${context.crop}
    - Mandi: ${context.mandi}
    - Current Price: ₹${context.todayPrice}/kg
    - Forecast Trend: ${context.trend}
    - Forecast Range: ₹${context.price_low} - ₹${context.price_high}
    - Confidence: ${context.confidence}%
    - Farmer has storage: ${context.has_storage ? 'Yes' : 'No'}
    - Farmer land: ${context.land_acres} acres
    
    Generate a tailored recommendation in JSON format with:
    1. action: A clear, actionable headline (e.g., "Hold your stock", "Sell 50% of your crop now").
    2. risk: "safe", "moderate", or "risky".
    3. probability: A number (0-100) representing the likelihood of this action being the optimal financial choice.
    4. rationale: 2-3 sentences explaining why, using the second person voice (e.g., "Since you have storage...", "You can maximize your profit...").
    5. alternative: A fallback option using the second person voice.
    
    IMPORTANT: 
    - Always address the farmer directly as "you" or "your".
    - The output (action, rationale, alternative) MUST be in English.
    - Return ONLY JSON. No preamble.
  `;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      try {
        // Clean markdown backticks if present
        const cleaned = content.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (e) {
        console.warn('Failed to parse Groq recommendation as JSON:', content);
      }
    }
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
  }

  // Fallback if AI fails - we will translate this fallback in the controller
  return {
    action: context.trend === 'up' ? 'Hold your stock' : 'Sell your crop',
    risk: 'moderate',
    probability: 70,
    rationale: `The market trend for ${context.crop} is currently ${context.trend}. Based on your ${context.land_acres} acres, you should manage your inventory carefully to maximize your returns.`,
    alternative: 'You can sell a small portion now if you need immediate cash.'
  };
}
