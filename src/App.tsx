import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Main from './components/Main';
import AuthScreen from './components/AuthScreen';
import LoteDetalle from './components/LoteDetalle';
import Dashboard from './components/Dashboard';
import Carrito from './components/Carrito';
import MiCuenta from './components/MiCuenta';
import { LoteAlimento } from './models/LoteAlimento';
import type { CategoriaLote } from './models/LoteAlimento';
import { Usuario } from './models/Usuario';

const API_URL = "http://localhost:3001/api";

interface LoteCrudo {
  id_lote: number;
  razon_social_empresa: string;
  descripcion: string;
  cantidad_en_stock: number;
  precio_original: number;
  precio_descuento: number;
  categoria: CategoriaLote;
  imagen?: string;
}

function crearUsuario(nombre: string, id: number): Usuario {
  return new Usuario(String(id), nombre, '', '');
}

function reconstruirLote(data: LoteCrudo): LoteAlimento {
  return new LoteAlimento(
    String(data.id_lote),
    data.razon_social_empresa,
    data.descripcion,
    data.cantidad_en_stock,
    Number(data.precio_original),
    Number(data.precio_descuento),
    data.imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
    data.categoria
  );
}

interface CarritoItem {
  lote: LoteAlimento;
  cantidad: number;
}

function AppConRutas() {
  const navigate = useNavigate();

  const sesionGuardada = JSON.parse(localStorage.getItem('sesion_linkzero') || 'null');

  const [userRole, setUserRole] = useState<'customer' | 'business' | null>(sesionGuardada?.role || null);
  const [nombreNegocio, setNombreNegocio] = useState(sesionGuardada?.nombre || '');
  const [correoUsuario, setCorreoUsuario] = useState(sesionGuardada?.correo || '');
  const [razonSocialNegocio, setRazonSocialNegocio] = useState(sesionGuardada?.razonSocial || '');
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(
    sesionGuardada?.idCliente ? crearUsuario(sesionGuardada.nombre, sesionGuardada.idCliente) : null
  );

  const [lotes, setLotes] = useState<LoteAlimento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaLote | null>(null);
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteAlimento | null>(null);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  useEffect(() => {
    async function cargarLotes() {
      try {
        setCargando(true);
        const respuesta = await fetch(`${API_URL}/lotes`);
        if (!respuesta.ok) throw new Error('Error del servidor');
        const datos: LoteCrudo[] = await respuesta.json();
        setLotes(datos.map(reconstruirLote));
        setError(null);
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    }
    cargarLotes();
  }, []);

  const lotesFiltrados = lotes.filter((lote) => {
    const coincideCategoria = categoriaActiva === null || lote.categoria === categoriaActiva;
    const coincideBusqueda =
      busqueda.trim() === '' ||
      lote.establecimientoId.toLowerCase().includes(busqueda.toLowerCase()) ||
      lote.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const handleLoginSuccess = (role: 'customer' | 'business', nombre: string, razonSocial?: string, idCliente?: number, correo?: string) => {
    setUserRole(role);
    setNombreNegocio(nombre);

    if (role === 'business' && razonSocial) {
      setRazonSocialNegocio(razonSocial);
      localStorage.setItem('sesion_linkzero', JSON.stringify({ role, nombre, razonSocial }));
      navigate('/dashboard', { replace: true });
    }

    if (role === 'customer' && idCliente) {
      const usuario = crearUsuario(nombre, idCliente);
      setUsuarioActual(usuario);
      setCorreoUsuario(correo || '');
      localStorage.setItem('sesion_linkzero', JSON.stringify({ role, nombre, idCliente, correo }));
      navigate('/home', { replace: true });
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('sesion_linkzero');
    setUserRole(null);
    setUsuarioActual(null);
    setNombreNegocio('');
    setRazonSocialNegocio('');
    setCorreoUsuario('');
    setCarrito([]);
  };

  const handleVerDetalle = (lote: LoteAlimento) => {
    setLoteSeleccionado(lote);
    navigate('/lote/' + lote.id);
  };

  const handleAgregarCarrito = (lote: LoteAlimento, cantidad: number) => {
    setCarrito([{ lote, cantidad }]);
    navigate('/carrito');
  };

  const handleConfirmarCompra = async () => {
    if (!usuarioActual || carrito.length === 0) return;

    try {
      const item = carrito[0];
      const ahora = new Date();
      const pin = Math.floor(1000 + Math.random() * 9000).toString();

      const respuesta = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: Number(usuarioActual.getId()),
          razon_social_empresa: item.lote.establecimientoId,
          hora_reserva: ahora.toTimeString().split(' ')[0],
          fecha_reserva: ahora.toISOString().split('T')[0],
          pin,
          items: [{ id_lote: Number(item.lote.id), cantidad: item.cantidad }]
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert('No se pudo confirmar la reserva: ' + datos.mensaje);
        return;
      }

      setLotes(lotes.map((l) => {
        if (l.id === item.lote.id) {
          l.cantidadDisponible -= item.cantidad;
          l.estado = l.cantidadDisponible > 0 ? 'Disponible' : 'Agotado';
        }
        return l;
      }));

      setCarrito([]);
      alert('¡Reserva confirmada! Tu PIN es: ' + pin);
      navigate('/home', { replace: true });

    } catch (err) {
      console.error(err);
      alert('No se pudo conectar con el servidor.');
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
        <p className="text-[#1A103C] font-bold text-lg">Cargando lotes disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
        <p className="text-red-600 font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        userRole ? (
          <Navigate to={userRole === 'business' ? '/dashboard' : '/home'} replace />
        ) : (
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        )
      } />

      <Route path="/home" element={
        userRole === 'customer' ? (
          <Main
            lotes={lotesFiltrados}
            onReservar={handleVerDetalle}
            onVerDetalle={handleVerDetalle}
            busqueda={busqueda}
            onCambiarBusqueda={setBusqueda}
            categoriaActiva={categoriaActiva}
            onSeleccionarCategoria={setCategoriaActiva}
            onMiCuentaClick={() => navigate('/micuenta')}
          />
        ) : (
          <Navigate to="/" replace />
        )
      } />

      <Route path="/micuenta" element={
        userRole === 'customer' && usuarioActual ? (
          <MiCuenta
            nombreUsuario={nombreNegocio}
            correoUsuario={correoUsuario}
            idCliente={Number(usuarioActual.getId())}
            onCerrarSesion={handleCerrarSesion}
          />
        ) : (
          <Navigate to="/" replace />
        )
      } />

      <Route path="/lote/:id" element={
        userRole === 'customer' && loteSeleccionado ? (
          <LoteDetalle
            lote={loteSeleccionado}
            onAgregarCarrito={handleAgregarCarrito}
            onVolver={() => navigate('/home', { replace: true })}
          />
        ) : (
          <Navigate to="/" replace />
        )
      } />

      <Route path="/carrito" element={
        userRole === 'customer' && carrito.length > 0 ? (
          <Carrito
            items={carrito}
            onConfirmar={handleConfirmarCompra}
            onVolver={() => navigate(-1)}
          />
        ) : (
          <Navigate to="/home" replace />
        )
      } />

      <Route path="/dashboard" element={
        userRole === 'business' ? (
          <Dashboard
  nombreEmpresa={nombreNegocio}
  razonSocialEmpresa={razonSocialNegocio}
  onCerrarSesion={handleCerrarSesion}
/>
          
        ) : (
          <Navigate to="/" replace />
        )
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppConRutas />;
}