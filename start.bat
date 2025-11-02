@echo off
echo Starting Weather App...
echo.

echo Starting MongoDB (make sure it's installed)...
REM Uncomment the next line if MongoDB is installed as a service
REM net start MongoDB

echo.
echo Starting Backend Server...
start cmd /k "cd backend && node server.js"

timeout /t 5

echo.
echo Starting Frontend Development Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo Backend API: http://localhost:5001/api
echo Frontend: http://localhost:3000
echo ============================================
echo.
echo Both servers are starting in separate windows...
pause
