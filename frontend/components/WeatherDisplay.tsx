'use client';

import { useState } from 'react';
import axios from 'axios';
import { FaSave, FaTemperatureHigh, FaTint, FaWind, FaCompress } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface WeatherDisplayProps {
  weatherData: any;
  location: any;
  onRecordSaved: () => void;
}

export default function WeatherDisplay({ weatherData, location, onRecordSaved }: WeatherDisplayProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSaveRecord = async () => {
    if (!startDate || !endDate) {
      setMessage('Please select date range');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await axios.post(`${API_URL}/weather/records`, {
        location: {
          type: 'city',
          value: location.city
        },
        dateRange: {
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        }
      });

      setMessage('Weather record saved successfully!');
      onRecordSaved();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const { current, forecast } = weatherData;

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Current Weather in {location.city}, {location.country}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Main Weather Info */}
          <div className="flex items-center gap-6">
            <img
              src={`https://openweathermap.org/img/wn/${current.icon}@4x.png`}
              alt={current.description}
              className="w-32 h-32"
            />
            <div>
              <div className="text-5xl font-bold text-gray-800">
                {Math.round(current.temp)}°C
              </div>
              <div className="text-xl text-gray-600 capitalize mt-2">
                {current.description}
              </div>
              <div className="text-gray-500 mt-1">
                Feels like {Math.round(current.feelsLike)}°C
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FaTint />
                <span className="font-medium">Humidity</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {current.humidity}%
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <FaWind />
                <span className="font-medium">Wind Speed</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {current.windSpeed} m/s
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <FaCompress />
                <span className="font-medium">Pressure</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {current.pressure} hPa
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <FaTemperatureHigh />
                <span className="font-medium">Temperature</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(current.temp)}°C
              </div>
            </div>
          </div>
        </div>

        {/* Save Record Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">Save This Weather Record</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleSaveRecord}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <FaSave />
              {saving ? 'Saving...' : 'Save Record'}
            </button>
          </div>
          {message && (
            <div className={`mt-3 p-3 rounded-lg ${
              message.includes('success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecast.map((day: any, index: number) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center">
              <div className="font-medium text-gray-700 mb-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="w-16 h-16 mx-auto"
              />
              <div className="text-sm capitalize text-gray-600 mb-2">
                {day.description}
              </div>
              <div className="font-bold text-lg text-gray-800">
                {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <FaTint className="inline mr-1" />
                {day.humidity}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
