import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface ReservaRow extends RowDataPacket {
  id_reserva: number;
}

interface PagoRow extends RowDataPacket {
  id_pago: number;
}

export async function crearPago(req: Request, res: Response) {
  try {
    const {
      id_reserva,
      metodo_pago,
      monto_total,
      estado_transaccion
    } = req.body;

    if (!id_reserva || !metodo_pago || monto_total === undefined || monto_total === null) {
      return res.status(400).json({
        mensaje: "id_reserva, metodo_pago y monto_total son obligatorios"
      });
    }

    const [reserva] = await db.query<ReservaRow[]>(
      `SELECT id_reserva
       FROM reservas
       WHERE id_reserva = ?`,
      [id_reserva]
    );

    if (reserva.length === 0) {
      return res.status(404).json({
        mensaje: "La reserva no existe"
      });
    }

    const [pagoExistente] = await db.query<PagoRow[]>(
      `SELECT id_pago
       FROM pago
       WHERE id_reserva = ?
       LIMIT 1`,
      [id_reserva]
    );

    if (pagoExistente.length > 0) {
      return res.status(409).json({
        mensaje: "Esta reserva ya tiene un pago registrado",
        id_pago: pagoExistente[0].id_pago
      });
    }

    const [resultado] = await db.query<ResultSetHeader>(
      `INSERT INTO pago
       (id_reserva, metodo_pago, monto_total, estado_transaccion)
       VALUES (?, ?, ?, ?)`,
      [
        id_reserva,
        metodo_pago,
        Number(monto_total),
        estado_transaccion || "Pendiente"
      ]
    );

    return res.status(201).json({
      mensaje: "Pago registrado correctamente",
      id_pago: resultado.insertId
    });

  } catch (error) {
    console.error("Error al registrar pago:", error);

    return res.status(500).json({
      mensaje: "Error al registrar pago"
    });
  }
}

export async function listarPagos(req: Request, res: Response) {
  try {
    const [rows] = await db.query(
      `SELECT
        p.*,
        r.id_cliente,
        r.razon_social_empresa,
        r.fecha_reserva,
        r.hora_reserva
       FROM pago p
       INNER JOIN reservas r ON p.id_reserva = r.id_reserva
       ORDER BY p.id_pago DESC`
    );

    return res.json(rows);
  } catch (error) {
    console.error("Error al listar pagos:", error);

    return res.status(500).json({
      mensaje: "Error al obtener pagos"
    });
  }
}

export async function listarPagosPorCliente(req: Request, res: Response) {
  try {
    const { idCliente } = req.params;

    const [rows] = await db.query(
      `SELECT
        p.*,
        r.razon_social_empresa,
        r.fecha_reserva,
        r.hora_reserva
       FROM pago p
       INNER JOIN reservas r ON p.id_reserva = r.id_reserva
       WHERE r.id_cliente = ?
       ORDER BY p.id_pago DESC`,
      [idCliente]
    );

    return res.json(rows);
  } catch (error) {
    console.error("Error al listar pagos del cliente:", error);

    return res.status(500).json({
      mensaje: "Error al obtener pagos del cliente"
    });
  }
}