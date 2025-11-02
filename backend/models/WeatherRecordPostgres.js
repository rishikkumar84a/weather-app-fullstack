const pool = require('../db/connection');

class WeatherRecord {
  // Create a new weather record
  static async create(data) {
    const { location, weatherData, dateRange, userInput } = data;
    
    const query = `
      INSERT INTO weather_records (
        city, country, latitude, longitude,
        current_temp, current_feels_like, current_humidity, current_pressure,
        current_wind_speed, current_description, current_icon, current_main,
        forecast_data, start_date, end_date, search_type, search_value
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    
    const values = [
      location.city,
      location.country,
      location.coordinates?.lat,
      location.coordinates?.lon,
      weatherData.current.temp,
      weatherData.current.feelsLike,
      weatherData.current.humidity,
      weatherData.current.pressure,
      weatherData.current.windSpeed,
      weatherData.current.description,
      weatherData.current.icon,
      weatherData.current.main,
      JSON.stringify(weatherData.forecast),
      dateRange.startDate,
      dateRange.endDate,
      userInput.searchType,
      userInput.searchValue
    ];
    
    const result = await pool.query(query, values);
    return this.formatRecord(result.rows[0]);
  }
  
  // Find all records with pagination
  static async findAll(options = {}) {
    const { page = 1, limit = 10, sort = 'created_at DESC' } = options;
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM weather_records';
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);
    
    const query = `
      SELECT * FROM weather_records
      ORDER BY ${sort}
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    return {
      records: result.rows.map(row => this.formatRecord(row)),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
  }
  
  // Find record by ID
  static async findById(id) {
    const query = 'SELECT * FROM weather_records WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatRecord(result.rows[0]);
  }
  
  // Update record
  static async update(id, data) {
    const { dateRange, location, weatherData, userInput } = data;
    
    let query = 'UPDATE weather_records SET updated_at = CURRENT_TIMESTAMP';
    const values = [];
    let paramCount = 1;
    
    if (dateRange) {
      query += `, start_date = $${paramCount}, end_date = $${paramCount + 1}`;
      values.push(dateRange.startDate, dateRange.endDate);
      paramCount += 2;
    }
    
    if (location && weatherData) {
      query += `, city = $${paramCount}, country = $${paramCount + 1}, 
                 latitude = $${paramCount + 2}, longitude = $${paramCount + 3},
                 current_temp = $${paramCount + 4}, current_feels_like = $${paramCount + 5},
                 current_humidity = $${paramCount + 6}, current_pressure = $${paramCount + 7},
                 current_wind_speed = $${paramCount + 8}, current_description = $${paramCount + 9},
                 current_icon = $${paramCount + 10}, current_main = $${paramCount + 11},
                 forecast_data = $${paramCount + 12}`;
      
      values.push(
        location.city,
        location.country,
        location.coordinates?.lat,
        location.coordinates?.lon,
        weatherData.current.temp,
        weatherData.current.feelsLike,
        weatherData.current.humidity,
        weatherData.current.pressure,
        weatherData.current.windSpeed,
        weatherData.current.description,
        weatherData.current.icon,
        weatherData.current.main,
        JSON.stringify(weatherData.forecast)
      );
      paramCount += 13;
    }
    
    if (userInput) {
      query += `, search_type = $${paramCount}, search_value = $${paramCount + 1}`;
      values.push(userInput.searchType, userInput.searchValue);
      paramCount += 2;
    }
    
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatRecord(result.rows[0]);
  }
  
  // Delete record
  static async delete(id) {
    const query = 'DELETE FROM weather_records WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatRecord(result.rows[0]);
  }
  
  // Get all records for export
  static async findAllForExport() {
    const query = 'SELECT * FROM weather_records ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows.map(row => this.formatRecord(row));
  }
  
  // Format record to match MongoDB structure
  static formatRecord(row) {
    return {
      _id: row.id,
      location: {
        city: row.city,
        country: row.country,
        coordinates: {
          lat: parseFloat(row.latitude),
          lon: parseFloat(row.longitude)
        }
      },
      weatherData: {
        current: {
          temp: parseFloat(row.current_temp),
          feelsLike: parseFloat(row.current_feels_like),
          humidity: row.current_humidity,
          pressure: row.current_pressure,
          windSpeed: parseFloat(row.current_wind_speed),
          description: row.current_description,
          icon: row.current_icon,
          main: row.current_main
        },
        forecast: row.forecast_data
      },
      dateRange: {
        startDate: row.start_date,
        endDate: row.end_date
      },
      userInput: {
        searchType: row.search_type,
        searchValue: row.search_value
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = WeatherRecord;
