# Deployment Guide

## Quick Deployment Options

### 1. **Vercel (Recommended for Frontend)**

**Deploy Frontend:**
```bash
cd frontend
npm install -g vercel
vercel
```

**Environment Variables in Vercel:**
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_YOUTUBE_API_KEY`

---

### 2. **Render (Full-Stack)**

1. **Push to GitHub** (already done ✓)
2. **Go to [Render.com](https://render.com)**
3. **Create New Blueprint** and connect your GitHub repo
4. **Set Environment Variables:**
   - Backend: `MONGODB_URI`, `WEATHER_API_KEY`, `PORT`
   - Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_YOUTUBE_API_KEY`

The `render.yaml` file will handle the rest!

---

### 3. **Railway (Easiest Full-Stack)**

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

**Set Environment Variables in Railway Dashboard:**
- `MONGODB_URI` (or add MongoDB plugin)
- `WEATHER_API_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_YOUTUBE_API_KEY`

---

### 4. **Docker (Local or Cloud)**

```bash
# Build and run with docker-compose
docker-compose up -d

# Or build separately
docker build -f Dockerfile.backend -t weather-backend .
docker build -f Dockerfile.frontend -t weather-frontend .

docker run -p 5001:5001 weather-backend
docker run -p 3000:3000 weather-frontend
```

---

### 5. **Heroku**

**Backend:**
```bash
cd backend
heroku create weather-app-backend-yourname
heroku addons:create mongolab:sandbox
git subtree push --prefix backend heroku main
```

**Frontend:**
```bash
cd frontend
heroku create weather-app-frontend-yourname
git subtree push --prefix frontend heroku main
```

---

### 6. **AWS / DigitalOcean / Azure**

Use the provided Dockerfiles:
- Deploy `Dockerfile.backend` for the backend service
- Deploy `Dockerfile.frontend` for the frontend service
- Use managed MongoDB (MongoDB Atlas)

---

## Environment Variables Checklist

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5001
WEATHER_API_KEY=your_openweathermap_api_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_key
```

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in your deployment

### Option 2: Railway/Render MongoDB Plugin
- Add MongoDB plugin in Railway/Render dashboard
- Connection string automatically added as environment variable

---

## Post-Deployment

1. **Test API Endpoints:**
   ```bash
   curl https://your-backend-url.com/health
   ```

2. **Update Frontend API URL:**
   - Set `NEXT_PUBLIC_API_URL` to your deployed backend URL

3. **Test Full Application:**
   - Visit your frontend URL
   - Search for weather
   - Save a record
   - Test CRUD operations

---

## Troubleshooting

**Build Errors:**
- Ensure all dependencies are in `package.json`
- Check Node.js version (v18+)

**API Connection Issues:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure environment variables are set

**Database Connection:**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure MongoDB service is running

---

## Recommended Stack

- **Frontend:** Vercel
- **Backend:** Railway or Render
- **Database:** MongoDB Atlas (free tier)

This gives you:
- ✅ Free hosting
- ✅ Automatic deployments on push
- ✅ SSL certificates
- ✅ Global CDN
- ✅ Easy scaling
