import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secreto';

export function authAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    if (payload.rol !== 'Administrador') {
      return res.status(403).json({ error: 'Permiso denegado' });
    }
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
} 