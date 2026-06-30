import { Router } from "express";

import {

listarClientes,
crearCliente,
obtenerCliente,
eliminarCliente

} from "../controllers/cliente.controller";

const router = Router();

router.get("/", listarClientes);

router.get("/:id", obtenerCliente);

router.post("/", crearCliente);

router.delete("/:id", eliminarCliente);

export default router;