import { useState } from 'react';
import Main from './components/Main';
import AuthScreen from './components/AuthScreen';
import LoteDetalle from './components/LoteDetalle';
import { LoteAlimento } from './models/LoteAlimento';
import { Reserva } from './models/Reserva';
import { Usuario } from './models/Usuario';

// Construye los datos "semilla" una sola vez (fuera del render, sin tocar setState)
function crearUsuarioInicial(): Usuario {
  return new Usuario("USR-001", "Habib Gonzalo", "habib@correo.com", "9981234567");
}

function crearLotesIniciales(): LoteAlimento[] {
  const lote1 = new LoteAlimento(
    "LOTE-001",
    "Nozomi Restaurant",
    "Japonés contemporáneo • ★ 4.9",
    6,
    1000,
    130,
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop"
  );

  const lote2 = new LoteAlimento(
    "LOTE-002",
    "Bistró del Cerro",
    "Alta cocina francesa • ★ 4.7",
    4,
    500,
    150,
    "https://images.unsplash.com/photo-1544025162-8315ea07f239?q=80&w=600&auto=format&fit=crop"
  );

  return [lote1, lote2];
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Lazy initial state: la función solo corre UNA VEZ, en el primer render.
  // No es un efecto, no dispara renders en cascada, y no necesita useEffect.
  const [usuarioActual] = useState<Usuario | null>(crearUsuarioInicial);
  const [lotes, setLotes] = useState<LoteAlimento[]>(crearLotesIniciales);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteAlimento | null>(null);

  const handleReservar = (lote: LoteAlimento) => {
    if (lote.cantidadDisponible > 0 && usuarioActual) {
      // Usamos el constructor de Reserva que definiste
      const nuevaReserva = new Reserva(
        "RES-" + Math.floor(Math.random() * 10000),
        usuarioActual.id,
        lote.id,
        1,
        "En sucursal" // metodoPago
      );

      setReservas([...reservas, nuevaReserva]);
      alert(`¡Reserva exitosa a nombre de ${usuarioActual.obtenerResumen()}!\nTu PIN de recolección es: ${nuevaReserva.codigoPIN}`);

      const lotesActualizados = lotes.map(l => {
        if (l.id === lote.id) {
          l.cantidadDisponible -= 1;
          l.estado = l.cantidadDisponible > 0 ? 'Disponible' : 'Agotado';
        }
        return l;
      });
      setLotes(lotesActualizados);
      setLoteSeleccionado(null); // al reservar, regresamos a la lista
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