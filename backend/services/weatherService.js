const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getCurrentWeather(location) {
    try {
      let url = '';
      
      if (location.type === 'city') {
        url = `${BASE_URL}/weather?q=${location.value}&appid=${WEATHER_API_KEY}&units=metric`;
      } else if (location.type === 'zip') {
        // ZIP code format: zip,country_code
        // If no country code provided, detect based on ZIP format:
        // Indian PIN codes are 6 digits, US ZIP codes are 5 or 5+4 digits
        let zipValue = location.value;
        if (!zipValue.includes(',')) {
          // Auto-detect country based on format
          const isIndianPIN = /^\d{6}$/.test(zipValue);
          const countryCode = isIndianPIN ? 'IN' : 'US';
          zipValue = `${zipValue},${countryCode}`;
        }
        url = `${BASE_URL}/weather?zip=${zipValue}&appid=${WEATHER_API_KEY}&units=metric`;
      } else if (location.type === 'coordinates') {
        url = `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}&units=metric`;
      }

      const response = await axios.get(url);
      return {
        temp: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        main: response.data.weather[0].main,
        city: response.data.name,
        country: response.data.sys.country,
        coordinates: {
          lat: response.data.coord.lat,
          lon: response.data.coord.lon
        }
      };
    } catch (error) {
      throw new Error(`Weather API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getForecast(location) {
    try {
      let url = '';
      
      if (location.type === 'city') {
        url = `${BASE_URL}/forecast?q=${location.value}&appid=${WEATHER_API_KEY}&units=metric`;
      } else if (location.type === 'zip') {
        // ZIP code format: zip,country_code
        // If no country code provided, detect based on ZIP format:
        // Indian PIN codes are 6 digits, US ZIP codes are 5 or 5+4 digits
        let zipValue = location.value;
        if (!zipValue.includes(',')) {
          // Auto-detect country based on format
          const isIndianPIN = /^\d{6}$/.test(zipValue);
          const countryCode = isIndianPIN ? 'IN' : 'US';
          zipValue = `${zipValue},${countryCode}`;
        }
        url = `${BASE_URL}/forecast?zip=${zipValue}&appid=${WEATHER_API_KEY}&units=metric`;
      } else if (location.type === 'coordinates') {
        url = `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}&units=metric`;
      }

      const response = await axios.get(url);
      
      // Group forecast by day (5-day forecast)
      const dailyForecasts = {};
      response.data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date: date,
            temps: [],
            humidity: item.main.humidity,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            main: item.weather[0].main
          };
        }
        dailyForecasts[date].temps.push(item.main.temp);
      });

      // Convert to array and calculate min/max/avg temps
      const forecast = Object.values(dailyForecasts).slice(0, 5).map(day => ({
        date: day.date,
        temp: {
          min: Math.min(...day.temps),
          max: Math.max(...day.temps),
          day: day.temps.reduce((a, b) => a + b, 0) / day.temps.length
        },
        humidity: day.humidity,
        description: day.description,
        icon: day.icon,
        main: day.main
      }));

      return forecast;
    } catch (error) {
      throw new Error(`Forecast API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getCompleteWeatherData(location, dateRange = null) {
    const [current, forecast] = await Promise.all([
      this.getCurrentWeather(location),
      this.getForecast(location)
    ]);

    // If dateRange is provided, filter forecast to only include dates in range
    let filteredForecast = forecast;
    let dateRangeInfo = null;
    
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      // Calculate how many days in the range
      const daysDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      filteredForecast = forecast.filter(day => {
        const forecastDate = new Date(day.date);
        return forecastDate >= startDate && forecastDate <= endDate;
      });

      dateRangeInfo = {
        requestedDays: daysDifference,
        availableDays: filteredForecast.length,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };

      // If no forecast data matches the date range, still include original forecast
      if (filteredForecast.length === 0) {
        filteredForecast = forecast;
      }
    }

    return {
      current,
      forecast: filteredForecast,
      dateRangeInfo,
      location: {
        city: current.city,
        country: current.country,
        coordinates: current.coordinates
      }
    };
  }
}

module.exports = new WeatherService();
