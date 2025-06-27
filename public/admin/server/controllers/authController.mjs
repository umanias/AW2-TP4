import { buscarPorUsuario, buscarPorCorreo, crearUsuario } from '../models/usuario.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET = process.env.JWT_SECRET || 'secreto';

export async function login(req, res) {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  const usuarioDB = await buscarPorUsuario(usuario);
  if (!usuarioDB) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  const match = await bcrypt.compare(password, usuarioDB.password);
  if (!match) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  const token = jwt.sign({ id: usuarioDB.id, usuario: usuarioDB.usuario, rol: usuarioDB.rol }, SECRET, { expiresIn: '2h' });
  res.json({ token, usuario: usuarioDB.usuario, rol: usuarioDB.rol });
}

export async function register(req, res) {
  const { name, email, usuario, password } = req.body;
  if (!name || !email || !usuario || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  const existenteUsuario = await buscarPorUsuario(usuario);
  if (existenteUsuario) return res.status(409).json({ error: 'El usuario ya existe' });
  const existenteCorreo = await buscarPorCorreo(email);
  if (existenteCorreo) return res.status(409).json({ error: 'El correo ya está registrado' });
  const usuarioDB = await crearUsuario(name, email, usuario, password, 'Usuario');
  res.status(201).json({ id: usuarioDB.id, usuario: usuarioDB.usuario, rol: usuarioDB.rol });
} 