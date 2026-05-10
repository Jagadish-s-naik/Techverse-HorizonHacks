import { query } from '../config/db.js';
export const getCommunitySignal = async (req, res) => {
    const { crop, district } = req.query;
    if (!crop || !district) {
        return res.status(400).json({ error: 'Crop and district are required' });
    }
    try {
        const result = await query('SELECT COUNT(*) FROM farmers WHERE crop = $1 AND district = $2', [crop, district]);
        const count = parseInt(result.rows[0].count);
        let implication = "Moderate local supply expected.";
        if (count > 50) {
            implication = "High local supply expected — consider diversifying or staggered selling.";
        }
        else if (count < 10) {
            implication = "Low local supply reported in our network.";
        }
        res.json({
            count,
            crop,
            district,
            implication
        });
    }
    catch (error) {
        console.error('Error fetching community signal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
//# sourceMappingURL=communityController.js.map