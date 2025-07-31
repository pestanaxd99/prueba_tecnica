

## Requisitos previos para inicializar Backend

Desde la carpeta raíz llamada "backend":
npm install
node app.js

## Requisitos previos para inicializar Frontend

- Node.js v16.x o superior
- npm v8.x o superior
- Angular CLI v15+
- Backend corriendo en `http://localhost:3000`

Desde la carpeta raíz llamada "frontend"
npm install
ng serve

Estructura de la base de datos:
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tasks_db;

-- Usar la base de datos
USE tasks_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tareas
CREATE TABLE tareas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estatus ENUM('pendiente', 'completado') DEFAULT 'pendiente',
  id_usuario INT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

Configuracion del archivo .env
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prueba_tecnica

# Configuración JWT
JWT_SECRET=sdjhfdskjfhsdjkfhsdkjhfdksjhfdskf
JWT_EXPIRES_IN=1h
JWT_ISSUER=prueba-tecnica-backend
JWT_AUDIENCE=prueba-tecnica-frontend

# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Opcional: Configuración de logs
DEBUG=express:*
