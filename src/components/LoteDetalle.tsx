import { useState } from 'react';
import { LoteAlimento } from '../models/LoteAlimento';

interface LoteDetalleProps {
  lote: LoteAlimento;
  onVolver: () => void;
  onAgregarCarrito: (lote: LoteAlimento, cantidad: number) => void;
}

export default function LoteDetalle({ lote, onVolver, onAgregarCarrito }: LoteDetalleProps) {
  const [cantidad, setCantidad] = useState(1);

  // Cálculos base
  const porcentajeDescuento = Math.round(((lote.precioOriginal - lote.precioDescuento) / lote.precioOriginal) * 100);
  const ahorroUnitario = lote.precioOriginal - lote.precioDescuento;

  // 👉 CÁLCULOS DINÁMICOS (Se actualizan en tiempo real al cambiar la cantidad)
  const totalPagar = lote.precioDescuento * cantidad;
  const precioOriginalTotal = lote.precioOriginal * cantidad;
  const totalAhorro = ahorroUnitario * cantidad;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-[#FDFCF8] min-h-screen font-sans text-[#1A103C] animate-in fade-in duration-500">
      
      <button onClick={onVolver} className="mb-8 font-bold text-sm flex items-center hover:opacity-75 transition-opacity">
        <span className="mr-2">←</span> Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative h-full">
          <img src={lote.imagen} alt={lote.establecimientoId} className="w-full h-full object-cover rounded-2xl shadow-lg border border-gray-100" />
          <div className="absolute top-4 right-4 bg-[#00E676] text-[#1A103C] font-extrabold px-3 py-1 rounded-full text-sm">
            -{porcentajeDescuento}%
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-[#00E676] text-xs font-bold tracking-wider mb-2 uppercase">📍 ZONA HOTELERA, CANCÚN</div>
          <h1 className="text-4xl font-extrabold mb-2 text-[#1A103C]">{lote.establecimientoId}</h1>
          <p className="text-gray-500 mb-6 font-medium">{lote.descripcion}</p>

          <div className="inline-flex bg-green-50 text-[#00E676] font-bold px-3 py-1.5 rounded-full text-sm mb-6 w-max items-center">
            <span className="mr-2 bg-[#00E676] w-2 h-2 rounded-full"></span> 
            {lote.cantidadDisponible} porciones disponibles
          </div>

          <div className="flex items-center gap-4 mb-8">
            <label className="text-gray-500 font-bold text-sm uppercase">CANTIDAD:</label>
            <input
              type="number" min="1" max={lote.cantidadDisponible} value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              className="w-20 p-2 border border-gray-300 rounded-md text-center font-bold text-lg"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 transition-all duration-300">
            <p className="text-gray-400 text-xs font-bold mb-1 uppercase">Precio Total</p>
            <div className="flex items-baseline gap-3 mb-1">
              {/* 👉 PRECIO TOTAL ACTUALIZADO */}
              <span className="text-4xl font-extrabold text-[#1A103C]">${totalPagar}</span>
              <span className="text-gray-400 line-through text-lg font-medium">${precioOriginalTotal}</span>
            </div>
            <p className="text-[#00E676] font-bold text-sm">Ahorras ${totalAhorro} pesos</p>
          </div>

          <button 
            onClick={() => onAgregarCarrito(lote, cantidad)}
            disabled={lote.cantidadDisponible === 0}
            className={`w-full py-4 rounded-full font-bold text-lg transition-all shadow-md ${
              lote.cantidadDisponible === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-[#2c225a] text-white hover:bg-opacity-90 hover:scale-[1.02]'
            }`}
          >
            {lote.cantidadDisponible === 0 ? 'Agotado' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}