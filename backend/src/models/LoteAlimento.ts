export class LoteAlimento {
    id: string;
    establecimientoId: string;
    descripcion: string;
    cantidadDisponible: number;
    precioOriginal: number;
    precioDescuento: number;
    estado: 'Disponible' | 'Agotado';

    constructor(
        id: string, 
        establecimientoId: string, 
        descripcion: string, 
        cantidadDisponible: number, 
        precioOriginal: number, 
        precioDescuento: number
    ) {
        this.id = id;
        this.establecimientoId = establecimientoId;
        this.descripcion = descripcion;
        this.cantidadDisponible = cantidadDisponible;
        this.precioOriginal = precioOriginal;
        this.precioDescuento = precioDescuento;
        this.estado = cantidadDisponible > 0 ? 'Disponible' : 'Agotado';
    }

    // Método para calcular el porcentaje de ahorro real
    calcularPorcentajeAhorro(): number {
        return Math.round(((this.precioOriginal - this.precioDescuento) / this.precioOriginal) * 100);
    }
}