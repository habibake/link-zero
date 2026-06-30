import { useState, useEffect } from 'react';

// CLASE ENTIDAD
class LoteComida {
  id_lote: number;
  descripcion: string;
  categoria: string;
  cantidad_en_stock: number;
  unidad_medida: string;
  precio_original: number;
  precio_descuento: number;
  fecha_expiracion: string;
  fecha_disponible: string;
  estado: string;
  icono: string;

  constructor(id_lote: number, descripcion: string, categoria: string, cantidad_en_stock: number, unidad_medida: string, precio_original: number, precio_descuento: number, fecha_expiracion: string, fecha_disponible: string, estado: string, icono: string) {
    this.id_lote = id_lote; this.descripcion = descripcion; this.categoria = categoria; this.cantidad_en_stock = cantidad_en_stock; this.unidad_medida = unidad_medida; this.precio_original = precio_original; this.precio_descuento = precio_descuento; this.fecha_expiracion = fecha_expiracion; this.fecha_disponible = fecha_disponible; this.estado = estado; this.icono = icono;
  }
}

const API_URL = "http://localhost:3001/api";
interface DashboardProps { nombreEmpresa: string; }

export default function Dashboard({ nombreEmpresa }: DashboardProps) {
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [filtroTabla, setFiltroTabla] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [alertaModal, setAlertaModal] = useState({ visible: false, mensaje: '', tipo: '' });

  const [productos, setProductos] = useState<LoteComida[]>([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const respuesta = await fetch(`${API_URL}/lotes`);
      const datos = await respuesta.json();
      const nuevos = datos.map((p: any) =>
        new LoteComida(
          p.id_lote,
          p.descripcion,
          p.categoria,
          p.cantidad_en_stock,
          "pzas",
          p.precio_original,
          p.precio_descuento,
          p.fecha_expiracion,
          p.fecha_disponible,
          p.estado || "Disponible",
          "🍞"
        )
      );
      setProductos(nuevos);
    } catch (error) {
      console.log(error);
    }
  }

  const [formLote, setFormLote] = useState({ descripcion: '', categoria: 'Panadería', cantidad: '', unidad: 'pzas', precioOriginal: '', precioDescuento: '', fechaExpiracion: '' });

  const [razonSocial, setRazonSocial] = useState(nombreEmpresa || 'Nozomi Restaurant');
  const [direccion, setDireccion] = useState('Zona Hotelera, Cancún');
  const [horario, setHorario] = useState('08:00 AM - 10:00 PM');

  const totalLotes = productos.filter(p => p.estado === 'Disponible').length;
  const metaLotes = 20;
  const progresoLotes = Math.min((totalLotes / metaLotes) * 100, 100);

  const ingresosProyectados = productos.reduce((acc, curr) => curr.estado === 'Disponible' ? acc + (curr.precio_descuento * curr.cantidad_en_stock) : acc, 0);
  const progresoIngresos = Math.min((ingresosProyectados / 10000) * 100, 100);

  const kgRescatados = productos.reduce((acc, curr) => acc + (curr.cantidad_en_stock * 1.5), 0);
  const progresoKg = Math.min((kgRescatados / 500) * 100, 100);

  const productosFiltrados = productos.filter(p => {
    let cumpleFiltroBoton = true;
    if (filtroTabla === 'Disponibles') cumpleFiltroBoton = p.estado === 'Disponible';
    if (filtroTabla === 'Vendidos') cumpleFiltroBoton = p.estado === 'Vendido';

    const cumpleBusqueda = p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) || p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltroBoton && cumpleBusqueda;
  });

  // ✅ AHORA GUARDA EN MYSQL (POST)
  const handleAddItem = async () => {
    const { descripcion, categoria, cantidad, precioOriginal, precioDescuento, fechaExpiracion } = formLote;

    if (Number(cantidad) <= 0 || Number(precioOriginal) < 0 || Number(precioDescuento) < 0) {
      setAlertaModal({ visible: true, mensaje: 'El stock y los precios deben ser números válidos y mayores a cero.', tipo: 'error' });
      return;
    }

    if (!descripcion || !cantidad || !precioOriginal || !precioDescuento || !fechaExpiracion) {
      setAlertaModal({ visible: true, mensaje: 'Por favor, llena todos los campos.', tipo: 'error' });
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/lotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razon_social_empresa: razonSocial,
          descripcion,
          categoria,
          cantidad_en_stock: Number(cantidad),
          precio_original: Number(precioOriginal),
          precio_descuento: Number(precioDescuento),
          fecha_expiracion: fechaExpiracion,
          fecha_disponible: new Date().toISOString().split("T")[0]
        })
      });

      if (!respuesta.ok) {
        setAlertaModal({ visible: true, mensaje: 'No se pudo guardar el lote en la base de datos.', tipo: 'error' });
        return;
      }

      await cargarProductos();
      setIsAdding(false);
      setFormLote({ descripcion: '', categoria: 'Panadería', cantidad: '', unidad: 'pzas', precioOriginal: '', precioDescuento: '', fechaExpiracion: '' });
      setAlertaModal({ visible: true, mensaje: '¡Lote agregado! Métricas actualizadas.', tipo: 'exito' });
    } catch (error) {
      console.log(error);
      setAlertaModal({ visible: true, mensaje: 'Error de conexión con el servidor.', tipo: 'error' });
    }
  };

  // ✅ AHORA ACTUALIZA EN MYSQL (PUT)
  const handleMarcarVendido = async (id: number) => {
    try {
      await fetch(`${API_URL}/lotes/${id}/vendido`, { method: "PUT" });
      await cargarProductos();
      setAlertaModal({ visible: true, mensaje: '¡Lote vendido! Tus ingresos reales han aumentado.', tipo: 'exito' });
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ AHORA ELIMINA EN MYSQL (DELETE)
  const handleEliminar = async (id: number) => {
    try {
      await fetch(`${API_URL}/lotes/${id}`, { method: "DELETE" });
      await cargarProductos();
      setAlertaModal({ visible: true, mensaje: 'Lote eliminado de la base de datos.', tipo: 'exito' });
    } catch (error) {
      console.log(error);
    }
  };

  const getColorCategoria = (cat: string) => {
    switch(cat) {
      case 'Panadería': return 'bg-yellow-100 text-yellow-700';
      case 'Lácteos': return 'bg-blue-100 text-blue-700';
      case 'Verduras': return 'bg-green-100 text-green-700';
      case 'Preparada': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderInicio = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-green-50 p-2 rounded-xl text-xl">🌱</div>
          <span className="bg-green-50 text-[#00E676] text-xs font-bold px-2 py-1 rounded-full">Actualizado</span>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-[#1A103C]">{kgRescatados} <span className="text-lg text-gray-400 font-medium">kg</span></h2>
          <p className="text-gray-500 text-sm font-medium mb-3">Comida rescatada total</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#00E676] h-1.5 rounded-full transition-all duration-1000" style={{width: `${progresoKg}%`}}></div></div>
        </div>
      </div>
      <div onClick={() => setVistaActual('Inventario')} className="cursor-pointer bg-[#1A103C] p-6 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden hover:scale-[1.02] transition-transform">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#2c225a] rounded-full opacity-50 blur-2xl"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="bg-[#2c225a] text-white p-2 rounded-xl text-xl border border-[#3b2d77]">📦</div>
          <span className="bg-[#2c225a] text-[#00E676] text-xs font-bold px-2 py-1 rounded-full border border-[#3b2d77]">En venta</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white">{totalLotes} <span className="text-lg text-gray-400 font-medium">/ {metaLotes}</span></h2>
          <p className="text-gray-400 text-sm font-medium mb-3">Lotes activos (Disponibles)</p>
          <div className="w-full bg-[#2c225a] rounded-full h-1.5"><div className="bg-[#00E676] h-1.5 rounded-full transition-all duration-1000" style={{width: `${progresoLotes}%`}}></div></div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-purple-50 p-2 rounded-xl text-xl">📈</div>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-[#1A103C]">${ingresosProyectados}</h2>
          <p className="text-gray-500 text-sm font-medium mb-3">Ingresos proyectados (De activos)</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000" style={{width: `${progresoIngresos}%`}}></div></div>
        </div>
      </div>
    </div>
  );

  const renderInventario = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
      <div className="p-6 flex justify-between items-center border-b border-gray-100">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A103C]">Inventario Central</h2>
          <p className="text-sm text-gray-500">{productosFiltrados.length} resultados encontrados</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-gray-50 rounded-lg p-1 flex text-sm font-bold text-gray-500 border border-gray-200">
            {['Todos', 'Disponibles', 'Vendidos'].map(filtro => (
              <button key={filtro} onClick={() => setFiltroTabla(filtro)} className={`px-4 py-1.5 rounded-md transition-all ${filtroTabla === filtro ? 'bg-white text-[#1A103C] shadow-sm' : 'hover:text-[#1A103C]'}`}>
                {filtro}
              </button>
            ))}
          </div>
          <button onClick={() => setIsAdding(!isAdding)} className="bg-[#00E676] px-5 py-2 rounded-xl font-extrabold text-sm text-[#1A103C] hover:scale-105 transition-transform shadow-sm">
            {isAdding ? '✕ Cancelar' : '+ Nuevo Lote'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="p-6 bg-green-50/50 border-b border-gray-100 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="col-span-2">
              <input className="w-full p-3 border-0 bg-white rounded-xl shadow-sm font-medium outline-none" placeholder="Descripción" value={formLote.descripcion} onChange={e => setFormLote({...formLote, descripcion: e.target.value})} />
            </div>
            <div>
              <select className="w-full p-3 border-0 bg-white rounded-xl shadow-sm font-medium text-gray-600 outline-none" value={formLote.categoria} onChange={e => setFormLote({...formLote, categoria: e.target.value})}>
                <option>Panadería</option><option>Lácteos</option><option>Preparada</option><option>Verduras</option>
              </select>
            </div>
            <div className="flex gap-2 col-span-1">
              <input type="number" min="1" className="w-full p-3 border-0 bg-white rounded-xl shadow-sm font-medium outline-none" placeholder="Cant." value={formLote.cantidad} onChange={e => setFormLote({...formLote, cantidad: e.target.value})} />
              <select className="w-full p-3 border-0 bg-white rounded-xl shadow-sm font-medium text-gray-600 outline-none" value={formLote.unidad} onChange={e => setFormLote({...formLote, unidad: e.target.value})}>
                <option>pzas</option><option>kg</option>
              </select>
            </div>
            <div className="flex gap-2 col-span-1">
              <input type="number" min="1" className="w-full p-3 border-0 bg-white rounded-xl shadow-sm font-medium outline-none" placeholder="$ Orig." value={formLote.precioOriginal} onChange={e => setFormLote({...formLote, precioOriginal: e.target.value})} />
              <input type="number" min="1" className="w-full p-3 border-0 bg-white rounded-xl shadow-sm font-medium outline-none" placeholder="$ Desc." value={formLote.precioDescuento} onChange={e => setFormLote({...formLote, precioDescuento: e.target.value})} />
            </div>
            <div className="col-span-1">
              <input type="date" className="w-full p-3 border-0 bg-white rounded-xl shadow-sm font-medium text-gray-500 outline-none" value={formLote.fechaExpiracion} onChange={e => setFormLote({...formLote, fechaExpiracion: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleAddItem} className="bg-[#1A103C] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">✓ Guardar Lote</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto p-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              <th className="p-4">Producto</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Precios</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(p => (
              <tr key={p.id_lote} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                <td className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl shadow-sm">{p.icono}</div>
                  <span className="font-extrabold text-[#1A103C]">{p.descripcion}</span>
                </td>
                <td className="p-4"><span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getColorCategoria(p.categoria)}`}>{p.categoria}</span></td>
                <td className="p-4 font-extrabold text-[#1A103C]">{p.cantidad_en_stock} <span className="text-gray-400 font-medium text-sm">{p.unidad_medida}</span></td>
                <td className="p-4 font-extrabold text-[#00E676]">${p.precio_descuento} <span className="text-gray-300 line-through text-xs">${p.precio_original}</span></td>
                <td className="p-4">
                  {p.estado === 'Disponible' 
                    ? <span className="bg-green-50 text-[#00E676] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 w-max"><span className="w-2 h-2 rounded-full bg-[#00E676]"></span> Disponible</span>
                    : <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 w-max"><span className="w-2 h-2 rounded-full bg-gray-400"></span> Vendido</span>
                  }
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    {p.estado === 'Disponible' && (
                      <button onClick={() => handleMarcarVendido(p.id_lote)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Marcar como vendido">
                        ✅
                      </button>
                    )}
                    <button onClick={() => handleEliminar(p.id_lote)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 font-bold">No se encontraron productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnaliticas = () => {
    const metricas = ['Panadería', 'Lácteos', 'Verduras', 'Preparada'].map(cat => ({
      nombre: cat,
      kg: productos.filter(p => p.categoria === cat).reduce((acc, curr) => acc + (curr.cantidad_en_stock * 1.5), 0)
    }));
    const maxKg = Math.max(...metricas.map(m => m.kg)) || 1;

    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-[#1A103C] mb-6">Analíticas y Reportes</h2>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-8 text-lg text-gray-600">Rescates históricos por Categoría</h3>
          <div className="space-y-8">
            {metricas.map(m => {
              const barWidth = `${(m.kg / maxKg) * 100}%`;
              let color = 'bg-gray-400';
              if(m.nombre === 'Panadería') color = 'bg-yellow-400';
              if(m.nombre === 'Lácteos') color = 'bg-blue-400';
              if(m.nombre === 'Verduras') color = 'bg-[#00E676]';
              if(m.nombre === 'Preparada') color = 'bg-orange-500';

              return (
                <div key={m.nombre}>
                  <div className="flex justify-between text-sm font-bold text-[#1A103C] mb-2"><span>{m.nombre}</span><span>{m.kg} kg</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden"><div className={`${color} h-full rounded-full transition-all duration-1000 ease-out`} style={{width: barWidth}}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderConfiguracion = () => (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
      <h2 className="text-2xl font-extrabold text-[#1A103C] mb-6">Configuración de Empresa</h2>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="text-xs text-gray-400 font-bold uppercase mb-2 block">Razón Social</label>
          <input className="w-full border-2 border-gray-100 p-4 rounded-xl bg-gray-50 font-bold text-[#1A103C] focus:border-[#00E676] outline-none" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-bold uppercase mb-2 block">Dirección Operativa</label>
          <input className="w-full border-2 border-gray-100 p-4 rounded-xl bg-gray-50 font-bold text-[#1A103C] focus:border-[#00E676] outline-none" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-bold uppercase mb-2 block">Horario de Atención</label>
          <input className="w-full border-2 border-gray-100 p-4 rounded-xl bg-gray-50 font-bold text-[#1A103C] focus:border-[#00E676] outline-none transition-colors" value={horario} onChange={(e) => setHorario(e.target.value)} />
        </div>
        <button 
          onClick={() => setAlertaModal({ visible: true, mensaje: 'Datos de facturación actualizados.', tipo: 'exito' })}
          className="mt-8 bg-[#1A103C] hover:bg-[#2c225a] text-white px-6 py-4 rounded-xl font-bold w-full transition-colors shadow-lg"
        >
          Guardar Preferencias
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFCF8] font-sans text-[#1A103C] overflow-hidden">
      
      <aside className="w-72 bg-[#1A103C] text-white flex flex-col justify-between shadow-2xl z-20 relative">
        <div>
          <div className="p-8 flex items-center gap-3">
            <div className="bg-[#00E676] p-2.5 rounded-xl"><span className="text-[#1A103C] font-black text-2xl leading-none">L</span></div>
            <span className="text-3xl font-black text-white tracking-tight">Link-Zero</span>
          </div>
          <p className="px-8 text-xs text-gray-500 font-bold uppercase mb-4 tracking-widest">Navegación</p>
          <nav className="space-y-2 px-4">
             {['Inicio', 'Inventario', 'Analíticas', 'Configuración'].map((item) => (
               <button 
                  key={item} onClick={() => { setVistaActual(item); setBusqueda(''); }}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-4 ${vistaActual === item ? 'bg-[#2c225a] text-[#00E676] shadow-inner' : 'text-gray-400 hover:bg-[#2c225a] hover:text-white'}`}
                >
                 <span className="text-xl">
                   {item === 'Inicio' && '🏠'}
                   {item === 'Inventario' && '📦'}
                   {item === 'Analíticas' && '📊'}
                   {item === 'Configuración' && '⚙️'}
                 </span>
                 {item}
               </button>
             ))}
          </nav>
        </div>
        <div className="p-6">
          <div className="bg-[#2c225a] p-5 rounded-2xl mb-4 border border-[#3b2d77] shadow-inner">
            <p className="text-xs text-gray-400 mb-1 font-bold">Rescate histórico</p>
            <p className="text-sm text-white font-bold leading-tight">Total: <span className="text-[#00E676]">{kgRescatados} kg</span> salvados.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#00E676] w-12 h-12 rounded-full flex items-center justify-center text-[#1A103C] font-black text-lg">AB</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate w-32">{razonSocial}</p>
              <p className="text-xs text-gray-400 font-medium truncate w-32">Propietario</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="flex justify-between items-center px-10 py-8 bg-[#FDFCF8]/80 backdrop-blur-md z-10 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1A103C]">
              {vistaActual === 'Inicio' && 'Dashboard General'}
              {vistaActual === 'Inventario' && 'Gestión de Inventario 📦'}
              {vistaActual === 'Analíticas' && 'Métricas y Reportes 📊'}
              {vistaActual === 'Configuración' && 'Ajustes del Sistema ⚙️'}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Busca pan, pizza, etc..." 
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  if(vistaActual !== 'Inventario') setVistaActual('Inventario'); 
                }}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium w-64 focus:outline-none focus:border-[#00E676] shadow-sm" 
              />
              <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
            </div>
            
            <button className="relative p-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm transition-colors">
              🔔 <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-10 overflow-y-auto h-full">
          {vistaActual === 'Inicio' && renderInicio()}
          {vistaActual === 'Inventario' && renderInventario()}
          {vistaActual === 'Analíticas' && renderAnaliticas()}
          {vistaActual === 'Configuración' && renderConfiguracion()}
        </div>
      </main>

      {alertaModal.visible && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-96 transform animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className={`px-6 py-4 flex justify-between items-center text-white ${alertaModal.tipo === 'error' ? 'bg-red-500' : 'bg-[#00E676] text-[#1A103C]'}`}>
              <span className="font-extrabold text-lg">{alertaModal.tipo === 'error' ? '⚠️ Error' : '✅ ¡Hecho!'}</span>
            </div>
            <div className="p-8"><p className="text-[#1A103C] font-bold text-center text-lg">{alertaModal.mensaje}</p></div>
            <div className="p-4 flex justify-center border-t border-gray-50">
              <button onClick={() => setAlertaModal({ ...alertaModal, visible: false })} className="bg-[#1A103C] hover:scale-105 transition-transform px-8 py-3 rounded-xl text-white font-extrabold shadow-md w-full">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}