import { Router } from 'express';
import { crearReserva, listarReservasPorUsuario } from '../controllers/reservas.controller';

const router = Router();

router.post('/', crearReserva);
router.get('/usuario/:usuarioId', listarReservasPorUsuario);

export default router;
