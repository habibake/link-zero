import { Request, Response } from "express";
import { db } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface LoteRow extends RowDataPacket {
    id_lote: number;
    razon_social_empresa: string;
    descripcion: string;
    categoria: string;
    cantidad_en_stock: number;
    precio_original: number;
    precio_descuento: number;
    fecha_expiracion: string;
    fecha_disponible: string;
    solo_donacion: boolean;
    imagen: string;
}

export async function listarLotes(req: Request, res: Response) {
    try {
        const [rows] = await db.query("SELECT * FROM Lote_comida ORDER BY id_lote DESC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los lotes" });
    }
}

export async function listarLotesPorEmpresa(req: Request, res: Response) {
    try {
        const { razon_social } = req.params;
        const [rows] = await db.query<LoteRow[]>(
            "SELECT * FROM Lote_comida WHERE razon_social_empresa = ? ORDER BY id_lote DESC",
            [razon_social]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener lotes de la empresa" });
    }
}

export async function obtenerLotePorId(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const [rows] = await db.query<LoteRow[]>(
            "SELECT * FROM Lote_comida WHERE id_lote=?", [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Lote no encontrado" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
}

export async function crearLote(req: Request, res: Response) {
    try {
        const {
            razon_social_empresa, descripcion, categoria,
            cantidad_en_stock, precio_original, precio_descuento,
            fecha_expiracion, fecha_disponible, solo_donacion, imagen
        } = req.body;

        const [resultado] = await db.query<ResultSetHeader>(
            `INSERT INTO Lote_comida
            (razon_social_empresa, descripcion, categoria, cantidad_en_stock,
             precio_original, precio_descuento, fecha_expiracion, fecha_disponible, solo_donacion, imagen)
            VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [razon_social_empresa, descripcion, categoria, cantidad_en_stock,
             precio_original, precio_descuento, fecha_expiracion, fecha_disponible, solo_donacion || false, imagen || null]
        );

        res.status(201).json({ mensaje: "Lote creado correctamente", id: resultado.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "No se pudo crear el lote" });
    }
}

export async function actualizarLote(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const {
            descripcion, categoria, cantidad_en_stock,
            precio_original, precio_descuento,
            fecha_expiracion, fecha_disponible, solo_donacion, imagen
        } = req.body;

        await db.query(
            `UPDATE Lote_comida SET descripcion=?, categoria=?, cantidad_en_stock=?,
             precio_original=?, precio_descuento=?, fecha_expiracion=?,
             fecha_disponible=?, solo_donacion=?, imagen=? WHERE id_lote=?`,
            [descripcion, categoria, cantidad_en_stock, precio_original,
             precio_descuento, fecha_expiracion, fecha_disponible, solo_donacion, imagen, id]
        );

        res.json({ mensaje: "Lote actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
}

export async function eliminarLote(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM Lote_comida WHERE id_lote=?", [id]);
        res.json({ mensaje: "Lote eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
}