#!/bin/bash

echo "Starting Weather App..."
echo ""

echo "Starting Backend Server..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

sleep 3

echo ""
echo "Starting Frontend Development Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo "Backend API: http://localhost:5001/api"
echo "Frontend: http://localhost:3000"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
