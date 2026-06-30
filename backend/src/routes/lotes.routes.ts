import { Router } from "express";

import {
    listarLotes,
    obtenerLotePorId,
    crearLote,
    actualizarLote,
    eliminarLote
} from "../controllers/lotes.controller";

const router = Router();

// Obtener todos los lotes
router.get("/", listarLotes);

// Obtener un lote por ID
router.get("/:id", obtenerLotePorId);

// Crear un lote
router.post("/", crearLote);

// Actualizar un lote
router.put("/:id", actualizarLote);

// Eliminar un lote
router.delete("/:id", eliminarLote);

export default router;