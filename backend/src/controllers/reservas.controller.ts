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

interface ReservaBody {
  id_cliente: number;
  razon_social_empresa: string;
  hora_reserva?: string;
  fecha_reserva?: string;
  pin?: string;
  qr_reserva?: string;
  items: ItemReservaEntrada[];
}

function crearPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function fechaActual(): string {
  return new Date().toISOString().split("T")[0];
}

function horaActual(): string {
  return new Date().toTimeString().split(" ")[0];
}

export async function crearReserva(req: Request, res: Response) {
  const conexion = await db.getConnection();

  try {
    const {
      id_cliente,
      razon_social_empresa,
      hora_reserva,
      fecha_reserva,
      pin,
      qr_reserva,
      items
    } = req.body as ReservaBody;

    if (!id_cliente || !razon_social_empresa || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        mensaje: "Faltan datos para crear la reserva"
      });
    }

    for (const item of items) {
      if (!item.id_lote || !item.cantidad || item.cantidad <= 0) {
        return res.status(400).json({
          mensaje: "Cada producto necesita id_lote y cantidad mayor a cero"
        });
      }
    }

    await conexion.beginTransaction();

    const pinFinal = pin || crearPin();
    const qrFinal = qr_reserva || `RESERVA-${pinFinal}`;

    const [resultadoReserva] = await conexion.query<ResultSetHeader>(
      `INSERT INTO reservas
       (id_cliente, razon_social_empresa, hora_reserva, fecha_reserva, pin, estado, qr_reserva)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_cliente,
        razon_social_empresa,
        hora_reserva || horaActual(),
        fecha_reserva || fechaActual(),
        pinFinal,
        "Pendiente",
        qrFinal
      ]
    );

    const id_reserva = resultadoReserva.insertId;
    let total_reserva = 0;

    for (const item of items) {
      const [loteRows] = await conexion.query<LoteRow[]>(
        `SELECT precio_descuento, cantidad_en_stock
         FROM lote_comida
         WHERE id_lote = ?
         FOR UPDATE`,
        [item.id_lote]
      );

      if (loteRows.length === 0) {
        throw new Error(`El lote ${item.id_lote} no existe`);
      }

      const lote = loteRows[0];

      if (lote.cantidad_en_stock < item.cantidad) {
        throw new Error(`No hay suficiente stock para el lote ${item.id_lote}`);
      }

      const precio_unitario = Number(lote.precio_descuento);
      const subtotal = precio_unitario * item.cantidad;

      total_reserva += subtotal;

      await conexion.query(
        `INSERT INTO item_reserva
         (id_reserva, id_lote, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [id_reserva, item.id_lote, item.cantidad, precio_unitario, subtotal]
      );

      await conexion.query(
        `UPDATE lote_comida
         SET cantidad_en_stock = cantidad_en_stock - ?
         WHERE id_lote = ?`,
        [item.cantidad, item.id_lote]
      );
    }

    await conexion.commit();

    return res.status(201).json({
      mensaje: "Reserva creada correctamente",
      id_reserva,
      pin: pinFinal,
      qr_reserva: qrFinal,
      total_reserva
    });

  } catch (error: unknown) {
    await conexion.rollback();

    console.error("Error al crear reserva:", error);

    const mensaje = error instanceof Error ? error.message : "Error al crear la reserva";

    return res.status(500).json({ mensaje });
  } finally {
    conexion.release();
  }
}

export async function listarReservas(req: Request, res: Response) {
  try {
    const [rows] = await db.query(
      `SELECT
        r.*,
        COALESCE(t.total_reserva, 0) AS total_reserva,
        p.id_pago,
        p.metodo_pago,
        p.monto_total,
        p.estado_transaccion,
        rec.folio_recibo
       FROM reservas r
       LEFT JOIN (
        SELECT id_reserva, SUM(subtotal) AS total_reserva
        FROM item_reserva
        GROUP BY id_reserva
       ) t ON r.id_reserva = t.id_reserva
       LEFT JOIN pago p ON r.id_reserva = p.id_reserva
       LEFT JOIN recibo rec ON p.id_pago = rec.id_pago
       ORDER BY r.id_reserva DESC`
    );

    return res.json(rows);
  } catch (error) {
    console.error("Error al listar reservas:", error);

    return res.status(500).json({
      mensaje: "Error al obtener reservas"
    });
  }
}

export async function listarReservasPorUsuario(req: Request, res: Response) {
  try {
    const { usuarioId } = req.params;

    const [rows] = await db.query(
      `SELECT
        r.*,
        COALESCE(t.total_reserva, 0) AS total_reserva,
        p.id_pago,
        p.metodo_pago,
        p.monto_total,
        p.estado_transaccion,
        rec.folio_recibo
       FROM reservas r
       LEFT JOIN (
        SELECT id_reserva, SUM(subtotal) AS total_reserva
        FROM item_reserva
        GROUP BY id_reserva
       ) t ON r.id_reserva = t.id_reserva
       LEFT JOIN pago p ON r.id_reserva = p.id_reserva
       LEFT JOIN recibo rec ON p.id_pago = rec.id_pago
       WHERE r.id_cliente = ?
       ORDER BY r.id_reserva DESC`,
      [usuarioId]
    );

    return res.json(rows);
  } catch (error) {
    console.error("Error al listar reservas del usuario:", error);

    return res.status(500).json({
      mensaje: "Error al obtener reservas del usuario"
    });
  }
}