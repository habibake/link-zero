import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { LoteAlimento } from './models/LoteAlimento';

const App: React.FC = () => {
  // Estado para almacenar TODOS los lotes que vienen del servidor
  const [lotesDisponibles, setLotesDisponibles] = useState<LoteAlimento[]>([]);
  // Estado para manejar el filtro activo
  const [filtroActivo, setFiltroActivo] = useState<string>('Todos');

  // Ejecutamos la petición HTTP (Fetch) al cargar la aplicación
  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        // Conexión real a tu Back-End en Node.js/Express
        const respuesta = await fetch('http://localhost:3000/api/lotes');
        
        if (respuesta.ok) {
          const datosBD = await respuesta.json();
          
          // Instanciamos los objetos reales aplicando la POO
          const lotesReales = datosBD.map((item: any) => 
            new LoteAlimento(
              item.id, 
              item.establecimientoId || 'est-generico', 
              item.descripcion, 
              item.cantidadStock || item.cantidadDisponible || 1, // Adaptación entre Back y Front
              item.precioOriginal || (item.precioDescuento * 2), // Simulamos precio original si no viene
              item.precioDescuento
            )
          );
          setLotesDisponibles(lotesReales);
        } else {
          console.warn('El servidor respondió, pero sin datos válidos.');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('Asegúrate de que tu Back-End esté corriendo en el puerto 3000.');
      }
    };

    fetchCatalogo();
  }, []); // El arreglo vacío indica que solo se ejecuta una vez al inicio

  // Función para cambiar el filtro (se la pasaremos al Sidebar)
  const cambiarFiltro = (nuevoFiltro: string) => {
    setFiltroActivo(nuevoFiltro);
  };

  // Filtramos la lista en tiempo real según lo seleccionado en el Sidebar
  const lotesFiltrados = lotesDisponibles.filter(lote => {
    if (filtroActivo === 'Todos') return true;
    // Filtro simple basado en palabras clave de la descripción
    return lote.descripcion.toLowerCase().includes(filtroActivo.toLowerCase());
  });

  return (
  <div className="app-container">
    <Header />
    <Main lotes={lotesFiltrados} />
    <Sidebar onFilterChange={cambiarFiltro} filtroActual={filtroActivo} />
  </div>
);
};
export default App;