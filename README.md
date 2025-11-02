# ⛅ Weather App - Full-Stack CRUD Application

> **PMA Bootcamp: AI Engineer Intern Technical Assessment**
> 
> A comprehensive full-stack weather application with CRUD operations, real-time weather data, 5-day forecasts, and integrated Google Maps & YouTube APIs.

**Built by: Rishik Kumar Chaurasiya**

**Live App:** [https://weather-app-fullstack-seven.vercel.app/](https://weather-app-fullstack-seven.vercel.app/)

**Backend API:** [https://weather-app-fullstack-1az2.onrender.com](https://weather-app-fullstack-1az2.onrender.com)

---

## 📽️ Demo Video & Live Link

🌐 **[Live Application](https://weather-app-fullstack-seven.vercel.app/)**

🎥 **[Watch Demo Video Here](https://your-demo-video-link.com)**

_A 1-2 minute demonstration of all features including CRUD operations, weather search, and API integrations._

---

## 🚀 Features

### ✨ Core Features (Tech Assessment 1 & 2)

- **Real-time Weather Data**: Fetch current weather using OpenWeatherMap API
- **5-Day Forecast**: Display detailed weather predictions with icons
- **Multiple Search Options**:
  - Search by City Name
  - Search by ZIP Code
  - Search by GPS Coordinates
  - Use Current Location (Geolocation API)

### 🔧 CRUD Operations

- **Create**: Save weather records with date ranges and validation
- **Read**: View all saved weather records with pagination
- **Update**: Edit date ranges for existing records
- **Delete**: Remove weather records with confirmation

### 📊 Data Export

Export your weather data in multiple formats:
- JSON
- CSV
- PDF
- Markdown

### 🌐 API Integrations

- **OpenWeatherMap**: Real-time weather data and forecasts
- **Google Maps**: Interactive location visualization
- **YouTube**: Related videos about searched locations

### 🎨 UI/UX Features

- Beautiful, responsive design with Tailwind CSS
- Weather icons and visual representations
- Info modal about PM Accelerator
- Error handling and loading states
- Form validation

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (React 19)
- **TypeScript**
- **Tailwind CSS 4**
- **Axios** for API calls
- **React Icons** for UI elements
- **Date-fns** for date formatting

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **Joi** for validation
- **Axios** for external API calls
- **JSON2CSV** for CSV export
- **PDFKit** for PDF generation

### APIs
- OpenWeatherMap API
- Google Maps JavaScript API
- YouTube Data API v3

---

## 📁 Project Structure

```
weather-app/
├── backend/
│   ├── models/
│   │   └── WeatherRecord.js        # MongoDB schema
│   ├── routes/
│   │   └── weather.js              # API routes (CRUD + export)
│   ├── services/
│   │   └── weatherService.js       # Weather API integration
│   ├── validators/
│   │   └── weatherValidator.js     # Input validation schemas
│   ├── package.json
│   └── server.js                   # Express server
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Main page
│   │   └── globals.css
│   ├── components/
│   │   ├── WeatherSearch.tsx       # Search component
│   │   ├── WeatherDisplay.tsx      # Current weather & forecast
│   │   ├── WeatherRecords.tsx      # CRUD operations UI
│   │   ├── InfoButton.tsx          # PMA info modal
│   │   ├── YouTubeVideos.tsx       # YouTube integration
│   │   └── GoogleMapComponent.tsx  # Google Maps integration
│   ├── package.json
│   └── .env.local                  # Frontend env variables
│
├── .env                            # Backend env variables
├── .env.example                    # Environment template
├── .gitignore
├── package.json                    # Root package.json
└── README.md
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd weather-app
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Setup Environment Variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/weather_app
PORT=5001

WEATHER_API_KEY=your_openweathermap_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. **Start MongoDB**

Make sure MongoDB is running on your machine:

```bash
# Windows (if installed as service)
net start MongoDB

# macOS/Linux
mongod
```

Or use MongoDB Atlas (cloud) and update the `MONGODB_URI` in `.env`

5. **Run the Application**

**Option 1: Run both frontend and backend together (Recommended)**

```bash
# From the root directory
npm run dev
```

**Option 2: Run separately**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api

---

## 🎯 Usage Guide

### 1. Search for Weather

- Choose search type (City, ZIP, or Coordinates)
- Enter location information
- Click "Search" or use "Use My Current Location"

### 2. View Weather Data

- Current weather with temperature, humidity, wind speed, pressure
- 5-day forecast with daily predictions
- Weather icons for visual representation

### 3. Save Weather Records

- Select start and end dates
- Click "Save Record" to store in database

### 4. Manage Records (CRUD)

- **View**: All saved records displayed below
- **Edit**: Click edit icon to modify date ranges
- **Delete**: Click delete icon to remove records
- **Export**: Download data in JSON, CSV, PDF, or Markdown format

### 5. Explore Location

- View YouTube videos about the location
- See location on Google Maps with coordinates

---

## 🔌 API Endpoints

### Weather Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather/current` | Get current weather (not saved) |
| POST | `/api/weather/records` | Create new weather record |
| GET | `/api/weather/records` | Get all weather records |
| GET | `/api/weather/records/:id` | Get single weather record |
| PUT | `/api/weather/records/:id` | Update weather record |
| DELETE | `/api/weather/records/:id` | Delete weather record |
| GET | `/api/weather/export/:format` | Export data (json/csv/pdf/markdown) |

### Request Examples

**Get Current Weather**
```bash
GET /api/weather/current?type=city&value=London
```

**Create Weather Record**
```bash
POST /api/weather/records
Content-Type: application/json

{
  "location": {
    "type": "city",
    "value": "London"
  },
  "dateRange": {
    "startDate": "2025-01-01",
    "endDate": "2025-01-07"
  }
}
```

**Update Weather Record**
```bash
PUT /api/weather/records/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "dateRange": {
    "startDate": "2025-01-01",
    "endDate": "2025-01-10"
  }
}
```

---

## ✅ Validation

The backend implements comprehensive validation using Joi:

- **Location validation**: Ensures correct format for city, zip, or coordinates
- **Date range validation**: End date must be after start date
- **Required fields**: All necessary fields must be provided
- **Type checking**: Ensures correct data types

---

## 🎨 UI Components

### WeatherSearch
- Multiple search type options
- Input validation
- Geolocation support
- Error handling

### WeatherDisplay
- Current weather card with icons
- 5-day forecast grid
- Save record form
- Visual weather metrics

### WeatherRecords
- List of all saved records
- Edit and delete functionality
- Export buttons for multiple formats
- Pagination support

### InfoButton
- Modal with PM Accelerator information
- LinkedIn embed
- Responsive design

### YouTubeVideos
- Fetches related videos
- Displays thumbnails and titles
- Links to YouTube

### GoogleMapComponent
- Interactive map
- Location marker
- Coordinates display

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Search weather by city name
- [ ] Search weather by ZIP code
- [ ] Search weather by coordinates
- [ ] Use current location (geolocation)
- [ ] View 5-day forecast
- [ ] Save weather record with date range
- [ ] View all saved records
- [ ] Edit existing record
- [ ] Delete record
- [ ] Export data in JSON format
- [ ] Export data in CSV format
- [ ] Export data in PDF format
- [ ] Export data in Markdown format
- [ ] View YouTube videos
- [ ] View Google Maps location
- [ ] Open PM Accelerator info modal

---

## 🐛 Error Handling

The application includes comprehensive error handling:

- **API errors**: Graceful handling of external API failures
- **Validation errors**: Clear error messages for invalid inputs
- **Network errors**: User-friendly error displays
- **Database errors**: Proper error logging and user feedback
- **404 errors**: Handle missing records

---

## 🌟 Future Enhancements

- User authentication and authorization
- Weather alerts and notifications
- Historical weather data comparison
- Weather maps and radar
- Unit and integration tests
- Docker containerization
- CI/CD pipeline
- Mobile app version

---

## 📝 Development Notes

### Input Validation

All user inputs are validated on both frontend and backend:
- City names: Non-empty strings
- ZIP codes: Valid format
- Coordinates: Valid lat/lon ranges (-90 to 90, -180 to 180)
- Dates: Valid date format, end date after start date

### Database Schema

Weather records include:
- Location information (city, country, coordinates)
- Current weather data
- 5-day forecast array
- Date range
- User input metadata
- Timestamps (created/updated)

### API Rate Limits

Be aware of API rate limits:
- OpenWeatherMap: 60 calls/minute (free tier)
- YouTube API: 10,000 units/day
- Google Maps: Based on your API key plan

---

## 🤝 Contributing

This is a technical assessment project. For the PMA community:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is created for the PMA Bootcamp Technical Assessment.

---

## 👤 Author

**Rishik Kumar Chaurasiya**

- LinkedIn: [linkedin.com/in/rishikkumar84ya](https://www.linkedin.com/in/rishikkumar84ya/)
- GitHub: [github.com/rishikkumar84a](https://github.com/rishikkumar84a)
- Email: rishikkumarchaurasiya@gmail.com

---

## 🙏 Acknowledgments

- **PM Accelerator** for the opportunity
- **OpenWeatherMap** for weather data API
- **Google** for Maps and YouTube APIs
- **Next.js** and **Express.js** communities

---

## 📞 Support

For questions or issues:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact: rishikkumarchaurasiya@gmail.com

---

**Made with ❤️ for PMA Bootcamp Technical Assessment**

---

## 🔗 Important Links

- [PM Accelerator LinkedIn](https://www.linkedin.com/company/product-manager-accelerator/)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Google Maps API Docs](https://developers.google.com/maps/documentation)
- [YouTube API Docs](https://developers.google.com/youtube/v3)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
