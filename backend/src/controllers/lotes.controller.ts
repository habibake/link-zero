import { Request, Response } from 'express';
import { lotes } from '../data/db';

// GET /api/lotes
// Devuelve todos los lotes disponibles (para la pantalla principal)
export function listarLotes(req: Request, res: Response) {
    res.json(lotes);
}

// GET /api/lotes/:id
// Devuelve un solo lote (para la pantalla de detalle)
export function obtenerLotePorId(req: Request, res: Response) {
    const { id } = req.params;
    const lote = lotes.find((l) => l.id === id);

    if (!lote) {
        return res.status(404).json({ error: 'Lote no encontrado' });
    }

    res.json(lote);
}
