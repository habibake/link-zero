import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Representa un lote de comida junto con datos visibles de la empresa.
interface LoteRow extends RowDataPacket {
  id_lote: number;
  razon_social_empresa: string;
  nombre_empresa: string;
  direccion_empresa: string;
  descripcion: string;
  categoria: string;
  cantidad_en_stock: number;
  cantidad_vendida: number;
  precio_original: number;
  precio_descuento: number;
  fecha_expiracion: string;
  fecha_disponible: string;
  solo_donacion: number;
  imagen: string | null;
}

// Consulta base para traer lotes con nombre de empresa, ubicación y cantidad vendida.
// cantidad_vendida se calcula desde item_reserva unido con pago.
const SELECT_LOTES_CON_EMPRESA = `
  SELECT
    l.id_lote,
    l.razon_social_empresa,
    l.descripcion,
    l.categoria,
    l.cantidad_en_stock,
    COALESCE(v.cantidad_vendida, 0) AS cantidad_vendida,
    l.precio_original,
    l.precio_descuento,
    l.fecha_expiracion,
    l.fecha_disponible,
    l.solo_donacion,
    l.imagen,
    COALESCE(NULLIF(e.nombre_empresa, ''), e.razon_social, l.razon_social_empresa) AS nombre_empresa,
    COALESCE(NULLIF(e.direccion, ''), 'Ubicación no disponible') AS direccion_empresa
  FROM lote_comida l
  LEFT JOIN empresa e
    ON TRIM(UPPER(l.razon_social_empresa)) = TRIM(UPPER(e.razon_social))
  LEFT JOIN (
    SELECT
      ir.id_lote,
      SUM(ir.cantidad) AS cantidad_vendida
    FROM item_reserva ir
    INNER JOIN reservas r
      ON ir.id_reserva = r.id_reserva
    INNER JOIN pago p
      ON p.id_reserva = r.id_reserva
    GROUP BY ir.id_lote
  ) v
    ON v.id_lote = l.id_lote
`;

// Lista todos los lotes para la pantalla del cliente.
export async function listarLotes(req: Request, res: Response) {
  try {
    const [rows] = await db.query<LoteRow[]>(
      `${SELECT_LOTES_CON_EMPRESA}
       ORDER BY l.id_lote DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener lotes:", error);
    res.status(500).json({ mensaje: "Error al obtener los lotes" });
  }
}

// Lista solo los lotes de una empresa para el dashboard.
export async function listarLotesPorEmpresa(req: Request, res: Response) {
  try {
    const { razon_social } = req.params;

    const [rows] = await db.query<LoteRow[]>(
      `${SELECT_LOTES_CON_EMPRESA}
       WHERE TRIM(UPPER(l.razon_social_empresa)) = TRIM(UPPER(?))
       ORDER BY l.id_lote DESC`,
      [razon_social]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener lotes de empresa:", error);
    res.status(500).json({ mensaje: "Error al obtener lotes de la empresa" });
  }
}

// Obtiene un lote específico por id.
export async function obtenerLotePorId(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [rows] = await db.query<LoteRow[]>(
      `${SELECT_LOTES_CON_EMPRESA}
       WHERE l.id_lote = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Lote no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener lote:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
}

// Crea un lote nuevo desde el dashboard de empresa.
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
      solo_donacion,
      imagen
    } = req.body;

    if (!razon_social_empresa || !descripcion || !categoria) {
      return res.status(400).json({
        mensaje: "razon_social_empresa, descripcion y categoria son obligatorios"
      });
    }

    const [resultado] = await db.query<ResultSetHeader>(
      `INSERT INTO lote_comida
       (
        razon_social_empresa,
        descripcion,
        categoria,
        cantidad_en_stock,
        precio_original,
        precio_descuento,
        fecha_expiracion,
        fecha_disponible,
        solo_donacion,
        imagen
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        razon_social_empresa,
        descripcion,
        categoria,
        Number(cantidad_en_stock),
        Number(precio_original),
        Number(precio_descuento),
        fecha_expiracion,
        fecha_disponible,
        solo_donacion || false,
        imagen || null
      ]
    );

    res.status(201).json({
      mensaje: "Lote creado correctamente",
      id_lote: resultado.insertId
    });
  } catch (error) {
    console.error("Error al crear lote:", error);
    res.status(500).json({ mensaje: "No se pudo crear el lote" });
  }
}

// Actualiza un lote. Para marcar como vendido, pone el stock en cero.
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
      solo_donacion,
      imagen,
      estado
    } = req.body;

    const campos: string[] = [];
    const valores: unknown[] = [];

    if (descripcion !== undefined) {
      campos.push("descripcion = ?");
      valores.push(descripcion);
    }

    if (categoria !== undefined) {
      campos.push("categoria = ?");
      valores.push(categoria);
    }

    if (cantidad_en_stock !== undefined) {
      campos.push("cantidad_en_stock = ?");
      valores.push(Number(cantidad_en_stock));
    }

    if (precio_original !== undefined) {
      campos.push("precio_original = ?");
      valores.push(Number(precio_original));
    }

    if (precio_descuento !== undefined) {
      campos.push("precio_descuento = ?");
      valores.push(Number(precio_descuento));
    }

    if (fecha_expiracion !== undefined) {
      campos.push("fecha_expiracion = ?");
      valores.push(fecha_expiracion);
    }

    if (fecha_disponible !== undefined) {
      campos.push("fecha_disponible = ?");
      valores.push(fecha_disponible);
    }

    if (solo_donacion !== undefined) {
      campos.push("solo_donacion = ?");
      valores.push(solo_donacion);
    }

    if (imagen !== undefined) {
      campos.push("imagen = ?");
      valores.push(imagen);
    }

    if (estado === "Vendido") {
      campos.push("cantidad_en_stock = ?");
      valores.push(0);
    }

    if (campos.length === 0) {
      return res.status(400).json({ mensaje: "No hay datos para actualizar" });
    }

    valores.push(id);

    await db.query(
      `UPDATE lote_comida
       SET ${campos.join(", ")}
       WHERE id_lote = ?`,
      valores
    );

    res.json({ mensaje: "Lote actualizado" });
  } catch (error) {
    console.error("Error al actualizar lote:", error);
    res.status(500).json({ mensaje: "Error al actualizar lote" });
  }
}

// Elimina un lote del inventario.
export async function eliminarLote(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM lote_comida WHERE id_lote = ?",
      [id]
    );

    res.json({ mensaje: "Lote eliminado" });
  } catch (error) {
    console.error("Error al eliminar lote:", error);
    res.status(500).json({ mensaje: "Error al eliminar lote" });
  }
}