import { useEffect, useRef, useState } from 'react';

// Ruta base del backend.
const API_URL = 'http://localhost:3001/api';

// Imagen por defecto.
const IMAGEN_DEFAULT = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';

// Modelo interno del dashboard.
class LoteComida {
  id_lote: number;
  descripcion: string;
  categoria: string;
  cantidad_en_stock: number;
  cantidad_vendida: number;
  unidad_medida: string;
  precio_original: number;
  precio_descuento: number;
  fecha_expiracion: string;
  fecha_disponible: string;
  imagen: string;

  constructor(
    id_lote: number,
    descripcion: string,
    categoria: string,
    cantidad_en_stock: number,
    cantidad_vendida: number,
    unidad_medida: string,
    precio_original: number,
    precio_descuento: number,
    fecha_expiracion: string,
    fecha_disponible: string,
    imagen: string
  ) {
    this.id_lote = id_lote;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.cantidad_en_stock = cantidad_en_stock;
    this.cantidad_vendida = cantidad_vendida;
    this.unidad_medida = unidad_medida;
    this.precio_original = precio_original;
    this.precio_descuento = precio_descuento;
    this.fecha_expiracion = fecha_expiracion;
    this.fecha_disponible = fecha_disponible;
    this.imagen = imagen;
  }

  // Si ya se vendió al menos una pieza, aparece como vendido en dashboard.
  get estado() {
    if (this.cantidad_vendida > 0) return 'Vendido';
    if (this.cantidad_en_stock > 0) return 'Disponible';
    return 'Agotado';
  }
}

// Lote como llega del backend.
interface LoteCrudoBackend {
  id_lote: number;
  descripcion: string;
  categoria: string;
  cantidad_en_stock: number;
  cantidad_vendida?: number;
  precio_original: number;
  precio_descuento: number;
  fecha_expiracion: string;
  fecha_disponible: string;
  imagen?: string | null;
}

// Empresa como llega del backend.
interface EmpresaBackend {
  razon_social: string;
  nombre_empresa: string;
  direccion: string;
  horario_de_atencion?: string;
}

// Props del dashboard.
interface DashboardProps {
  nombreEmpresa: string;
  razonSocialEmpresa: string;
  direccionEmpresa: string;
  onCerrarSesion: () => void;
}

export default function Dashboard({
  nombreEmpresa,
  razonSocialEmpresa,
  direccionEmpresa,
  onCerrarSesion
}: DashboardProps) {
  // Vista seleccionada.
  const [vistaActual, setVistaActual] = useState('Inventario');

  // Filtros.
  const [filtroTabla, setFiltroTabla] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Datos visibles de empresa.
  const [nombreVisible, setNombreVisible] = useState(nombreEmpresa || razonSocialEmpresa);
  const [direccionVisible, setDireccionVisible] = useState(direccionEmpresa || 'Ubicación no disponible');
  const [horarioVisible, setHorarioVisible] = useState('08:00 - 20:00');
  const [razonSocial] = useState(razonSocialEmpresa || nombreEmpresa);

  // Formulario de configuración.
  const [editandoConfig, setEditandoConfig] = useState(false);
  const [formConfig, setFormConfig] = useState({
    nombre_empresa: nombreEmpresa || razonSocialEmpresa,
    direccion: direccionEmpresa || '',
    horario_de_atencion: '08:00 - 20:00'
  });

  // Productos.
  const [productos, setProductos] = useState<LoteComida[]>([]);

  // Modal nuevo lote.
  const [isAdding, setIsAdding] = useState(false);

  // Imagen base64.
  const [imagenPreview, setImagenPreview] = useState('');

  // Alertas.
  const [alertaModal, setAlertaModal] = useState({ visible: false, mensaje: '', tipo: '' });

  // Input file.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formulario nuevo lote.
  const [formLote, setFormLote] = useState({
    descripcion: '',
    categoria: 'Panadería',
    cantidad: '',
    precioOriginal: '',
    precioDescuento: '',
    fechaExpiracion: ''
  });

  // Carga empresa y productos.
  useEffect(() => {
    cargarEmpresa();
    cargarProductos();
  }, []);

  // Oculta alertas.
  useEffect(() => {
    if (!alertaModal.visible) return;

    const timer = setTimeout(() => {
      setAlertaModal({ visible: false, mensaje: '', tipo: '' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [alertaModal.visible]);

  // Carga datos reales de empresa.
  async function cargarEmpresa() {
    try {
      const respuesta = await fetch(`${API_URL}/empresas`);
      const datos: EmpresaBackend[] = await respuesta.json();

      const empresaActual = datos.find(
        (empresa) => empresa.razon_social.trim().toUpperCase() === razonSocial.trim().toUpperCase()
      );

      if (empresaActual) {
        const nombre = empresaActual.nombre_empresa || empresaActual.razon_social;
        const direccion = empresaActual.direccion || 'Ubicación no disponible';
        const horario = empresaActual.horario_de_atencion || '08:00 - 20:00';

        setNombreVisible(nombre);
        setDireccionVisible(direccion);
        setHorarioVisible(horario);

        setFormConfig({
          nombre_empresa: nombre,
          direccion,
          horario_de_atencion: horario
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Carga productos de la empresa.
  async function cargarProductos() {
    try {
      const respuesta = await fetch(`${API_URL}/lotes/empresa/${encodeURIComponent(razonSocial)}`);
      const datos: LoteCrudoBackend[] = await respuesta.json();

      const nuevos = datos.map((p) =>
        new LoteComida(
          p.id_lote,
          p.descripcion,
          p.categoria,
          Number(p.cantidad_en_stock),
          Number(p.cantidad_vendida || 0),
          'pzas',
          Number(p.precio_original),
          Number(p.precio_descuento),
          p.fecha_expiracion,
          p.fecha_disponible,
          p.imagen || IMAGEN_DEFAULT
        )
      );

      setProductos(nuevos);
    } catch (error) {
      console.log(error);
      setProductos([]);
    }
  }

  // Convierte imagen a base64.
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagenPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // Métricas.
  const totalLotes = productos.filter((p) => p.cantidad_en_stock > 0).length;

  const kgRescatados = productos.reduce(
    (acc, curr) => acc + curr.cantidad_vendida * 1.5,
    0
  );

  const ingresosProyectados = productos.reduce(
    (acc, curr) => acc + curr.precio_descuento * curr.cantidad_vendida,
    0
  );

  const totalVendidos = productos.reduce(
    (acc, curr) => acc + curr.cantidad_vendida,
    0
  );

  // Filtra productos.
  const productosFiltrados = productos.filter((p) => {
    let cumpleFiltroBoton = true;

    if (filtroTabla === 'Disponibles') {
      cumpleFiltroBoton = p.cantidad_en_stock > 0;
    }

    if (filtroTabla === 'Vendidos') {
      cumpleFiltroBoton = p.cantidad_vendida > 0 || p.estado === 'Agotado';
    }

    const texto = busqueda.toLowerCase();

    const cumpleBusqueda =
      p.descripcion.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto);

    return cumpleFiltroBoton && cumpleBusqueda;
  });

  // Guarda configuración de empresa.
  const handleGuardarConfiguracion = async () => {
    if (!formConfig.nombre_empresa || !formConfig.direccion || !formConfig.horario_de_atencion) {
      setAlertaModal({
        visible: true,
        mensaje: 'Completa nombre, ubicación y horario.',
        tipo: 'error'
      });
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/empresas/${encodeURIComponent(razonSocial)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formConfig)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setAlertaModal({
          visible: true,
          mensaje: datos.mensaje || 'No se pudo actualizar la empresa.',
          tipo: 'error'
        });
        return;
      }

      setNombreVisible(formConfig.nombre_empresa);
      setDireccionVisible(formConfig.direccion);
      setHorarioVisible(formConfig.horario_de_atencion);
      setEditandoConfig(false);

      const sesion = JSON.parse(localStorage.getItem('sesion_linkzero') || 'null');

      if (sesion) {
        localStorage.setItem('sesion_linkzero', JSON.stringify({
          ...sesion,
          nombre: formConfig.nombre_empresa,
          direccion: formConfig.direccion
        }));
      }

      setAlertaModal({
        visible: true,
        mensaje: 'Configuración actualizada.',
        tipo: 'exito'
      });
    } catch (error) {
      console.log(error);

      setAlertaModal({
        visible: true,
        mensaje: 'Error de conexión con el servidor.',
        tipo: 'error'
      });
    }
  };

  // Agrega nuevo lote.
  const handleAddItem = async () => {
    const {
      descripcion,
      categoria,
      cantidad,
      precioOriginal,
      precioDescuento,
      fechaExpiracion
    } = formLote;

    if (!descripcion || !cantidad || !precioOriginal || !precioDescuento || !fechaExpiracion) {
      setAlertaModal({
        visible: true,
        mensaje: 'Llena todos los campos obligatorios.',
        tipo: 'error'
      });
      return;
    }

    if (Number(cantidad) <= 0 || Number(precioOriginal) <= 0 || Number(precioDescuento) < 0) {
      setAlertaModal({
        visible: true,
        mensaje: 'El stock y los precios deben ser válidos.',
        tipo: 'error'
      });
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/lotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razon_social_empresa: razonSocial,
          descripcion,
          categoria,
          cantidad_en_stock: Number(cantidad),
          precio_original: Number(precioOriginal),
          precio_descuento: Number(precioDescuento),
          fecha_expiracion: fechaExpiracion,
          fecha_disponible: new Date().toISOString().split('T')[0],
          solo_donacion: false,
          imagen: imagenPreview || IMAGEN_DEFAULT
        })
      });

      if (!respuesta.ok) {
        setAlertaModal({
          visible: true,
          mensaje: 'No se pudo guardar el lote.',
          tipo: 'error'
        });
        return;
      }

      await cargarProductos();

      setIsAdding(false);
      setImagenPreview('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setFormLote({
        descripcion: '',
        categoria: 'Panadería',
        cantidad: '',
        precioOriginal: '',
        precioDescuento: '',
        fechaExpiracion: ''
      });

      setAlertaModal({
        visible: true,
        mensaje: 'Lote agregado con éxito.',
        tipo: 'exito'
      });
    } catch (error) {
      console.log(error);

      setAlertaModal({
        visible: true,
        mensaje: 'Error de conexión con el servidor.',
        tipo: 'error'
      });
    }
  };

  // Marca lote como vendido manualmente.
  const handleMarcarVendido = async (id: number) => {
    try {
      await fetch(`${API_URL}/lotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Vendido' })
      });

      await cargarProductos();

      setAlertaModal({
        visible: true,
        mensaje: 'Lote marcado como vendido.',
        tipo: 'exito'
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Elimina lote.
  const handleEliminar = async (id: number) => {
    try {
      await fetch(`${API_URL}/lotes/${id}`, { method: 'DELETE' });

      await cargarProductos();

      setAlertaModal({
        visible: true,
        mensaje: 'Lote eliminado.',
        tipo: 'exito'
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Color por categoría.
  const getColorCategoria = (cat: string) => {
    switch (cat) {
      case 'Panadería': return 'bg-yellow-100 text-yellow-700';
      case 'Lácteos': return 'bg-blue-100 text-blue-700';
      case 'Verduras': return 'bg-green-100 text-green-700';
      case 'Preparada': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Color del estado del lote.
  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'Vendido': return 'bg-purple-50 text-purple-600';
      case 'Disponible': return 'bg-green-50 text-green-600';
      case 'Agotado': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] text-[#1A103C] font-sans">
      {/* Menú lateral. */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[#1A103C] text-[#00E676] flex items-center justify-center font-black">
              L
            </div>
            <h1 className="font-extrabold text-xl">Link-Zero</h1>
          </div>

          <p className="text-xs text-gray-300 font-bold uppercase mb-4">Navegación</p>

          <nav className="space-y-2">
            {['Inicio', 'Inventario', 'Analíticas', 'Configuración'].map((vista) => (
              <button
                key={vista}
                onClick={() => setVistaActual(vista)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm ${vistaActual === vista ? 'bg-[#1A103C] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {vista}
              </button>
            ))}
          </nav>

          <div className="bg-emerald-50 mt-10 p-4 rounded-2xl">
            <p className="text-xs text-gray-500 font-bold">Rescate histórico</p>
            <p className="text-sm font-extrabold">
              Total: <span className="text-emerald-500">{kgRescatados} kg salvados</span>
            </p>
          </div>
        </div>

        {/* Datos inferiores de empresa. */}
        <div className="border-t border-gray-100 pt-5">
          <p className="font-extrabold text-sm truncate">{nombreVisible}</p>
          <p className="text-xs text-gray-400 truncate">{razonSocial}</p>
          <p className="text-xs text-gray-400 truncate">{direccionVisible}</p>

          <button
            onClick={onCerrarSesion}
            className="mt-4 w-full bg-red-50 text-red-600 py-2 rounded-xl text-sm font-bold hover:bg-red-100"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal. */}
      <main className="flex-1 overflow-x-hidden">
        {/* Encabezado. */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">{vistaActual}</h2>
            <p className="text-gray-400 text-sm font-bold uppercase">{nombreVisible}</p>
            <p className="text-gray-400 text-xs">{direccionVisible}</p>
          </div>

          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por producto o categoría..."
            className="w-80 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none text-sm font-medium"
          />
        </header>

        <section className="p-8">
          {/* Alertas. */}
          {alertaModal.visible && (
            <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${alertaModal.tipo === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {alertaModal.mensaje}
            </div>
          )}

          {/* Configuración. */}
          {vistaActual === 'Configuración' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black mb-1">Configuración del negocio</h3>
                  <p className="text-gray-400 text-sm">
                    Edita el nombre visible, ubicación y horario de la empresa.
                  </p>
                </div>

                <button
                  onClick={() => setEditandoConfig(!editandoConfig)}
                  className="bg-[#1A103C] text-white px-5 py-3 rounded-xl text-sm font-black"
                >
                  {editandoConfig ? 'Cancelar edición' : 'Editar'}
                </button>
              </div>

              {!editandoConfig ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Nombre visible</p>
                    <p className="font-black">{nombreVisible}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Razón social</p>
                    <p className="font-black">{razonSocial}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Ubicación</p>
                    <p className="font-black">{direccionVisible}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Horario</p>
                    <p className="font-black">{horarioVisible}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 font-bold uppercase mb-1">
                      Nombre visible
                    </label>
                    <input
                      value={formConfig.nombre_empresa}
                      onChange={(e) => setFormConfig({ ...formConfig, nombre_empresa: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 font-bold uppercase mb-1">
                      Ubicación
                    </label>
                    <input
                      value={formConfig.direccion}
                      onChange={(e) => setFormConfig({ ...formConfig, direccion: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 font-bold uppercase mb-1">
                      Horario
                    </label>
                    <input
                      value={formConfig.horario_de_atencion}
                      onChange={(e) => setFormConfig({ ...formConfig, horario_de_atencion: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleGuardarConfiguracion}
                    className="w-full bg-[#00E676] text-[#1A103C] py-4 rounded-2xl font-black"
                  >
                    Guardar cambios
                  </button>
                </div>
              )}

              <button
                onClick={onCerrarSesion}
                className="mt-6 w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black hover:bg-red-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          {/* Métricas. */}
          {vistaActual !== 'Inventario' && vistaActual !== 'Configuración' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm font-bold">Lotes activos</p>
                <h3 className="text-4xl font-black mt-2">{totalLotes}</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm font-bold">Piezas vendidas</p>
                <h3 className="text-4xl font-black mt-2">{totalVendidos}</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm font-bold">Kg rescatados</p>
                <h3 className="text-4xl font-black mt-2">{kgRescatados}</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm font-bold">Ingresos generados</p>
                <h3 className="text-4xl font-black mt-2">${ingresosProyectados}</h3>
              </div>
            </div>
          )}

          {/* Inventario. */}
          {vistaActual !== 'Configuración' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black">Inventario Central</h3>
                  <p className="text-sm text-gray-400">{productosFiltrados.length} resultados encontrados</p>
                </div>

                <div className="flex gap-2">
                  {['Todos', 'Disponibles', 'Vendidos'].map((filtro) => (
                    <button
                      key={filtro}
                      onClick={() => setFiltroTabla(filtro)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border ${filtroTabla === filtro ? 'bg-[#1A103C] text-white border-[#1A103C]' : 'bg-white text-gray-500 border-gray-100'}`}
                    >
                      {filtro}
                    </button>
                  ))}

                  <button
                    onClick={() => setIsAdding(true)}
                    className="bg-[#00E676] text-[#1A103C] px-5 py-2 rounded-xl text-sm font-black"
                  >
                    + Nuevo Lote
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                  <thead>
                    <tr className="text-xs uppercase text-gray-400 border-b border-gray-50">
                      <th className="p-5">Producto</th>
                      <th className="p-5">Categoría</th>
                      <th className="p-5">Stock</th>
                      <th className="p-5">Vendidos</th>
                      <th className="p-5">Precios</th>
                      <th className="p-5">Estado</th>
                      <th className="p-5">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-gray-400 font-bold">
                          No se encontraron productos.
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map((producto) => (
                        <tr key={producto.id_lote} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={producto.imagen}
                                alt={producto.descripcion}
                                className="w-12 h-12 rounded-xl object-cover"
                              />

                              <div>
                                <p className="font-black">{producto.descripcion}</p>
                                <p className="text-xs text-gray-400">ID {producto.id_lote}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getColorCategoria(producto.categoria)}`}>
                              {producto.categoria}
                            </span>
                          </td>

                          <td className="p-5">
                            <p className="font-black">{producto.cantidad_en_stock}</p>
                            <p className="text-xs text-gray-400">{producto.unidad_medida} restantes</p>
                          </td>

                          <td className="p-5">
                            <p className="font-black text-purple-600">{producto.cantidad_vendida}</p>
                            <p className="text-xs text-gray-400">{producto.unidad_medida} vendidas</p>
                          </td>

                          <td className="p-5">
                            <p className="font-black text-emerald-500">${producto.precio_descuento}</p>
                            <p className="text-xs text-gray-400 line-through">${producto.precio_original}</p>
                          </td>

                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getColorEstado(producto.estado)}`}>
                              {producto.estado}
                            </span>
                          </td>

                          <td className="p-5">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMarcarVendido(producto.id_lote)}
                                className="bg-green-50 text-green-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-green-100"
                              >
                                Vendido
                              </button>

                              <button
                                onClick={() => handleEliminar(producto.id_lote)}
                                className="bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-100"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modal para crear lote. */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black">Nuevo Lote</h3>

              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-red-500 font-black"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Nombre del producto</label>
                <input
                  value={formLote.descripcion}
                  onChange={(e) => setFormLote({ ...formLote, descripcion: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                  placeholder="Ej. Hotdog"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Categoría</label>
                <select
                  value={formLote.categoria}
                  onChange={(e) => setFormLote({ ...formLote, categoria: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                >
                  <option value="Panadería">Panadería</option>
                  <option value="Lácteos">Lácteos</option>
                  <option value="Preparada">Preparada</option>
                  <option value="Verduras">Verduras</option>
                  <option value="Buffet">Buffet</option>
                  <option value="Sushi">Sushi</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Stock</label>
                  <input
                    type="number"
                    value={formLote.cantidad}
                    onChange={(e) => setFormLote({ ...formLote, cantidad: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Precio original</label>
                  <input
                    type="number"
                    value={formLote.precioOriginal}
                    onChange={(e) => setFormLote({ ...formLote, precioOriginal: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Precio descuento</label>
                  <input
                    type="number"
                    value={formLote.precioDescuento}
                    onChange={(e) => setFormLote({ ...formLote, precioDescuento: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Fecha de expiración</label>
                <input
                  type="date"
                  value={formLote.fechaExpiracion}
                  onChange={(e) => setFormLote({ ...formLote, fechaExpiracion: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Imagen</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none"
                />

                {imagenPreview && (
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="mt-3 w-full h-40 object-cover rounded-2xl"
                  />
                )}
              </div>

              <button
                onClick={handleAddItem}
                className="w-full bg-[#00E676] text-[#1A103C] py-4 rounded-2xl font-black hover:bg-[#00c965]"
              >
                Guardar lote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}