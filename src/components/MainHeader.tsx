export default function MainHeader() {
  return (
    <header className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
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
        <button className="bg-emerald-400 text-white px-6 py-2.5 rounded-full hover:bg-emerald-500 shadow-sm transition-all">
          Mi Cuenta
        </button>
      </div>
    </header>
  );
}
