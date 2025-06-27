import pool from '../db.mjs';

export async function obtenerTodos() {
  const { rows } = await pool.query('SELECT * FROM productos ORDER BY id');
  return rows;
}

export async function obtenerPorId(id) {
  const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function obtenerPorTipo(tipo) {
  const { rows } = await pool.query('SELECT * FROM productos WHERE tipo = $1 ORDER BY id', [tipo]);
  return rows;
}

export async function obtenerPorTipoYId(tipo, id) {
  const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1 AND tipo = $2', [id, tipo]);
  return rows[0] || null;
}

export async function crearProducto({ nombre, precio, imagen, tipo }) {
  const { rows } = await pool.query(
    'INSERT INTO productos (nombre, precio, imagen, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, precio, imagen, tipo]
  );
  return rows[0];
}

export async function actualizarProducto({ id, nombre, precio, imagen, tipo }) {
  const { rows } = await pool.query(
    'UPDATE productos SET nombre = $1, precio = $2, imagen = $3 WHERE id = $4 AND tipo = $5 RETURNING *',
    [nombre, precio, imagen, id, tipo]
  );
  return rows[0] || null;
}

export async function eliminarProducto({ id, tipo }) {
  const { rows } = await pool.query('DELETE FROM productos WHERE id = $1 AND tipo = $2 RETURNING *', [id, tipo]);
  return rows[0] || null;
} 