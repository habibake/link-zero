// Categorías que puede tener un lote de comida.
export type CategoriaLote =
  | 'Panaderia'
  | 'Panadería'
  | 'Buffet'
  | 'Sushi'
  | 'Lácteos'
  | 'Verduras'
  | 'Preparada'
  | string;

// Clase que representa un lote de comida dentro del frontend.
export class LoteAlimento {
  id: string;

  // Esta propiedad guarda la razón social. Se usa como ID interno para reservas y relaciones con MySQL.
  establecimientoId: string;

  // Esta propiedad guarda el nombre visible de la empresa.
  nombreEmpresa: string;

  // Esta propiedad guarda la ubicación real de la empresa.
  direccionEmpresa: string;

  // Esta propiedad guarda el nombre o descripción del producto.
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
    categoria: CategoriaLote,
    nombreEmpresa?: string,
    direccionEmpresa?: string
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

    // Si no llega nombre de empresa, se usa la razón social como respaldo.
    this.nombreEmpresa = nombreEmpresa || establecimientoId;

    // Si no llega ubicación, se muestra un texto neutral.
    this.direccionEmpresa = direccionEmpresa || 'Ubicación no disponible';
  }

  // Calcula el porcentaje de descuento del lote.
  calcularPorcentajeAhorro(): number {
    if (this.precioOriginal <= 0) return 0;

    return Math.round(
      ((this.precioOriginal - this.precioDescuento) / this.precioOriginal) * 100
    );
  }
}