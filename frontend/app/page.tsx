'use client';

import { useState } from 'react';
import WeatherSearch from '@/components/WeatherSearch';
import WeatherDisplay from '@/components/WeatherDisplay';
import WeatherRecords from '@/components/WeatherRecords';
import InfoButton from '@/components/InfoButton';
import YouTubeVideos from '@/components/YouTubeVideos';
import GoogleMapComponent from '@/components/GoogleMapComponent';

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [refreshRecords, setRefreshRecords] = useState(0);

  const handleWeatherData = (data: any, locationInfo: any) => {
    setWeatherData(data);
    setLocation(locationInfo);
  };

  const handleRecordSaved = () => {
    setRefreshRecords(prev => prev + 1);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">
          ⛅ Weather App
        </h1>
        <p className="text-gray-600 text-lg">
          Built by <span className="font-semibold text-indigo-600">Rishik Kumar Chaurasiya</span> - PMA Bootcamp Technical Assessment
        </p>
        <div className="mt-4">
          <InfoButton />
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <WeatherSearch onWeatherData={handleWeatherData} />
      </div>

      {/* Weather Display */}
      {weatherData && (
        <div className="mb-8">
          <WeatherDisplay 
            weatherData={weatherData} 
            location={location}
            onRecordSaved={handleRecordSaved}
          />
        </div>
      )}

      {/* YouTube Videos */}
      {location && (
        <div className="mb-8">
          <YouTubeVideos location={location.city} />
        </div>
      )}

      {/* Google Map */}
      {location?.coordinates && (
        <div className="mb-8">
          <GoogleMapComponent 
            lat={location.coordinates.lat} 
            lon={location.coordinates.lon}
            city={location.city}
          />
        </div>
      )}

      {/* Saved Records */}
      <div className="mb-8">
        <WeatherRecords refreshTrigger={refreshRecords} />
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-12 pb-4">
        <p>© 2025 Weather App | PMA Bootcamp AI Engineer Intern Technical Assessment</p>
      </footer>
    </main>
  );
}
