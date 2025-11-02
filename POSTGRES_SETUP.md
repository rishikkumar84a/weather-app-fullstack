# PostgreSQL Setup Guide

## Quick Start

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

---

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE weather_app;
CREATE USER weather_user WITH PASSWORD 'weather_password';
GRANT ALL PRIVILEGES ON DATABASE weather_app TO weather_user;
\q
```

---

### 3. Update Environment Variables

Update your `.env` file:

```env
DATABASE_URL=postgresql://weather_user:weather_password@localhost:5432/weather_app
PORT=5001
WEATHER_API_KEY=your_openweathermap_api_key
```

---

### 4. Run Database Setup

```bash
cd backend
npm run setup-db
```

This will create all necessary tables and indexes.

---

### 5. Start the Server

```bash
# From backend directory
npm start

# Or with hot reload
npm run dev
```

---

## Using Docker (Easiest)

```bash
# From project root
docker-compose up -d

# Database will be automatically initialized
```

---

## PostgreSQL Cloud Options

### 1. **Neon (Recommended - Free Tier)**
- Go to [neon.tech](https://neon.tech)
- Create free PostgreSQL database
- Copy connection string
- Update `DATABASE_URL` in `.env`

### 2. **Railway**
- Add PostgreSQL plugin in Railway dashboard
- Connection string auto-provided

### 3. **Render**
- Create PostgreSQL database
- Copy connection string
- Add to environment variables

### 4. **Supabase**
- Create project at [supabase.com](https://supabase.com)
- Get connection string from Settings → Database
- Update `DATABASE_URL`

---

## Verify Setup

```bash
# Check database connection
psql postgresql://weather_user:weather_password@localhost:5432/weather_app

# List tables
\dt

# Check records
SELECT COUNT(*) FROM weather_records;
```

---

## Migration from MongoDB

Your data structure is automatically converted. The PostgreSQL model maintains compatibility with your frontend API.

---

## Troubleshooting

**Connection refused:**
- Ensure PostgreSQL service is running
- Check port 5432 is not blocked

**Authentication failed:**
- Verify username and password in `DATABASE_URL`
- Check user has proper permissions

**Schema errors:**
- Run `npm run setup-db` again
- Check `backend/db/schema.sql` for syntax errors
