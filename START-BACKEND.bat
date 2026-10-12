@echo off
title Campus Lost & Found - Backend Server
color 0A
echo.
echo ============================================
echo   CAMPUS LOST AND FOUND PORTAL
echo   Starting Backend Server...
echo ============================================
echo.
echo Wait for: "CAMPUS LOST AND FOUND PORTAL IS RUNNING!"
echo Then open your browser at: http://localhost:8080
echo.
echo DO NOT CLOSE THIS WINDOW while using the website!
echo.
cd /d "%~dp0backend"
java -jar target\campus-lost-found-1.0.0.jar
echo.
echo Server stopped. Press any key to exit.
pause
