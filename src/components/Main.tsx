import { LoteAlimento } from '../models/LoteAlimento';
import type { CategoriaLote } from '../models/LoteAlimento';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import MainCategorias from './MainCategorias';
import MainDescubrimientos from './MainDescubrimientos';
import QuienesSomos from './QuienesSomos';
import Impacto from './Impacto';

interface MainProps {
  lotes: LoteAlimento[];
  onReservar: (lote: LoteAlimento) => void;
  onVerDetalle: (lote: LoteAlimento) => void;
  busqueda: string;
  onCambiarBusqueda: (texto: string) => void;
  categoriaActiva: CategoriaLote | null;
  onSeleccionarCategoria: (categoria: CategoriaLote | null) => void;
  onMiCuentaClick: () => void;
}

export default function Main({
  lotes,
  onReservar,
  onVerDetalle,
  busqueda,
  onCambiarBusqueda,
  categoriaActiva,
  onSeleccionarCategoria,
  onMiCuentaClick,
}: MainProps) {
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A103C]">
      <MainHeader
        busqueda={busqueda}
        onCambiarBusqueda={onCambiarBusqueda}
        onMiCuentaClick={onMiCuentaClick}
      />
      <MainHero />
      <MainCategorias
        categoriaActiva={categoriaActiva}
        onSeleccionarCategoria={onSeleccionarCategoria}
      />
      <MainDescubrimientos
        lotes={lotes}
        onReservar={onReservar}
        onVerDetalle={onVerDetalle}
      />
      <QuienesSomos />
      <Impacto />
    </div>
  );
}