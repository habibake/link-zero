import { Request, Response } from 'express';
import { lotes, reservas, usuarios } from '../data/db';
import { Reserva } from '../models/Reserva';

// POST /api/reservas
// Body esperado: { usuarioId: string, loteId: string, cantidadReservada: number, metodoPago: string }
export function crearReserva(req: Request, res: Response) {
    const { usuarioId, loteId, cantidadReservada, metodoPago } = req.body;

    // Validación básica de que llegaron los datos necesarios
    if (!usuarioId || !loteId || !cantidadReservada || !metodoPago) {
        return res.status(400).json({ error: 'Faltan datos en la solicitud' });
    }

    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const lote = lotes.find((l) => l.id === loteId);
    if (!lote) {
        return res.status(404).json({ error: 'Lote no encontrado' });
    }

    if (lote.cantidadDisponible < cantidadReservada) {
        return res.status(400).json({ error: 'No hay suficiente disponibilidad' });
    }

    // Creamos la reserva usando tu clase real (genera el PIN y el estado 'Pendiente' automáticamente)
    const nuevaReserva = new Reserva(
        'RES-' + Math.floor(Math.random() * 10000),
        usuarioId,
        loteId,
        cantidadReservada,
        metodoPago
    );

    reservas.push(nuevaReserva);

    // Descontamos la disponibilidad del lote (mismo patrón que hacías en App.tsx)
    lote.cantidadDisponible -= cantidadReservada;
    lote.estado = lote.cantidadDisponible > 0 ? 'Disponible' : 'Agotado';

    res.status(201).json(nuevaReserva);
}

// GET /api/reservas/usuario/:usuarioId
// Devuelve el historial de reservas de un usuario (para la pantalla de historial)
export function listarReservasPorUsuario(req: Request, res: Response) {
    const { usuarioId } = req.params;
    const reservasDelUsuario = reservas.filter((r) => r.usuarioId === usuarioId);
    res.json(reservasDelUsuario);
}
