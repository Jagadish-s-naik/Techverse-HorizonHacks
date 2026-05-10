import type { Request, Response } from 'express';
export declare const createFarmer: (req: Request, res: Response) => Promise<void>;
export declare const getFarmer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateFarmer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=farmerController.d.ts.map