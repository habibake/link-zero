import { Router } from 'express';
import { listarLotes, obtenerLotePorId } from '../controllers/lotes.controller';

const router = Router();

router.get('/', listarLotes);
router.get('/:id', obtenerLotePorId);

export default router;
