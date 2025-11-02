'use client';

import { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface WeatherSearchProps {
  onWeatherData: (data: any, location: any) => void;
}

export default function WeatherSearch({ onWeatherData }: WeatherSearchProps) {
  const [searchType, setSearchType] = useState<'city' | 'zip' | 'coordinates'>('city');
  const [searchValue, setSearchValue] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let params: any = { type: searchType };

      if (searchType === 'coordinates') {
        params.lat = parseFloat(lat);
        params.lon = parseFloat(lon);
      } else {
        params.value = searchValue;
      }

      const response = await axios.get(`${API_URL}/weather/current`, { params });
      
      onWeatherData(response.data, {
        city: response.data.current.city,
        country: response.data.current.country,
        coordinates: response.data.current.coordinates
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchType('coordinates');
          setLat(position.coords.latitude.toString());
          setLon(position.coords.longitude.toString());
        },
        (error) => {
          setError('Unable to get your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Weather</h2>
      
      <form onSubmit={handleSearch}>
        {/* Search Type Selector */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setSearchType('city')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              searchType === 'city'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            City Name
          </button>
          <button
            type="button"
            onClick={() => setSearchType('zip')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              searchType === 'zip'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ZIP Code
          </button>
          <button
            type="button"
            onClick={() => setSearchType('coordinates')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              searchType === 'coordinates'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Coordinates
          </button>
        </div>

        {/* Input Fields */}
        <div className="flex gap-4 mb-4">
          {searchType === 'coordinates' ? (
            <>
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </>
          ) : (
            <input
              type="text"
              placeholder={searchType === 'city' ? 'Enter city name (e.g., London)' : 'Enter ZIP code'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <FaSearch />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Get Current Location Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <FaMapMarkerAlt />
          Use My Current Location
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
