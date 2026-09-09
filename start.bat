@echo off
echo Starting AI Nutrition Planner...
echo.

echo [1/2] Starting Backend API on port 8000...
start cmd /k "cd /d "%~dp0backend" && .\venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend on port 5173...
start cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers starting in separate windows.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
pause
