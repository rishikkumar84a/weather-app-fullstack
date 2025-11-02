const express = require('express');
const router = express.Router();
const WeatherRecord = require('../models/WeatherRecordPostgres');
const weatherService = require('../services/weatherService');
const { weatherQuerySchema, createWeatherRecordSchema, updateWeatherRecordSchema } = require('../validators/weatherValidator');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Get current weather (doesn't save to DB)
router.get('/current', async (req, res) => {
  try {
    const { error, value } = weatherQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const weatherData = await weatherService.getCompleteWeatherData(value);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE - Save weather record with validation
router.post('/records', async (req, res) => {
  try {
    const { error, value } = createWeatherRecordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Fetch weather data with date range filtering
    const weatherData = await weatherService.getCompleteWeatherData(value.location, value.dateRange);

    // Create new record using PostgreSQL static method
    const newRecord = await WeatherRecord.create({
      location: weatherData.location,
      weatherData: {
        current: weatherData.current,
        forecast: weatherData.forecast
      },
      dateRange: value.dateRange,
      userInput: {
        searchType: value.location.type,
        searchValue: value.location.value
      }
    });

    res.status(201).json({ 
      message: 'Weather record created successfully',
      record: newRecord 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all weather records
router.get('/records', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'created_at DESC' } = req.query;
    
    const result = await WeatherRecord.findAll({ page, limit, sort });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get single weather record by ID
router.get('/records/:id', async (req, res) => {
  try {
    const record = await WeatherRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update weather record with validation
router.put('/records/:id', async (req, res) => {
  try {
    const { error, value } = updateWeatherRecordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let updateData = {};

    // If location is being updated, fetch new weather data
    if (value.location) {
      const weatherData = await weatherService.getCompleteWeatherData(value.location);
      updateData.location = weatherData.location;
      updateData.weatherData = {
        current: weatherData.current,
        forecast: weatherData.forecast
      };
      updateData.userInput = {
        searchType: value.location.type,
        searchValue: value.location.value
      };
    }

    // Update date range if provided
    if (value.dateRange) {
      updateData.dateRange = value.dateRange;
    }

    const record = await WeatherRecord.update(req.params.id, updateData);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ 
      message: 'Weather record updated successfully',
      record 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete weather record
router.delete('/records/:id', async (req, res) => {
  try {
    const record = await WeatherRecord.delete(req.params.id);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ 
      message: 'Weather record deleted successfully',
      record 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EXPORT - Export data in various formats
router.get('/export/:format', async (req, res) => {
  try {
    const { format } = req.params;
    const records = await WeatherRecord.findAllForExport();

    if (!records || records.length === 0) {
      return res.status(404).json({ error: 'No records to export' });
    }

    switch (format) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.json');
        res.json(records);
        break;

      case 'csv':
        const fields = [
          'location.city',
          'location.country',
          'weatherData.current.temp',
          'weatherData.current.description',
          'dateRange.startDate',
          'dateRange.endDate',
          'createdAt'
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(records);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.csv');
        res.send(csv);
        break;

      case 'pdf':
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.pdf');
        
        doc.pipe(res);
        doc.fontSize(20).text('Weather Records', { align: 'center' });
        doc.moveDown();

        records.forEach((record, index) => {
          doc.fontSize(12).text(`Record ${index + 1}:`);
          doc.fontSize(10).text(`Location: ${record.location.city}, ${record.location.country}`);
          doc.text(`Temperature: ${record.weatherData.current.temp}°C`);
          doc.text(`Description: ${record.weatherData.current.description}`);
          doc.text(`Date Range: ${record.dateRange.startDate} to ${record.dateRange.endDate}`);
          doc.moveDown();
        });

        doc.end();
        break;

      case 'markdown':
        let markdown = '# Weather Records\n\n';
        records.forEach((record, index) => {
          markdown += `## Record ${index + 1}\n\n`;
          markdown += `- **Location**: ${record.location.city}, ${record.location.country}\n`;
          markdown += `- **Temperature**: ${record.weatherData.current.temp}°C\n`;
          markdown += `- **Description**: ${record.weatherData.current.description}\n`;
          markdown += `- **Humidity**: ${record.weatherData.current.humidity}%\n`;
          markdown += `- **Date Range**: ${record.dateRange.startDate} to ${record.dateRange.endDate}\n\n`;
        });

        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.md');
        res.send(markdown);
        break;

      default:
        res.status(400).json({ error: 'Invalid format. Use json, csv, pdf, or markdown' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
