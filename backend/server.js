const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = require('./db/connection');
const weatherRoutes = require('./routes/weather');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;
const fs = require('fs');

// Initialize database and start server
async function initializeDatabase() {
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL database');
    
    // Create tables if they don't exist
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Database schema initialized');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API endpoints available at http://localhost:${PORT}/api/weather`);
    });
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(1);
  }
}

initializeDatabase();

module.exports = app;
