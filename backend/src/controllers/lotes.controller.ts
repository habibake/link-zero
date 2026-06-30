import { Request, Response } from "express";
import { db } from "../config/database";

// =========================
// LISTAR TODOS LOS LOTES
// =========================
export async function listarLotes(req: Request, res: Response) {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM Lote_comida
            ORDER BY id_lote DESC
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los lotes" });
    }
}

// =========================
// OBTENER LOTE POR ID
// =========================
export async function obtenerLotePorId(req: Request, res: Response) {

    try {

        const { id } = req.params;

        const [rows]: any = await db.query(
            "SELECT * FROM Lote_comida WHERE id_lote=?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: "Lote no encontrado"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error del servidor"
        });

    }

}

// =========================
// CREAR LOTE
// =========================
export async function crearLote(req: Request, res: Response) {

    try {

        const {
            razon_social_empresa,
            descripcion,
            categoria,
            cantidad_en_stock,
            precio_original,
            precio_descuento,
            fecha_expiracion,
            fecha_disponible,
            solo_donacion
        } = req.body;

        const [resultado]: any = await db.query(

            `INSERT INTO Lote_comida
            (
                razon_social_empresa,
                descripcion,
                categoria,
                cantidad_en_stock,
                precio_original,
                precio_descuento,
                fecha_expiracion,
                fecha_disponible,
                solo_donacion
            )
            VALUES (?,?,?,?,?,?,?,?,?)`,

            [
                razon_social_empresa,
                descripcion,
                categoria,
                cantidad_en_stock,
                precio_original,
                precio_descuento,
                fecha_expiracion,
                fecha_disponible,
                solo_donacion
            ]

        );

        res.status(201).json({
            mensaje: "Lote creado correctamente",
            id: resultado.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "No se pudo crear el lote"
        });

    }

}

// =========================
// ACTUALIZAR LOTE
// =========================
export async function actualizarLote(req: Request, res: Response) {

    try {

        const { id } = req.params;

        const {
            descripcion,
            categoria,
            cantidad_en_stock,
            precio_original,
            precio_descuento,
            fecha_expiracion,
            fecha_disponible,
            solo_donacion
        } = req.body;

        await db.query(

            `UPDATE Lote_comida
            SET
                descripcion=?,
                categoria=?,
                cantidad_en_stock=?,
                precio_original=?,
                precio_descuento=?,
                fecha_expiracion=?,
                fecha_disponible=?,
                solo_donacion=?
            WHERE id_lote=?`,

            [
                descripcion,
                categoria,
                cantidad_en_stock,
                precio_original,
                precio_descuento,
                fecha_expiracion,
                fecha_disponible,
                solo_donacion,
                id
            ]

        );

        res.json({
            mensaje: "Lote actualizado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar"
        });

    }

}

// =========================
// ELIMINAR LOTE
// =========================
export async function eliminarLote(req: Request, res: Response) {

    try {

        const { id } = req.params;

        await db.query(
            "DELETE FROM Lote_comida WHERE id_lote=?",
            [id]
        );

        res.json({
            mensaje: "Lote eliminado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar"
        });

    }

}