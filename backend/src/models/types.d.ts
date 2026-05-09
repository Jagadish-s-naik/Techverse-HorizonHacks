export interface Forecast {
    crop: string;
    mandi: string;
    price_range_low: number;
    price_range_high: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
    drivers: string[];
}
export interface Farmer {
    id?: string;
    crop: string;
    land_acres: number;
    has_irrigation: boolean;
    has_storage: boolean;
    mandi: string;
    district: string;
    language: string;
    created_at?: Date;
}
//# sourceMappingURL=types.d.ts.map