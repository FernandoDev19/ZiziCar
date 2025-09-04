# ZiziCar - Plataforma de Gestión de Vehículos

![ZiziCar Logo](https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/logos/logo-zizicar.webp) 

## Descripción

ZiziCar es una plataforma web diseñada para optimizar la rentabilidad de vehículos en toda Colombia. Automatiza la gestión de vehículos disponibles, calcula valores de mercado y facilita a clientes y proveedores la búsqueda y reserva de rentas de manera rápida, sencilla y eficiente.

## Características Principales

- 🚗 Gestión completa de flota de vehículos
- 💰 Cálculo automático de valores de mercado
- 🔍 Búsqueda avanzada de vehículos disponibles
- 📅 Sistema de reservas integrado
- 📱 Interfaz de usuario moderna y responsiva
- 🔒 Autenticación y autorización segura
- 📊 Panel de administración

## Estructura del Proyecto

```
zizicar/
├── backend/           # API REST en NestJS
├── frontend/         
│   ├── admin/        # Panel de administración (Angular)
│   └── landing/      # Sitio web público (Angular)
└── README.md         # Este archivo
```

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior) o yarn
- MySQL (v8 o superior)
- Redis (última versión estable)
- AWS S3 (para almacenamiento de archivos)

## Configuración del Backend (NestJS)

### Instalación

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Configura las variables según tu entorno

4. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

### Variables de Entorno

Crea un archivo `.env` en la raíz del backend con las siguientes variables:

```env
# Configuración de la aplicación
NODE_ENV=development
PORT=3000

# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/zizicar?schema=public"

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=zizicar-bucket

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Iniciar el Servidor

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La API estará disponible en `http://localhost:3000`

## Configuración del Frontend (Angular)

### Landing Page

1. Navega al directorio del frontend:
   ```bash
   cd frontend/landing
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `environment.ts` en `src/environments/`
   - Configura la URL de la API

4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:4200`

### Panel de Administración

1. Navega al directorio del admin:
   ```bash
   cd frontend/admin
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```  

3. Configura las variables de entorno

4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

   El panel de administración estará disponible en `http://localhost:4201`

## Despliegue

### Backend

1. Construye la aplicación:
   ```bash
   npm run build
   ```

2. Copia los archivos al servidor

3. Configura PM2 para producción:
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name "zizicar-backend"
   ```

### Frontend

1. Construye la aplicación para producción:
   ```bash
   npm run build
   ```

2. Sirve los archivos estáticos con Nginx o Apache

## Tecnologías Utilizadas

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- AWS S3
- JWT para autenticación
- Swagger para documentación

### Frontend
- Angular 19
- PrimeNG
- RxJS
- TypeScript
- SCSS
- Angular Universal (SSR)

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

<!-- ## Contacto -->

<!-- ¿Preguntas o comentarios? Contáctanos en [correo@zizicar.com](mailto:correo@zizicar.com) -->

---

Desarrollado con ❤️ por el equipo de ZiziCar
