import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface PagoRow extends RowDataPacket {
  id_pago: number;
}

interface ReciboRow extends RowDataPacket {
  folio_recibo: number;
}

export async function crearRecibo(req: Request, res: Response) {
  try {
    const {
      id_pago,
      detalles_de_compra
    } = req.body;

    if (!id_pago || !detalles_de_compra) {
      return res.status(400).json({
        mensaje: "id_pago y detalles_de_compra son obligatorios"
      });
    }

    const [pago] = await db.query<PagoRow[]>(
      `SELECT id_pago
       FROM pago
       WHERE id_pago = ?`,
      [id_pago]
    );

    if (pago.length === 0) {
      return res.status(404).json({
        mensaje: "El pago no existe"
      });
    }

    const [reciboExistente] = await db.query<ReciboRow[]>(
      `SELECT folio_recibo
       FROM recibo
       WHERE id_pago = ?
       LIMIT 1`,
      [id_pago]
    );

    if (reciboExistente.length > 0) {
      return res.status(409).json({
        mensaje: "Este pago ya tiene recibo",
        folio_recibo: reciboExistente[0].folio_recibo
      });
    }

    const [resultado] = await db.query<ResultSetHeader>(
      `INSERT INTO recibo
       (id_pago, detalles_de_compra)
       VALUES (?, ?)`,
      [id_pago, detalles_de_compra]
    );

    return res.status(201).json({
      mensaje: "Recibo generado correctamente",
      folio_recibo: resultado.insertId
    });

  } catch (error) {
    console.error("Error al generar recibo:", error);

    return res.status(500).json({
      mensaje: "Error al generar recibo"
    });
  }
}

export async function listarRecibos(req: Request, res: Response) {
  try {
    const [rows] = await db.query(
      `SELECT
        rec.*,
        p.id_reserva,
        p.metodo_pago,
        p.monto_total,
        p.estado_transaccion,
        r.id_cliente,
        r.razon_social_empresa
       FROM recibo rec
       INNER JOIN pago p ON rec.id_pago = p.id_pago
       INNER JOIN reservas r ON p.id_reserva = r.id_reserva
       ORDER BY rec.folio_recibo DESC`
    );

    return res.json(rows);
  } catch (error) {
    console.error("Error al listar recibos:", error);

    return res.status(500).json({
      mensaje: "Error al obtener recibos"
    });
  }
}

export async function listarRecibosPorCliente(req: Request, res: Response) {
  try {
    const { idCliente } = req.params;

    const [rows] = await db.query(
      `SELECT
        rec.*,
        p.id_reserva,
        p.metodo_pago,
        p.monto_total,
        p.estado_transaccion,
        r.razon_social_empresa,
        r.fecha_reserva,
        r.hora_reserva
       FROM recibo rec
       INNER JOIN pago p ON rec.id_pago = p.id_pago
       INNER JOIN reservas r ON p.id_reserva = r.id_reserva
       WHERE r.id_cliente = ?
       ORDER BY rec.folio_recibo DESC`,
      [idCliente]
    );

    return res.json(rows);
  } catch (error) {
    console.error("Error al listar recibos del cliente:", error);

    return res.status(500).json({
      mensaje: "Error al obtener recibos del cliente"
    });
  }
}