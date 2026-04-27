@echo off
setlocal
cd /d "%~dp0"

echo Saltitos Numericos - modo local PC
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
echo Abre esta direccion en esta PC:
echo http://localhost:5173
echo.
echo Deja esta ventana abierta mientras uses la app.
echo Presiona Ctrl+C para detener el servidor.
echo.

npm.cmd run dev -- --host 127.0.0.1
pause
