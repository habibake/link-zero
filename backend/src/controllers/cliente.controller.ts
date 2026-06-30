import { Request, Response } from "express";
import { db } from "../config/database";

// Listar clientes
export async function listarClientes(req: Request, res: Response) {

    try {

        const [rows] = await db.query(
            "SELECT * FROM Cliente ORDER BY id_cliente DESC"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener clientes"
        });

    }

}

// Registrar cliente
export async function crearCliente(req: Request, res: Response) {

    try {

        const {
            nombre,
            telefono,
            correo,
            contrasena,
            estado_vulnerabilidad
        } = req.body;

        const [resultado]: any = await db.query(

            `INSERT INTO Cliente
            (
                nombre,
                telefono,
                correo,
                contrasena,
                estado_vulnerabilidad
            )
            VALUES (?,?,?,?,?)`,

            [
                nombre,
                telefono,
                correo,
                contrasena,
                estado_vulnerabilidad
            ]

        );

        res.status(201).json({
            mensaje: "Cliente registrado",
            id_cliente: resultado.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al registrar cliente"
        });

    }

}

// Buscar cliente por ID
export async function obtenerCliente(req: Request, res: Response) {

    try {

        const { id } = req.params;

        const [rows]: any = await db.query(

            "SELECT * FROM Cliente WHERE id_cliente=?",

            [id]

        );

        if (rows.length === 0) {

            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });

        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error"
        });

    }

}

// Eliminar cliente
export async function eliminarCliente(req: Request, res: Response) {

    try {

        const { id } = req.params;

        await db.query(

            "DELETE FROM Cliente WHERE id_cliente=?",

            [id]

        );

        res.json({
            mensaje: "Cliente eliminado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error"
        });

    }

}