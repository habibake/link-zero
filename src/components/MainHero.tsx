export default function MainHero() {
  return (
    <main className="px-10 mt-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Columna Izquierda: Textos */}
      <div>
        <div className="inline-flex items-center gap-2 bg-yellow-100/60 text-[#857b54] px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border border-yellow-200/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          +2,400 kg rescatados este mes en Cancún
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 text-[#1A103C]">
          Rescata <br />
          <span className="text-[#3b2b73]">comida</span> <br />
          deliciosa. <br />
          <span className="text-emerald-400">Cero</span> <br />
          desperdicio.
        </h1>

        <p className="text-indigo-950/60 text-lg max-w-md mb-10 leading-relaxed font-medium">
          Conectamos restaurantes gourmet con personas que valoran la buena gastronomía — a precios que hacen sentido para todos y el planeta.
        </p>

        <div className="flex gap-4">
          <button className="bg-emerald-400 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-emerald-500 shadow-lg shadow-emerald-400/30 transition-all flex items-center gap-2">
            Explorar Hoy <span className="text-lg leading-none">→</span>
          </button>
          <button className="border border-gray-300 bg-transparent text-[#1A103C] px-7 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all">
            Para Restaurantes
          </button>
        </div>
      </div>

      {/* Columna Derecha: Composición Visual */}
      <div className="relative h-[550px] w-full flex items-center justify-center">
        <div className="absolute right-10 top-20 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-50 to-blue-50/50 rounded-full blur-3xl"></div>

        <div className="relative w-[420px] h-[420px] rounded-full overflow-hidden shadow-2xl z-10 border-[12px] border-white">
          <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop" alt="Salmón Gourmet" className="w-full h-full object-cover" />
        </div>

        <div className="absolute right-0 top-1/4 w-24 h-24 rounded-full overflow-hidden shadow-xl z-20 border-4 border-white">
          <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop" alt="Panadería" className="w-full h-full object-cover" />
        </div>

        <div className="absolute top-24 left-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-30 border border-white">
          <p className="text-[11px] text-gray-500 font-medium mb-1">Rescatado ahora</p>
          <p className="text-sm font-bold text-[#1A103C]">Nozomi Sushi</p>
          <p className="text-xs font-bold text-emerald-500 mt-1 tracking-wide">-87% • 6 porciones</p>
        </div>

        <div className="absolute bottom-12 right-12 bg-[#403387] text-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(59,43,115,0.4)] z-30">
          <p className="text-[11px] text-indigo-200 font-medium mb-1">Disponible</p>
          <p className="text-sm font-bold tracking-wide">Hoy 6 – 8 pm</p>
        </div>

        <div className="absolute bottom-1/3 -right-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl z-30 border border-white">
          <p className="text-sm font-bold text-[#1A103C] flex items-center gap-1">
            <span className="text-emerald-400">★</span> 4.9
          </p>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">Chef's pick</p>
        </div>
      </div>
    </main>
  );
}
