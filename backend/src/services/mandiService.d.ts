export interface MandiPriceRecord {
    crop: string;
    mandi: string;
    price: number;
    date: string;
}
/**
 * Fetches current daily mandi prices from data.gov.in.
 * NOTE: Requires an API key from data.gov.in.
 */
export declare function fetchLiveMandiPrices(commodity?: string, market?: string): Promise<MandiPriceRecord[]>;
/**
 * Fetches available crops and mandis from the most recent records in the API.
 */
export declare function getMandiMetaData(): Promise<{
    crops: string[];
    mandis: string[];
}>;
//# sourceMappingURL=mandiService.d.ts.map