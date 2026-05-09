import type { Forecast } from '../models/types';

export interface SMSPayload {
  to: string;
  body: string;
}

class SMSService {
  /**
   * Simulates sending an SMS message.
   * In a real production app, this would use Twilio, MSG91, or a similar gateway.
   */
  async sendSMS(payload: SMSPayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`[SMS STUB] Sending message to ${payload.to}...`);
    console.log(`[SMS STUB] Message Content: \n-------------------\n${payload.body}\n-------------------`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const messageId = `sms_${Math.random().toString(36).substring(7)}`;
    console.log(`[SMS STUB] Message sent successfully. ID: ${messageId}`);
    
    return {
      success: true,
      messageId
    };
  }

  /**
   * Formats a forecast into a concise, SMS-friendly text message.
   * Farmers often use low-end feature phones, so brevity is key.
   */
  formatForecastForSMS(forecast: Forecast): string {
    const trendEmoji = forecast.trend === 'up' ? '📈' : forecast.trend === 'down' ? '📉' : '↔️';
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    return `FarmSight ${date}: ${forecast.crop.toUpperCase()} (${forecast.mandi})
Range: ₹${forecast.price_range_low}-${forecast.price_range_high}/qtl
Trend: ${forecast.trend.toUpperCase()} ${trendEmoji} (${forecast.confidence}% confidence)
Why: ${forecast.drivers[0] || 'Market dynamics'}
Stay informed, FarmBetter!`;
  }
}

export const smsService = new SMSService();
