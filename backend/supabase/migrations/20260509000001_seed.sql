-- Seed mandi prices (Historical 30 days for demo with realistic smooth curves)
-- Tomato, Kolar (Uptrend curve)
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

-- Onion, Lasalgaon (Downtrend to stable curve)
INSERT INTO mandi_prices (crop, mandi, date, price) VALUES
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '30 days', 22.00),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '25 days', 20.50),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '20 days', 18.00),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '15 days', 16.80),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '10 days', 14.50),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '5 days', 14.00),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '1 day', 14.50)
ON CONFLICT (crop, mandi, date) DO NOTHING;

-- Seed Historical Forecasts to demonstrate "Track Record" (Prediction Accuracy)
INSERT INTO forecasts (crop, mandi, forecast_date, price_low, price_high, trend, confidence, drivers) VALUES
('tomato', 'kolar', CURRENT_DATE - INTERVAL '3 days', 36.00, 39.00, 'up', 88, '["Expected slight dip resolved", "Market volume adjusting"]'),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '2 days', 37.00, 41.00, 'up', 92, '["Steady uptrend visible", "Local transport disruptions"]'),
('tomato', 'kolar', CURRENT_DATE - INTERVAL '1 day', 38.00, 42.00, 'up', 90, '["Peak demand arriving", "Low buffer stocks in mandi"]'),
('tomato', 'kolar', CURRENT_DATE, 38.00, 44.00, 'up', 82, '["Increased demand in metropolitan centers driving prices", "Lower arrivals in local markets due to harvest delays", "Favorable weather supporting quality but reducing immediate volume"]'),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '2 days', 13.00, 15.00, 'stable', 75, '["Prices hitting bottom support", "Export ban continues"]'),
('onion', 'lasalgaon', CURRENT_DATE - INTERVAL '1 day', 13.50, 15.50, 'stable', 78, '["Mild recovery seen", "Traders holding stock"]')
ON CONFLICT (crop, mandi, forecast_date) DO NOTHING;

-- Link Historical Forecasts to Actual Prices for Track Record Accuracy
INSERT INTO forecast_actuals (forecast_id, actual_price)
SELECT id, 37.50 FROM forecasts WHERE crop='tomato' AND mandi='kolar' AND forecast_date = CURRENT_DATE - INTERVAL '3 days'
ON CONFLICT DO NOTHING;

INSERT INTO forecast_actuals (forecast_id, actual_price)
SELECT id, 39.00 FROM forecasts WHERE crop='tomato' AND mandi='kolar' AND forecast_date = CURRENT_DATE - INTERVAL '2 days'
ON CONFLICT DO NOTHING;

INSERT INTO forecast_actuals (forecast_id, actual_price)
SELECT id, 40.00 FROM forecasts WHERE crop='tomato' AND mandi='kolar' AND forecast_date = CURRENT_DATE - INTERVAL '1 day'
ON CONFLICT DO NOTHING;

INSERT INTO forecast_actuals (forecast_id, actual_price)
SELECT id, 14.00 FROM forecasts WHERE crop='onion' AND mandi='lasalgaon' AND forecast_date = CURRENT_DATE - INTERVAL '2 days'
ON CONFLICT DO NOTHING;

INSERT INTO forecast_actuals (forecast_id, actual_price)
SELECT id, 14.50 FROM forecasts WHERE crop='onion' AND mandi='lasalgaon' AND forecast_date = CURRENT_DATE - INTERVAL '1 day'
ON CONFLICT DO NOTHING;

-- Community Signals (Sample Farmers with varying resources for Recommendations)
INSERT INTO farmers (crop, land_acres, has_irrigation, has_storage, mandi, district, language) VALUES
('tomato', 2.5, true, false, 'kolar', 'kolar', 'kannada'),
('tomato', 1.0, false, false, 'kolar', 'kolar', 'kannada'),
('tomato', 3.0, true, true, 'kolar', 'kolar', 'kannada'),
('onion', 5.0, true, true, 'lasalgaon', 'nashik', 'marathi');
