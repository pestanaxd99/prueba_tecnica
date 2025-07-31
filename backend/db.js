const mysql = require('mysql2/promise');
require('dotenv').config({ silent: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'prueba_tecnica',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true
});

// Función mejorada de verificación de conexión
const verifyConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅  Conexión a MySQL verificada. Prueba de consulta exitosa:', rows[0].result);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a MySQL:', error.message);
    console.error('ℹ️  Configuración usada:', {
      host: pool.config.connectionConfig.host,
      user: pool.config.connectionConfig.user,
      database: pool.config.connectionConfig.database
    });
    return false;
  } finally {
    if (connection) await connection.release();
  }
};

// Exportamos todo lo necesario
module.exports = {
  pool, // Exportamos el pool directamente
  query: (...args) => pool.query(...args),
  getConnection: () => pool.getConnection(),
  verifyConnection
};