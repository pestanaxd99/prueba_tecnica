const express = require('express');
const router = express.Router();
const { pool, query } = require('./db');
const authenticateToken = require('./authMiddleware');

// Todas las rutas requieren autenticación JWT
router.use(authenticateToken);

/**
 * @route GET /tasks
 * @description Obtener todas las tareas del usuario
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const [tasks] = await query(
      `SELECT id, titulo, descripcion, estatus, creado_en 
       FROM tareas 
       WHERE id_usuario = ? 
       ORDER BY creado_en DESC`,
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
    
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas'
    });
  }
});

/**
 * @route POST /tasks
 * @description Crear una nueva tarea
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, estatus } = req.body;
    
    if (!titulo?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El título es requerido'
      });
    }

    const [result] = await query(
      `INSERT INTO tareas 
       (titulo, descripcion, estatus, id_usuario) 
       VALUES (?, ?, ?, ?)`,
      [titulo.trim(), descripcion?.trim(), estatus || 'pendiente', req.user.id]
    );

    const [newTask] = await query(
      `SELECT id, titulo, descripcion, estatus 
       FROM tareas WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      task: newTask[0]
    });
    
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la tarea'
    });
  }
});

/**
 * @route PUT /tasks/:id
 * @description Actualizar una tarea existente
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estatus } = req.body;
    
    // Verificar que la tarea pertenezca al usuario
    const [existingTask] = await query(
      'SELECT id FROM tareas WHERE id = ? AND id_usuario = ?',
      [id, req.user.id]
    );
    
    if (!existingTask.length) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Actualizar solo los campos proporcionados
    const updateFields = {};
    if (titulo !== undefined) updateFields.titulo = titulo.trim();
    if (descripcion !== undefined) updateFields.descripcion = descripcion?.trim();
    if (estatus !== undefined) updateFields.estatus = estatus;

    await query(
      'UPDATE tareas SET ? WHERE id = ?',
      [updateFields, id]
    );

    // Obtener la tarea actualizada
    const [updatedTask] = await query(
      'SELECT * FROM tareas WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      task: updatedTask[0]
    });
    
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea'
    });
  }
});

/**
 * @route DELETE /tasks/:id
 * @description Eliminar una tarea
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la tarea pertenezca al usuario
    const [result] = await query(
      'DELETE FROM tareas WHERE id = ? AND id_usuario = ?',
      [id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea'
    });
  }
});

module.exports = router;