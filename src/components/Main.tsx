import React from 'react';

export default function Main() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A103C]">
      {/* HEADER */}
      <header className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold">
            {/* Ícono de hoja simulado */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#0a1f18]">Link-Zero</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-indigo-950/70">
          <a href="#" className="hover:text-indigo-950 transition-colors">Cómo funciona</a>
          <a href="#" className="hover:text-indigo-950 transition-colors">Restaurantes</a>
          <a href="#" className="hover:text-indigo-950 transition-colors">Impacto</a>
          <a href="#" className="hover:text-indigo-950 transition-colors">Blog</a>
        </nav>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <button className="text-indigo-950/70 hover:text-indigo-950 transition-colors">Acceder</button>
          <button className="bg-emerald-400 text-white px-6 py-2.5 rounded-full hover:bg-emerald-500 shadow-sm transition-all">
            Ingresar
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
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
            {/* Resplandor de fondo */}
            <div className="absolute right-10 top-20 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-50 to-blue-50/50 rounded-full blur-3xl"></div>
            
            {/* Plato principal (Círculo grande) */}
            <div className="relative w-[420px] h-[420px] rounded-full overflow-hidden shadow-2xl z-10 border-[12px] border-white">
                <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop" alt="Salmón Gourmet" className="w-full h-full object-cover" />
            </div>

            {/* Foto secundaria pequeña (Panadería) */}
            <div className="absolute right-0 top-1/4 w-24 h-24 rounded-full overflow-hidden shadow-xl z-20 border-4 border-white">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop" alt="Panadería" className="w-full h-full object-cover" />
            </div>

            {/* Tarjeta flotante 1: Nozomi Sushi */}
            <div className="absolute top-24 left-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-30 border border-white">
                <p className="text-[11px] text-gray-500 font-medium mb-1">Rescatado ahora</p>
                <p className="text-sm font-bold text-[#1A103C]">Nozomi Sushi</p>
                <p className="text-xs font-bold text-emerald-500 mt-1 tracking-wide">-87% • 6 porciones</p>
            </div>

            {/* Tarjeta flotante 2: Horario */}
            <div className="absolute bottom-12 right-12 bg-[#403387] text-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(59,43,115,0.4)] z-30">
                <p className="text-[11px] text-indigo-200 font-medium mb-1">Disponible</p>
                <p className="text-sm font-bold tracking-wide">Hoy 6 – 8 pm</p>
            </div>
            
            {/* Tarjeta flotante 3: Rating */}
            <div className="absolute bottom-1/3 -right-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl z-30 border border-white">
                <p className="text-sm font-bold text-[#1A103C] flex items-center gap-1">
                  <span className="text-emerald-400">★</span> 4.9
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">Chef's pick</p>
            </div>
        </div>
      </main>
      {/* SECCIÓN: Elige tu antojo (Bento Box) */}
      <section className="px-10 mt-32 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-[#1A103C] mb-2">
          Elige tu <span className="text-[#3b2b73]">antojo.</span>
        </h2>
        <p className="text-indigo-950/60 font-medium mb-8 flex justify-between items-center">
          <span className="text-sm tracking-wide uppercase">Categorías principales</span>
          <a href="#" className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors">Ver todas →</a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Bento 1: Grande (ocupa 2 columnas) */}
          <div className="md:col-span-2 bg-[#fef5d4] rounded-3xl p-8 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border border-yellow-100">
            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🥐</div>
            <h3 className="text-2xl font-bold text-[#1A103C] mb-1">Panadería Artesanal</h3>
            <p className="text-[#857b54] font-medium text-sm">Pan recién horneado</p>
          </div>
          
          {/* Bento 2 */}
          <div className="bg-[#d4eeff] rounded-3xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-blue-100 group">
            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🍽️</div>
            <h3 className="text-xl font-bold text-[#1A103C] mb-1">Buffet</h3>
            <p className="text-[#597b91] font-medium text-sm">Variedad premium</p>
          </div>
          
          {/* Bento 3 */}
          <div className="bg-[#e9dfff] rounded-3xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-purple-100 group">
            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🍣</div>
            <h3 className="text-xl font-bold text-[#1A103C] mb-1">Sushi & Mar</h3>
            <p className="text-[#655787] font-medium text-sm">Del mar a la mesa</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN: Descubrimientos del día */}
      <section className="px-10 mt-32 mb-32 max-w-7xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-2">Rescates del día</p>
        <h2 className="text-4xl font-extrabold text-[#1A103C] mb-8">
          Descubrimientos <br/> del <span className="text-emerald-400">día.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta 1 (Ocupa 2 columnas) */}
          <div className="md:col-span-2 relative h-[420px] rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop" 
              alt="Plato Gourmet" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A103C] via-[#1A103C]/30 to-transparent opacity-90"></div>
            
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/30 shadow-sm">
              -87% • Hoy 6 - 8 pm
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <p className="text-emerald-400 text-xs font-bold mb-2 flex items-center gap-1">📍 Zona Hotelera, Cancún</p>
                <h3 className="text-3xl font-bold text-white mb-1">Nozomi Restaurant</h3>
                <p className="text-gray-300 text-sm font-medium">Japonés contemporáneo • ★ 4.9</p>
              </div>
              <button className="bg-[#403387] hover:bg-[#5b4ab3] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl">
                Reservar
              </button>
            </div>
          </div>

          {/* Tarjeta 2 */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544025162-8315ea07f239?q=80&w=600&auto=format&fit=crop" 
              alt="Bistró Gourmet" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A103C] via-[#1A103C]/40 to-transparent opacity-90"></div>
            
            <div className="absolute top-6 right-6 bg-emerald-400 text-[#0a1f18] px-3 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
              -70%
            </div>

            <div className="absolute bottom-8 left-6 right-6">
              <p className="text-gray-300 text-xs font-medium mb-2 flex items-center gap-1">📍 Centro, Cancún</p>
              <h3 className="text-xl font-bold text-white mb-4">Bistró del Cerro</h3>
              <div className="flex justify-between items-center">
                <p className="text-gray-300 text-xs font-medium">Hoy, 5 - 7 pm</p>
                <button className="bg-[#403387] hover:bg-[#5b4ab3] text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-md">
                  Reservar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}