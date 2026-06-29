import { useState } from 'react';

interface AuthScreenProps {
  onLoginSuccess: (role: 'customer' | 'business', nombre: string) => void;
}

type AuthMode = 'register' | 'login' | 'business';

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('register');
  
  // Estados para todos los campos posibles
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    // Enviamos el nombre correspondiente al tipo de registro
    const nombreParaApp = authMode === 'business' ? empresaNombre : nombreCompleto;
    onLoginSuccess(authMode === 'business' ? 'business' : 'customer', nombreParaApp || 'Usuario');
  };

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
      <div className="w-full lg:w-3/5 p-8 lg:p-20 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          {/* TABS */}
          <div className="bg-gray-100 p-1 rounded-full flex mb-10 w-full justify-between">
            <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${authMode === 'register' ? 'bg-[#403387] text-white shadow-lg' : 'text-gray-500'}`}>Usuario</button>
            <button onClick={() => setAuthMode('business')} className={`flex-1 py-2 rounded-full text-xs font-bold ${authMode === 'business' ? 'bg-[#403387] text-white shadow-lg' : 'text-gray-500'}`}>Empresa</button>
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-full text-xs font-bold ${authMode === 'login' ? 'bg-[#403387] text-white shadow-lg' : 'text-gray-500'}`}>Ingresar</button>
          </div>

          <h1 className="text-4xl font-bold text-[#1A103C] mb-2">
            {authMode === 'login' ? 'Bienvenido de vuelta' : authMode === 'business' ? 'Suma tu negocio' : 'Crea tu cuenta'}
          </h1>
          <p className="text-gray-500 mb-8">{authMode === 'business' ? 'Registra tu restaurante y empieza a rescatar.' : 'Empieza a rescatar comida hoy mismo.'}</p>
          
          <form className="space-y-5" onSubmit={manejarEnvio}>
            {/* Campos condicionales */}
            {authMode === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nombre completo</label>
                <input type="text" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387]" placeholder="Sofia Ramírez" required />
              </div>
            )}

            {authMode === 'business' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nombre de la empresa</label>
                  <input type="text" value={empresaNombre} onChange={e => setEmpresaNombre(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387]" placeholder="Ej. Bistró del Cerro" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Razón Social (ID)</label>
                  <input type="text" value={razonSocial} onChange={e => setRazonSocial(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387]" placeholder="Ej. BISTRO SA DE CV" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ubicación</label>
                  <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387]" placeholder="Ej. Centro, Cancún" required />
                </div>
              </>
            )}

            {/* Campos siempre visibles */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Correo electrónico</label>
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387]" placeholder="correo@ejemplo.com" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387]" placeholder="Mínimo 8 caracteres" required />
            </div>

            <button type="submit" className="w-full bg-[#00E676] hover:bg-[#00C853] text-[#1A103C] font-bold py-4 rounded-2xl shadow-lg transition-all mt-4">
              {authMode === 'login' ? 'Ingresar →' : 'Crear Cuenta →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}