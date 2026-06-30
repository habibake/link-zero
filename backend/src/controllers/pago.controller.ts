import { Request, Response } from "express";
import { db } from "../config/database";

// Crear pago
export async function crearPago(req: Request, res: Response) {

    try {

        const {
            id_reserva,
            metodo_pago,
            monto_total,
            estado_transaccion
        } = req.body;

        const [resultado]: any = await db.query(

            `INSERT INTO Pago
            (
                id_reserva,
                metodo_pago,
                monto_total,
                estado_transaccion
            )
            VALUES (?,?,?,?)`,

            [
                id_reserva,
                metodo_pago,
                monto_total,
                estado_transaccion
            ]

        );

        res.status(201).json({
            mensaje: "Pago registrado",
            id_pago: resultado.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al registrar pago"
        });

    }

}

// Listar pagos
export async function listarPagos(req: Request, res: Response) {

    try {

        const [rows] = await db.query(
            "SELECT * FROM Pago ORDER BY id_pago DESC"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error"
        });

    }

}