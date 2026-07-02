import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

// Ruta base del backend.

// Estructura de cada reserva como viene desde el backend.
interface Reserva {
  id_reserva: number;
  razon_social_empresa: string;
  fecha_reserva: string;
  hora_reserva: string;
  pin: string;
  estado: string;
  total_reserva?: number;
  id_pago?: number | null;
  metodo_pago?: string | null;
  monto_total?: number | null;
  estado_transaccion?: string | null;
  folio_recibo?: number | null;
}

// Datos que MiCuenta recibe desde App.tsx.
interface MiCuentaProps {
  nombreUsuario: string;
  correoUsuario: string;
  idCliente: number;
  onCerrarSesion: () => void;
}

export default function MiCuenta({ nombreUsuario, correoUsuario, idCliente, onCerrarSesion }: MiCuentaProps) {
  const navigate = useNavigate();

  // Guarda reservas reales del cliente.
  const [reservas, setReservas] = useState<Reserva[]>([]);

  // Controla el estado de carga.
  const [cargando, setCargando] = useState(true);

  // Carga las reservas del cliente desde el backend.
  useEffect(() => {
    async function cargarReservas() {
      try {
        const respuesta = await fetch(`${API_URL}/reservas/usuario/${idCliente}`);
        const datos = await respuesta.json();

        if (Array.isArray(datos)) {
          setReservas(datos);
        } else {
          setReservas([]);
        }
      } catch (error) {
        console.error(error);
        setReservas([]);
      } finally {
        setCargando(false);
      }
    }

    cargarReservas();
  }, [idCliente]);

  // Cierra sesión y manda al login.
  const handleCerrarSesion = () => {
    localStorage.removeItem('sesion_linkzero');
    onCerrarSesion();
    navigate('/', { replace: true });
  };

  // Formatea fechas para mostrarlas más bonitas.
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Convierte valores de MySQL a número.
  const convertirNumero = (valor: number | string | null | undefined) => {
    if (valor === null || valor === undefined) return 0;
    return Number(valor);
  };

  // Color del estado de la reserva.
  const getColorEstadoReserva = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'Confirmado': return 'bg-green-100 text-green-700';
      case 'Cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Color del estado del pago.
  const getColorEstadoPago = (estado?: string | null) => {
    switch (estado) {
      case 'Aprobado': return 'bg-green-100 text-green-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'Rechazado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A103C]">
      {/* Encabezado superior. */}
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
        {/* Tarjeta del perfil. */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#1A103C] flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-[#1A103C]">{nombreUsuario}</h2>
            <p className="text-gray-500 text-sm">{correoUsuario || 'Sin correo registrado'}</p>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full mt-1 inline-block">
              Cliente activo
            </span>
          </div>
        </div>

        {/* Sección de reservas. */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-extrabold text-lg text-[#1A103C]">Mis Reservas</h3>
            <p className="text-gray-500 text-sm">{reservas.length} reserva(s) registrada(s)</p>
          </div>

          {cargando ? (
            <div className="p-8 text-center text-gray-400 font-medium">Cargando reservas...</div>
          ) : reservas.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 font-bold">Todavía no tienes reservas</p>
              <p className="text-gray-400 text-sm mt-1">Explora los lotes disponibles y haz tu primera reserva</p>

              <button
                onClick={() => navigate('/home', { replace: true })}
                className="mt-4 bg-[#00E676] text-[#1A103C] px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
              >
                Explorar lotes
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reservas.map((r) => (
                <div key={r.id_reserva} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-extrabold text-[#1A103C]">{r.razon_social_empresa}</p>

                      <p className="text-gray-400 text-xs mt-0.5">
                        {formatearFecha(r.fecha_reserva)} · {r.hora_reserva}
                      </p>

                      <p className="text-emerald-600 text-xs font-bold mt-1">
                        PIN: <span className="tracking-widest text-[#1A103C]">{r.pin}</span>
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getColorEstadoReserva(r.estado)}`}>
                      {r.estado}
                    </span>
                  </div>

                  {/* Resumen de pago y recibo conectado a la reserva. */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-gray-400 text-xs font-bold uppercase">Total</p>
                      <p className="font-extrabold text-[#1A103C]">
                        ${convertirNumero(r.total_reserva || r.monto_total).toFixed(2)} MXN
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-gray-400 text-xs font-bold uppercase">Pago</p>
                      <p className="font-bold text-[#1A103C]">{r.metodo_pago || 'Sin pago'}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${getColorEstadoPago(r.estado_transaccion)}`}>
                        {r.estado_transaccion || 'No registrado'}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-gray-400 text-xs font-bold uppercase">Recibo</p>
                      <p className="font-extrabold text-[#1A103C]">
                        {r.folio_recibo ? `Folio ${r.folio_recibo}` : 'Sin recibo'}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {r.id_pago ? `Pago ${r.id_pago}` : 'Pago pendiente'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de recibos generados. */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-extrabold text-lg text-[#1A103C] mb-1">Facturas y Recibos</h3>
          <p className="text-gray-400 text-sm mb-4">Historial de pagos y comprobantes</p>

          {reservas.filter((r) => r.folio_recibo).length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-gray-500 font-bold text-sm">Los recibos aparecerán aquí después de confirmar una reserva</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservas.filter((r) => r.folio_recibo).map((r) => (
                <div key={`recibo-${r.folio_recibo}`} className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#1A103C]">Recibo folio {r.folio_recibo}</p>
                    <p className="text-gray-400 text-xs">Reserva {r.id_reserva} · {r.razon_social_empresa}</p>
                  </div>

                  <p className="font-extrabold text-[#1A103C]">
                    ${convertirNumero(r.monto_total || r.total_reserva).toFixed(2)} MXN
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón grande para cerrar sesión. */}
        <button
          onClick={handleCerrarSesion}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}