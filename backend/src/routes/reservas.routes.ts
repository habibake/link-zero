import { Router } from "express";

import {
    crearReserva,
    listarReservas,
    listarReservasPorUsuario
} from "../controllers/reservas.controller";

const router = Router();

router.post("/", crearReserva);

router.get("/", listarReservas);

router.get("/usuario/:usuarioId", listarReservasPorUsuario);

export default router;