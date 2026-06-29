export class Reserva {
    private id: string;
    private usuarioId: string;
    private loteId: string;
    private cantidadReservada: number;
    private codigoPIN: string;
    private estado: 'Pendiente' | 'Completada' | 'Cancelada';
    private metodoPago: string;

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

    public getId(): string {
        return this.id;
    }

    public getUsuarioId(): string {
        return this.usuarioId;
    }

    public getLoteId(): string {
        return this.loteId;
    }

    public getCantidadReservada(): number {
        return this.cantidadReservada;
    }

    public getCodigoPIN(): string {
        return this.codigoPIN;
    }

    public getEstado(): 'Pendiente' | 'Completada' | 'Cancelada' {
        return this.estado;
    }

    public getMetodoPago(): string {
        return this.metodoPago;
    }

    // Permite marcar la reserva como completada al recoger el pedido
    public completar(): void {
        this.estado = 'Completada';
    }

    public cancelar(): void {
        this.estado = 'Cancelada';
    }
}   