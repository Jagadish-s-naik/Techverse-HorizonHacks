import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import { translateText } from '../services/translateService.js';

export const getCommunitySignal = async (req: Request, res: Response) => {
  const { crop, district } = req.query;
  
  if (!crop || !district) {
    return res.status(400).json({ error: 'Crop and district are required' });
  }
  
  try {
    const result = await query(
      'SELECT COUNT(*) FROM farmers WHERE crop = $1 AND district = $2',
      [crop, district]
    );
    
    const count = parseInt(result.rows[0].count);
    
    let implication = "Moderate local supply expected.";
    if (count > 50) {
      implication = "High local supply expected — consider diversifying or staggered selling.";
    } else if (count < 10) {
      implication = "Low local supply reported in our network.";
    }
    
    const farmerId = req.query.farmerId as string;
    let finalImplication = implication;

    if (farmerId) {
      try {
        const farmerRes = await query('SELECT language FROM farmers WHERE id = $1', [farmerId]);
        const language = farmerRes.rows[0]?.language || 'English';
        if (language !== 'English') {
          finalImplication = await translateText(implication, language) as string;
        }
      } catch (e) {
        console.warn('Failed to translate community implication:', e);
      }
    }

    res.json({
      count,
      crop,
      district,
      implication: finalImplication
    });
  } catch (error) {
    console.error('Error fetching community signal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
