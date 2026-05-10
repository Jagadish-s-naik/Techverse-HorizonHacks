import type { Request, Response } from 'express';
import { query } from '../config/db.js';

export const createFarmer = async (req: Request, res: Response) => {
  const { crop, land_acres, has_irrigation, has_storage, mandi, district, language } = req.body;
  
  try {
    const result = await query(
      'INSERT INTO farmers (crop, land_acres, has_irrigation, has_storage, mandi, district, language) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [crop?.toLowerCase(), land_acres, has_irrigation, has_storage, mandi?.toLowerCase(), district?.toLowerCase(), language]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error: any) {
    console.error('Error creating farmer:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const getFarmer = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const result = await query('SELECT * FROM farmers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching farmer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateFarmer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { crop, land_acres, has_irrigation, has_storage, mandi, district, language } = req.body;
  
  try {
    const result = await query(
      'UPDATE farmers SET crop = $1, land_acres = $2, has_irrigation = $3, has_storage = $4, mandi = $5, district = $6, language = $7 WHERE id = $8 RETURNING *',
      [crop?.toLowerCase(), land_acres, has_irrigation, has_storage, mandi?.toLowerCase(), district?.toLowerCase(), language, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating farmer:', error);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      detail: error.detail // Useful for DB errors
    });
  }
};
