export interface ForecastInput {
    prices: number[];
    crop: string;
    mandi: string;
}
export interface ForecastOutput {
    trend: 'up' | 'down' | 'stable';
    band: {
        low: number;
        high: number;
    };
    confidence: number;
}
export declare function computeForecast(prices: number[]): ForecastOutput;
export declare function processTarget(cropInput: string, mandiInput: string): Promise<any>;
export declare function runForecastPipeline(): Promise<void>;
export declare function recordActuals(): Promise<void>;
//# sourceMappingURL=forecastService.d.ts.map