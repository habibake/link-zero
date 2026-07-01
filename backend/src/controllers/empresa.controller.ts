import { Request, Response } from "express";
import { db } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface EmpresaRow extends RowDataPacket {
    razon_social: string;
    direccion: string;
    correo: string;
    contrasena: string;
}

export async function listarEmpresas(req: Request, res: Response) {
    try {
        const [rows] = await db.query("SELECT * FROM Empresa");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al listar empresas" });
    }
}

export async function crearEmpresa(req: Request, res: Response) {
    try {
        const { razon_social, direccion, horario_de_atencion, correo, contrasena } = req.body;

        if (!razon_social || !direccion) {
            return res.status(400).json({ mensaje: "razon_social y direccion son obligatorios" });
        }

        const [existe] = await db.query<EmpresaRow[]>(
            "SELECT razon_social FROM Empresa WHERE razon_social = ?", [razon_social]
        );

        if (existe.length > 0) {
            return res.status(409).json({ mensaje: "Ya existe una empresa con esa razón social" });
        }

        await db.query<ResultSetHeader>(
            `INSERT INTO Empresa (razon_social, direccion, horario_de_atencion, correo, contrasena)
             VALUES (?, ?, ?, ?, ?)`,
            [razon_social, direccion, horario_de_atencion || '08:00 - 20:00', correo || '', contrasena || '']
        );

        res.status(201).json({ razon_social, direccion, correo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear empresa" });
    }
}

export async function actualizarEmpresa(req: Request, res: Response) {
    try {
        const { razon_social } = req.params;
        const { direccion, horario_de_atencion } = req.body;
        await db.query(
            "UPDATE Empresa SET direccion = ?, horario_de_atencion = ? WHERE razon_social = ?",
            [direccion, horario_de_atencion, razon_social]
        );
        res.json({ mensaje: "Empresa actualizada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar empresa" });
    }
}

export async function eliminarEmpresa(req: Request, res: Response) {
    try {
        const { razon_social } = req.params;
        await db.query("DELETE FROM Empresa WHERE razon_social = ?", [razon_social]);
        res.json({ mensaje: "Empresa eliminada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar empresa" });
    }
}