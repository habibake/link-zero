import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface ItemReservaEntrada {
    id_lote: number;
    cantidad: number;
}

interface LoteRow extends RowDataPacket {
    precio_descuento: number;
    cantidad_en_stock: number;
}

// ==========================
// CREAR RESERVA (+ items + descuento de stock)
// ==========================
export async function crearReserva(req: Request, res: Response) {

    const conexion = await db.getConnection();

    try {

        const {
            id_cliente,
            razon_social_empresa,
            hora_reserva,
            fecha_reserva,
            pin,
            items
        } = req.body as {
            id_cliente: number;
            razon_social_empresa: string;
            hora_reserva: string;
            fecha_reserva: string;
            pin: string;
            items: ItemReservaEntrada[];
        };

        if (!id_cliente || !razon_social_empresa || !items || items.length === 0) {
            conexion.release();
            return res.status(400).json({
                mensaje: "Faltan datos para crear la reserva"
            });
        }

        await conexion.beginTransaction();

        const [resultadoReserva] = await conexion.query<ResultSetHeader>(
            `INSERT INTO Reservas
            (id_cliente, razon_social_empresa, hora_reserva, fecha_reserva, pin)
            VALUES (?,?,?,?,?)`,
            [id_cliente, razon_social_empresa, hora_reserva, fecha_reserva, pin]
        );

        const id_reserva = resultadoReserva.insertId;

        for (const item of items) {

            const [loteRows] = await conexion.query<LoteRow[]>(
                "SELECT precio_descuento, cantidad_en_stock FROM Lote_comida WHERE id_lote = ? FOR UPDATE",
                [item.id_lote]
            );

            if (loteRows.length === 0) {
                throw new Error("El lote " + item.id_lote + " no existe");
            }

            const lote = loteRows[0];

            if (lote.cantidad_en_stock < item.cantidad) {
                throw new Error("No hay suficiente stock para el lote " + item.id_lote);
            }

            const precio_unitario = lote.precio_descuento;
            const subtotal = precio_unitario * item.cantidad;

            await conexion.query(
                `INSERT INTO Item_reserva
                (id_reserva, id_lote, cantidad, precio_unitario, subtotal)
                VALUES (?,?,?,?,?)`,
                [id_reserva, item.id_lote, item.cantidad, precio_unitario, subtotal]
            );

            await conexion.query(
                "UPDATE Lote_comida SET cantidad_en_stock = cantidad_en_stock - ? WHERE id_lote = ?",
                [item.cantidad, item.id_lote]
            );
        }

        await conexion.commit();
        conexion.release();

        res.status(201).json({
            mensaje: "Reserva creada correctamente",
            id_reserva: id_reserva
        });

    } catch (error: unknown) {

        await conexion.rollback();
        conexion.release();

        console.error(error);

        const mensaje = error instanceof Error ? error.message : "Error al crear la reserva";

        res.status(500).json({
            mensaje
        });

    }

}

// ==========================
// LISTAR RESERVAS
// ==========================
export async function listarReservas(req: Request, res: Response) {
    try {
        const [rows] = await db.query("SELECT * FROM Reservas ORDER BY id_reserva DESC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener reservas" });
    }
}

// ==========================
// RESERVAS POR CLIENTE
// ==========================
export async function listarReservasPorUsuario(req: Request, res: Response) {
    try {
        const { usuarioId } = req.params;
        const [rows] = await db.query(
            "SELECT * FROM Reservas WHERE id_cliente=?",
            [usuarioId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener reservas" });
    }
}