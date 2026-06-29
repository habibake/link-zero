import { LoteAlimento } from '../models/LoteAlimento';

interface CarritoItem {
  lote: LoteAlimento;
  cantidad: number;
}

interface CarritoProps {
  items: CarritoItem[];
  onConfirmar: () => void;
  onVolver: () => void;
}

export default function Carrito({ items, onConfirmar, onVolver }: CarritoProps) {
  // Calculamos el total a pagar sumando los productos del carrito
  const total = items.reduce((acc, item) => acc + (item.lote.precioDescuento * item.cantidad), 0);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#FDFCF8] min-h-screen font-sans text-[#1A103C] animate-in fade-in duration-500">
      <button onClick={onVolver} className="mb-8 font-bold text-sm flex items-center hover:opacity-75 transition-opacity">
        <span className="mr-2">←</span> Volver
      </button>

      <h1 className="text-4xl font-extrabold mb-8">Confirma tu Reserva 🛒</h1>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
            <div className="flex items-center gap-4">
              <img src={item.lote.imagen} alt="Comida" className="w-20 h-20 object-cover rounded-xl shadow-sm" />
              <div>
                <h3 className="font-bold text-lg">{item.lote.establecimientoId}</h3>
                <p className="text-gray-500 text-sm">{item.lote.descripcion}</p>
                <p className="text-[#00E676] font-bold text-sm mt-1">Cantidad: {item.cantidad} porción(es)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold">${item.lote.precioDescuento * item.cantidad}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#2c225a] text-white p-6 rounded-2xl shadow-md flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-300 text-sm font-medium">Total a pagar en sucursal</p>
          <p className="text-3xl font-bold">${total} MXN</p>
        </div>
        <button 
          onClick={onConfirmar}
          className="bg-[#00E676] text-[#1A103C] px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform"
        >
          Confirmar Reserva ✓
        </button>
      </div>
    </div>
  );
}