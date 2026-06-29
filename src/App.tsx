import { useState, useEffect } from 'react';
import Main from './components/Main';
import AuthScreen from './components/AuthScreen';
import LoteDetalle from './components/LoteDetalle';
import { LoteAlimento } from './models/LoteAlimento';
import type { CategoriaLote } from './models/LoteAlimento';
import { Reserva } from './models/Reserva';
import { Usuario } from './models/Usuario';

const API_URL = 'http://localhost:3001/api';

// Construye el usuario "semilla" una sola vez (esto NO viene del backend todavía,
// porque no tienes login real conectado aún)
function crearUsuarioInicial(): Usuario {
  return new Usuario("USR-001", "Habib Gonzalo", "habib@correo.com", "9981234567");
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioActual] = useState<Usuario | null>(crearUsuarioInicial);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteAlimento | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaLote | null>(null);

  // Estados de carga: ahora los lotes empiezan vacíos y "cargando",
  // porque ya no nacen instantáneamente en el código, vienen de una petición de red.
  const [lotes, setLotes] = useState<LoteAlimento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Ahora la reserva también se manda al backend real, en vez de solo modificar estado local
  const handleReservar = async (lote: LoteAlimento) => {
    if (lote.cantidadDisponible <= 0 || !usuarioActual) return;

    try {
      const respuesta = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: usuarioActual.id,
          loteId: lote.id,
          cantidadReservada: 1,
          metodoPago: 'En sucursal',
        }),
      });

      if (!respuesta.ok) {
        const datosError = await respuesta.json();
        alert(`No se pudo reservar: ${datosError.error}`);
        return;
      }

      const reservaCreada: Reserva = await respuesta.json();
      setReservas([...reservas, reservaCreada]);
      alert(`¡Reserva exitosa a nombre de ${usuarioActual.obtenerResumen()}!\nTu PIN de recolección es: ${reservaCreada.codigoPIN}`);

      // Actualizamos el lote localmente para reflejar la nueva disponibilidad
      // (el backend ya lo descontó en su array; aquí solo sincronizamos la UI)
      const lotesActualizados = lotes.map((l) => {
        if (l.id === lote.id) {
          l.cantidadDisponible -= 1;
          l.estado = l.cantidadDisponible > 0 ? 'Disponible' : 'Agotado';
        }
        return l;
      });
      setLotes(lotesActualizados);
      setLoteSeleccionado(null);
    } catch (err) {
      console.error('Error al crear la reserva:', err);
      alert('No se pudo conectar con el servidor para reservar.');
    }
  };

  return (
    <div className="w-full min-h-screen">
      {!isLoggedIn ? (
        <AuthScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : loteSeleccionado ? (
        <LoteDetalle
          lote={loteSeleccionado}
          onReservar={handleReservar}
          onVolver={() => setLoteSeleccionado(null)}
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
          onReservar={handleReservar}
          onVerDetalle={(lote) => setLoteSeleccionado(lote)}
          busqueda={busqueda}
          onCambiarBusqueda={setBusqueda}
          categoriaActiva={categoriaActiva}
          onSeleccionarCategoria={setCategoriaActiva}
        />
      )}
    </div>
  );
}
