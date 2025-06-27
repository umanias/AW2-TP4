import express from 'express';
import { getAll, getById } from '../controllers/productoReadonlyController.mjs';

const router = express.Router();

// GET /api/v1/articulos
router.get('/', getAll);

// GET /api/v1/articulos/:id
router.get('/:id', getById);

export default router; 