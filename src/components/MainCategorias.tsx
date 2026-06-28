export default function MainCategorias() {
  return (
    <section className="px-10 mt-32 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold text-[#1A103C] mb-2">
        Elige tu <span className="text-[#3b2b73]">antojo.</span>
      </h2>
      <p className="text-indigo-950/60 font-medium mb-8 flex justify-between items-center">
        <span className="text-sm tracking-wide uppercase">Categorías principales</span>
        <a href="#" className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors">Ver todas →</a>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-[#fef5d4] rounded-3xl p-8 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border border-yellow-100">
          <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🥐</div>
          <h3 className="text-2xl font-bold text-[#1A103C] mb-1">Panadería Artesanal</h3>
          <p className="text-[#857b54] font-medium text-sm">Pan recién horneado</p>
        </div>

        <div className="bg-[#d4eeff] rounded-3xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-blue-100 group">
          <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🍽️</div>
          <h3 className="text-xl font-bold text-[#1A103C] mb-1">Buffet</h3>
          <p className="text-[#597b91] font-medium text-sm">Variedad premium</p>
        </div>

        <div className="bg-[#e9dfff] rounded-3xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-purple-100 group">
          <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🍣</div>
          <h3 className="text-xl font-bold text-[#1A103C] mb-1">Sushi & Mar</h3>
          <p className="text-[#655787] font-medium text-sm">Del mar a la mesa</p>
        </div>
      </div>
    </section>
  );
}
