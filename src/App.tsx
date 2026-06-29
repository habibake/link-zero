import { useState } from 'react';
import Main from './components/Main';
import AuthScreen from './components/AuthScreen';
import LoteDetalle from './components/LoteDetalle';
import Dashboard from './components/Dashboard';
import { LoteAlimento } from './models/LoteAlimento';

// Datos semilla
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
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteAlimento | null>(null);

 const handleReservar = (lote: LoteAlimento) => {
    setLotes(lotes.map(l => {
      if (l.id === lote.id) {
        return new LoteAlimento(
          l.id, 
          l.establecimientoId, // Aquí está la corrección: le pusimos el ID correcto
          l.descripcion, 
          l.cantidadDisponible - 1, 
          l.precioOriginal, 
          l.precioDescuento, 
          l.imagen
        );
      }
      return l;
    }));
    setLoteSeleccionado(null);
    alert('¡Reserva exitosa!');
  };

  return (
    <div className="w-full min-h-screen">
      {!isLoggedIn ? (
        <AuthScreen onLoginSuccess={(role, nombre) => {
          setIsLoggedIn(true);
          setUserRole(role);
          setNombreNegocio(nombre);
        }} />
      ) : userRole === 'business' ? (
        <Dashboard nombreEmpresa={nombreNegocio} />
      ) : loteSeleccionado ? (
        <LoteDetalle
          lote={loteSeleccionado}
          onReservar={handleReservar}
          onVolver={() => setLoteSeleccionado(null)}
        />
      ) : (
        <Main 
          lotes={lotes} 
          onReservar={handleReservar} 
          onVerDetalle={(lote) => setLoteSeleccionado(lote)} 
        />
      )}
    </div>
  );
}