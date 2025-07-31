require('dotenv').config({ silent: true });
const express = require('express');
const cors = require('cors');
const { verifyConnection } = require('./db');
const authRoutes = require('./auth');
const taskRoutes = require('./tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Endpoint de verificación de salud
app.get('/health', async (req, res) => {
  const dbHealthy = await verifyConnection();
  res.json({
    status: dbHealthy ? 'healthy' : 'degraded',
    database: dbHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor con verificación de conexión
verifyConnection().then(isConnected => {
  if (!isConnected) {
    console.warn('⚠️  Advertencia: El servidor iniciará sin conexión a la base de datos');
  }
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor listo en http://localhost:${PORT}`);
    console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗃️  Base de datos: ${process.env.DB_NAME || 'prueba_tecnica'}`);
    console.log(`⏱️  JWT Expira: ${process.env.JWT_EXPIRES_IN || '1h'}\n`);
  });
});