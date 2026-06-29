export class Usuario {
    private id: string;
    private nombre: string;
    private correo: string;
    private telefono?: string;

    constructor(id: string, nombre: string, correo: string, telefono?: string) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
    }

    public getId(): string {
        return this.id;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getCorreo(): string {
        return this.correo;
    }

    public getTelefono(): string | undefined {
        return this.telefono;
    }

    public obtenerResumen(): string {
        return `${this.nombre} (${this.correo})`;
    }
}