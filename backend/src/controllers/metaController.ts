import { type Request, type Response } from 'express';
import { getMandiMetaData } from '../services/mandiService.js';
import { query } from '../config/db.js';

export async function getOptions(req: Request, res: Response) {
  try {
    const data = await getMandiMetaData();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching meta options:', error);
    res.json({ crops: [], mandis: [], error: 'Data currently unavailable' });
  }
}

export async function getMarketOverview(req: Request, res: Response) {
  try {
    const crops = ['rice', 'wheat', 'cotton', 'mustard', 'maize', 'soybean', 'potato', 'tomato', 'onion'];
    
    const results = await Promise.all(crops.map(async (crop) => {
      const q = `
        SELECT price, date 
        FROM mandi_prices 
        WHERE crop = $1 
        ORDER BY date DESC 
        LIMIT 2
      `;
      const { rows } = await query(q, [crop]);
      
      if (rows.length === 0) {
        return {
          crop,
          price: 0,
          change: 0,
          changePercent: 0,
          date: new Date().toISOString()
        };
      }
      
      const current = rows[0];
      const previous = rows[1] || current;
      
      // Safety logs for debugging
      if (current.price === undefined) {
        console.warn(`WARNING: Price is undefined for crop ${crop}. Row:`, current);
      }

      const price = Number(current.price || 0);
      const prevPrice = Number(previous.price || 0);
      const change = price - prevPrice;
      const changePercent = prevPrice !== 0 ? (change / prevPrice) * 100 : 0;
      
      return {
        crop,
        price,
        change,
        changePercent,
        date: current.date
      };
    }));

    res.json(results);
  } catch (error: any) {
    console.error('Error fetching market overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
