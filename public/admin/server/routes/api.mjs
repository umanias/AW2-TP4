import express from 'express';
import pool from '../db.mjs';
import { login, register } from '../controllers/authController.mjs';

const router = express.Router();

router.get('/:tipo', async (req, res) => {
  const { tipo } = req.params;
  if (!['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM productos WHERE tipo = $1 ORDER BY id', [tipo.slice(0, -1)]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:tipo/:id', async (req, res) => {
  const { tipo, id } = req.params;
  if (!['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1 AND tipo = $2', [id, tipo.slice(0, -1)]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Rutas de autenticación
router.post('/login', login);
router.post('/register', register);

export default router;
