import { Router } from "express";

import {
    crearRecibo,
    listarRecibos
} from "../controllers/recibo.controller";

const router = Router();

router.get("/", listarRecibos);

router.post("/", crearRecibo);

export default router;