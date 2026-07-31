@echo off
title Portable PHP Application
echo Starting Portable Web Server...
echo =================================================================
echo  [ Mobile Access URL ] Type this link on your phone (Same Wi-Fi):
powershell -Command "Get-NetIPAddress -AddressFamily IPv4 -Type Unicast | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | ForEach-Object { Write-Host ('   => http://' + $_.IPAddress + ':8000/index.php') -ForegroundColor Green }"
echo =================================================================
start http://localhost:8000/bootcamp_master_learning_hub.html
.\php\php.exe -S 0.0.0.0:8000
pause