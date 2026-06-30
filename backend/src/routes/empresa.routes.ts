import { Router } from "express";

import {
    listarEmpresas,
    crearEmpresa,
    actualizarEmpresa,
    eliminarEmpresa
} from "../controllers/empresa.controller";

const router = Router();

router.get("/", listarEmpresas);

router.post("/", crearEmpresa);

router.put("/:razon_social", actualizarEmpresa);

router.delete("/:razon_social", eliminarEmpresa);

export default router;