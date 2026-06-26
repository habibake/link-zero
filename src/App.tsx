import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { LoteAlimento } from './models/LoteAlimento';

const App: React.FC = () => {
  // Manejo del estado: Un arreglo que contendrá objetos reales de nuestra clase
  const [lotesDisponibles, setLotesDisponibles] = useState<LoteAlimento[]>([]);

  useEffect(() => {
    // Simularemos la Fetch API para traer el inventario en riesgo de desecho
    const fetchCatalogo = async () => {
      // En el futuro, aquí haremos un fetch real al Backend de Node.js
      // Por ahora, instanciamos objetos reales usando nuestra clase POO
      const lote1 = new LoteAlimento('1', 'est-101', 'Paquete de panadería surtido', 5, 120, 50);
      const lote2 = new LoteAlimento('2', 'est-102', 'Desayuno buffet (Hotel)', 3, 300, 120);
      const lote3 = new LoteAlimento('3', 'est-103', 'Comida del día (Cafetería)', 2, 150, 60);

      setLotesDisponibles([lote1, lote2, lote3]);
    };

    fetchCatalogo();
  }, []);

  return (
    // Estructura layout principal (Flexbox para distribuir los espacios)
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        {/* Pasamos los objetos a través de Props (Requisito de la rúbrica) */}
        <Main lotes={lotesDisponibles} />
      </div>
    </div>
  );
};

export default App;