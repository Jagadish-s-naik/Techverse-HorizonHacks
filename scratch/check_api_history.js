import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('c:/xampp/htdocs/FarmSight/Techverse-HorizonHacks/backend/.env') });

const MANDI_API_KEY = process.env.MANDI_API_KEY;

async function checkApiHistory(commodity, market) {
    console.log(`Checking history for ${commodity} in ${market}...`);
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${MANDI_API_KEY}&format=json&limit=100&filters[commodity]=${encodeURIComponent(commodity)}&filters[market]=${encodeURIComponent(market)}`;
    
    try {
        const res = await axios.get(url);
        const records = res.data?.records || [];
        console.log(`Total records found: ${records.length}`);
        
        const dates = new Set();
        records.forEach(r => {
            dates.add(r.arrival_date);
        });
        
        console.log(`Unique dates found: ${Array.from(dates).join(', ')}`);
        console.log(`Number of unique dates: ${dates.size}`);
    } catch (e) {
        console.error('Error fetching data:', e.message);
    }
}

async function run() {
    await checkApiHistory('Potato', 'Agra');
    await checkApiHistory('Onion', 'Mumbai');
    await checkApiHistory('Tomato', 'Bangalore');
}

run();
