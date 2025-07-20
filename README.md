# Chat de Tilisarao - Aplicación de Chat Full Stack

Una aplicación de chat simple construida completamente con tecnologías JavaScript para el frontend, backend y base de datos.

![](docs/screenshot.png)

## Tecnologías Utilizadas
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 4
- **Backend**: Node.js
  - Express.js
  - Socket.io
- **Base de Datos**: PostgreSQL

## Instalación Local

```bash
git clone <tu-repositorio>
cd chat-javascript-fullstack-main
npm install
```

## Configuración de Variables de Entorno

Copia el archivo `env.example` a `.env` y configura las variables:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```bash
# Configuración del servidor
PORT=3000

# Configuración de la base de datos PostgreSQL
DATABASE_URL=postgresql://username:password@host:port/database_name
```

## Ejecutar el Proyecto Localmente

```bash
npm run dev
```

## Despliegue en la Nube

### Preparación para Despliegue

1. **Configurar Base de Datos**: Asegúrate de tener una base de datos PostgreSQL configurada en tu proveedor de nube.

2. **Variables de Entorno**: Configura las siguientes variables de entorno en tu plataforma de despliegue:
   - `PORT`: Puerto del servidor (generalmente configurado automáticamente)
   - `DATABASE_URL`: URL de conexión a tu base de datos PostgreSQL

3. **Script de Inicio**: El proyecto ya está configurado para usar `npm start` como comando de inicio.

### Despliegue en Cloud Platforms

#### Render.com
- Conecta tu repositorio de GitHub
- Selecciona "Web Service"
- Configura las variables de entorno
- Usa `npm start` como comando de inicio

#### Railway
- Conecta tu repositorio de GitHub
- Configura las variables de entorno
- El proyecto se desplegará automáticamente

#### Heroku
- Conecta tu repositorio de GitHub
- Configura las variables de entorno en Settings > Config Vars
- El proyecto se desplegará automáticamente

## Estructura del Proyecto

```
chat-javascript-fullstack-main/
├── src/
│   ├── app.js          # Configuración de Express
│   ├── config.js       # Variables de configuración
│   ├── database.js     # Conexión a PostgreSQL
│   ├── index.js        # Punto de entrada del servidor
│   ├── sockets.js      # Configuración de Socket.io
│   └── models/         # Modelos de datos
├── public/             # Archivos estáticos
├── database/           # Scripts de base de datos
└── package.json        # Dependencias y scripts
```

## Recursos Utilizados

- [Bootstrap 4 CDN](http://getbootstrap.com/docs/4.0/getting-started/introduction/)
- [Background Gradient Color](https://uigradients.com/#Lawrencium)
- [jQuery CDN](https://code.jquery.com/)

## Licencia

ISC
