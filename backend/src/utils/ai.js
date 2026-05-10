import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
export async function generateDriverBullets(context) {
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
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // Using high-performance Groq model
            max_tokens: 200,
            messages: [{ role: 'user', content: prompt }],
        });
        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                return JSON.parse(content);
            }
            catch (e) {
                console.warn('Failed to parse Groq response as JSON:', content);
            }
        }
        return ['Supply and demand changes', 'Weather impacts', 'Market conditions'];
    }
    catch (error) {
        console.error('Error generating driver bullets:', error);
        return ['Supply and demand changes', 'Weather impacts', 'Market conditions']; // Fallback
    }
}
//# sourceMappingURL=ai.js.map