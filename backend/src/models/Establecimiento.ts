export class Establecimiento {
    id: string;
    nombreComercial: string;
    direccion: string;
    tipoNegocio: string; // Ej. 'Hotel', 'Cafetería', 'Restaurante'
    latitud: number;
    longitud: number;

    constructor(id: string, nombreComercial: string, direccion: string, tipoNegocio: string, latitud: number, longitud: number) {
        this.id = id;
        this.nombreComercial = nombreComercial;
        this.direccion = direccion;
        this.tipoNegocio = tipoNegocio;
        this.latitud = latitud;
        this.longitud = longitud;
    }
}