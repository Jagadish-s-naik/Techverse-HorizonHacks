import type { Forecast } from '../models/types.js';
export interface SMSPayload {
    to: string;
    body: string;
}
declare class SMSService {
    /**
     * Simulates sending an SMS message.
     * In a real production app, this would use Twilio, MSG91, or a similar gateway.
     */
    sendSMS(payload: SMSPayload): Promise<{
        success: boolean;
        messageId: string;
    }>;
    /**
     * Formats a forecast into a concise, SMS-friendly text message.
     * Farmers often use low-end feature phones, so brevity is key.
     */
    formatForecastForSMS(forecast: Forecast): string;
}
export declare const smsService: SMSService;
export {};
//# sourceMappingURL=smsService.d.ts.map