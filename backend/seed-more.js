import fs from 'fs';

const crops = [
  { crop: 'chickpea', mandi: 'indore', basePrice: 55 },
  { crop: 'wheat', mandi: 'azadpur', basePrice: 28 },
  { crop: 'rice', mandi: 'vashi', basePrice: 42 },
  { crop: 'mustard', mandi: 'indore', basePrice: 60 },
  { crop: 'onion', mandi: 'lasalgaon', basePrice: 15 } // Extend the existing onion
];

let sql = '\n-- Additional generated seeds for demo to prevent 404s --\n';

for (const { crop, mandi, basePrice } of crops) {
  let values = [];
  for (let i = 30; i >= 1; i--) {
    const fluctuation = (Math.random() - 0.5) * 5;
    const price = (basePrice + fluctuation).toFixed(2);
    values.push(`('${crop}', '${mandi}', CURRENT_DATE - INTERVAL '${i} days', ${price})`);
  }
  sql += `INSERT INTO mandi_prices (crop, mandi, date, price) VALUES\n` + values.join(',\n') + `\nON CONFLICT (crop, mandi, date) DO NOTHING;\n`;
}

// Add some sample farmers for these new crops to ensure no other 404s
sql += `
INSERT INTO farmers (crop, land_acres, has_irrigation, has_storage, mandi, district, language) VALUES
('chickpea', 4.0, false, false, 'indore', 'indore', 'hindi'),
('wheat', 10.0, true, true, 'azadpur', 'delhi', 'hindi'),
('rice', 3.0, true, false, 'vashi', 'mumbai', 'marathi'),
('mustard', 2.0, false, false, 'indore', 'indore', 'hindi')
ON CONFLICT DO NOTHING;
`;

fs.appendFileSync('../db/seed.sql', sql);
console.log('Successfully appended more data to seed.sql');
