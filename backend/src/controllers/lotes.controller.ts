import { Request, Response } from "express";
import { db } from "../config/database";

// Obtener todos los lotes
export async function listarLotes(req: Request, res: Response) {
    try {
        const [rows] = await db.query("SELECT * FROM Lote_comida");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los lotes" });
    }
}

// Obtener un lote por ID
export async function obtenerLotePorId(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const [rows]: any = await db.query(
            "SELECT * FROM Lote_comida WHERE id_lote = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Lote no encontrado"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error del servidor"
        });
    }
}