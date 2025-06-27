import * as Producto from '../models/producto.mjs';

export async function getProductos(req, res) {
  const { tipo } = req.params;
  if (tipo && !['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  try {
    if (tipo) {
      const productos = await Producto.obtenerPorTipo(tipo.slice(0, -1));
      res.json(productos);
    } else {
      const productos = await Producto.obtenerTodos();
      res.json(productos);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

export async function getProducto(req, res) {
  const { tipo, id } = req.params;
  try {
    let producto;
    if (tipo) {
      if (!['prendas', 'accesorios'].includes(tipo)) {
        return res.status(400).json({ error: 'Tipo inválido' });
      }
      producto = await Producto.obtenerPorTipoYId(tipo.slice(0, -1), id);
    } else {
      producto = await Producto.obtenerPorId(id);
    }
    if (!producto) return res.status(404).json({ error: 'No encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
}

export async function createProducto(req, res) {
  const { tipo } = req.params;
  const { nombre, precio, imagen } = req.body;
  if (!['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  if (!nombre || !precio || !imagen) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const producto = await Producto.crearProducto({ nombre, precio, imagen, tipo: tipo.slice(0, -1) });
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
}

export async function updateProducto(req, res) {
  const { tipo, id } = req.params;
  const { nombre, precio, imagen } = req.body;
  if (!['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  try {
    const producto = await Producto.actualizarProducto({ id, nombre, precio, imagen, tipo: tipo.slice(0, -1) });
    if (!producto) return res.status(404).json({ error: 'No encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
}

export async function deleteProducto(req, res) {
  const { tipo, id } = req.params;
  if (!['prendas', 'accesorios'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  try {
    const producto = await Producto.eliminarProducto({ id, tipo: tipo.slice(0, -1) });
    if (!producto) return res.status(404).json({ error: 'No encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
} 