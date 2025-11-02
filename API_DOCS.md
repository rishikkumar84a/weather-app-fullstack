# API Documentation

## Base URL
```
http://localhost:5001/api
```

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Weather API is running"
}
```

---

### 2. Get Current Weather (No Save)

**GET** `/weather/current`

Fetch current weather data without saving to database.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Search type: 'city', 'zip', or 'coordinates' |
| value | string | Conditional | Required for 'city' and 'zip' types |
| lat | number | Conditional | Required for 'coordinates' type |
| lon | number | Conditional | Required for 'coordinates' type |

**Example Requests:**

Search by City:
```
GET /weather/current?type=city&value=London
```

Search by ZIP:
```
GET /weather/current?type=zip&value=10001
```

Search by Coordinates:
```
GET /weather/current?type=coordinates&lat=51.5074&lon=-0.1278
```

**Success Response (200):**
```json
{
  "current": {
    "temp": 15.5,
    "feelsLike": 14.2,
    "humidity": 72,
    "pressure": 1013,
    "windSpeed": 3.5,
    "description": "overcast clouds",
    "icon": "04d",
    "main": "Clouds",
    "city": "London",
    "country": "GB",
    "coordinates": {
      "lat": 51.5074,
      "lon": -0.1278
    }
  },
  "forecast": [
    {
      "date": "2025-01-15",
      "temp": {
        "min": 12.3,
        "max": 16.8,
        "day": 14.5
      },
      "humidity": 68,
      "description": "light rain",
      "icon": "10d",
      "main": "Rain"
    }
    // ... 4 more days
  ],
  "location": {
    "city": "London",
    "country": "GB",
    "coordinates": {
      "lat": 51.5074,
      "lon": -0.1278
    }
  }
}
```

**Error Response (400):**
```json
{
  "error": "Validation error message"
}
```

**Error Response (500):**
```json
{
  "error": "Weather API Error: Invalid API key"
}
```

---

### 3. Create Weather Record

**POST** `/weather/records`

Create and save a new weather record with validation.

**Request Body:**
```json
{
  "location": {
    "type": "city",
    "value": "London"
  },
  "dateRange": {
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-07T00:00:00.000Z"
  }
}
```

**Validation Rules:**
- `location.type` must be 'city', 'zip', or 'coordinates'
- `location.value` is required
- `dateRange.startDate` is required and must be valid date
- `dateRange.endDate` is required and must be after startDate

**Success Response (201):**
```json
{
  "message": "Weather record created successfully",
  "record": {
    "_id": "507f1f77bcf86cd799439011",
    "location": {
      "city": "London",
      "country": "GB",
      "coordinates": {
        "lat": 51.5074,
        "lon": -0.1278
      }
    },
    "weatherData": {
      "current": { /* current weather data */ },
      "forecast": [ /* 5-day forecast */ ]
    },
    "dateRange": {
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-07T00:00:00.000Z"
    },
    "userInput": {
      "searchType": "city",
      "searchValue": "London"
    },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "\"dateRange.endDate\" must be greater than \"dateRange.startDate\""
}
```

---

### 4. Get All Weather Records

**GET** `/weather/records`

Retrieve all saved weather records with pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Records per page |
| sort | string | -createdAt | Sort field (prefix with - for descending) |

**Example Request:**
```
GET /weather/records?page=1&limit=10&sort=-createdAt
```

**Success Response (200):**
```json
{
  "records": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "location": {
        "city": "London",
        "country": "GB",
        "coordinates": { "lat": 51.5074, "lon": -0.1278 }
      },
      "weatherData": { /* weather data */ },
      "dateRange": {
        "startDate": "2025-01-01T00:00:00.000Z",
        "endDate": "2025-01-07T00:00:00.000Z"
      },
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 42
}
```

---

### 5. Get Single Weather Record

**GET** `/weather/records/:id`

Retrieve a specific weather record by ID.

**URL Parameters:**
- `id`: MongoDB ObjectId of the record

**Example Request:**
```
GET /weather/records/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "location": { /* location data */ },
  "weatherData": { /* weather data */ },
  "dateRange": { /* date range */ },
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Record not found"
}
```

---

### 6. Update Weather Record

**PUT** `/weather/records/:id`

Update an existing weather record with validation.

**URL Parameters:**
- `id`: MongoDB ObjectId of the record

**Request Body:**
```json
{
  "location": {
    "type": "city",
    "value": "Paris"
  },
  "dateRange": {
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-10T00:00:00.000Z"
  }
}
```

**Notes:**
- Both `location` and `dateRange` are optional
- If `location` is provided, weather data will be re-fetched
- At least one field must be provided

**Success Response (200):**
```json
{
  "message": "Weather record updated successfully",
  "record": { /* updated record */ }
}
```

**Error Response (404):**
```json
{
  "error": "Record not found"
}
```

**Error Response (400):**
```json
{
  "error": "Validation error message"
}
```

---

### 7. Delete Weather Record

**DELETE** `/weather/records/:id`

Delete a weather record by ID.

**URL Parameters:**
- `id`: MongoDB ObjectId of the record

**Example Request:**
```
DELETE /weather/records/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "message": "Weather record deleted successfully",
  "record": { /* deleted record */ }
}
```

**Error Response (404):**
```json
{
  "error": "Record not found"
}
```

---

### 8. Export Weather Data

**GET** `/weather/export/:format`

Export all weather records in specified format.

**URL Parameters:**
- `format`: Export format ('json', 'csv', 'pdf', 'markdown')

**Example Requests:**
```
GET /weather/export/json
GET /weather/export/csv
GET /weather/export/pdf
GET /weather/export/markdown
```

**Success Response (200):**

Downloads file with appropriate Content-Type:
- JSON: `application/json`
- CSV: `text/csv`
- PDF: `application/pdf`
- Markdown: `text/markdown`

**CSV Format:**
```csv
location.city,location.country,weatherData.current.temp,weatherData.current.description,dateRange.startDate,dateRange.endDate,createdAt
London,GB,15.5,overcast clouds,2025-01-01,2025-01-07,2025-01-15
```

**Markdown Format:**
```markdown
# Weather Records

## Record 1

- **Location**: London, GB
- **Temperature**: 15.5°C
- **Description**: overcast clouds
- **Humidity**: 72%
- **Date Range**: 2025-01-01 to 2025-01-07
```

**Error Response (400):**
```json
{
  "error": "Invalid format. Use json, csv, pdf, or markdown"
}
```

**Error Response (404):**
```json
{
  "error": "No records to export"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Data Models

### Weather Record Schema

```javascript
{
  location: {
    city: String,
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
    startDate: Date,
    endDate: Date
  },
  userInput: {
    searchType: String, // 'city', 'zip', 'coordinates'
    searchValue: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Rate Limits

External API rate limits:
- OpenWeatherMap: 60 calls/minute (free tier)
- No rate limits on this backend API

---

## Authentication

Currently, no authentication is required. In production, implement:
- JWT tokens
- API keys
- OAuth 2.0

---

## Testing with cURL

### Create Record
```bash
curl -X POST http://localhost:5001/api/weather/records \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"type": "city", "value": "London"},
    "dateRange": {
      "startDate": "2025-01-01",
      "endDate": "2025-01-07"
    }
  }'
```

### Get Records
```bash
curl http://localhost:5001/api/weather/records
```

### Update Record
```bash
curl -X PUT http://localhost:5001/api/weather/records/YOUR_ID \
  -H "Content-Type: application/json" \
  -d '{
    "dateRange": {
      "startDate": "2025-01-01",
      "endDate": "2025-01-10"
    }
  }'
```

### Delete Record
```bash
curl -X DELETE http://localhost:5001/api/weather/records/YOUR_ID
```

---

## Notes

1. All dates should be in ISO 8601 format
2. Coordinates: lat (-90 to 90), lon (-180 to 180)
3. ZIP codes should include country code for international (e.g., "10001,US")
4. Weather icons use OpenWeatherMap icon codes
5. Temperatures are in Celsius by default

---

**For more information, see the main README.md file.**
