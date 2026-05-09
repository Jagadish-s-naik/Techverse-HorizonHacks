export interface DriverContext {
    crop: string;
    district: string;
    trend: string;
    ma7: number;
    weatherSummary: string;
    headlines: string[];
    language: string;
}
export declare function generateDriverBullets(context: DriverContext): Promise<string[]>;
//# sourceMappingURL=ai.d.ts.map