import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import redis from '../config/redis.js';
import { processTarget } from '../services/forecastService.js';
import { generateTailoredRecommendation } from '../utils/ai.js';
import { translateText } from '../services/translateService.js';

function getRecommendation(forecast: any, farmer: any) {
  const { trend, confidence } = forecast;
  const { has_storage, land_acres } = farmer || { has_storage: false, land_acres: 1 };

  if (trend === 'up' && confidence > 60 && has_storage) {
    return { 
      action: 'Hold your stock — wait 5–7 days', 
      risk: 'moderate',
      rationale: 'Prices are trending up with high confidence, and your storage allows you to wait for a better peak.',
      alternative: 'If you need immediate cash, you should sell only 30% of your stock now.'
    };
  }
  if (trend === 'down' || !has_storage) {
    return { 
      action: 'Sell your crop now', 
      risk: 'safe',
      rationale: 'Market supply is increasing. Since you lack storage, holding risks quality loss and lower prices for you later.',
      alternative: 'You should check nearby mandis for a ±₹2/kg difference before you commit.'
    };
  }
  if (trend === 'up' && confidence < 60) {
    return { 
      action: 'Sell 50% now, hold 50%', 
      risk: 'moderate',
      rationale: 'The market shows upward potential but is volatile. By splitting your stock, you reduce your risk.',
      alternative: 'You can wait 2 days to see if the trend stabilizes before selling your remaining stock.'
    };
  }
  return { 
    action: 'Monitor daily — market is unclear', 
    risk: 'risky',
    rationale: 'Current indicators are mixed. You should avoid large sells until a clearer trend emerges.',
    alternative: 'Focus on your harvest quality to ensure you get top-tier pricing.'
  };
}

export const getLatestForecast = async (req: Request, res: Response) => {
  const crop = (req.query.crop as string)?.toLowerCase();
  const mandi = (req.query.mandi as string)?.toLowerCase();
  const farmerId = req.query.farmerId as string;
  
  if (!crop || !mandi) {
    return res.status(400).json({ error: 'Crop and mandi are required' });
  }
  
  try {
    const cacheKey = `forecast:${crop}:${mandi}`;
    let forecast = null;
    
    try {
      forecast = await redis.get(cacheKey) as any;
    } catch (e) {
      console.warn('Redis cache error, falling back to DB:', e);
    }

    if (!forecast) {
      const forecastResult = await query(
        'SELECT * FROM forecasts WHERE crop = $1 AND mandi = $2 ORDER BY forecast_date DESC LIMIT 1',
        [crop, mandi]
      );

      // Also get the absolute latest price from mandi_prices for today
      const latestPriceResult = await query(
        'SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 ORDER BY date DESC LIMIT 1',
        [crop, mandi]
      );
      const todayPrice = latestPriceResult.rows[0]?.price;
      
      if (forecastResult.rows.length === 0) {
        // If it doesn't exist, generate it on-the-fly!
        try {
          console.log(`Forecast missing for ${crop} in ${mandi}, generating on the fly...`);
          forecast = await processTarget(crop, mandi);
          console.log(`On-the-fly forecast generated successfully for ${crop} in ${mandi}`);
        } catch (genError: any) {
          console.error(`Error generating forecast on the fly for ${crop} in ${mandi}:`, genError.message);
          const isInsufficient = genError.message && genError.message.includes('Insufficient');
          
          if (isInsufficient) {
            const latestPriceResult = await query(
              'SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 ORDER BY date DESC LIMIT 1',
              [crop, mandi]
            );
            
            const farmerResult = await query('SELECT language FROM farmers WHERE id = $1', [farmerId]);
            const language = farmerResult.rows[0]?.language || 'English';
            const translatedError = language !== 'English' ? await translateText(genError.message, language) : genError.message;

            return res.json({ 
              error: translatedError, 
              status: 'insufficient_data',
              crop,
              mandi,
              todayPrice: latestPriceResult.rows[0]?.price
            });
          }
          
          const farmerResult = await query('SELECT language FROM farmers WHERE id = $1', [farmerId]);
          const language = farmerResult.rows[0]?.language || 'English';
          const errorMsg = genError.message || 'Failed to generate forecast for new crop';
          const translatedError = language !== 'English' ? await translateText(errorMsg, language) : errorMsg;
          
          return res.status(500).json({ error: translatedError });
        }
      } else {
        forecast = forecastResult.rows[0];
      }
      
      if (forecast) {
        try {
          // Cache for 1 hour
          await redis.set(cacheKey, forecast, { ex: 3600 });
        } catch (e) {
          console.warn('Failed to set Redis cache:', e);
        }
      }
    }

    // Ensure todayPrice is included in the final object
    const latestPriceResult = await query(
      'SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 ORDER BY date DESC LIMIT 1',
      [crop, mandi]
    );
    const todayPrice = latestPriceResult.rows[0]?.price;

    // Fetch farmer profile for personalized recommendation
    let farmerProfile = null;
    if (farmerId) {
      try {
        const farmerResult = await query('SELECT * FROM farmers WHERE id = $1', [farmerId]);
        farmerProfile = farmerResult.rows[0];
      } catch (e) {
        console.warn('Failed to fetch farmer profile for recommendation:', e);
      }
    }
    
    // Try to get AI recommendation first, fallback to rule-based
    let recommendation;
    try {
      recommendation = await generateTailoredRecommendation({
        crop: forecast.crop,
        mandi: forecast.mandi,
        trend: forecast.trend,
        confidence: forecast.confidence,
        price_low: forecast.price_low,
        price_high: forecast.price_high,
        todayPrice: Number(todayPrice),
        has_storage: farmerProfile?.has_storage || false,
        land_acres: Number(farmerProfile?.land_acres || 1)
      });
    } catch (e) {
      console.warn('AI Recommendation failed, using rule-based fallback:', e);
      recommendation = getRecommendation(forecast, farmerProfile);
    }

    // 5. Apply translations for the response
    const language = farmerProfile?.language || 'English';
    
    // Translate the recommendation
    if (language !== 'English') {
      try {
        const [translatedAction, translatedRationale, translatedAlternative] = await Promise.all([
          translateText(recommendation.action, language),
          translateText(recommendation.rationale, language),
          translateText(recommendation.alternative, language)
        ]);
        
        recommendation.action = translatedAction as string;
        recommendation.rationale = translatedRationale as string;
        recommendation.alternative = translatedAlternative as string;
      } catch (e) {
        console.warn('Failed to translate recommendation:', e);
      }
    }

    // Translate the drivers (bullet points)
    let finalDrivers = forecast.drivers;
    if (typeof finalDrivers === 'string') {
      try {
        finalDrivers = JSON.parse(finalDrivers);
      } catch (e) {
        finalDrivers = [];
      }
    }

    if (language !== 'English' && Array.isArray(finalDrivers) && finalDrivers.length > 0) {
      try {
        const translatedDrivers = await translateText(finalDrivers, language);
        finalDrivers = translatedDrivers;
      } catch (e) {
        console.warn('Failed to translate drivers:', e);
      }
    }

    res.json({ 
      ...forecast, 
      drivers: finalDrivers,
      todayPrice, 
      recommendation 
    });
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getForecastHistory = async (req: Request, res: Response) => {
  const crop = (req.query.crop as string)?.toLowerCase();
  const mandi = (req.query.mandi as string)?.toLowerCase();
  const limit = req.query.limit || 20;
  
  try {
    const result = await query(
      `SELECT f.*, fa.actual_price 
       FROM forecasts f
       LEFT JOIN forecast_actuals fa ON f.id = fa.forecast_id
       WHERE f.crop = $1 AND f.mandi = $2 
       ORDER BY f.forecast_date DESC 
       LIMIT $3`,
      [crop, mandi, limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
