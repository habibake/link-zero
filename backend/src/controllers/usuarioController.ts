// src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { Usuario, usuariosDB } from '../models/Usuario';

// Controlador para registrar un nuevo usuario
export const registrarUsuario = (req: Request, res: Response) => {
    // 1. Extraemos los datos que nos mandará el frontend
    const { id, nombre, correo } = req.body;

    // 2. Aplicamos POO: Instanciamos un nuevo objeto de la clase Usuario
    const nuevoUsuario = new Usuario(id, nombre, correo);

    // 3. Lo guardamos en nuestra base de datos temporal (el arreglo)
    usuariosDB.push(nuevoUsuario);

    // 4. Respondemos que todo salió al cien usando los Getters (Encapsulamiento)
    res.status(201).json({
        mensaje: "¡Usuario registrado con éxito en Link-Zero!",
        usuario: {
            id: nuevoUsuario.getId(),
            nombre: nuevoUsuario.getNombre(),
            correo: nuevoUsuario.getCorreo()
        }
    });
};