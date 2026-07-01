import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:3001/api";

interface Reserva {
  id_reserva: number;
  razon_social_empresa: string;
  fecha_reserva: string;
  hora_reserva: string;
  pin: string;
  estado: string;
}

interface MiCuentaProps {
  nombreUsuario: string;
  correoUsuario: string;
  idCliente: number;
  onCerrarSesion: () => void;
}

export default function MiCuenta({ nombreUsuario, correoUsuario, idCliente, onCerrarSesion }: MiCuentaProps) {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarReservas() {
      try {
        const respuesta = await fetch(`${API_URL}/reservas/usuario/${idCliente}`);
        const datos = await respuesta.json();
        setReservas(datos);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    }
    cargarReservas();
  }, [idCliente]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('sesion_linkzero');
    onCerrarSesion();
    navigate('/', { replace: true });
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'Confirmado': return 'bg-green-100 text-green-700';
      case 'Cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A103C]">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/home', { replace: true })}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1A103C] transition-colors"
        >
          ← Volver
        </button>
        <span className="font-extrabold text-lg text-[#1A103C]">Mi Cuenta</span>
        <button
          onClick={handleCerrarSesion}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {/* Tarjeta de perfil */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#1A103C] flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1A103C]">{nombreUsuario}</h2>
            <p className="text-gray-500 text-sm">{correoUsuario || 'Sin correo registrado'}</p>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full mt-1 inline-block">
              ✅ Cliente activo
            </span>
          </div>
        </div>

        {/* Mis Reservas */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-extrabold text-lg text-[#1A103C]">Mis Reservas</h3>
            <p className="text-gray-500 text-sm">{reservas.length} reserva(s) registrada(s)</p>
          </div>

          {cargando ? (
            <div className="p-8 text-center text-gray-400 font-medium">Cargando reservas...</div>
          ) : reservas.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-gray-500 font-bold">Todavía no tienes reservas</p>
              <p className="text-gray-400 text-sm mt-1">Explora los lotes disponibles y haz tu primera reserva</p>
              <button
                onClick={() => navigate('/home', { replace: true })}
                className="mt-4 bg-[#00E676] text-[#1A103C] px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
              >
                Explorar lotes →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reservas.map((r) => (
                <div key={r.id_reserva} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A103C] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      🏪
                    </div>
                    <div>
                      <p className="font-extrabold text-[#1A103C]">{r.razon_social_empresa}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {formatearFecha(r.fecha_reserva)} · {r.hora_reserva}
                      </p>
                      <p className="text-emerald-600 text-xs font-bold mt-1">
                        PIN: <span className="tracking-widest text-[#1A103C]">{r.pin}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getColorEstado(r.estado)}`}>
                    {r.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tarjeta de recibos (placeholder por ahora) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-extrabold text-lg text-[#1A103C] mb-1">Facturas y Recibos</h3>
          <p className="text-gray-400 text-sm mb-4">Historial de pagos y comprobantes</p>
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-3xl mb-2">🧾</p>
            <p className="text-gray-500 font-bold text-sm">Los recibos aparecerán aquí después de cada pago confirmado</p>
          </div>
        </div>

        {/* Botón cerrar sesión grande */}
        <button
          onClick={handleCerrarSesion}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl transition-colors"
        >
          🚪 Cerrar sesión
        </button>

      </div>
    </div>
  );
}