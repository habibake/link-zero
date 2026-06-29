import { useState } from 'react';
import Main from './components/Main';
import AuthScreen from './components/AuthScreen';
import LoteDetalle from './components/LoteDetalle';
import Dashboard from './components/Dashboard';
import Carrito from './components/Carrito';
import { LoteAlimento } from './models/LoteAlimento';

function crearLotesIniciales(): LoteAlimento[] {
  return [
    new LoteAlimento("LOTE-001", "Nozomi Restaurant", "Japonés • ★ 4.9", 6, 1000, 130, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400"),
    new LoteAlimento("LOTE-002", "Bistró del Cerro", "Francés • ★ 4.7", 4, 500, 150, "https://gastronomiapalacio.com/cdn/shop/files/le-bistro-galeria-2_500x.jpg")
  ];
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'customer' | 'business' | null>(null);
  const [nombreNegocio, setNombreNegocio] = useState('');
  
  const [lotes, setLotes] = useState<LoteAlimento[]>(crearLotesIniciales);
  
  // 👉 SISTEMA DE NAVEGACIÓN
  const [vistaApp, setVistaApp] = useState<'main' | 'detalle' | 'carrito'>('main');
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteAlimento | null>(null);
  
  // 👉 ESTADO DEL CARRITO
  const [carrito, setCarrito] = useState<{lote: LoteAlimento, cantidad: number}[]>([]);

  // 1. Ir a ver los detalles
  const handleVerDetalle = (lote: LoteAlimento) => {
    setLoteSeleccionado(lote);
    setVistaApp('detalle');
  };

  // 2. Mandar al carrito
  const handleAgregarCarrito = (lote: LoteAlimento, cantidad: number) => {
    setCarrito([{ lote, cantidad }]); // Lo metemos al carrito
    setVistaApp('carrito'); // Cambiamos la pantalla al carrito
  };

  // 3. Confirmar la compra final
  const handleConfirmarCompra = () => {
    // Bajamos el inventario real de los lotes
    const updatedLotes = lotes.map(l => {
      const itemEnCarrito = carrito.find(item => item.lote.id === l.id);
      if (itemEnCarrito) {
        return new LoteAlimento(
          l.id, l.establecimientoId, l.descripcion, 
          l.cantidadDisponible - itemEnCarrito.cantidad, 
          l.precioOriginal, l.precioDescuento, l.imagen
        );
      }
      return l;
    });
    
    setLotes(updatedLotes);
    setCarrito([]); // Vaciamos el carrito
    setVistaApp('main'); // Regresamos al inicio triunfalmente
    alert('¡Reserva confirmada con éxito! Revisa tu correo para las instrucciones de recolección.');
  };

  return (
    <div className="w-full min-h-screen">
      {!isLoggedIn ? (
        <AuthScreen onLoginSuccess={(role, nombre) => {
          setIsLoggedIn(true); setUserRole(role); setNombreNegocio(nombre);
        }} />
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
          onVolver={() => setVistaApp('detalle')} // Te deja regresar al detalle por si te arrepientes
        />
      ) : (
        <Main 
          lotes={lotes} 
          onReservar={handleVerDetalle} // Desde el home, el botón de reservar te lleva al detalle primero
          onVerDetalle={handleVerDetalle} 
        />
      )}
    </div>
  );
}