import { Router } from 'express';
import { registrarUsuario } from '../controllers/usuarioController';

const router = Router();

// Creamos la ruta tipo POST para recibir datos
router.post('/registro', registrarUsuario);

export default router;