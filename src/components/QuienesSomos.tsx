import React from 'react';

export default function QuienesSomos() {
  return (
    <section id="como-funciona" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="bg-[#1A103C] rounded-[2rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Nuestra <span className="text-emerald-400">misión.</span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Link-Zero nace de la visión de estudiantes de Desarrollo de Software Multiplataforma. Habib, Jonathan y todo el equipo detrás de este proyecto nos dimos cuenta de algo crítico: la comida perfecta no debe terminar en la basura.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Por eso, creamos esta plataforma exclusiva para conectar los excedentes de deliciosos platillos de restaurantes y PyMEs locales directamente contigo. Menos desperdicio, mejores precios, y un impacto real en nuestra comunidad.
          </p>
        </div>
        <div className="flex-1 w-full">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop" 
            alt="Equipo trabajando" 
            className="rounded-2xl object-cover w-full h-72 shadow-lg opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </section>
  );
}