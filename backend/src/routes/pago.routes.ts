import { Router } from "express";

import {
  crearPago,
  listarPagos,
  listarPagosPorCliente
} from "../controllers/pago.controller";

const router = Router();

router.get("/", listarPagos);

router.get("/cliente/:idCliente", listarPagosPorCliente);

router.post("/", crearPago);

export default router;