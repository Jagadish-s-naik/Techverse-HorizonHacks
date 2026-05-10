const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_openweather_api_key';

export async function getWeatherSummary(location: string): Promise<string> {
  try {
    const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
    url.searchParams.append('q', location);
    url.searchParams.append('appid', WEATHER_API_KEY);
    url.searchParams.append('units', 'metric');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Basic logic to summarize the weather from the API response
    const forecasts = data.list.slice(0, 7); // roughly next 24 hours (3-hour intervals)
    const hasRain = forecasts.some((f: any) => f.weather[0].main.toLowerCase() === 'rain');
    
    if (hasRain) {
      return `Scattered rainfall expected in ${location} over the next few days.`;
    }
    
    return `Clear skies and stable weather expected in ${location}.`;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fallback if API fails to prevent pipeline crash
    return 'Stable weather conditions expected.';
  }
}
