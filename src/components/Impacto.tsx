import React from 'react';

export default function Impacto() {
  return (
    <section id="impacto" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-[#1A103C] mb-4">El impacto de <span className="text-emerald-500">Link-Zero</span></h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">Cada reserva que haces es un paso hacia un ecosistema gastronómico más sostenible.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center transform transition-transform hover:-translate-y-2">
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="text-4xl font-black text-[#1A103C] mb-2">+2,400</h3>
          <p className="text-gray-500 font-medium">Platillos rescatados</p>
        </div>
        
        <div className="bg-emerald-400 p-8 rounded-3xl shadow-lg text-center transform transition-transform hover:-translate-y-2">
          <div className="text-5xl mb-4">🌍</div>
          <h3 className="text-4xl font-black text-white mb-2">1.5 Ton</h3>
          <p className="text-emerald-950 font-semibold">De CO2 evitado</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center transform transition-transform hover:-translate-y-2">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="text-4xl font-black text-[#1A103C] mb-2">+45</h3>
          <p className="text-gray-500 font-medium">PyMEs aliadas</p>
        </div>
      </div>
    </section>
  );
}