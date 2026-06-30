import { Request, Response } from "express";
import { db } from "../config/database";

// Obtener empresas
export async function listarEmpresas(req: Request, res: Response) {

    try {

        const [rows] = await db.query(
            "SELECT * FROM Empresa ORDER BY date_cuenta DESC"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener empresas"
        });

    }

}

// Crear empresa
export async function crearEmpresa(req: Request, res: Response) {

    try {

        const {
            razon_social,
            direccion,
            horario_de_atencion
        } = req.body;

        await db.query(

            `INSERT INTO Empresa
            (
                razon_social,
                direccion,
                horario_de_atencion
            )
            VALUES (?,?,?)`,

            [
                razon_social,
                direccion,
                horario_de_atencion
            ]

        );

        res.status(201).json({
            mensaje: "Empresa registrada"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al registrar empresa"
        });

    }

}

// Editar empresa
export async function actualizarEmpresa(req: Request, res: Response) {

    try {

        const { razon_social } = req.params;

        const {
            direccion,
            horario_de_atencion
        } = req.body;

        await db.query(

            `UPDATE Empresa
             SET
             direccion=?,
             horario_de_atencion=?
             WHERE razon_social=?`,

            [
                direccion,
                horario_de_atencion,
                razon_social
            ]

        );

        res.json({
            mensaje: "Empresa actualizada"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error"
        });

    }

}

// Eliminar empresa
export async function eliminarEmpresa(req: Request, res: Response) {

    try {

        const { razon_social } = req.params;

        await db.query(

            "DELETE FROM Empresa WHERE razon_social=?",

            [razon_social]

        );

        res.json({
            mensaje: "Empresa eliminada"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error"
        });

    }

}