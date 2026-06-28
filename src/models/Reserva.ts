export class Reserva {
    id: string;
    usuarioId: string;
    loteId: string;
    cantidadReservada: number;
    codigoPIN: string; // Para que el cliente recoja el paquete
    estado: 'Pendiente' | 'Completada' | 'Cancelada';
    metodoPago: string; // Ej. 'Efectivo', 'Tarjeta'

    constructor(id: string, usuarioId: string, loteId: string, cantidadReservada: number, metodoPago: string) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.loteId = loteId;
        this.cantidadReservada = cantidadReservada;
        this.metodoPago = metodoPago;
        this.estado = 'Pendiente';
        // Genera un PIN aleatorio de 4 dígitos al crear la reserva
        this.codigoPIN = Math.floor(1000 + Math.random() * 9000).toString(); 
    }
}
