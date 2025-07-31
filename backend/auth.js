const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool, query, getConnection } = require("./db"); // Importación corregida
const { isEmail } = require('validator');
require("dotenv").config({ silent: true });

const JWT_CONFIG = {
  expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  issuer: process.env.JWT_ISSUER || "prueba-tecnica-backend",
  audience: process.env.JWT_AUDIENCE || "prueba-tecnica-frontend",
  algorithm: "HS256"
};

// Middleware de validación mejorado
const validateUserData = (req, res, next) => {
  const { nombre, email, password } = req.body;
  
  if (!nombre?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Todos los campos son requeridos",
      details: {
        nombre: !nombre ? "Requerido" : "OK",
        email: !email ? "Requerido" : "OK",
        password: !password ? "Requerido" : "OK"
      }
    });
  }

  if (!isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "El formato del email no es válido"
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "La contraseña debe tener al menos 8 caracteres"
    });
  }

  req.normalizedEmail = email.trim().toLowerCase();
  next();
};

// Middleware de validación específico para login
const validateLoginData = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      message: "El email es requerido"
    });
  }

  if (!password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "La contraseña es requerida"
    });
  }

  if (!isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "El formato del email no es válido"
    });
  }

  req.normalizedEmail = email.trim().toLowerCase();
  next();
};

router.post("/register", validateUserData, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { nombre, password } = req.body;
    const email = req.normalizedEmail;

    const [existing] = await connection.query(
      "SELECT id FROM usuarios WHERE email = ? FOR UPDATE", 
      [email]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre.trim(), email, hashedPassword]
    );

    // Generación de token corregida
    const token = jwt.sign(
      { 
        id: result.insertId,
        email: email
      },
      process.env.JWT_SECRET,
      JWT_CONFIG
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Registro exitoso",
      token,
      user: {
        id: result.insertId,
        nombre: nombre.trim(),
        email
      },
      expiresIn: JWT_CONFIG.expiresIn
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error en el proceso de registro",
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message
      })
    });
  } finally {
    if (connection) await connection.release();
  }
});

// Endpoint de Login
router.post("/login", validateLoginData, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { password } = req.body;
    const email = req.normalizedEmail;

    // Buscar usuario
    const [users] = await connection.query(
      "SELECT id, nombre, email, password FROM usuarios WHERE email = ?", 
      [email]
    );
    
    const user = users[0];
    
    // Comparación segura de contraseñas (evita timing attacks)
    const passwordValid = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !passwordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Credenciales inválidas" 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      JWT_CONFIG
    );

    // Respuesta exitosa
    res.json({ 
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      },
      expiresIn: JWT_CONFIG.expiresIn
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: "Error en el proceso de autenticación",
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message
      })
    });
  } finally {
    if (connection) await connection.release();
  }
});

module.exports = router;