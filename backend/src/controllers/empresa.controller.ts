import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Estructura de empresa como viene desde MySQL.
interface EmpresaRow extends RowDataPacket {
  razon_social: string;
  nombre_empresa: string;
  direccion: string;
  calificacion: number;
  horario_de_atencion: string;
  date_cuenta: string;
  correo: string;
  contrasena: string;
}

// Lista todas las empresas registradas.
export async function listarEmpresas(req: Request, res: Response) {
  try {
    const [rows] = await db.query<EmpresaRow[]>(
      `SELECT
        razon_social,
        COALESCE(NULLIF(nombre_empresa, ''), razon_social) AS nombre_empresa,
        direccion,
        calificacion,
        horario_de_atencion,
        date_cuenta,
        correo
       FROM empresa
       ORDER BY date_cuenta DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al listar empresas:", error);
    res.status(500).json({ mensaje: "Error al listar empresas" });
  }
}

// Crea una empresa nueva desde el formulario de registro.
export async function crearEmpresa(req: Request, res: Response) {
  try {
    const {
      nombre_empresa,
      razon_social,
      direccion,
      horario_de_atencion,
      correo,
      contrasena
    } = req.body;

    if (!nombre_empresa || !razon_social || !direccion || !correo || !contrasena) {
      return res.status(400).json({
        mensaje: "nombre_empresa, razon_social, direccion, correo y contrasena son obligatorios"
      });
    }

    const [existeRazon] = await db.query<EmpresaRow[]>(
      "SELECT razon_social FROM empresa WHERE razon_social = ?",
      [razon_social]
    );

    if (existeRazon.length > 0) {
      return res.status(409).json({
        mensaje: "Ya existe una empresa con esa razón social"
      });
    }

    const [existeCorreo] = await db.query<EmpresaRow[]>(
      "SELECT correo FROM empresa WHERE correo = ?",
      [correo]
    );

    if (existeCorreo.length > 0) {
      return res.status(409).json({
        mensaje: "Ya existe una empresa con ese correo"
      });
    }

    await db.query<ResultSetHeader>(
      `INSERT INTO empresa
       (razon_social, nombre_empresa, direccion, horario_de_atencion, correo, contrasena)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        razon_social,
        nombre_empresa,
        direccion,
        horario_de_atencion || "08:00 - 20:00",
        correo,
        contrasena
      ]
    );

    res.status(201).json({
      mensaje: "Empresa registrada correctamente",
      razon_social,
      nombre_empresa,
      direccion,
      correo
    });
  } catch (error) {
    console.error("Error al crear empresa:", error);
    res.status(500).json({ mensaje: "Error al crear empresa" });
  }
}

// Actualiza nombre visible, dirección y horario de una empresa.
export async function actualizarEmpresa(req: Request, res: Response) {
  try {
    const { razon_social } = req.params;

    const {
      nombre_empresa,
      direccion,
      horario_de_atencion
    } = req.body;

    if (!nombre_empresa || !direccion || !horario_de_atencion) {
      return res.status(400).json({
        mensaje: "nombre_empresa, direccion y horario_de_atencion son obligatorios"
      });
    }

    const [resultado] = await db.query<ResultSetHeader>(
      `UPDATE empresa
       SET nombre_empresa = ?,
           direccion = ?,
           horario_de_atencion = ?
       WHERE TRIM(UPPER(razon_social)) = TRIM(UPPER(?))`,
      [
        nombre_empresa,
        direccion,
        horario_de_atencion,
        razon_social
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Empresa no encontrada"
      });
    }

    res.json({
      mensaje: "Empresa actualizada correctamente",
      razon_social,
      nombre_empresa,
      direccion,
      horario_de_atencion
    });
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    res.status(500).json({ mensaje: "Error al actualizar empresa" });
  }
}

// Elimina una empresa por razón social.
export async function eliminarEmpresa(req: Request, res: Response) {
  try {
    const { razon_social } = req.params;

    await db.query(
      "DELETE FROM empresa WHERE TRIM(UPPER(razon_social)) = TRIM(UPPER(?))",
      [razon_social]
    );

    res.json({ mensaje: "Empresa eliminada" });
  } catch (error) {
    console.error("Error al eliminar empresa:", error);
    res.status(500).json({ mensaje: "Error al eliminar empresa" });
  }
}