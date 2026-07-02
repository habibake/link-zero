import { Router } from "express";

import {
    crearReserva,
    listarReservas,
    listarReservasPorUsuario
} from "../controllers/reservas.controller";

const router = Router();

// Crear reserva
router.post("/", crearReserva);

// Listar todas las reservas
router.get("/", listarReservas);

// Historial por cliente
router.get("/usuario/:usuarioId", listarReservasPorUsuario);

export default router;