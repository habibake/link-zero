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

// Ruta base del backend.
const API_URL = 'http://localhost:3001/api';

// Representa el lote como llega desde MySQL.
interface LoteCrudo {
  id_lote: number;
  razon_social_empresa: string;
  nombre_empresa?: string;
  direccion_empresa?: string;
  descripcion: string;
  cantidad_en_stock: number;
  cantidad_vendida?: number;
  precio_original: number;
  precio_descuento: number;
  categoria: CategoriaLote;
  imagen?: string | null;
}

// Producto dentro del carrito.
interface CarritoItem {
  lote: LoteAlimento;
  cantidad: number;
}

// Datos simulados de tarjeta.
interface DatosTarjetaSimulada {
  nombreTitular: string;
  numeroTarjeta: string;
  expiracion: string;
  cvv: string;
}

// Crea un usuario usando el id real de MySQL.
function crearUsuario(nombre: string, id: number): Usuario {
  return new Usuario(String(id), nombre, '', '');
}

// Convierte el lote del backend al modelo del frontend.
function reconstruirLote(data: LoteCrudo): LoteAlimento {
  return new LoteAlimento(
    String(data.id_lote),
    data.razon_social_empresa,
    data.descripcion,
    Number(data.cantidad_en_stock),
    Number(data.precio_original),
    Number(data.precio_descuento),
    data.imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
    data.categoria,
    data.nombre_empresa || data.razon_social_empresa,
    data.direccion_empresa || 'Ubicación no disponible'
  );
}

function AppConRutas() {
  const navigate = useNavigate();

  // Recupera la sesión guardada del navegador.
  const sesionGuardada = JSON.parse(localStorage.getItem('sesion_linkzero') || 'null');

  // Guarda si entró cliente o empresa.
  const [userRole, setUserRole] = useState<'customer' | 'business' | null>(sesionGuardada?.role || null);

  // Guarda datos visibles de la cuenta.
  const [nombreCuenta, setNombreCuenta] = useState(sesionGuardada?.nombre || '');
  const [correoUsuario, setCorreoUsuario] = useState(sesionGuardada?.correo || '');

  // Guarda datos internos de empresa.
  const [razonSocialNegocio, setRazonSocialNegocio] = useState(sesionGuardada?.razonSocial || '');
  const [direccionNegocio, setDireccionNegocio] = useState(sesionGuardada?.direccion || '');

  // Guarda cliente actual con su id real.
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(
    sesionGuardada?.idCliente ? crearUsuario(sesionGuardada.nombre, sesionGuardada.idCliente) : null
  );

  // Guarda lotes mostrados al cliente.
  const [lotes, setLotes] = useState<LoteAlimento[]>([]);

  // Estados de carga y error.
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de búsqueda, filtro, detalle y carrito.
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaLote | null>(null);
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteAlimento | null>(null);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  // Carga los lotes reales desde backend.
  useEffect(() => {
    async function cargarLotes() {
      try {
        setCargando(true);

        const respuesta = await fetch(`${API_URL}/lotes`);

        if (!respuesta.ok) {
          throw new Error('Error del servidor');
        }

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

  // Filtra lotes por categoría, producto, empresa o ubicación.
  const lotesFiltrados = lotes.filter((lote) => {
    const texto = busqueda.toLowerCase();

    const coincideCategoria = categoriaActiva === null || lote.categoria === categoriaActiva;

    const coincideBusqueda =
      busqueda.trim() === '' ||
      lote.descripcion.toLowerCase().includes(texto) ||
      lote.nombreEmpresa.toLowerCase().includes(texto) ||
      lote.direccionEmpresa.toLowerCase().includes(texto) ||
      lote.establecimientoId.toLowerCase().includes(texto);

    return coincideCategoria && coincideBusqueda;
  });

  // Maneja login o registro exitoso.
  const handleLoginSuccess = (
    role: 'customer' | 'business',
    nombre: string,
    razonSocial?: string,
    idCliente?: number,
    correo?: string,
    direccion?: string
  ) => {
    setUserRole(role);
    setNombreCuenta(nombre);
    setCorreoUsuario(correo || '');

    // Guarda sesión de empresa.
    if (role === 'business') {
      setRazonSocialNegocio(razonSocial || '');
      setDireccionNegocio(direccion || '');

      localStorage.setItem('sesion_linkzero', JSON.stringify({
        role,
        nombre,
        razonSocial,
        correo,
        direccion
      }));

      navigate('/dashboard', { replace: true });
      return;
    }

    // Guarda sesión de cliente.
    if (role === 'customer' && idCliente) {
      const usuario = crearUsuario(nombre, idCliente);

      setUsuarioActual(usuario);

      localStorage.setItem('sesion_linkzero', JSON.stringify({
        role,
        nombre,
        idCliente,
        correo
      }));

      navigate('/home', { replace: true });
    }
  };

  // Cierra sesión y limpia datos.
  const handleCerrarSesion = () => {
    localStorage.removeItem('sesion_linkzero');

    setUserRole(null);
    setUsuarioActual(null);
    setNombreCuenta('');
    setRazonSocialNegocio('');
    setDireccionNegocio('');
    setCorreoUsuario('');
    setCarrito([]);

    navigate('/', { replace: true });
  };

  // Abre el detalle de un lote.
  const handleVerDetalle = (lote: LoteAlimento) => {
    setLoteSeleccionado(lote);
    navigate('/lote/' + lote.id);
  };

  // Agrega un producto al carrito.
  const handleAgregarCarrito = (lote: LoteAlimento, cantidad: number) => {
    setCarrito([{ lote, cantidad }]);
    navigate('/carrito');
  };

  // Crea reserva, pago y recibo.
  const handleConfirmarCompra = async (
    metodoPago: string = 'Efectivo en sucursal',
    datosTarjeta?: DatosTarjetaSimulada
  ) => {
    if (!usuarioActual || carrito.length === 0) {
      alert('Necesitas iniciar sesión y tener productos en el carrito.');
      return;
    }

    const ahora = new Date();
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const total = carrito.reduce(
      (acc, item) => acc + item.lote.precioDescuento * item.cantidad,
      0
    );

    const primerProducto = carrito[0];

    try {
      // Paso 1: crea la reserva.
      const respuestaReserva = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: Number(usuarioActual.getId()),
          razon_social_empresa: primerProducto.lote.establecimientoId,
          hora_reserva: ahora.toTimeString().split(' ')[0],
          fecha_reserva: ahora.toISOString().split('T')[0],
          pin,
          qr_reserva: `RESERVA-${pin}`,
          items: carrito.map((item) => ({
            id_lote: Number(item.lote.id),
            cantidad: item.cantidad
          }))
        })
      });

      const datosReserva = await respuestaReserva.json();

      if (!respuestaReserva.ok) {
        alert('No se pudo crear la reserva: ' + (datosReserva.mensaje || 'Error desconocido'));
        return;
      }

      // Si es tarjeta simulada, se considera pago aprobado.
      // Si es efectivo o transferencia, queda pendiente.
      const estadoPago = metodoPago === 'Tarjeta simulada' ? 'Aprobado' : 'Pendiente';

      // Paso 2: crea el pago.
      const respuestaPago = await fetch(`${API_URL}/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_reserva: datosReserva.id_reserva,
          metodo_pago: metodoPago,
          monto_total: total,
          estado_transaccion: estadoPago
        })
      });

      const datosPago = await respuestaPago.json();

      if (!respuestaPago.ok) {
        alert('La reserva se creó, pero falló el pago: ' + (datosPago.mensaje || 'Error desconocido'));
        return;
      }

      const ultimosDigitos = datosTarjeta?.numeroTarjeta
        ? datosTarjeta.numeroTarjeta.replace(/\s/g, '').slice(-4)
        : '';

      const detallesCompra = carrito
        .map((item) => `${item.cantidad} x ${item.lote.descripcion} - ${item.lote.nombreEmpresa} - $${item.lote.precioDescuento * item.cantidad} MXN`)
        .join('\n');

      const detalleTarjeta = metodoPago === 'Tarjeta simulada'
        ? `\nTarjeta simulada terminación: ${ultimosDigitos}`
        : '';

      // Paso 3: crea el recibo.
      const respuestaRecibo = await fetch(`${API_URL}/recibos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pago: datosPago.id_pago,
          detalles_de_compra: `Reserva: ${datosReserva.id_reserva}\nPIN: ${pin}\n${detallesCompra}\nTotal: $${total} MXN\nMetodo de pago: ${metodoPago}\nEstado de pago: ${estadoPago}${detalleTarjeta}`
        })
      });

      const datosRecibo = await respuestaRecibo.json();

      if (!respuestaRecibo.ok) {
        alert('La reserva y el pago se crearon, pero falló el recibo: ' + (datosRecibo.mensaje || 'Error desconocido'));
        return;
      }

      // Actualiza el stock visual en la pantalla del cliente.
      setLotes((lotesActuales) => lotesActuales.map((lote) => {
        const itemComprado = carrito.find((item) => item.lote.id === lote.id);

        if (!itemComprado) return lote;

        return new LoteAlimento(
          lote.id,
          lote.establecimientoId,
          lote.descripcion,
          Math.max(lote.cantidadDisponible - itemComprado.cantidad, 0),
          lote.precioOriginal,
          lote.precioDescuento,
          lote.imagen,
          lote.categoria,
          lote.nombreEmpresa,
          lote.direccionEmpresa
        );
      }));

      setCarrito([]);

      alert(
        `Reserva confirmada correctamente.\nPIN: ${pin}\nPago: ${estadoPago}\nRecibo: ${datosRecibo.folio_recibo || datosRecibo.folio}`
      );

      navigate('/micuenta', { replace: true });
    } catch (err) {
      console.error(err);
      alert('No se pudo conectar con el servidor.');
    }
  };

  // Pantalla de carga inicial.
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
        <p className="text-[#1A103C] font-bold text-lg">Cargando lotes disponibles...</p>
      </div>
    );
  }

  // Pantalla de error.
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
        <p className="text-red-600 font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login o redirección automática. */}
      <Route
        path="/"
        element={
          userRole ? (
            <Navigate to={userRole === 'business' ? '/dashboard' : '/home'} replace />
          ) : (
            <AuthScreen onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      {/* Pantalla principal del cliente. */}
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
              onMiCuentaClick={() => navigate('/micuenta')}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Cuenta del cliente. */}
      <Route
        path="/micuenta"
        element={
          userRole === 'customer' && usuarioActual ? (
            <MiCuenta
              nombreUsuario={nombreCuenta}
              correoUsuario={correoUsuario}
              idCliente={Number(usuarioActual.getId())}
              onCerrarSesion={handleCerrarSesion}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Detalle de lote. */}
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

      {/* Carrito del cliente. */}
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
            <Navigate to="/home" replace />
          )
        }
      />

      {/* Dashboard de empresa. */}
      <Route
        path="/dashboard"
        element={
          userRole === 'business' ? (
            <Dashboard
              nombreEmpresa={nombreCuenta}
              razonSocialEmpresa={razonSocialNegocio}
              direccionEmpresa={direccionNegocio}
              onCerrarSesion={handleCerrarSesion}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Ruta de seguridad. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Componente principal.
export default function App() {
  return <AppConRutas />;
}