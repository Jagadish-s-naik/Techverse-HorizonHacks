import { query } from '../config/db.js';
import redis from '../config/redis.js';
import { processTarget } from '../services/forecastService.js';
function getRecommendation(forecast, farmer) {
    const { trend, confidence } = forecast;
    const { has_storage, land_acres } = farmer || { has_storage: false, land_acres: 1 };
    if (trend === 'up' && confidence > 60 && has_storage) {
        return {
            action: 'Hold — wait 5–7 days before selling',
            risk: 'moderate',
            rationale: 'Prices are trending up with high confidence, and your storage allows you to wait for a better peak.',
            alternative: 'If you need immediate cash, sell only 30% of your stock now.'
        };
    }
    if (trend === 'down' || !has_storage) {
        return {
            action: 'Sell now at current market price',
            risk: 'safe',
            rationale: 'Market supply is increasing. Without storage, holding risks quality loss and lower prices later.',
            alternative: 'Check nearby mandis for a ±₹2/kg difference before committing.'
        };
    }
    if (trend === 'up' && confidence < 60) {
        return {
            action: 'Sell 50% now, hold 50%',
            risk: 'moderate',
            rationale: 'The market shows upward potential but is volatile. Splitting your stock reduces your risk.',
            alternative: 'Wait 2 days to see if the trend stabilizes before selling the rest.'
        };
    }
    return {
        action: 'Monitor daily — market is unclear',
        risk: 'risky',
        rationale: 'Current indicators are mixed. Avoid large sells until a clearer trend emerges.',
        alternative: 'Focus on harvest quality to ensure top-tier pricing when you do sell.'
    };
}
export const getLatestForecast = async (req, res) => {
    const crop = req.query.crop?.toLowerCase();
    const mandi = req.query.mandi?.toLowerCase();
    const farmerId = req.query.farmerId;
    if (!crop || !mandi) {
        return res.status(400).json({ error: 'Crop and mandi are required' });
    }
    try {
        const cacheKey = `forecast:${crop}:${mandi}`;
        let forecast = null;
        try {
            forecast = await redis.get(cacheKey);
        }
        catch (e) {
            console.warn('Redis cache error, falling back to DB:', e);
        }
        if (!forecast) {
            const forecastResult = await query('SELECT * FROM forecasts WHERE crop = $1 AND mandi = $2 ORDER BY forecast_date DESC LIMIT 1', [crop, mandi]);
            // Also get the absolute latest price from mandi_prices for today
            const latestPriceResult = await query('SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 ORDER BY date DESC LIMIT 1', [crop, mandi]);
            const todayPrice = latestPriceResult.rows[0]?.price;
            if (forecastResult.rows.length === 0) {
                // If it doesn't exist, generate it on-the-fly!
                try {
                    console.log(`Forecast missing for ${crop} in ${mandi}, generating on the fly...`);
                    forecast = await processTarget(crop, mandi);
                    console.log(`On-the-fly forecast generated successfully for ${crop} in ${mandi}`);
                }
                catch (genError) {
                    console.error(`Error generating forecast on the fly for ${crop} in ${mandi}:`, genError.message);
                    const isInsufficient = genError.message && genError.message.includes('Insufficient');
                    if (isInsufficient) {
                        const latestPriceResult = await query('SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 ORDER BY date DESC LIMIT 1', [crop, mandi]);
                        return res.json({
                            error: genError.message,
                            status: 'insufficient_data',
                            crop,
                            mandi,
                            todayPrice: latestPriceResult.rows[0]?.price
                        });
                    }
                    return res.status(500).json({ error: genError.message || 'Failed to generate forecast for new crop' });
                }
            }
            else {
                forecast = forecastResult.rows[0];
            }
            if (forecast) {
                try {
                    // Cache for 1 hour
                    await redis.set(cacheKey, forecast, { ex: 3600 });
                }
                catch (e) {
                    console.warn('Failed to set Redis cache:', e);
                }
            }
        }
        // Ensure todayPrice is included in the final object
        const latestPriceResult = await query('SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 ORDER BY date DESC LIMIT 1', [crop, mandi]);
        const todayPrice = latestPriceResult.rows[0]?.price;
        // Fetch farmer profile for personalized recommendation
        let farmerProfile = null;
        if (farmerId) {
            try {
                const farmerResult = await query('SELECT * FROM farmers WHERE id = $1', [farmerId]);
                farmerProfile = farmerResult.rows[0];
            }
            catch (e) {
                console.warn('Failed to fetch farmer profile for recommendation:', e);
            }
        }
        const recommendation = getRecommendation(forecast, farmerProfile);
        res.json({ ...forecast, todayPrice, recommendation });
    }
    catch (error) {
        console.error('Error fetching forecast:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getForecastHistory = async (req, res) => {
    const crop = req.query.crop?.toLowerCase();
    const mandi = req.query.mandi?.toLowerCase();
    const limit = req.query.limit || 20;
    try {
        const result = await query(`SELECT f.*, fa.actual_price 
       FROM forecasts f
       LEFT JOIN forecast_actuals fa ON f.id = fa.forecast_id
       WHERE f.crop = $1 AND f.mandi = $2 
       ORDER BY f.forecast_date DESC 
       LIMIT $3`, [crop, mandi, limit]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
//# sourceMappingURL=forecastController.js.map