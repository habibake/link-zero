import { useState } from 'react';
import { LoteAlimento } from '../models/LoteAlimento';

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

// Props que recibe el carrito desde App.tsx.
interface CarritoProps {
  items: CarritoItem[];
  onConfirmar: (metodoPago: string, datosTarjeta?: DatosTarjetaSimulada) => void | Promise<void>;
  onVolver: () => void;
}

export default function Carrito({ items, onConfirmar, onVolver }: CarritoProps) {
  // Método de pago elegido por el usuario.
  const [metodoPago, setMetodoPago] = useState('Efectivo en sucursal');

  // Datos de tarjeta simulada.
  const [nombreTitular, setNombreTitular] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [expiracion, setExpiracion] = useState('');
  const [cvv, setCvv] = useState('');

  // Estado para evitar doble clic.
  const [procesando, setProcesando] = useState(false);

  // Mensaje de error del formulario.
  const [error, setError] = useState('');

  // Total del carrito.
  const total = items.reduce(
    (acc, item) => acc + item.lote.precioDescuento * item.cantidad,
    0
  );

  // Valida datos simulados de tarjeta.
  const validarTarjetaSimulada = () => {
    const numeroLimpio = numeroTarjeta.replace(/\s/g, '');

    if (!nombreTitular.trim()) {
      return 'Escribe el nombre del titular.';
    }

    if (!/^\d{16}$/.test(numeroLimpio)) {
      return 'La tarjeta simulada debe tener 16 números.';
    }

    if (!expiracion.trim()) {
      return 'Escribe la fecha de expiración.';
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return 'El CVV debe tener 3 o 4 números.';
    }

    return '';
  };

  // Confirma la reserva y manda el pago al flujo de App.tsx.
  const handleConfirmar = async () => {
    setError('');

    if (metodoPago === 'Tarjeta simulada') {
      const errorTarjeta = validarTarjetaSimulada();

      if (errorTarjeta) {
        setError(errorTarjeta);
        return;
      }
    }

    try {
      setProcesando(true);

      await onConfirmar(
        metodoPago,
        metodoPago === 'Tarjeta simulada'
          ? {
              nombreTitular,
              numeroTarjeta,
              expiracion,
              cvv
            }
          : undefined
      );
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#FDFCF8] min-h-screen font-sans text-[#1A103C] animate-in fade-in duration-500">
      {/* Botón para volver. */}
      <button
        onClick={onVolver}
        className="mb-8 font-bold text-sm flex items-center hover:opacity-75 transition-opacity"
      >
        <span className="mr-2">←</span> Volver
      </button>

      <h1 className="text-4xl font-extrabold mb-8">Confirma tu Reserva</h1>

      {/* Lista de productos del carrito. */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.lote.imagen}
                alt={item.lote.descripcion}
                className="w-20 h-20 object-cover rounded-xl shadow-sm"
              />

              <div>
                <h3 className="font-bold text-lg">{item.lote.descripcion}</h3>
                <p className="text-gray-500 text-sm">{item.lote.nombreEmpresa}</p>
                <p className="text-gray-400 text-xs">{item.lote.direccionEmpresa}</p>

                <p className="text-[#00E676] font-bold text-sm mt-1">
                  Cantidad: {item.cantidad} porción(es)
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-extrabold">
                ${item.lote.precioDescuento * item.cantidad}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Selección de método de pago. */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Método de pago
        </label>

        <select
          value={metodoPago}
          onChange={(e) => {
            setMetodoPago(e.target.value);
            setError('');
          }}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387] font-bold"
        >
          <option value="Efectivo en sucursal">Efectivo en sucursal</option>
          <option value="Tarjeta simulada">Tarjeta simulada</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <p className="text-gray-400 text-xs mt-2">
          El pago con tarjeta es simulado para pruebas del proyecto.
        </p>

        {/* Formulario de tarjeta simulada. */}
        {metodoPago === 'Tarjeta simulada' && (
          <div className="mt-5 bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Nombre del titular
              </label>
              <input
                value={nombreTitular}
                onChange={(e) => setNombreTitular(e.target.value)}
                placeholder="Nombre Apellido"
                className="w-full bg-white border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Número de tarjeta
              </label>
              <input
                value={numeroTarjeta}
                onChange={(e) => {
                  const limpio = e.target.value.replace(/\D/g, '').slice(0, 16);
                  const formateado = limpio.replace(/(.{4})/g, '$1 ').trim();
                  setNumeroTarjeta(formateado);
                }}
                placeholder="4242 4242 4242 4242"
                className="w-full bg-white border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387] font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Expiración
                </label>
                <input
                  value={expiracion}
                  onChange={(e) => setExpiracion(e.target.value)}
                  placeholder="12/28"
                  className="w-full bg-white border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  CVV
                </label>
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className="w-full bg-white border border-gray-100 rounded-xl p-3 outline-none focus:border-[#403387] font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* Total y botón final. */}
      <div className="bg-[#2c225a] text-white p-6 rounded-2xl shadow-md flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-300 text-sm font-medium">Total a pagar</p>
          <p className="text-3xl font-bold">${total} MXN</p>
        </div>

        <button
          onClick={handleConfirmar}
          disabled={procesando}
          className="bg-[#00E676] text-[#1A103C] px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100"
        >
          {procesando ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </div>
    </div>
  );
}