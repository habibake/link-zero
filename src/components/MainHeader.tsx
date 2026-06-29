import React from 'react';

interface MainHeaderProps {
  busqueda: string;
  onCambiarBusqueda: (texto: string) => void;
  onMiCuentaClick?: () => void;
}

export default function MainHeader({ busqueda, onCambiarBusqueda, onMiCuentaClick }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-gray-100/50">
      <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto gap-4">
        
        {/* Lado Izquierdo: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#1A103C]">Link-Zero</span>
        </div>

        {/* Centro: Navegación y Barra de Búsqueda Integrada */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          {/* Navegación por Anclas */}
          <nav className="flex gap-6 text-sm font-semibold text-gray-500">
            <a href="#como-funciona" className="hover:text-[#1A103C] transition-colors">¿Quiénes somos?</a>
            <a href="#restaurantes" className="hover:text-[#1A103C] transition-colors">Restaurantes</a>
            <a href="#impacto" className="hover:text-[#1A103C] transition-colors">Impacto</a>
          </nav>

          {/* Barra de Búsqueda Compacta en el Header */}
          <div className="relative max-w-xs w-full lg:max-w-sm ml-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">🔍</span>
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => onCambiarBusqueda(e.target.value)}
              placeholder="Buscar platillos"
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm font-medium text-[#1A103C] placeholder:text-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Lado Derecho: Botón Mi Cuenta */}
        <div className="flex items-center text-sm font-semibold">
          <button 
            onClick={onMiCuentaClick}
            className="bg-emerald-400 text-[#1A103C] px-6 py-2 rounded-full hover:bg-emerald-500 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Mi Cuenta
          </button>
        </div>
        
      </div>
    </header>
  );
}