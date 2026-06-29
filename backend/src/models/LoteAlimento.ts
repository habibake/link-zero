export type CategoriaLote = 'Panaderia' | 'Buffet' | 'Sushi';

export class LoteAlimento {
    id: string;
    establecimientoId: string;
    descripcion: string;
    cantidadDisponible: number;
    precioOriginal: number;
    precioDescuento: number;
    estado: 'Disponible' | 'Agotado';
    imagen: string;
    categoria: CategoriaLote;

    constructor(
        id: string,
        establecimientoId: string,
        descripcion: string,
        cantidadDisponible: number,
        precioOriginal: number,
        precioDescuento: number,
        imagen: string,
        categoria: CategoriaLote
    ) {
        this.id = id;
        this.establecimientoId = establecimientoId;
        this.descripcion = descripcion;
        this.cantidadDisponible = cantidadDisponible;
        this.precioOriginal = precioOriginal;
        this.precioDescuento = precioDescuento;
        this.estado = cantidadDisponible > 0 ? 'Disponible' : 'Agotado';
        this.imagen = imagen;
        this.categoria = categoria;
    }

    calcularPorcentajeAhorro(): number {
        return Math.round(((this.precioOriginal - this.precioDescuento) / this.precioOriginal) * 100);
    }
}
