-- Weather App PostgreSQL Schema

-- Create weather_records table
CREATE TABLE IF NOT EXISTS weather_records (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Current weather data
    current_temp DECIMAL(5, 2),
    current_feels_like DECIMAL(5, 2),
    current_humidity INTEGER,
    current_pressure INTEGER,
    current_wind_speed DECIMAL(5, 2),
    current_description VARCHAR(255),
    current_icon VARCHAR(50),
    current_main VARCHAR(100),
    
    -- Forecast data (stored as JSON)
    forecast_data JSONB,
    
    -- Date range
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- User input metadata
    search_type VARCHAR(20) NOT NULL CHECK (search_type IN ('city', 'zip', 'coordinates')),
    search_value VARCHAR(255) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on city for faster searches
CREATE INDEX IF NOT EXISTS idx_weather_records_city ON weather_records(city);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_weather_records_created_at ON weather_records(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_weather_records_updated_at ON weather_records;
CREATE TRIGGER update_weather_records_updated_at
    BEFORE UPDATE ON weather_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
