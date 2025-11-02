'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface WeatherRecordsProps {
  refreshTrigger: number;
}

export default function WeatherRecords({ refreshTrigger }: WeatherRecordsProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [refreshTrigger]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/weather/records`);
      setRecords(response.data.records || []);
    } catch (err: any) {
      console.error('Failed to fetch records:', err);
      // If 404 or no records, just show empty state
      if (err.response?.status === 404 || err.message.includes('404')) {
        setRecords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.delete(`${API_URL}/weather/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const handleEdit = (record: any) => {
    setEditingId(record._id);
    setEditStartDate(new Date(record.dateRange.startDate).toISOString().split('T')[0]);
    setEditEndDate(new Date(record.dateRange.endDate).toISOString().split('T')[0]);
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.put(`${API_URL}/weather/records/${id}`, {
        dateRange: {
          startDate: new Date(editStartDate),
          endDate: new Date(editEndDate)
        }
      });
      setEditingId(null);
      fetchRecords();
    } catch (err) {
      alert('Failed to update record');
    }
  };

  const handleExport = async (format: string) => {
    try {
      const response = await axios.get(`${API_URL}/weather/export/${format}`, {
        responseType: format === 'pdf' ? 'blob' : 'text'
      });

      const blob = new Blob([response.data], {
        type: format === 'json' ? 'application/json' :
              format === 'csv' ? 'text/csv' :
              format === 'pdf' ? 'application/pdf' :
              'text/markdown'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather-data.${format}`;
      a.click();
    } catch (err) {
      alert('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Saved Weather Records</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('json')}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
          >
            <FaDownload /> JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-2"
          >
            <FaDownload /> CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center gap-2"
          >
            <FaDownload /> PDF
          </button>
          <button
            onClick={() => handleExport('markdown')}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm flex items-center gap-2"
          >
            <FaDownload /> MD
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No records saved yet. Search for weather and save records to see them here.
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={`https://openweathermap.org/img/wn/${record.weatherData.current.icon}@2x.png`}
                      alt="weather icon"
                      className="w-12 h-12"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {record.location.city}, {record.location.country}
                      </h3>
                      <p className="text-gray-600 capitalize">
                        {record.weatherData.current.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <span className="text-sm text-gray-500">Temperature</span>
                      <p className="font-bold text-gray-800">{Math.round(record.weatherData.current.temp)}°C</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Humidity</span>
                      <p className="font-bold text-gray-800">{record.weatherData.current.humidity}%</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Wind Speed</span>
                      <p className="font-bold text-gray-800">{record.weatherData.current.windSpeed} m/s</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Pressure</span>
                      <p className="font-bold text-gray-800">{record.weatherData.current.pressure} hPa</p>
                    </div>
                  </div>

                  {/* Display Forecast Data for Date Range */}
                  {record.weatherData.forecast && record.weatherData.forecast.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Forecast for Selected Date Range ({record.weatherData.forecast.length} days)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {record.weatherData.forecast.map((day: any, index: number) => (
                          <div key={index} className="bg-blue-50 p-2 rounded text-center">
                            <div className="text-xs text-gray-600 mb-1">
                              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <img
                              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                              alt={day.description}
                              className="w-10 h-10 mx-auto"
                            />
                            <div className="text-xs font-bold text-gray-800">
                              {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingId === record._id ? (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={editStartDate}
                            onChange={(e) => setEditStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            value={editEndDate}
                            onChange={(e) => setEditEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                        </div>
                        <button
                          onClick={() => handleUpdate(record._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Date Range:</span>{' '}
                      {new Date(record.dateRange.startDate).toLocaleDateString()} - {new Date(record.dateRange.endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
