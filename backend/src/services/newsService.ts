const NEWS_API_KEY = process.env.NEWS_API_KEY || 'your_newsapi_key';

export async function getHeadlines(crop: string): Promise<string[]> {
  try {
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.append('q', `${crop} AND agriculture AND India`);
    url.searchParams.append('language', 'en');
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('pageSize', '3');
    url.searchParams.append('apiKey', NEWS_API_KEY);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      return data.articles.map((article: any) => article.title);
    }
    
    return ['Normal market arrivals reported'];
  } catch (error) {
    console.error('Error fetching news data:', error);
    // Fallback if API fails
    return ['Local mandis report steady supply'];
  }
}
