@echo off
setlocal
cd /d "%~dp0"

echo Saltitos Numericos - modo local red Wi-Fi
echo.

if not exist node_modules (
  echo Instalando dependencias...
  npm.cmd install --cache .npm-cache
  if errorlevel 1 (
    echo.
    echo No se pudieron instalar dependencias. Revisa el mensaje anterior.
    pause
    exit /b 1
  )
)

echo.
echo Busca en la salida de Vite una direccion tipo:
echo Network: http://192.168.x.x:5173
echo.
echo Abre esa direccion en el iPad conectado al mismo Wi-Fi.
echo Deja esta ventana abierta mientras uses la app.
echo Presiona Ctrl+C para detener el servidor.
echo.

npm.cmd run dev -- --host 0.0.0.0
pause
