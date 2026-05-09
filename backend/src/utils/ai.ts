import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface DriverContext {
  crop: string;
  district: string;
  trend: string;
  ma7: number;
  weatherSummary: string;
  headlines: string[];
  language: string;
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
    - Be in ${context.language}
    
    Return only a JSON array of 3 strings. No preamble.
  `;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Using current stable model
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content && content.type === 'text') {
      return JSON.parse(content.text);
    }
    return ['Supply and demand changes', 'Weather impacts', 'Market conditions'];
  } catch (error) {
    console.error('Error generating driver bullets:', error);
    return ['Supply and demand changes', 'Weather impacts', 'Market conditions']; // Fallback
  }
}
