// Define las categorías que puede recibir un lote desde la base de datos.
export type CategoriaLote =
  | 'Panaderia'
  | 'Panadería'
  | 'Buffet'
  | 'Sushi'
  | 'Lácteos'
  | 'Verduras'
  | 'Preparada'
  | string;

// Modelo principal que usa el frontend para mostrar un producto publicado por una empresa.
export class LoteAlimento {
  id: string;

  // Guarda la razón social de la empresa. Esto se usa para reservas y relaciones con MySQL.
  establecimientoId: string;

  // Guarda el nombre visible de la empresa, por ejemplo: La Milpita.
  nombreEmpresa: string;

  // Guarda la ubicación de la empresa, por ejemplo: Cancún.
  direccionEmpresa: string;

  // Guarda el nombre del producto, por ejemplo: hotdog.
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

    // Si el backend no manda nombre comercial, se usa la razón social como respaldo.
    this.nombreEmpresa = nombreEmpresa || establecimientoId;

    // Si el backend no manda dirección, se muestra este texto de respaldo.
    this.direccionEmpresa = direccionEmpresa || 'Ubicación no disponible';
  }

  // Calcula el porcentaje de descuento que se muestra en la tarjeta.
  calcularPorcentajeAhorro(): number {
    if (this.precioOriginal <= 0) return 0;

    return Math.round(
      ((this.precioOriginal - this.precioDescuento) / this.precioOriginal) * 100
    );
  }
}