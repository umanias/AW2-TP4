import express from 'express';
import pool from '../db.mjs';
import { authAdmin } from '../utils/authMiddleware.mjs';

const router = express.Router();

// POST /:tipo
router.post('/:tipo', authAdmin, async (req, res) => {
  const { tipo } = req.params;
  const { nombre, precio, imagen } = req.body;
  if (!['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  if (!nombre || !precio || !imagen) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO productos (nombre, precio, imagen, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, precio, imagen, tipo.slice(0, -1)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /:tipo/:id
router.put('/:tipo/:id', authAdmin, async (req, res) => {
  const { tipo, id } = req.params;
  const { nombre, precio, imagen } = req.body;
  if (!['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE productos SET nombre = $1, precio = $2, imagen = $3 WHERE id = $4 AND tipo = $5 RETURNING *',
      [nombre, precio, imagen, id, tipo.slice(0, -1)]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /:tipo/:id
router.delete('/:tipo/:id', authAdmin, async (req, res) => {
  const { tipo, id } = req.params;
  if (!['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  try {
    const { rows } = await pool.query('DELETE FROM productos WHERE id = $1 AND tipo = $2 RETURNING *', [id, tipo.slice(0, -1)]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router; 