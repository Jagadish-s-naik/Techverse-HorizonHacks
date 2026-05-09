import { Request, Response } from 'express';
import { query } from '../config/db';

export const getLatestForecast = async (req: Request, res: Response) => {
  const { crop, mandi } = req.query;
  
  if (!crop || !mandi) {
    return res.status(400).json({ error: 'Crop and mandi are required' });
  }
  
  try {
    const result = await query(
      'SELECT * FROM forecasts WHERE crop = $1 AND mandi = $2 ORDER BY forecast_date DESC LIMIT 1',
      [crop, mandi]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No forecast found for this combination' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getForecastHistory = async (req: Request, res: Response) => {
  const { crop, mandi, limit = 20 } = req.query;
  
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
