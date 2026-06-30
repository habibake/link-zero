import { Request, Response } from "express";
import { db } from "../config/database";

// ==========================
// CREAR RESERVA
// ==========================
export async function crearReserva(req: Request, res: Response) {

    try {

        const {
            id_cliente,
            razon_social_empresa,
            hora_reserva,
            fecha_reserva,
            pin
        } = req.body;

        const [resultado]: any = await db.query(

            `INSERT INTO Reservas
            (
                id_cliente,
                razon_social_empresa,
                hora_reserva,
                fecha_reserva,
                pin
            )
            VALUES (?,?,?,?,?)`,

            [
                id_cliente,
                razon_social_empresa,
                hora_reserva,
                fecha_reserva,
                pin
            ]

        );

        res.status(201).json({
            mensaje: "Reserva creada correctamente",
            id_reserva: resultado.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear la reserva"
        });

    }

}

// ==========================
// LISTAR RESERVAS
// ==========================
export async function listarReservas(req: Request, res: Response) {

    try {

        const [rows] = await db.query(`
            SELECT *
            FROM Reservas
            ORDER BY id_reserva DESC
        `);

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener reservas"
        });

    }

}

// ==========================
// RESERVAS POR CLIENTE
// ==========================
export async function listarReservasPorUsuario(req: Request, res: Response) {

    try {

        const { usuarioId } = req.params;

        const [rows] = await db.query(

            `SELECT *
             FROM Reservas
             WHERE id_cliente=?`,

            [usuarioId]

        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener reservas"
        });

    }

}