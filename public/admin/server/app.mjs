import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiRouter from './routes/api.mjs';
import apiReadonlyRouter from './routes/api-readonly.mjs';
import crudRouter from './routes/crudRouter.mjs';

dotenv.config();
const app = express();
const PUERTO = process.env.PUERTO || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Rutas estáticas corregidas
app.use(express.static(path.join(__dirname, '../../client/vistas')));
app.use('/resources', express.static(path.join(__dirname, '../../client/resources')));
app.use('/admin', express.static(path.join(__dirname, '../')));

// API routes
app.use('/api/v1/articulos', apiReadonlyRouter);
app.use('/api', apiRouter);
app.use('/api', crudRouter);

app.listen(PUERTO, () => {
    console.log(`Server is running on http://localhost:${PUERTO}`);
});


