import pool from '../db.mjs';
import bcrypt from 'bcrypt';

export async function crearTablaUsuarios() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuario (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      usuario VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol VARCHAR(20) NOT NULL
    )
  `);
  // Insertar usuarios por defecto si no existen
  const admin = await buscarPorUsuario('admin');
  if (!admin) {
    await crearUsuario('Admin', 'admin@gmail.com', 'admin', '123', 'Administrador');
  }
  const user = await buscarPorUsuario('usuario');
  if (!user) {
    await crearUsuario('Usuario', 'usuario@gmail.com', 'usuario', '123', 'Usuario');
  }
}

export async function crearUsuario(name, email, usuario, password, rol = 'Usuario') {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    'INSERT INTO usuario (name, email, usuario, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, usuario, hash, rol]
  );
  return rows[0];
}

export async function buscarPorUsuario(usuario) {
  const { rows } = await pool.query('SELECT * FROM usuario WHERE usuario = $1', [usuario]);
  return rows[0] || null;
}

export async function buscarPorCorreo(email) {
  const { rows } = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
  return rows[0] || null;
} 