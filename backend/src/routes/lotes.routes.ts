import { Router } from "express";
import {
    listarLotes,
    listarLotesPorEmpresa,
    obtenerLotePorId,
    crearLote,
    actualizarLote,
    eliminarLote
} from "../controllers/lotes.controller";

const router = Router();

router.get("/", listarLotes);
router.get("/empresa/:razon_social", listarLotesPorEmpresa);
router.get("/:id", obtenerLotePorId);
router.post("/", crearLote);
router.put("/:id", actualizarLote);
router.delete("/:id", eliminarLote);

export default router;