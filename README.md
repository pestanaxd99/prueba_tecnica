# Prueba Técnica - Gestión de Tareas

## Descripción
Aplicación fullstack para gestión de tareas con autenticación de usuarios.

## Requisitos del Sistema

### Backend
- Node.js
- MySQL
- npm

### Frontend
- Node.js v16.x o superior
- npm v8.x o superior
- Angular CLI v15+

## Instalación y Configuración

### Base de Datos
1. Ejecutar los siguientes comandos en MySQL:

```sql
CREATE DATABASE IF NOT EXISTS prueba_tecnica;

USE prueba_tecnica;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

Archivo .env tiene la siguiente configuración:

# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prueba_tecnica

# Configuración JWT
JWT_SECRET=
JWT_EXPIRES_IN=1h
JWT_ISSUER=prueba-tecnica-backend
JWT_AUDIENCE=prueba-tecnica-frontend

# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Opcional: Configuración de logs
DEBUG=express:*

Ir a la raíz del directorio "backend" y ejecutar:
npm i
node app.js

Ir a la raíz del directorio "frontend" y ejecutar:
npm i
ng serve

## Instrucciones de Uso

### Registro de Usuarios
1. Accede a la aplicación en `http://localhost:4200`
2. Haz clic en "Registrarse" 
3. Completa el formulario con:
   - Nombre completo
   - Email válido
   - Contraseña (mínimo 6 caracteres)
4. Haz clic en "Crear cuenta"

### Inicio de Sesión
1. En la página principal, ingresa tu email y contraseña
2. Haz clic en "Iniciar Sesión"
3. Serás redirigido al dashboard de tareas

### Gestión de Tareas

#### Crear una nueva tarea
1. Haz clic en el botón "+ Nueva Tarea"
2. Completa el formulario:
   - Título (obligatorio)
   - Descripción (opcional)
   - Estado (Obligatorio)
3. Haz clic en "Guardar"

#### Editar una tarea
1. Haz clic sobre el icono de la tarea que deseas editar
2. Modifica los datos de la tarea y da clic en Guardar

#### Elimina una tarea
1. Localiza la tarea en la lista
2. Haz clic en el icono de la tarea que deseas eliminar
3. Confirma la tarea que deseas eliminar

### Cerrar Sesión
1. Clic en el icono de la esquina superior derecha

## Notas Importantes
- Necesitas estar autenticado para acceder al dashboard de tareas
- Las tareas son personales (cada usuario solo ve las suyas)
- La sesión se mantiene activa por 1 hora
- Si tienes problemas, verifica que el backend esté corriendo en `http://localhost:3000`


Lista de ENDPOINTS:

GET /tasks

  Obtener todas las tareas del usuario (ordenadas por fecha DESC).

POST /tasks

  Crear nueva tarea.

  Body:
  
  json
  {
    "titulo": "(requerido)",
    "descripcion": "(opcional)",
    "estatus": "(opcional, default: 'pendiente')"
  }

PUT /tasks/:id

  Actualizar tarea existente.
  
  Body (campos opcionales):
  
  json
  {
    "titulo": "(opcional)",
    "descripcion": "(opcional)",
    "estatus": "(opcional)"
  }

DELETE /tasks/:id

Eliminar tarea.
