import { LoteAlimento } from '../models/LoteAlimento';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import MainCategorias from './MainCategorias';
import MainDescubrimientos from './MainDescubrimientos';

interface MainProps {
  lotes: LoteAlimento[];
  onReservar: (lote: LoteAlimento) => void;
  onVerDetalle: (lote: LoteAlimento) => void;
}

export default function Main({ lotes, onReservar, onVerDetalle }: MainProps) {
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1A103C]">
      <MainHeader />
      <MainHero />
      <MainCategorias />
      <MainDescubrimientos lotes={lotes} onReservar={onReservar} onVerDetalle={onVerDetalle} />
    </div>
  );
}
