export class LoteAlimento {
    id: string;
    establecimientoId: string;
    descripcion: string;
    cantidadDisponible: number;
    precioOriginal: number;
    precioDescuento: number;
    estado: 'Disponible' | 'Agotado';
    imagen: string;
 
    constructor(
        id: string,
        establecimientoId: string,
        descripcion: string,
        cantidadDisponible: number,
        precioOriginal: number,
        precioDescuento: number,
        imagen: string
    ) {
        this.id = id;
        this.establecimientoId = establecimientoId;
        this.descripcion = descripcion;
        this.cantidadDisponible = cantidadDisponible;
        this.precioOriginal = precioOriginal;
        this.precioDescuento = precioDescuento;
        this.estado = cantidadDisponible > 0 ? 'Disponible' : 'Agotado';
        this.imagen = imagen;
    }
 
    // Método para calcular el porcentaje de ahorro real
    calcularPorcentajeAhorro(): number {
        return Math.round(((this.precioOriginal - this.precioDescuento) / this.precioOriginal) * 100);
    }
}