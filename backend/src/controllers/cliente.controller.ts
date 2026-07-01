import { Request, Response } from "express";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface ClienteRow extends RowDataPacket {
    id_cliente: number;
    nombre: string;
    correo: string;
    contrasena: string;
}

interface EmpresaRow extends RowDataPacket {
    razon_social: string;
    correo: string;
    contrasena: string;
}

// Listar clientes
export async function listarClientes(req: Request, res: Response) {
    try {
        const [rows] = await db.query("SELECT * FROM Cliente ORDER BY id_cliente DESC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener clientes" });
    }
}

// Registrar cliente
export async function crearCliente(req: Request, res: Response) {
    try {
        const { nombre, telefono, correo, contrasena, estado_vulnerabilidad } = req.body;

        const [existe] = await db.query<ClienteRow[]>(
            "SELECT id_cliente FROM Cliente WHERE correo = ?", [correo]
        );
        if (existe.length > 0) {
            return res.status(400).json({ mensaje: "Ya existe una cuenta con ese correo" });
        }

        const [resultado] = await db.query<ResultSetHeader>(
            `INSERT INTO Cliente (nombre, telefono, correo, contrasena, estado_vulnerabilidad)
             VALUES (?,?,?,?,?)`,
            [nombre, telefono || '', correo, contrasena, estado_vulnerabilidad || false]
        );

        res.status(201).json({
            mensaje: "Cliente registrado",
            id_cliente: resultado.insertId,
            nombre,
            correo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al registrar cliente" });
    }
}

// LOGIN UNIFICADO — detecta automáticamente si es cliente o empresa
export async function loginUnificado(req: Request, res: Response) {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
        }

        // Primero busca en Cliente
        const [clientes] = await db.query<ClienteRow[]>(
            "SELECT * FROM Cliente WHERE correo = ? AND contrasena = ?",
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

        // Si no es cliente, busca en Empresa
        const [empresas] = await db.query<EmpresaRow[]>(
            "SELECT * FROM Empresa WHERE correo = ? AND contrasena = ?",
            [correo, contrasena]
        );

        if (empresas.length > 0) {
            const empresa = empresas[0];
            return res.json({
                tipo: "empresa",
                razon_social: empresa.razon_social,
                correo: empresa.correo
            });
        }

        return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
}

// LOGIN cliente (mantener por compatibilidad)
export async function loginCliente(req: Request, res: Response) {
    try {
        const { correo, contrasena } = req.body;
        const [rows] = await db.query<ClienteRow[]>(
            "SELECT * FROM Cliente WHERE correo = ? AND contrasena = ?",
            [correo, contrasena]
        );
        if (rows.length === 0) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }
        const cliente = rows[0];
        res.json({ mensaje: "Login exitoso", id_cliente: cliente.id_cliente, nombre: cliente.nombre, correo: cliente.correo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
}

// Buscar cliente por ID
export async function obtenerCliente(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const [rows] = await db.query<ClienteRow[]>(
            "SELECT * FROM Cliente WHERE id_cliente=?", [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error" });
    }
}

// Eliminar cliente
export async function eliminarCliente(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM Cliente WHERE id_cliente=?", [id]);
        res.json({ mensaje: "Cliente eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error" });
    }
}