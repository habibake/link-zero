import { LoteAlimento } from '../models/LoteAlimento';
import type { CategoriaLote } from '../models/LoteAlimento';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import MainBusqueda from './MainBusqueda';
import MainCategorias from './MainCategorias';
import MainDescubrimientos from './MainDescubrimientos';

interface MainProps {
  lotes: LoteAlimento[]; // ya filtrados (búsqueda + categoría aplicados en App.tsx)
  onReservar: (lote: LoteAlimento) => void;
  onVerDetalle: (lote: LoteAlimento) => void;
  busqueda: string;
  onCambiarBusqueda: (texto: string) => void;
  categoriaActiva: CategoriaLote | null;
  onSeleccionarCategoria: (categoria: CategoriaLote | null) => void;
}

export default function Main({
  lotes,
  onReservar,
  onVerDetalle,
  busqueda,
  onCambiarBusqueda,
  categoriaActiva,
  onSeleccionarCategoria,
}: MainProps) {
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A103C]">
      <MainHeader />
      <MainHero />
      <MainBusqueda busqueda={busqueda} onCambiarBusqueda={onCambiarBusqueda} />
      <MainCategorias categoriaActiva={categoriaActiva} onSeleccionarCategoria={onSeleccionarCategoria} />
      <MainDescubrimientos lotes={lotes} onReservar={onReservar} onVerDetalle={onVerDetalle} />
    </div>
  );
}