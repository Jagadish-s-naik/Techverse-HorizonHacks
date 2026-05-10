import axios from 'axios';
const MANDI_API_KEY = process.env.MANDI_API_KEY;
/**
 * Fetches current daily mandi prices from data.gov.in.
 * NOTE: Requires an API key from data.gov.in.
 */
export async function fetchLiveMandiPrices(commodity, market) {
    if (!MANDI_API_KEY) {
        console.warn('MANDI_API_KEY is not set in .env. Skipping live mandi price fetch.');
        return [];
    }
    try {
        // 9ef84268-d588-465a-a308-a864a43d0070 is the Daily Market Prices dataset resource ID
        let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${MANDI_API_KEY}&format=json&limit=10`;
        const fetchWithFilter = async (c, m, casing) => {
            let filteredUrl = url;
            const formatter = casing === 'title'
                ? (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
                : (str) => str.toUpperCase();
            if (commodity)
                filteredUrl += `&filters[commodity]=${encodeURIComponent(formatter(c))}`;
            if (market)
                filteredUrl += `&filters[market]=${encodeURIComponent(formatter(m))}`;
            const res = await axios.get(filteredUrl);
            return res.data?.records || [];
        };
        let records = await fetchWithFilter(commodity || '', market || '', 'title');
        // Fallback to UPPERCASE if no records found with Title Case
        if (records.length === 0 && (commodity || market)) {
            console.log(`No records found with Title Case for ${commodity}/${market}, trying UPPERCASE...`);
            records = await fetchWithFilter(commodity || '', market || '', 'upper');
        }
        if (records.length === 0) {
            return [];
        }
        return records.map((r) => {
            // Typically prices are given in Rs per Quintal (100 kg)
            const modalPricePerQuintal = Number(r.modal_price);
            const pricePerKg = modalPricePerQuintal / 100;
            // Parse arrival_date (usually DD/MM/YYYY) to standard YYYY-MM-DD for consistency
            const dateParts = r.arrival_date.split('/');
            let formattedDate = new Date().toISOString().split('T')[0];
            if (dateParts.length === 3) {
                formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
            return {
                crop: String(r.commodity).toLowerCase(),
                mandi: String(r.market).toLowerCase(),
                price: pricePerKg,
                date: formattedDate
            };
        });
    }
    catch (error) {
        console.error('Error fetching live mandi prices:', error);
        return [];
    }
}
/**
 * Fetches available crops and mandis from the most recent records in the API.
 */
export async function getMandiMetaData() {
    if (!MANDI_API_KEY) {
        return { crops: [], mandis: [] };
    }
    try {
        // Fetch a larger sample to get more variety
        const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${MANDI_API_KEY}&format=json&limit=1000`;
        const res = await axios.get(url);
        const records = res.data?.records || [];
        const crops = new Set();
        const mandis = new Set();
        records.forEach((r) => {
            if (r.commodity)
                crops.add(String(r.commodity).toLowerCase());
            if (r.market)
                mandis.add(String(r.market).toLowerCase());
        });
        return {
            crops: Array.from(crops).sort(),
            mandis: Array.from(mandis).sort()
        };
    }
    catch (error) {
        console.error('Error fetching mandi metadata:', error);
        return { crops: [], mandis: [] };
    }
}
//# sourceMappingURL=mandiService.js.map