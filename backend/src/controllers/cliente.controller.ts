import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Estructura de cliente desde MySQL.
interface ClienteRow extends RowDataPacket {
  id_cliente: number;
  nombre: string;
  correo: string;
  contrasena: string;
}

// Estructura de empresa desde MySQL.
interface EmpresaRow extends RowDataPacket {
  razon_social: string;
  nombre_empresa: string;
  direccion: string;
  correo: string;
  contrasena: string;
}

// Lista clientes registrados.
export async function listarClientes(req: Request, res: Response) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM cliente ORDER BY id_cliente DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ mensaje: "Error al obtener clientes" });
  }
}

// Registra un cliente nuevo.
export async function crearCliente(req: Request, res: Response) {
  try {
    const { nombre, telefono, correo, contrasena, estado_vulnerabilidad } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        mensaje: "nombre, correo y contrasena son obligatorios"
      });
    }

    const [existe] = await db.query<ClienteRow[]>(
      "SELECT id_cliente FROM cliente WHERE correo = ?",
      [correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        mensaje: "Ya existe una cuenta con ese correo"
      });
    }

    const [resultado] = await db.query<ResultSetHeader>(
      `INSERT INTO cliente
       (nombre, telefono, correo, contrasena, estado_vulnerabilidad)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, telefono || "", correo, contrasena, estado_vulnerabilidad || false]
    );

    res.status(201).json({
      mensaje: "Cliente registrado",
      id_cliente: resultado.insertId,
      nombre,
      correo
    });
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    res.status(500).json({ mensaje: "Error al registrar cliente" });
  }
}

// Login unificado. Detecta si el correo pertenece a cliente o empresa.
export async function loginUnificado(req: Request, res: Response) {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    const [clientes] = await db.query<ClienteRow[]>(
      "SELECT * FROM cliente WHERE correo = ? AND contrasena = ?",
      [correo, contrasena]
    );

    if (clientes.length > 0) {
      const cliente = clientes[0];

      return res.json({
        tipo: "cliente",
        id_cliente: cliente.id_cliente,
        nombre: cliente.nombre,
        correo: cliente.correo
      });
    }

    const [empresas] = await db.query<EmpresaRow[]>(
      `SELECT
        razon_social,
        COALESCE(NULLIF(nombre_empresa, ''), razon_social) AS nombre_empresa,
        direccion,
        correo,
        contrasena
       FROM empresa
       WHERE correo = ? AND contrasena = ?`,
      [correo, contrasena]
    );

    if (empresas.length > 0) {
      const empresa = empresas[0];

      return res.json({
        tipo: "empresa",
        razon_social: empresa.razon_social,
        nombre_empresa: empresa.nombre_empresa,
        direccion: empresa.direccion,
        correo: empresa.correo
      });
    }

    return res.status(401).json({
      mensaje: "Correo o contraseña incorrectos"
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
}

// Login exclusivo de cliente. Se deja por compatibilidad.
export async function loginCliente(req: Request, res: Response) {
  try {
    const { correo, contrasena } = req.body;

    const [rows] = await db.query<ClienteRow[]>(
      "SELECT * FROM cliente WHERE correo = ? AND contrasena = ?",
      [correo, contrasena]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const cliente = rows[0];

    res.json({
      mensaje: "Login exitoso",
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      correo: cliente.correo
    });
  } catch (error) {
    console.error("Error en login cliente:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
}

// Busca un cliente por ID.
export async function obtenerCliente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [rows] = await db.query<ClienteRow[]>(
      "SELECT * FROM cliente WHERE id_cliente = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ mensaje: "Error al obtener cliente" });
  }
}

// Elimina un cliente por ID.
export async function eliminarCliente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM cliente WHERE id_cliente = ?",
      [id]
    );

    res.json({ mensaje: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ mensaje: "Error al eliminar cliente" });
  }
}