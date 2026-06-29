import { LoteAlimento } from '../models/LoteAlimento';
import type { CategoriaLote } from '../models/LoteAlimento';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import MainCategorias from './MainCategorias';
import MainDescubrimientos from './MainDescubrimientos';
import QuienesSomos from './QuienesSomos'; // <-- Importado
import Impacto from './Impacto'; // <-- Importado

interface MainProps {
  lotes: LoteAlimento[];
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
      <MainHeader 
        busqueda={busqueda} 
        onCambiarBusqueda={onCambiarBusqueda} 
      />
      
      <MainHero />
      
      <MainCategorias 
        categoriaActiva={categoriaActiva} 
        onSeleccionarCategoria={onSeleccionarCategoria} 
      />
      
      {/* Esta es la sección a la que bajará el botón de "Restaurantes" */}
      <MainDescubrimientos 
        lotes={lotes} 
        onReservar={onReservar} 
        onVerDetalle={onVerDetalle} 
      />

      {/* Nuevas secciones conectadas a tu Header */}
      <QuienesSomos />
      <Impacto />

    </div>
  );
}