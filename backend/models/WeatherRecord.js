const mongoose = require('mongoose');

const weatherRecordSchema = new mongoose.Schema({
  location: {
    city: { type: String, required: true },
    country: String,
    coordinates: {
      lat: Number,
      lon: Number
    }
  },
  weatherData: {
    current: {
      temp: Number,
      feelsLike: Number,
      humidity: Number,
      pressure: Number,
      windSpeed: Number,
      description: String,
      icon: String,
      main: String
    },
    forecast: [{
      date: String,
      temp: {
        min: Number,
        max: Number,
        day: Number
      },
      humidity: Number,
      description: String,
      icon: String,
      main: String
    }]
  },
  dateRange: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  userInput: {
    searchType: { type: String, enum: ['city', 'zip', 'coordinates'], required: true },
    searchValue: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

weatherRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WeatherRecord', weatherRecordSchema);
