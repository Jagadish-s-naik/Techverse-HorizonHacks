import type { Request, Response } from 'express';
export declare const getLatestForecast: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getForecastHistory: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=forecastController.d.ts.map