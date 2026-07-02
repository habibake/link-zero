import { LoteAlimento } from '../models/LoteAlimento';

interface LoteCardProps {
  lote: LoteAlimento;
  destacado: boolean;
  onReservar: (lote: LoteAlimento) => void;
  onVerDetalle: (lote: LoteAlimento) => void;
}

export default function LoteCard({ lote, destacado, onReservar, onVerDetalle }: LoteCardProps) {
  // Verifica si el lote ya no tiene stock.
  const agotado = lote.cantidadDisponible <= 0;

  return (
    <div
      onClick={() => onVerDetalle(lote)}
      className={`${destacado ? 'md:col-span-2' : ''} relative h-[420px] rounded-3xl overflow-hidden group shadow-lg cursor-pointer`}
    >
      {/* Imagen del producto. */}
      <img
        src={lote.imagen}
        alt={lote.descripcion}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Capa oscura para que el texto se lea bien. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A103C] via-[#1A103C]/35 to-transparent opacity-95" />

      {/* Stock disponible o agotado. */}
      <div className={`absolute top-6 left-6 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${agotado ? 'bg-red-500 text-white' : 'bg-white/90 text-[#1A103C]'}`}>
        {agotado ? 'Agotado' : `${lote.cantidadDisponible} disponibles`}
      </div>

      {/* Porcentaje de descuento. */}
      <div className="absolute top-6 right-6 bg-emerald-400 text-[#0a1f18] px-3 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
        -{lote.calcularPorcentajeAhorro()}%
      </div>

      {/* Información que ve el usuario. */}
      <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          {/* Aquí aparece la ubicación real de la empresa. */}
          <p className="text-emerald-400 text-xs font-bold mb-2">
            {lote.direccionEmpresa}
          </p>

          {/* Aquí aparece el nombre del producto. */}
          <h3 className="text-3xl font-bold text-white mb-1">
            {lote.descripcion}
          </h3>

          {/* Aquí aparece el nombre comercial de la empresa. */}
          <p className="text-gray-200 text-sm font-medium">
            {lote.nombreEmpresa}
          </p>
        </div>

        {/* Botón para abrir el detalle del lote. */}
        <button
          onClick={(e) => {
            e.stopPropagation();
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