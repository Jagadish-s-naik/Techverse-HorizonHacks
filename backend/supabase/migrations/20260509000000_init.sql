-- Anonymous farmer profiles
CREATE TABLE farmers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop          VARCHAR(50) NOT NULL,
  land_acres    DECIMAL(5,2),
  has_irrigation BOOLEAN DEFAULT false,
  has_storage   BOOLEAN DEFAULT false,
  mandi         VARCHAR(100) NOT NULL,
  district      VARCHAR(100) NOT NULL,
  language      VARCHAR(20) DEFAULT 'hindi',
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Seeded mandi price data
CREATE TABLE mandi_prices (
  id       SERIAL PRIMARY KEY,
  crop     VARCHAR(50) NOT NULL,
  mandi    VARCHAR(100) NOT NULL,
  date     DATE NOT NULL,
  price    DECIMAL(8,2) NOT NULL,
  UNIQUE(crop, mandi, date)
);

-- Daily computed forecasts
CREATE TABLE forecasts (
  id            SERIAL PRIMARY KEY,
  crop          VARCHAR(50) NOT NULL,
  mandi         VARCHAR(100) NOT NULL,
  forecast_date DATE NOT NULL,
  price_low     DECIMAL(8,2),
  price_high    DECIMAL(8,2),
  trend         VARCHAR(10),
  confidence    INTEGER,
  drivers       JSONB,           -- array of 3 bullet strings
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(crop, mandi, forecast_date)
);

-- Track record: actuals vs forecasts
CREATE TABLE forecast_actuals (
  forecast_id   INTEGER REFERENCES forecasts(id),
  actual_price  DECIMAL(8,2),
  recorded_at   TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(forecast_id)
);
