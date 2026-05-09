import { Request, Response } from 'express';
import { smsService } from '../services/smsService.js';
import { query } from '../config/db.js';

export const simulateReceiveSMS = async (req: Request, res: Response) => {
  const { phoneNumber, crop } = req.body;

  if (!phoneNumber || !crop) {
    return res.status(400).json({ error: 'phoneNumber and crop are required' });
  }

  try {
    // 1. Fetch the latest forecast for this crop
    // Note: In a real app, we might also use the farmer's location/mandi from their profile linked to the phone number.
    const result = await query(
      'SELECT crop, mandi, price_low as price_range_low, price_high as price_range_high, trend, confidence, drivers FROM forecasts WHERE crop = $1 ORDER BY forecast_date DESC LIMIT 1',
      [crop]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No forecast found for crop: ${crop}` });
    }

    const forecast = result.rows[0];
    
    // Parse drivers if it's a string (Postgres might return it as string or object depending on driver)
    if (typeof forecast.drivers === 'string') {
      forecast.drivers = JSON.parse(forecast.drivers);
    }

    // 2. Format the SMS
    const smsText = smsService.formatForecastForSMS(forecast);

    // 3. Send the SMS
    const sendResult = await smsService.sendSMS({
      to: phoneNumber,
      body: smsText
    });

    res.status(200).json({
      message: 'SMS simulation triggered',
      sentTo: phoneNumber,
      content: smsText,
      result: sendResult
    });
  } catch (error) {
    console.error('Error in simulateReceiveSMS:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
