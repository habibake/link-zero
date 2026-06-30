import { Request, Response } from "express";
import { db } from "../config/database";

// Crear recibo
export async function crearRecibo(req: Request, res: Response) {

    try {

        const {
            id_pago,
            detalles_de_compra
        } = req.body;

        const [resultado]: any = await db.query(

            `INSERT INTO Recibo
            (
                id_pago,
                detalles_de_compra
            )
            VALUES (?,?)`,

            [
                id_pago,
                detalles_de_compra
            ]

        );

        res.status(201).json({
            mensaje: "Recibo generado",
            folio: resultado.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al generar recibo"
        });

    }

}

// Obtener todos los recibos
export async function listarRecibos(req: Request, res: Response) {

    try {

        const [rows] = await db.query(
            "SELECT * FROM Recibo ORDER BY folio_recibo DESC"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error"
        });

    }

}