import {} from 'express';
import { getMandiMetaData } from '../services/mandiService.js';
export async function getOptions(req, res) {
    try {
        const data = await getMandiMetaData();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching meta options:', error);
        res.json({ crops: [], mandis: [], error: 'Data currently unavailable' });
    }
}
//# sourceMappingURL=metaController.js.map