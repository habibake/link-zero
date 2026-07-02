import { useState } from 'react';
import { LoteAlimento } from '../models/LoteAlimento';

interface LoteDetalleProps {
  lote: LoteAlimento;
  onVolver: () => void;
  onAgregarCarrito: (lote: LoteAlimento, cantidad: number) => void;
}

export default function LoteDetalle({ lote, onVolver, onAgregarCarrito }: LoteDetalleProps) {
  // Cantidad que el usuario quiere reservar.
  const [cantidad, setCantidad] = useState(1);

  // Calcula descuento y ahorro.
  const porcentajeDescuento = lote.calcularPorcentajeAhorro();
  const ahorroUnitario = lote.precioOriginal - lote.precioDescuento;

  // Calcula totales según la cantidad seleccionada.
  const totalPagar = lote.precioDescuento * cantidad;
  const precioOriginalTotal = lote.precioOriginal * cantidad;
  const totalAhorro = ahorroUnitario * cantidad;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-[#FDFCF8] min-h-screen font-sans text-[#1A103C] animate-in fade-in duration-500">
      {/* Botón para volver a la pantalla anterior. */}
      <button
        onClick={onVolver}
        className="mb-8 font-bold text-sm flex items-center hover:opacity-75 transition-opacity"
      >
        <span className="mr-2">←</span> Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagen del producto. */}
        <div className="relative h-full">
          <img
            src={lote.imagen}
            alt={lote.descripcion}
            className="w-full h-full object-cover rounded-2xl shadow-lg border border-gray-100"
          />

          <div className="absolute top-4 right-4 bg-[#00E676] text-[#1A103C] font-extrabold px-3 py-1 rounded-full text-sm">
            -{porcentajeDescuento}%
          </div>
        </div>

        {/* Información del producto. */}
        <div className="flex flex-col justify-center">
          {/* Ubicación de la empresa. */}
          <div className="text-[#00E676] text-xs font-bold tracking-wider mb-2 uppercase">
            {lote.direccionEmpresa}
          </div>

          {/* Nombre del producto. */}
          <h1 className="text-4xl font-extrabold mb-2 text-[#1A103C]">
            {lote.descripcion}
          </h1>

          {/* Nombre de la empresa. */}
          <p className="text-gray-500 mb-6 font-medium">
            Por {lote.nombreEmpresa}
          </p>

          <div className="inline-flex bg-green-50 text-[#00E676] font-bold px-3 py-1.5 rounded-full text-sm mb-6 w-max items-center">
            <span className="mr-2 bg-[#00E676] w-2 h-2 rounded-full" />
            {lote.cantidadDisponible} porciones disponibles
          </div>

          {/* Selector de cantidad. */}
          <div className="flex items-center gap-4 mb-8">
            <label className="text-gray-500 font-bold text-sm uppercase">Cantidad:</label>
            <input
              type="number"
              min="1"
              max={lote.cantidadDisponible}
              value={cantidad}
              onChange={(e) => {
                const valor = parseInt(e.target.value) || 1;
                const valorSeguro = Math.min(Math.max(valor, 1), Math.max(lote.cantidadDisponible, 1));
                setCantidad(valorSeguro);
              }}
              className="w-20 p-2 border border-gray-300 rounded-md text-center font-bold text-lg"
            />
          </div>

          {/* Precio total. */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 transition-all duration-300">
            <p className="text-gray-400 text-xs font-bold mb-1 uppercase">Precio total</p>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-extrabold text-[#1A103C]">${totalPagar}</span>
              <span className="text-gray-400 line-through text-lg font-medium">${precioOriginalTotal}</span>
            </div>

            <p className="text-[#00E676] font-bold text-sm">Ahorras ${totalAhorro} pesos</p>
          </div>

          {/* Botón para mandar al carrito. */}
          <button
            onClick={() => onAgregarCarrito(lote, cantidad)}
            disabled={lote.cantidadDisponible === 0}
            className={`w-full py-4 rounded-full font-bold text-lg transition-all shadow-md ${
              lote.cantidadDisponible === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#2c225a] text-white hover:bg-opacity-90 hover:scale-[1.02]'
            }`}
          >
            {lote.cantidadDisponible === 0 ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}