import { useState } from 'react';

// 1. CLASE DEFINIDA DE FORMA ESTÁNDAR (Sin atajos para evitar errores de compilación)
class Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: string;
  status: string;

  constructor(id: number, nombre: string, categoria: string, stock: string, status: string) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.stock = stock;
    this.status = status;
  }
}

interface DashboardProps { 
  nombreEmpresa: string; 
}

export default function Dashboard({ nombreEmpresa: propNombre }: DashboardProps) {
  // ESTADOS GLOBALES
  const [empresa, setEmpresa] = useState(propNombre);
  const [tipoNegocio, setTipoNegocio] = useState('Restaurante');
  const [vistaActual, setVistaActual] = useState('Inicio');
  
  // ARREGLO DE PRODUCTOS
  const [productos, setProductos] = useState<Producto[]>([
    new Producto(1, 'Pan de Masa Madre', 'Panadería', '24 pzas', 'Disponible'),
    new Producto(2, 'Yogurt Natural', 'Lácteos', '12 pzas', 'Disponible')
  ]);

  // ESTADOS CONFIGURACIÓN
  const [alertas, setAlertas] = useState(true);
  const [notif, setNotif] = useState(true);

  // LÓGICA DE AGREGAR
  const [isAdding, setIsAdding] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCat, setNuevaCat] = useState('');
  const [nuevoStock, setNuevoStock] = useState('');

  const handleAddItem = () => {
    if (nuevoNombre && nuevaCat && nuevoStock) {
      setProductos([...productos, new Producto(Date.now(), nuevoNombre, nuevaCat, nuevoStock, 'Disponible')]);
      setNuevoNombre(''); setNuevaCat(''); setNuevoStock('');
      setIsAdding(false);
    }
  };

  const renderizarContenido = () => {
    switch (vistaActual) {
      case 'Inicio':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-[#1A103C]">Buenos días, {empresa} 👋</h1>
            <div className="grid grid-cols-3 gap-6">
              {[ {t: 'Comida rescatada hoy', v: '347 kg', s: '+12% vs ayer'}, {t: 'Solicitudes pendientes', v: '6', s: '2 requieren confirmación'}, {t: 'Próximos vencimientos', v: '14', s: '4 vencen en 24 hrs'} ].map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm">{card.t}</p>
                  <h2 className="text-4xl font-bold mt-2">{card.v}</h2>
                  <p className="text-emerald-500 text-sm mt-1">{card.s}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Inventario':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#1A103C]">Productos Activos</h2>
              <button onClick={() => setIsAdding(!isAdding)} className="bg-[#00E676] px-4 py-2 rounded-lg font-bold text-sm text-[#1A103C]">+ Agregar</button>
            </div>
            {isAdding && (
              <div className="bg-gray-50 p-4 rounded-xl mb-6 grid grid-cols-4 gap-4">
                <input className="p-2 border rounded" placeholder="Producto" onChange={e => setNuevoNombre(e.target.value)} />
                <input className="p-2 border rounded" placeholder="Categoría" onChange={e => setNuevaCat(e.target.value)} />
                <input className="p-2 border rounded" placeholder="Stock" onChange={e => setNuevoStock(e.target.value)} />
                <button onClick={handleAddItem} className="bg-[#1A103C] text-white rounded font-bold">Guardar</button>
              </div>
            )}
            <table className="w-full text-left">
              <thead><tr className="text-gray-400 text-xs uppercase"><th className="pb-4">Producto</th><th className="pb-4">Categoría</th><th className="pb-4">Stock</th><th className="pb-4">Estado</th></tr></thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id} className="border-t border-gray-50">
                    <td className="py-6 font-bold">{p.nombre}</td>
                    <td className="py-6 text-orange-500">{p.categoria}</td>
                    <td className="py-6">{p.stock}</td>
                    <td className="py-6"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Analíticas':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-[#1A103C]">Analíticas</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-6">Resumen de Rescate</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="h-40 bg-gray-50 rounded-2xl flex items-center justify-center border-dashed border-2 text-gray-400">Gráfica de Tendencia</div>
                <div className="h-40 bg-gray-50 rounded-2xl flex items-center justify-center border-dashed border-2 text-gray-400">Comparativa mensual</div>
              </div>
            </div>
          </div>
        );

      case 'Configuración':
        return (
          <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-[#1A103C]">Configuración de Cuenta</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-4">Perfil de Negocio</h3>
              <input className="w-full border p-3 rounded-xl mb-4" value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nombre" />
              <input className="w-full border p-3 rounded-xl" value={tipoNegocio} onChange={(e) => setTipoNegocio(e.target.value)} placeholder="Tipo de negocio" />
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-4">Preferencias</h3>
              <div className="flex justify-between items-center py-2"><span>Alertas de Correo</span><input type="checkbox" checked={alertas} onChange={() => setAlertas(!alertas)} className="w-5 h-5"/></div>
              <div className="flex justify-between items-center py-2"><span>Notificaciones Push</span><input type="checkbox" checked={notif} onChange={() => setNotif(!notif)} className="w-5 h-5"/></div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFCF8] font-sans text-[#1A103C]">
      <aside className="w-64 bg-[#1A103C] text-white p-8">
        <div className="text-2xl font-bold mb-12 text-emerald-400">Link-Zero</div>
        <nav className="space-y-6">
           {['Inicio', 'Inventario', 'Analíticas', 'Configuración'].map((item) => (
             <p key={item} onClick={() => setVistaActual(item)} className={`cursor-pointer transition-all ${vistaActual === item ? 'font-bold text-white border-r-4 border-emerald-400' : 'text-gray-400 hover:text-white'}`}>
               {item}
             </p>
           ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{renderizarContenido()}</main>
    </div>
  );
}