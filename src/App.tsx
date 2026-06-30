import { useState, useEffect } from 'react';
import Main from './components/Main';
import AuthScreen from './components/AuthScreen';
import LoteDetalle from './components/LoteDetalle';
import Dashboard from './components/Dashboard';
import Carrito from './components/Carrito';
import { LoteAlimento } from './models/LoteAlimento';
import type { CategoriaLote } from './models/LoteAlimento';
import { Reserva } from './models/Reserva';
import { Usuario } from './models/Usuario';

const API_URL = "http://localhost:3001/api";

// Construye el usuario "semilla" una sola vez (esto NO viene del backend todavía,
// porque no tienes login real con base de datos conectado aún)
function crearUsuarioInicial(nombre: string): Usuario {
  return new Usuario("USR-001", nombre, "habib@correo.com", "9981234567");
}

// El backend responde objetos JSON planos (sin métodos de la clase).
// Esta función "reconstruye" cada objeto plano como una instancia real de LoteAlimento,
// para que lote.calcularPorcentajeAhorro() funcione en el frontend.
function reconstruirLote(data: LoteAlimento): LoteAlimento {
  return new LoteAlimento(
    data.id,
    data.establecimientoId,
    data.descripcion,
    data.cantidadDisponible,
    data.precioOriginal,
    data.precioDescuento,
    data.imagen,
    data.categoria
  );
}

interface CarritoItem {
  lote: LoteAlimento;
  cantidad: number;
}

export default function App() {
  // --- Autenticación y rol ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'customer' | 'business' | null>(null);
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  // --- Datos del backend ---
  const [lotes, setLotes] = useState<LoteAlimento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Búsqueda y filtros (pantalla principal) ---
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaLote | null>(null);

  // --- Navegación entre pantallas ---
  const [vistaApp, setVistaApp] = useState<'main' | 'detalle' | 'carrito'>('main');
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteAlimento | null>(null);

  // --- Carrito ---
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);

  // useEffect SÍ es correcto aquí: estamos sincronizando con un sistema EXTERNO
  // (el servidor backend), que es exactamente para lo que React diseñó los effects.
  useEffect(() => {
    async function cargarLotesDesdeBackend() {
      try {
        setCargando(true);
        const respuesta = await fetch(`${API_URL}/lotes`);

        if (!respuesta.ok) {
          throw new Error('El servidor respondió con un error');
        }

        const datos: LoteAlimento[] = await respuesta.json();
        const lotesReconstruidos = datos.map(reconstruirLote);
        setLotes(lotesReconstruidos);
        setError(null);
      } catch (err) {
        console.error('Error al cargar lotes:', err);
        setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
      } finally {
        setCargando(false);
      }
    }

    cargarLotesDesdeBackend();
  }, []); // [] = solo se ejecuta una vez, al montar el componente

  // Valor DERIVADO: se recalcula en cada render, no es estado propio
  const lotesFiltrados = lotes.filter((lote) => {
    const coincideCategoria = categoriaActiva === null || lote.categoria === categoriaActiva;
    const coincideBusqueda =
      busqueda.trim() === '' ||
      lote.establecimientoId.toLowerCase().includes(busqueda.toLowerCase()) ||
      lote.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  // --- Login: ahora distingue cliente vs negocio ---
  const handleLoginSuccess = (role: 'customer' | 'business', nombre: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setNombreNegocio(nombre);
    if (role === 'customer') {
      setUsuarioActual(crearUsuarioInicial(nombre));
    }
  };

  // --- Navegación: ver detalle de un lote ---
  const handleVerDetalle = (lote: LoteAlimento) => {
    setLoteSeleccionado(lote);
    setVistaApp('detalle');
  };

  // --- Agregar al carrito (no reserva todavía, solo guarda la intención) ---
  const handleAgregarCarrito = (lote: LoteAlimento, cantidad: number) => {
    setCarrito([{ lote, cantidad }]);
    setVistaApp('carrito');
  };

  // --- Confirmar compra: AQUÍ es donde de verdad hablamos con el backend ---
  const handleConfirmarCompra = async () => {
    if (!usuarioActual || carrito.length === 0) return;

    try {
      // Por ahora el carrito solo soporta 1 lote a la vez (igual que su versión original)
      const item = carrito[0];

      const respuesta = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: usuarioActual.getId(),
          loteId: item.lote.id,
          cantidadReservada: item.cantidad,
          metodoPago: 'En sucursal',
        }),
      });

      if (!respuesta.ok) {
        const datosError = await respuesta.json();
        alert(`No se pudo confirmar la reserva: ${datosError.error}`);
        return;
      }

      const reservaCreada: Reserva = await respuesta.json();
      setReservas([...reservas, reservaCreada]);

      // Reflejamos la nueva disponibilidad en la UI (el backend ya la descontó en su array)
      const lotesActualizados = lotes.map((l) => {
        if (l.id === item.lote.id) {
          l.cantidadDisponible -= item.cantidad;
          l.estado = l.cantidadDisponible > 0 ? 'Disponible' : 'Agotado';
        }
        return l;
      });
      setLotes(lotesActualizados);

      setCarrito([]);
      setVistaApp('main');
      alert('¡Reserva confirmada con éxito! Revisa tu correo para las instrucciones de recolección.');
    } catch (err) {
      console.error('Error al confirmar la reserva:', err);
      alert('No se pudo conectar con el servidor para confirmar la reserva.');
    }
  };

  return (
    <div className="w-full min-h-screen">
      {!isLoggedIn ? (
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      ) : userRole === 'business' ? (
        <Dashboard nombreEmpresa={nombreNegocio} />
      ) : vistaApp === 'detalle' && loteSeleccionado ? (
        <LoteDetalle
          lote={loteSeleccionado}
          onAgregarCarrito={handleAgregarCarrito}
          onVolver={() => setVistaApp('main')}
        />
      ) : vistaApp === 'carrito' ? (
        <Carrito
          items={carrito}
          onConfirmar={handleConfirmarCompra}
          onVolver={() => setVistaApp('detalle')}
        />
      ) : cargando ? (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
          <p className="text-[#1A103C] font-bold text-lg">Cargando lotes disponibles...</p>
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
          <p className="text-red-600 font-bold text-lg">{error}</p>
        </div>
      ) : (
        <Main
          lotes={lotesFiltrados}
          onReservar={handleVerDetalle}
          onVerDetalle={handleVerDetalle}
          busqueda={busqueda}
          onCambiarBusqueda={setBusqueda}
          categoriaActiva={categoriaActiva}
          onSeleccionarCategoria={setCategoriaActiva}
        />
      )}
    </div>
  );
}