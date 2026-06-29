import { LoteAlimento } from '../models/LoteAlimento';
import LoteCard from './LoteCard';

interface MainDescubrimientosProps {
  lotes: LoteAlimento[];
  onReservar: (lote: LoteAlimento) => void;
  onVerDetalle: (lote: LoteAlimento) => void;
}

export default function MainDescubrimientos({ lotes, onReservar, onVerDetalle }: MainDescubrimientosProps) {
  return (
    // ¡Aquí está la magia! Le agregamos id="restaurantes"
    <section id="restaurantes" className="px-10 mt-32 mb-32 max-w-7xl mx-auto">
      <p className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-2">Rescates del día</p>
      <h2 className="text-4xl font-extrabold text-[#1A103C] mb-8">
        Descubrimientos <br /> del <span className="text-emerald-400">día.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lotes.map((lote, index) => (
          <LoteCard
            key={lote.id}
            lote={lote}
            destacado={index === 0}
            onReservar={onReservar}
            onVerDetalle={onVerDetalle}
          />
        ))}
      </div>
    </section>
  );
}