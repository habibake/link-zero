import { Router } from "express";
import {
    listarClientes,
    crearCliente,
    loginCliente,
    loginUnificado,
    obtenerCliente,
    eliminarCliente
} from "../controllers/cliente.controller";

const router = Router();

router.get("/", listarClientes);
router.post("/", crearCliente);
router.post("/login", loginCliente);
router.post("/login-unificado", loginUnificado);
router.get("/:id", obtenerCliente);
router.delete("/:id", eliminarCliente);

export default router;