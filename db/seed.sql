-- Seed mandi prices (Historical 30 days for demo)
-- Tomato, Kolar
INSERT INTO mandi_prices (crop, mandi, date, price) VALUES
('tomato', 'kolar', CURRENT_DATE - INTERVAL '30 days', 18.50),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '29 days', 19.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '28 days', 18.80),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '27 days', 19.50),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '26 days', 20.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '25 days', 21.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '24 days', 20.50),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '23 days', 22.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '22 days', 23.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '21 days', 22.50),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '20 days', 24.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '19 days', 25.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '18 days', 26.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '17 days', 25.50),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '16 days', 27.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '15 days', 28.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '14 days', 29.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '13 days', 30.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '12 days', 31.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '11 days', 30.50),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '10 days', 32.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '9 days', 33.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '8 days', 34.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '7 days', 35.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '6 days', 36.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '5 days', 37.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '4 days', 38.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '3 days', 37.50),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '2 days', 39.00),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '1 day', 40.00)
ON CONFLICT (crop, mandi, date) DO NOTHING;

-- Onion, Lasalgaon
INSERT INTO mandi_prices (crop, mandi, date, price) VALUES
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '30 days', 12.00),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '25 days', 12.50),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '20 days', 13.00),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '15 days', 12.80),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '10 days', 13.50),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '5 days', 14.00),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '1 day', 14.50)
ON CONFLICT (crop, mandi, date) DO NOTHING;

-- Mock Forecast for today
INSERT INTO forecasts (crop, mandi, forecast_date, price_low, price_high, trend, confidence, drivers) VALUES
('tomato', 'kolar', CURRENT_DATE, 38.00, 44.00, 'up', 82, '["Increased demand in metropolitan centers driving prices", "Lower arrivals in local markets due to harvest delays", "Favorable weather supporting quality but reducing immediate volume"]')
ON CONFLICT (crop, mandi, forecast_date) DO NOTHING;

-- Community Signals (Sample Farmers)
INSERT INTO farmers (crop, land_acres, has_irrigation, has_storage, mandi, district, language) 
SELECT 'tomato', 2.5, true, false, 'kolar', 'kolar', 'kannada' WHERE NOT EXISTS (SELECT 1 FROM farmers WHERE crop='tomato' AND mandi='kolar' AND land_acres=2.5);
INSERT INTO farmers (crop, land_acres, has_irrigation, has_storage, mandi, district, language) 
SELECT 'tomato', 1.0, false, false, 'kolar', 'kolar', 'kannada' WHERE NOT EXISTS (SELECT 1 FROM farmers WHERE crop='tomato' AND mandi='kolar' AND land_acres=1.0);
INSERT INTO farmers (crop, land_acres, has_irrigation, has_storage, mandi, district, language) 
SELECT 'tomato', 3.0, true, true, 'kolar', 'kolar', 'kannada' WHERE NOT EXISTS (SELECT 1 FROM farmers WHERE crop='tomato' AND mandi='kolar' AND land_acres=3.0);
INSERT INTO farmers (crop, land_acres, has_irrigation, has_storage, mandi, district, language) 
SELECT 'onion', 5.0, true, true, 'lasalgaon', 'nashik', 'marathi' WHERE NOT EXISTS (SELECT 1 FROM farmers WHERE crop='onion' AND mandi='lasalgaon' AND land_acres=5.0);

-- Additional generated seeds for demo to prevent 404s --
INSERT INTO mandi_prices (crop, mandi, date, price) VALUES
('chickpea', 'indore', CURRENT_DATE - INTERVAL '30 days', 53.22),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '29 days', 56.97),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '28 days', 54.73),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '27 days', 55.73),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '26 days', 57.17),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '25 days', 56.43),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '24 days', 56.25),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '23 days', 53.77),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '22 days', 55.41),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '21 days', 54.87),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '20 days', 52.74),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '19 days', 57.26),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '18 days', 57.02),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '17 days', 53.93),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '16 days', 57.36),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '15 days', 53.89),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '14 days', 52.54),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '13 days', 53.45),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '12 days', 54.07),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '11 days', 52.97),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '10 days', 53.04),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '9 days', 53.48),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '8 days', 54.65),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '7 days', 56.35),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '6 days', 55.13),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '5 days', 56.58),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '4 days', 57.41),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '3 days', 52.71),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '2 days', 55.65),
('chickpea', 'indore', CURRENT_DATE - INTERVAL '1 days', 52.53)
ON CONFLICT (crop, mandi, date) DO NOTHING;
INSERT INTO mandi_prices (crop, mandi, date, price) VALUES
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '30 days', 25.54),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '29 days', 25.97),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '28 days', 27.02),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '27 days', 27.04),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '26 days', 30.14),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '25 days', 27.37),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '24 days', 27.64),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '23 days', 29.42),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '22 days', 29.55),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '21 days', 28.22),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '20 days', 26.08),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '19 days', 27.36),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '18 days', 30.34),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '17 days', 27.94),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '16 days', 28.48),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '15 days', 28.55),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '14 days', 29.58),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '13 days', 26.82),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '12 days', 26.24),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '11 days', 30.14),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '10 days', 28.84),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '9 days', 30.41),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '8 days', 27.34),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '7 days', 29.68),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '6 days', 25.95),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '5 days', 28.30),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '4 days', 27.31),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '3 days', 26.26),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '2 days', 27.25),
('wheat', 'azadpur', CURRENT_DATE - INTERVAL '1 days', 26.22)
ON CONFLICT (crop, mandi, date) DO NOTHING;
INSERT INTO mandi_prices (crop, mandi, date, price) VALUES
('rice', 'vashi', CURRENT_DATE - INTERVAL '30 days', 40.51),
('rice', 'vashi', CURRENT_DATE - INTERVAL '29 days', 41.02),
('rice', 'vashi', CURRENT_DATE - INTERVAL '28 days', 42.06),
('rice', 'vashi', CURRENT_DATE - INTERVAL '27 days', 42.63),
('rice', 'vashi', CURRENT_DATE - INTERVAL '26 days', 41.65),
('rice', 'vashi', CURRENT_DATE - INTERVAL '25 days', 44.15),
('rice', 'vashi', CURRENT_DATE - INTERVAL '24 days', 40.51),
('rice', 'vashi', CURRENT_DATE - INTERVAL '23 days', 40.88),
('rice', 'vashi', CURRENT_DATE - INTERVAL '22 days', 40.90),
('rice', 'vashi', CURRENT_DATE - INTERVAL '21 days', 41.61),
('rice', 'vashi', CURRENT_DATE - INTERVAL '20 days', 43.04),
('rice', 'vashi', CURRENT_DATE - INTERVAL '19 days', 39.60),
('rice', 'vashi', CURRENT_DATE - INTERVAL '18 days', 42.95),
('rice', 'vashi', CURRENT_DATE - INTERVAL '17 days', 39.80),
('rice', 'vashi', CURRENT_DATE - INTERVAL '16 days', 43.16),
('rice', 'vashi', CURRENT_DATE - INTERVAL '15 days', 43.40),
('rice', 'vashi', CURRENT_DATE - INTERVAL '14 days', 42.27),
('rice', 'vashi', CURRENT_DATE - INTERVAL '13 days', 40.55),
('rice', 'vashi', CURRENT_DATE - INTERVAL '12 days', 39.82),
('rice', 'vashi', CURRENT_DATE - INTERVAL '11 days', 41.78),
('rice', 'vashi', CURRENT_DATE - INTERVAL '10 days', 41.51),
('rice', 'vashi', CURRENT_DATE - INTERVAL '9 days', 41.86),
('rice', 'vashi', CURRENT_DATE - INTERVAL '8 days', 42.38),
('rice', 'vashi', CURRENT_DATE - INTERVAL '7 days', 41.51),
('rice', 'vashi', CURRENT_DATE - INTERVAL '6 days', 42.60),
('rice', 'vashi', CURRENT_DATE - INTERVAL '5 days', 42.43),
('rice', 'vashi', CURRENT_DATE - INTERVAL '4 days', 40.86),
('rice', 'vashi', CURRENT_DATE - INTERVAL '3 days', 41.14),
('rice', 'vashi', CURRENT_DATE - INTERVAL '2 days', 40.79),
('rice', 'vashi', CURRENT_DATE - INTERVAL '1 days', 43.05)
ON CONFLICT (crop, mandi, date) DO NOTHING;
INSERT INTO mandi_prices (crop, mandi, date, price) VALUES
('mustard', 'indore', CURRENT_DATE - INTERVAL '30 days', 62.14),
('mustard', 'indore', CURRENT_DATE - INTERVAL '29 days', 58.61),
('mustard', 'indore', CURRENT_DATE - INTERVAL '28 days', 58.68),
('mustard', 'indore', CURRENT_DATE - INTERVAL '27 days', 57.92),
('mustard', 'indore', CURRENT_DATE - INTERVAL '26 days', 57.86),
('mustard', 'indore', CURRENT_DATE - INTERVAL '25 days', 58.21),
('mustard', 'indore', CURRENT_DATE - INTERVAL '24 days', 61.59),
('mustard', 'indore', CURRENT_DATE - INTERVAL '23 days', 59.21),
('mustard', 'indore', CURRENT_DATE - INTERVAL '22 days', 58.73),
('mustard', 'indore', CURRENT_DATE - INTERVAL '21 days', 57.89),
('mustard', 'indore', CURRENT_DATE - INTERVAL '20 days', 61.07),
('mustard', 'indore', CURRENT_DATE - INTERVAL '19 days', 59.19),
('mustard', 'indore', CURRENT_DATE - INTERVAL '18 days', 61.24),
('mustard', 'indore', CURRENT_DATE - INTERVAL '17 days', 62.42),
('mustard', 'indore', CURRENT_DATE - INTERVAL '16 days', 58.01),
('mustard', 'indore', CURRENT_DATE - INTERVAL '15 days', 60.04),
('mustard', 'indore', CURRENT_DATE - INTERVAL '14 days', 58.60),
('mustard', 'indore', CURRENT_DATE - INTERVAL '13 days', 59.92),
('mustard', 'indore', CURRENT_DATE - INTERVAL '12 days', 62.32),
('mustard', 'indore', CURRENT_DATE - INTERVAL '11 days', 58.03),
('mustard', 'indore', CURRENT_DATE - INTERVAL '10 days', 61.43),
('mustard', 'indore', CURRENT_DATE - INTERVAL '9 days', 61.63),
('mustard', 'indore', CURRENT_DATE - INTERVAL '8 days', 60.41),
('mustard', 'indore', CURRENT_DATE - INTERVAL '7 days', 58.95),
('mustard', 'indore', CURRENT_DATE - INTERVAL '6 days', 59.88),
('mustard', 'indore', CURRENT_DATE - INTERVAL '5 days', 57.51),
('mustard', 'indore', CURRENT_DATE - INTERVAL '4 days', 58.10),
('mustard', 'indore', CURRENT_DATE - INTERVAL '3 days', 58.36),
('mustard', 'indore', CURRENT_DATE - INTERVAL '2 days', 61.29),
('mustard', 'indore', CURRENT_DATE - INTERVAL '1 days', 59.33)
ON CONFLICT (crop, mandi, date) DO NOTHING;
INSERT INTO mandi_prices (crop, mandi, date, price) VALUES
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '30 days', 15.95),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '29 days', 14.61),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '28 days', 15.29),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '27 days', 13.19),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '26 days', 16.33),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '25 days', 16.74),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '24 days', 13.89),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '23 days', 16.29),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '22 days', 17.03),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '21 days', 14.07),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '20 days', 14.06),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '19 days', 12.90),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '18 days', 15.60),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '17 days', 15.74),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '16 days', 16.87),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '15 days', 14.22),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '14 days', 14.61),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '13 days', 13.06),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '12 days', 17.09),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '11 days', 13.60),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '10 days', 14.01),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '9 days', 12.92),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '8 days', 14.74),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '7 days', 16.38),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '6 days', 13.23),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '5 days', 13.39),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '4 days', 13.62),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '3 days', 12.57),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '2 days', 14.09),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '1 days', 16.59)
ON CONFLICT (crop, mandi, date) DO NOTHING;

INSERT INTO farmers (crop, land_acres, has_irrigation, has_storage, mandi, district, language) VALUES
('chickpea', 4.0, false, false, 'indore', 'indore', 'hindi'),
('wheat', 10.0, true, true, 'azadpur', 'delhi', 'hindi'),
('rice', 3.0, true, false, 'vashi', 'mumbai', 'marathi'),
('mustard', 2.0, false, false, 'indore', 'indore', 'hindi'),
('potato', 5.0, true, true, 'agra', 'agra', 'hindi'),
('cotton', 8.0, true, false, 'amravati', 'amravati', 'marathi'),
('maize', 4.0, true, false, 'gulabbagh', 'purnia', 'hindi'),
('soybean', 6.0, true, true, 'ujjain', 'ujjain', 'hindi')
ON CONFLICT DO NOTHING;

-- Seed prices for the new targets
INSERT INTO mandi_prices (crop, mandi, date, price) 
SELECT 'potato', 'agra', CURRENT_DATE - (i || ' days')::interval, 12 + random()*2
FROM generate_series(0, 30) i
ON CONFLICT DO NOTHING;

INSERT INTO mandi_prices (crop, mandi, date, price) 
SELECT 'cotton', 'amravati', CURRENT_DATE - (i || ' days')::interval, 60 + random()*10
FROM generate_series(0, 30) i
ON CONFLICT DO NOTHING;

INSERT INTO mandi_prices (crop, mandi, date, price) 
SELECT 'maize', 'gulabbagh', CURRENT_DATE - (i || ' days')::interval, 20 + random()*5
FROM generate_series(0, 30) i
ON CONFLICT DO NOTHING;

INSERT INTO mandi_prices (crop, mandi, date, price) 
SELECT 'soybean', 'ujjain', CURRENT_DATE - (i || ' days')::interval, 45 + random()*8
FROM generate_series(0, 30) i
ON CONFLICT DO NOTHING;
