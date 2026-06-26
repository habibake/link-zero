import React from 'react';
import { LoteAlimento } from '../models/LoteAlimento';

// Definimos la interfaz de los Props que recibe el componente
interface MainProps {
  lotes: LoteAlimento[];
}

const Main: React.FC<MainProps> = ({ lotes }) => {
  return (
    <main style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
      <h2>Explorar Alimentos (Excedentes con Descuento)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {lotes.map((lote) => (
          <div key={lote.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{lote.descripcion}</h3>
            <p style={{ margin: '5px 0', color: '#7f8c8d', textDecoration: 'line-through' }}>Normal: ${lote.precioOriginal} MXN</p>
            <p style={{ margin: '5px 0', color: '#27ae60', fontSize: '18px', fontWeight: 'bold' }}>Hoy: ${lote.precioDescuento} MXN</p>
            
            {/* Aquí usamos el método de la clase POO */}
            <p style={{ color: '#e67e22', fontWeight: 'bold' }}>¡Ahorras un {lote.calcularPorcentajeAhorro()}%!</p>
            
            <p style={{ fontSize: '12px', color: lote.estado === 'Disponible' ? 'green' : 'red' }}>
              Estado: {lote.estado} ({lote.cantidadDisponible} disponibles)
            </p>
            
            <button style={{ width: '100%', marginTop: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
              Reservar Comida
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Main;