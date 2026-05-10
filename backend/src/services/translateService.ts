import axios from 'axios';

/**
 * Translates text using Google Translate's public API (gtx client)
 * This is an unofficial API and may be rate-limited.
 */
export async function translateText(text: string | string[], targetLang: string): Promise<string | string[]> {
  const langMap: { [key: string]: string } = {
    'English': 'en',
    'Hindi': 'hi',
    'Kannada': 'kn',
    'Marathi': 'mr',
    'Telugu': 'te',
    'Tamil': 'ta',
    'Gujarati': 'gu',
    'Bengali': 'bn',
    'Punjabi': 'pa',
    'Malayalam': 'ml'
  };

  const targetCode = langMap[targetLang] || 'en';
  
  if (targetCode === 'en') return text;

  try {
    if (Array.isArray(text)) {
      // For arrays, we translate each item
      // Note: In a real app, we might want to batch these to avoid multiple requests
      const results = await Promise.all(
        text.map(t => translateSingle(t, targetCode))
      );
      return results;
    } else {
      return await translateSingle(text, targetCode);
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text on error
  }
}

async function translateSingle(text: string, target: string): Promise<string> {
  if (!text || text.trim() === '') return text;
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await axios.get(url);
  
  // The response format for gtx client is an array of arrays
  // [[["translatedText","originalText",null,null,1]],null,"en"]
  if (response.data && response.data[0] && response.data[0][0] && response.data[0][0][0]) {
    // Join multiple parts if the translation was split
    return response.data[0].map((part: any) => part[0]).join('');
  }
  
  return text;
}
