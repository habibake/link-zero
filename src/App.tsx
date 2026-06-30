import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Main from './components/Main';
import AuthScreen from './components/AuthScreen';
import LoteDetalle from './components/LoteDetalle';
import Dashboard from './components/Dashboard';
import Carrito from './components/Carrito';
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

function crearUsuarioInicial(nombre: string, id: number): Usuario {
  return new Usuario(String(id), nombre, "habib@correo.com", "9981234567");
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

// Componente separado para usar useNavigate
function AppConRutas() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<'customer' | 'business' | null>(null);
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [razonSocialNegocio, setRazonSocialNegocio] = useState('');
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  const [lotes, setLotes] = useState<LoteAlimento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaLote | null>(null);

  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteAlimento | null>(null);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  useEffect(() => {
    async function cargarLotesDesdeBackend() {
      try {
        setCargando(true);
        const respuesta = await fetch(`${API_URL}/lotes`);
        if (!respuesta.ok) throw new Error('El servidor respondió con un error');
        const datos: LoteCrudo[] = await respuesta.json();
        setLotes(datos.map(reconstruirLote));
        setError(null);
      } catch (err) {
        console.error('Error al cargar lotes:', err);
        setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
      } finally {
        setCargando(false);
      }
    }
    cargarLotesDesdeBackend();
  }, []);

  const lotesFiltrados = lotes.filter((lote) => {
    const coincideCategoria = categoriaActiva === null || lote.categoria === categoriaActiva;
    const coincideBusqueda =
      busqueda.trim() === '' ||
      lote.establecimientoId.toLowerCase().includes(busqueda.toLowerCase()) ||
      lote.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const handleLoginSuccess = (role: 'customer' | 'business', nombre: string, razonSocial?: string, idCliente?: number) => {
    setUserRole(role);
    setNombreNegocio(nombre);
    if (role === 'business' && razonSocial) {
      setRazonSocialNegocio(razonSocial);
      // navigate con replace: el usuario no puede volver atrás al login
      navigate('/dashboard', { replace: true });
    }
    if (role === 'customer' && idCliente) {
      setUsuarioActual(crearUsuarioInicial(nombre, idCliente));
      navigate('/home', { replace: true });
    }
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
      // replace: true para que no puedan volver al carrito con "atrás" después de confirmar
      navigate('/home', { replace: true });
      alert('¡Reserva confirmada! Tu PIN es: ' + pin);
    } catch (err) {
      console.error('Error al confirmar la reserva:', err);
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
      {/* Si no hay sesión, va al login */}
      <Route path="/" element={<AuthScreen onLoginSuccess={handleLoginSuccess} />} />

      {/* Rutas de cliente */}
      <Route
        path="/home"
        element={
          userRole === 'customer' ? (
            <Main
              lotes={lotesFiltrados}
              onReservar={handleVerDetalle}
              onVerDetalle={handleVerDetalle}
              busqueda={busqueda}
              onCambiarBusqueda={setBusqueda}
              categoriaActiva={categoriaActiva}
              onSeleccionarCategoria={setCategoriaActiva}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/lote/:id"
        element={
          userRole === 'customer' && loteSeleccionado ? (
            <LoteDetalle
              lote={loteSeleccionado}
              onAgregarCarrito={handleAgregarCarrito}
              onVolver={() => navigate('/home', { replace: true })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/carrito"
        element={
          userRole === 'customer' && carrito.length > 0 ? (
            <Carrito
              items={carrito}
              onConfirmar={handleConfirmarCompra}
              onVolver={() => navigate(-1)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Ruta de empresa */}
      <Route
        path="/dashboard"
        element={
          userRole === 'business' ? (
            <Dashboard
              nombreEmpresa={nombreNegocio}
              razonSocialEmpresa={razonSocialNegocio}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Cualquier ruta desconocida → login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppConRutas />;
}