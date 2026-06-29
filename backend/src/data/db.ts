import { LoteAlimento } from '../models/LoteAlimento';
import { Usuario } from '../models/Usuario';
import { Reserva } from '../models/Reserva';

// "Base de datos" temporal en memoria.
// IMPORTANTE: estos arrays se BORRAN cada vez que reinicias el servidor (npm run dev),
// porque viven en RAM, no en disco. Cuando conectes MySQL, este archivo deja de existir
// y las consultas se hacen directo a la base de datos real.

export const lotes: LoteAlimento[] = [
    new LoteAlimento(
        "LOTE-001",
        "Nozomi Restaurant",
        "Japonés contemporáneo • ★ 4.9",
        6,
        1000,
        130,
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop",
        "Sushi"
    ),
    new LoteAlimento(
        "LOTE-002",
        "Bistró del Cerro",
        "Alta cocina francesa • ★ 4.7",
        4,
        500,
        150,
        "https://images.unsplash.com/photo-1544025162-8315ea07f239?q=80&w=600&auto=format&fit=crop",
        "Buffet"
    ),
    new LoteAlimento(
        "LOTE-003",
        "Panadería La Espiga",
        "Pan artesanal recién horneado • ★ 4.8",
        10,
        300,
        60,
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
        "Panaderia"
    ),
];

export const usuarios: Usuario[] = [
    new Usuario("USR-001", "Habib Gonzalo", "habib@correo.com", "9981234567"),
];

export const reservas: Reserva[] = [];
