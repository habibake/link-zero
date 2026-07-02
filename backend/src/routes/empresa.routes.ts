import { Router } from "express";

import {
  listarEmpresas,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
} from "../controllers/empresa.controller";

const router = Router();

// Trae todas las empresas.
router.get("/", listarEmpresas);

// Registra una empresa.
router.post("/", crearEmpresa);

// Actualiza datos visibles de empresa.
router.put("/:razon_social", actualizarEmpresa);

// Elimina una empresa.
router.delete("/:razon_social", eliminarEmpresa);

export default router;