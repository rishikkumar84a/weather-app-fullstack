# Quick Setup Guide - Weather App

## Prerequisites Check

Before running the application, make sure you have:

1. ✅ **Node.js** (v18 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. ✅ **MongoDB**
   - Option A: Local installation
     - Check: `mongod --version`
     - Download: https://www.mongodb.com/try/download/community
   
   - Option B: MongoDB Atlas (Cloud - Recommended for testing)
     - Create free account: https://www.mongodb.com/cloud/atlas
     - Get connection string and update `.env` file

3. ✅ **npm** (comes with Node.js)
   - Check: `npm --version`

## Step-by-Step Installation

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd weather-app
```

### 2. Install All Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 3. Configure Environment Variables

**Backend (.env in root directory):**
```
MONGODB_URI=mongodb://localhost:27017/weather-app
PORT=5001

WEATHER_API_KEY=8cc42f1330fb03e5b46d090b5266673f
GOOGLE_MAPS_API_KEY=AIzaSyDmWOLADTf9v6M6nKyCGAtN0BeAbfTxUO4
YOUTUBE_API_KEY=AIzaSyAMAZ2DZxdyPOu-steqOa_3r9PRB8nw0yY
```

**Frontend (.env.local in frontend directory):**
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_WEATHER_API_KEY=8cc42f1330fb03e5b46d090b5266673f
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDmWOLADTf9v6M6nKyCGAtN0BeAbfTxUO4
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyAMAZ2DZxdyPOu-steqOa_3r9PRB8nw0yY
```

### 4. Start MongoDB

**Windows (if installed as service):**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
mongod
```

**Or use MongoDB Atlas connection string in .env**

### 5. Run the Application

**Option 1: Using startup script (Windows)**
```bash
start.bat
```

**Option 2: Using startup script (macOS/Linux)**
```bash
chmod +x start.sh
./start.sh
```

**Option 3: Manual start (Recommended for development)**

Terminal 1 - Backend:
```bash
cd backend
node server.js
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/health

## Troubleshooting

### Port Already in Use

If you see "EADDRINUSE" error:

**Backend:**
- Change PORT in `.env` file to another port (e.g., 5002)
- Update NEXT_PUBLIC_API_URL in frontend/.env.local

**Frontend:**
- Next.js will automatically use port 3001 if 3000 is busy

### MongoDB Connection Issues

**Error: "MongoNetworkError" or "ECONNREFUSED"**

Solution 1: Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
net start MongoDB  # Windows
mongod             # macOS/Linux
```

Solution 2: Use MongoDB Atlas
- Create free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update MONGODB_URI in .env file

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Keys Not Working

Make sure:
1. API keys are correctly copied (no extra spaces)
2. .env files are in the correct directories
3. Restart servers after changing .env files

### Next.js Build Issues

```bash
cd frontend
# Delete .next folder and rebuild
rm -rf .next
npm run dev
```

## Testing the Features

### 1. Test Weather Search
- Enter "London" in city search
- Click Search
- Verify current weather displays
- Verify 5-day forecast displays

### 2. Test CRUD Operations
- Search for a city
- Select date range
- Click "Save Record"
- Verify record appears in "Saved Weather Records"
- Click Edit button, change dates, save
- Click Delete button to remove record

### 3. Test Export Features
- Click JSON, CSV, PDF, or MD export buttons
- Verify files download correctly

### 4. Test API Integrations
- Search for a city
- Scroll down to see YouTube videos
- Verify Google Maps displays location

## API Endpoints Testing

Use tools like Postman, Insomnia, or curl:

**Get Current Weather:**
```bash
curl "http://localhost:5001/api/weather/current?type=city&value=London"
```

**Create Record:**
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

**Get All Records:**
```bash
curl http://localhost:5001/api/weather/records
```

## Common Issues and Solutions

### Issue: "Cannot find module"
**Solution:** Run `npm install` in both backend and frontend directories

### Issue: Frontend not connecting to backend
**Solution:** Check that:
- Backend is running on port 5001
- Frontend .env.local has correct API_URL
- No CORS errors in browser console

### Issue: Weather data not displaying
**Solution:**
- Check API key is valid
- Check internet connection
- Open browser console for errors

### Issue: Google Maps not showing
**Solution:**
- Verify Google Maps API key is enabled
- Enable Maps JavaScript API in Google Cloud Console
- Check browser console for errors

### Issue: YouTube videos not loading
**Solution:**
- Verify YouTube API key is valid
- Enable YouTube Data API v3 in Google Cloud Console
- Check API quota limits

## Development Tips

1. **Hot Reload**: Next.js has hot reload - changes appear without refresh
2. **Backend Changes**: Restart backend server after code changes
3. **Environment Variables**: Restart servers after changing .env files
4. **Database**: Use MongoDB Compass to view database visually
5. **Debugging**: Check browser console and terminal for errors

## Production Deployment

For production deployment:

1. **Build Frontend:**
```bash
cd frontend
npm run build
npm start
```

2. **Environment Variables:**
- Update MongoDB URI to production database
- Update API URLs to production domains
- Keep API keys secure (use environment secrets)

3. **Recommended Platforms:**
- Frontend: Vercel, Netlify
- Backend: Railway, Render, Heroku
- Database: MongoDB Atlas

## Support

If you encounter issues:
1. Check this guide
2. Review README.md
3. Check terminal/console for errors
4. Verify all dependencies are installed
5. Ensure MongoDB is running
6. Verify API keys are correct

---

**Ready to Start!** 🚀

Once everything is set up, you should have a fully functional weather app with CRUD operations, real-time data, and API integrations!
