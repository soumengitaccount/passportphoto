@echo off

:: Run some commands
echo Running commands...
::npm install
::npm run build

:: Open Chrome with a URL
echo Opening Chrome...
start chrome http://localhost:3000

:: Wait for 5 seconds
::timeout /t 5

:: Run the application
echo Running application...
node index.js