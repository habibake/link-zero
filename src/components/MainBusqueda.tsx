interface MainBusquedaProps {
  busqueda: string;
  onCambiarBusqueda: (texto: string) => void;
}

export default function MainBusqueda({ busqueda, onCambiarBusqueda }: MainBusquedaProps) {
  return (
    <section className="px-10 mt-16 max-w-7xl mx-auto">
      <div className="relative max-w-xl">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onCambiarBusqueda(e.target.value)}
          placeholder="Busca por restaurante o platillo..."
          className="w-full bg-white border border-gray-200 rounded-full py-4 pl-12 pr-6 text-sm font-medium text-[#1A103C] placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
        />
      </div>
    </section>
  );
}
