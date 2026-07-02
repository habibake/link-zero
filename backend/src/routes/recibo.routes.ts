import { Router } from "express";

import {
  crearRecibo,
  listarRecibos,
  listarRecibosPorCliente
} from "../controllers/recibo.controller";

const router = Router();

router.get("/", listarRecibos);

router.get("/cliente/:idCliente", listarRecibosPorCliente);

router.post("/", crearRecibo);

export default router;