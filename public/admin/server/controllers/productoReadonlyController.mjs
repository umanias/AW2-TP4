import * as Producto from '../models/producto.mjs';

export async function getAll(req, res) {
  try {
    const productos = await Producto.obtenerTodos();
    res.json(productos);
  } catch (e) {
    console.error('Error en GET /api/v1/articulos:', e);
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
}

export async function getById(req, res) {
  const id = parseInt(req.params.id);
  try {
    const producto = await Producto.obtenerPorId(id);
    if (!producto) return res.status(404).json({ error: 'Artículo no encontrado' });
    res.json(producto);
  } catch (e) {
    console.error('Error en GET /api/v1/articulos/:id:', e);
    res.status(500).json({ error: 'Error al obtener artículo' });
  }
} 