export class Usuario {
    id: string;
    nombre: string;
    correo: string;
    telefono?: string;
    
    constructor(id: string, nombre: string, correo: string, telefono?: string) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
    }

    // Método de ejemplo simulando comportamiento POO
    obtenerResumen(): string {
        return `${this.nombre} (${this.correo})`;
    }
}