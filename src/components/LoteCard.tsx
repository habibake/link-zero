import { LoteAlimento } from '../models/LoteAlimento';

interface LoteCardProps {
  lote: LoteAlimento;
  destacado: boolean; // true = ocupa 2 columnas (primer elemento)
  onReservar: (lote: LoteAlimento) => void;
  onVerDetalle: (lote: LoteAlimento) => void;
}

export default function LoteCard({ lote, destacado, onReservar, onVerDetalle }: LoteCardProps) {
  const agotado = lote.cantidadDisponible === 0;

  return (
    <div
      onClick={() => onVerDetalle(lote)}
      className={`${destacado ? 'md:col-span-2' : ''} relative h-[420px] rounded-3xl overflow-hidden group shadow-lg cursor-pointer`}
    >
      <img
        src={lote.imagen}
        alt={lote.establecimientoId}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A103C] via-[#1A103C]/30 to-transparent opacity-90"></div>

      {/* Etiqueta de Descuento utilizando el método de la Clase (POO) */}
      <div className="absolute top-6 right-6 bg-emerald-400 text-[#0a1f18] px-3 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
        -{lote.calcularPorcentajeAhorro()}%
      </div>

      {/* Etiqueta de Disponibilidad */}
      <div className={`absolute top-6 left-6 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${lote.cantidadDisponible > 0 ? 'bg-white/90 text-[#1A103C]' : 'bg-red-500/90 text-white'}`}>
        {lote.cantidadDisponible > 0 ? `${lote.cantidadDisponible} disponibles` : 'Agotado'}
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-emerald-400 text-xs font-bold mb-2 flex items-center gap-1">📍 Zona Hotelera, Cancún</p>
          <h3 className="text-3xl font-bold text-white mb-1">{lote.establecimientoId}</h3>
          <p className="text-gray-300 text-sm font-medium">{lote.descripcion}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // evita que también dispare onVerDetalle
            onReservar(lote);
          }}
          disabled={agotado}
          className={`${agotado ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#403387] hover:bg-[#5b4ab3]'} text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl`}
        >
          {agotado ? 'Agotado' : 'Reservar'}
        </button>
      </div>
    </div>
  );
}
