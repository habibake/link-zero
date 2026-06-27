import React, { useState } from 'react';

// Definimos que este componente recibe la función onLoginSuccess como propiedad
interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex h-screen w-full font-sans bg-[#FDFCF8]">
      {/* LADO IZQUIERDO */}
      <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-[#1A103C] to-[#00A86B] p-12 flex-col justify-between text-white">
        <div className="text-2xl font-bold">Link-Zero</div>
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 pb-12 rotate-3 shadow-2xl mb-8 transform hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop" alt="Panadería" className="w-full h-48 object-cover mb-4"/>
            <p className="text-[#1A103C] text-sm font-bold text-center">Panadería artesanal ✨</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">"Únete a la revolución <span className="text-emerald-400">cero desperdicio</span>."</h2>
          <p className="opacity-80">+18,000 usuarios rescatando comida</p>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="w-full lg:w-3/5 p-8 lg:p-20 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-gray-100 p-1 rounded-full flex mb-12 w-fit">
            <button onClick={() => setIsLogin(false)} className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${!isLogin ? 'bg-[#403387] text-white shadow-lg' : 'text-gray-500'}`}>Registrarse</button>
            <button onClick={() => setIsLogin(true)} className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${isLogin ? 'bg-[#403387] text-white shadow-lg' : 'text-gray-500'}`}>Ingresar</button>
          </div>

          <h1 className="text-4xl font-bold text-[#1A103C] mb-2">{isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}</h1>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre completo</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-[#403387]" placeholder="Sofia Ramírez" />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Correo electrónico</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-[#00E676]" placeholder="sofia@correo.com" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Contraseña</label>
              <input type="password" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-[#403387]" placeholder="Mínimo 8 caracteres" />
            </div>

            {/* AQUÍ ESTÁ EL BOTÓN QUE HACE LA MAGIA */}
            <button 
              onClick={onLoginSuccess} 
              className="w-full bg-[#00E676] hover:bg-[#00C853] text-[#1A103C] font-bold py-4 rounded-2xl shadow-lg transition-all"
            >
              {isLogin ? 'Ingresar →' : 'Crear Cuenta →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}