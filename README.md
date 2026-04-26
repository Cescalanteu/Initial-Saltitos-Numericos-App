# Saltitos Numericos

Aplicacion web local para practicar sumas simples como saltos unitarios sobre una recta numerica del 1 al 10.

## Instalacion

```bash
npm install
```

Si PowerShell bloquea `npm` por la politica de ejecucion local, usa:

```bash
npm.cmd install
```

## Correr en desarrollo

```bash
npm run dev
```

Luego abre la URL local que muestre Vite, normalmente `http://localhost:5173`.

## Tests y build

```bash
npm test
npm run build
```

## Publicar en GitHub Pages

Este proyecto ya incluye `.github/workflows/deploy.yml`. Al subirlo a la rama `main`, GitHub Actions instala dependencias, corre tests, genera `dist` y publica la pagina.

Comandos iniciales. Si el repositorio ya fue inicializado, omite `git init -b main`.

```bash
git config --global user.name "TU_NOMBRE"
git config --global user.email "TU_EMAIL_DE_GITHUB"
git init -b main
git add .
git commit -m "Initial Saltitos Numericos app"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/saltitos-numericos.git
git push -u origin main
```

Despues, en GitHub:

1. Crea un repositorio llamado `saltitos-numericos`.
2. En `Settings` -> `Pages`, usa `GitHub Actions` como fuente si GitHub lo solicita.
3. Espera a que termine el workflow `Deploy to GitHub Pages`.
4. Abre el enlace: `https://TU_USUARIO.github.io/saltitos-numericos/`.

## Guia breve de uso

1. Toca `Empezar`.
2. En `Panel adulto`, elige una suma valida. Por defecto el rango es 1-10 y no permite resultados mayores a 10.
3. Toca `Usar suma manual` o `Practica automatica`.
4. El nino selecciona el primer numero en la recta numerica.
5. Luego toca cada siguiente numero a la derecha, un salto por vez.
6. Al terminar, la app muestra la ecuacion completa, por ejemplo `3 + 2 = 5`.

## Accesibilidad y sensibilidad

- Botones grandes y navegables por teclado.
- Instrucciones cortas, visuales y repetibles.
- Sin temporizador obligatorio, rankings, castigos ni mensajes de fracaso.
- Sonido apagado por defecto.
- Configuraciones locales para reducir movimiento, alto contraste, modo calmado, animaciones y nivel de ayuda.
- Barra AAC con `Ayuda`, `Pausa`, `Otra vez`, `Termine`, `Si` y `No`.

La app esta disenada para aproximarse a WCAG 2.2 AA en lo aplicable, pero no reemplaza una auditoria formal.

## Datos locales

No hay login, backend, analitica externa ni envio de datos a terceros. El progreso se guarda en `localStorage` del navegador.

El panel `Progreso` permite exportar registros locales en JSON o CSV. Cada registro incluye problema, completado, intentos, ayudas usadas, tiempo aproximado, fecha, nivel de ayuda y modo de entrada.

## Alcance clinico

Saltitos Numericos es una herramienta educativa de practica familiar. No se presenta como terapia, diagnostico ni intervencion clinica.
