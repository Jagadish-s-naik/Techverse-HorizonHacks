import axios from 'axios';
import { query } from '../config/db.js';

const MANDI_API_KEY = process.env.MANDI_API_KEY;

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
export async function fetchLiveMandiPrices(commodity?: string, market?: string): Promise<MandiPriceRecord[]> {
  if (!MANDI_API_KEY) {
    console.warn('MANDI_API_KEY is not set in .env. Skipping live mandi price fetch.');
    return [];
  }

  try {
    // 9ef84268-d588-465a-a308-a864a43d0070 is the Daily Market Prices dataset resource ID
    let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${MANDI_API_KEY}&format=json&limit=10`;
    
    const fetchWithFilter = async (c: string, m: string, casing: 'title' | 'upper') => {
      let filteredUrl = url;
      const formatter = casing === 'title' 
        ? (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
        : (str: string) => str.toUpperCase();

      if (commodity) filteredUrl += `&filters[commodity]=${encodeURIComponent(formatter(c))}`;
      if (market) filteredUrl += `&filters[market]=${encodeURIComponent(formatter(m))}`;
      
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
    return records.map((r: any) => {
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
  } catch (error) {
    console.error('Error fetching live mandi prices:', error);
    return [];
  }
}

/**
 * Fetches available crops and mandis from the most recent records in the API and local database.
 */
export async function getMandiMetaData(): Promise<{ crops: string[], mandis: string[] }> {
  const crops = new Set<string>();
  const mandis = new Set<string>();

  // 1. Try to fetch from API if key is available
  if (MANDI_API_KEY) {
    try {
      // Fetch a larger sample to get more variety
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${MANDI_API_KEY}&format=json&limit=1000`;
      const res = await axios.get(url);
      const records = res.data?.records || [];

      records.forEach((r: any) => {
        if (r.commodity) crops.add(String(r.commodity).toLowerCase());
        if (r.market) mandis.add(String(r.market).toLowerCase());
      });
    } catch (error) {
      console.error('Error fetching mandi metadata from API:', error);
    }
  }

  // 2. Always fetch from DB to include seeded data
  try {
    const dbRes = await query('SELECT DISTINCT crop, mandi FROM mandi_prices');
    dbRes.rows.forEach(r => {
      if (r.crop) crops.add(r.crop.toLowerCase());
      if (r.mandi) mandis.add(r.mandi.toLowerCase());
    });
  } catch (dbErr) {
    console.error('Error fetching meta from DB:', dbErr);
  }

  // 3. Ensure core demo crops are always present if DB is empty for some reason
  const coreCrops = ['rice', 'wheat', 'cotton', 'mustard', 'maize', 'soybean', 'potato', 'tomato', 'onion'];
  const coreMandis = ['agra', 'amravati', 'gulabbagh', 'ujjain', 'indore', 'kolar', 'vashi', 'azadpur', 'lasalgaon'];
  
  coreCrops.forEach(c => crops.add(c));
  coreMandis.forEach(m => mandis.add(m));

  return {
    crops: Array.from(crops).sort(),
    mandis: Array.from(mandis).sort()
  };
}
