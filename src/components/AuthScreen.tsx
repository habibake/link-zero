import { useState } from 'react';

const API_URL = "http://localhost:3001/api";

interface AuthScreenProps {
  onLoginSuccess: (role: 'customer' | 'business', nombre: string, razonSocial?: string, idCliente?: number) => void;
}

type AuthMode = 'register' | 'login' | 'business';

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('register');

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Registro de empresa
    if (authMode === 'business') {
      setCargando(true);
      try {
        const respuesta = await fetch(`${API_URL}/empresas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razon_social: razonSocial,
            direccion: ubicacion,
            horario_de_atencion: '08:00 - 20:00'
          })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          setErrorMsg(datos.mensaje || 'No se pudo registrar la empresa. ¿Ya existe esa Razón Social?');
          setCargando(false);
          return;
        }

        setCargando(false);
        onLoginSuccess('business', empresaNombre || razonSocial, razonSocial);
      } catch (error) {
        console.log(error);
        setErrorMsg('No se pudo conectar con el servidor.');
        setCargando(false);
      }
      return;
    }

    // Login: no creamos nada nuevo, solo pasamos (no hay validación real todavía)
    if (authMode === 'login') {
      onLoginSuccess('customer', nombreCompleto || 'Usuario');
      return;
    }

    // Registro de cliente: lo creamos de verdad en MySQL
    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreCompleto,
          correo,
          contrasena: password,
          telefono: ''
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setErrorMsg(datos.mensaje || 'No se pudo registrar el usuario.');
        setCargando(false);
        return;
      }

      setCargando(false);
      onLoginSuccess('customer', nombreCompleto || 'Usuario', undefined, datos.id_cliente);
    } catch (error) {
      console.log(error);
      setErrorMsg('No se pudo conectar con el servidor.');
      setCargando(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans bg-[#FDFCF8]">
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

      <div className="w-full lg:w-3/5 p-8 lg:p-20 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-gray-100 p-1 rounded-full flex mb-10 w-full justify-between">
            <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${authMode === 'register' ? 'bg-[#403387] text-white shadow-lg' : 'text-gray-500'}`}>Usuario</button>
            <button onClick={() => setAuthMode('business')} className={`flex-1 py-2 rounded-full text-xs font-bold ${authMode === 'business' ? 'bg-[#403387] text-white shadow-lg' : 'text-gray-500'}`}>Empresa</button>
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-full text-xs font-bold ${authMode === 'login' ? 'bg-[#403387] text-white shadow-lg' : 'text-gray-500'}`}>Ingresar</button>
          </div>

          <h1 className="text-4xl font-bold text-[#1A103C] mb-2">
            {authMode === 'login' ? 'Bienvenido de vuelta' : authMode === 'business' ? 'Suma tu negocio' : 'Crea tu cuenta'}
          </h1>
          <p className="text-gray-500 mb-8">{authMode === 'business' ? 'Registra tu restaurante y empieza a rescatar.' : 'Empieza a rescatar comida hoy mismo.'}</p>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl mb-4">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={manejarEnvio}>
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

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Correo electrónico</label>
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387]" placeholder="correo@ejemplo.com" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387]" placeholder="Mínimo 8 caracteres" required />
            </div>

            <button type="submit" disabled={cargando} className="w-full bg-[#00E676] hover:bg-[#00C853] text-[#1A103C] font-bold py-4 rounded-2xl shadow-lg transition-all mt-4 disabled:opacity-50">
              {cargando ? 'Guardando...' : authMode === 'login' ? 'Ingresar →' : 'Crear Cuenta →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}