import { Router } from "express";

import {
    crearPago,
    listarPagos
} from "../controllers/pago.controller";

const router = Router();

router.get("/", listarPagos);

router.post("/", crearPago);

export default router;