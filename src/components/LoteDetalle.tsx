import { LoteAlimento } from '../models/LoteAlimento';

interface LoteDetalleProps {
  lote: LoteAlimento;
  onReservar: (lote: LoteAlimento) => void;
  onVolver: () => void;
}

export default function LoteDetalle({ lote, onReservar, onVolver }: LoteDetalleProps) {
  const agotado = lote.cantidadDisponible === 0;

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A103C]">
      {/* Barra superior simple, consistente con el header del resto de la app */}
      <header className="flex items-center px-10 py-6 max-w-5xl mx-auto">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 text-sm font-bold text-indigo-950/70 hover:text-indigo-950 transition-colors"
        >
          <span className="text-lg leading-none">←</span> Volver
        </button>
      </header>

      <main className="px-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-32">
        {/* Columna izquierda: Imagen grande, mismo tratamiento visual que el hero */}
        <div className="relative">
          <div className="relative w-full h-[460px] rounded-3xl overflow-hidden shadow-2xl border-[8px] border-white">
            <img
              src={lote.imagen}
              alt={lote.establecimientoId}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Etiqueta de descuento flotante, igual a la de las tarjetas */}
          <div className="absolute top-6 right-6 bg-emerald-400 text-[#0a1f18] px-4 py-2 rounded-full text-sm font-extrabold shadow-sm">
            -{lote.calcularPorcentajeAhorro()}%
          </div>
        </div>

        {/* Columna derecha: Info del lote */}
        <div>
          <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
            📍 Zona Hotelera, Cancún
          </p>

          <h1 className="text-4xl font-extrabold text-[#1A103C] mb-2">
            {lote.establecimientoId}
          </h1>

          <p className="text-indigo-950/60 text-base font-medium mb-6 leading-relaxed">
            {lote.descripcion}
          </p>

          {/* Tarjeta de disponibilidad, mismo lenguaje visual de "tarjeta flotante" */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8 ${agotado ? 'bg-red-500/10 text-red-600' : 'bg-emerald-400/10 text-emerald-600'}`}>
            <span className={`w-2 h-2 rounded-full ${agotado ? 'bg-red-500' : 'bg-emerald-400'}`}></span>
            {agotado ? 'Agotado' : `${lote.cantidadDisponible} porciones disponibles`}
          </div>

          {/* Precio */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 mb-8">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Precio</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-[#1A103C]">
                ${lote.precioDescuento}
              </span>
              <span className="text-lg text-gray-400 line-through font-medium mb-1">
                ${lote.precioOriginal}
              </span>
            </div>
            <p className="text-sm text-emerald-600 font-bold mt-2">
              Ahorras ${lote.precioOriginal - lote.precioDescuento} pesos
            </p>
          </div>

          {/* Horario, mismo estilo de la tarjeta morada del hero */}
          <div className="bg-[#403387] text-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(59,43,115,0.4)] mb-8">
            <p className="text-[11px] text-indigo-200 font-medium mb-1">Disponible para recoger</p>
            <p className="text-base font-bold tracking-wide">Hoy 6 – 8 pm</p>
          </div>

          <button
            onClick={() => onReservar(lote)}
            disabled={agotado}
            className={`w-full ${agotado ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#403387] hover:bg-[#5b4ab3]'} text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl`}
          >
            {agotado ? 'Agotado' : 'Reservar este lote'}
          </button>
        </div>
      </main>
    </div>
  );
}
