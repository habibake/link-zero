import React from 'react';
import './Main.css';
import { LoteAlimento } from '../models/LoteAlimento';

interface MainProps {
  lotes: LoteAlimento[];
}

const Main: React.FC<MainProps> = ({ lotes }) => {
  const categorias = [
    { nombre: 'Panadería', icono: '🥐' },
    { nombre: 'Pastelería', icono: '🍰' },
    { nombre: 'Postres', icono: '🍮' },
    { nombre: 'Despensa', icono: '🥫' }
  ];

  return (
    <main className="main-content">
      
      {/* Categorías (Scroll Horizontal) */}
      <section className="categories-section">
        {categorias.map((cat) => (
          <div key={cat.nombre} className="category-item">
            <div className="category-icon-box">
              <span>{cat.icono}</span>
            </div>
            <span className="category-name">{cat.nombre}</span>
          </div>
        ))}
      </section>

      {/* Paquetes */}
      <section className="packages-section">
        <div className="packages-header">
          <h2>Paquetes disponibles</h2>
          <button className="view-all-btn">Ver todos</button>
        </div>
        
        <div className="packages-grid">
          {lotes.length === 0 ? (
            <p className="loading-text">Cargando paquetes...</p>
          ) : (
            lotes.map((lote) => (
              <div key={lote.id} className="food-card">
                <div className="card-image">
                  <span className="card-placeholder">🛍️</span>
                  <span className="discount-badge">
                    ⚡ {Math.round(((lote.precioOriginal - lote.precioDescuento) / lote.precioOriginal) * 100)}% OFF
                  </span>
                </div>
                <div className="card-info">
                  <h3 className="food-title">{lote.descripcion}</h3>
                  <p className="food-stock">Quedan {lote.cantidadDisponible} disponibles</p>
                  <div className="food-pricing">
                    <span className="price-discount">${lote.precioDescuento}</span>
                    <span className="price-original">${lote.precioOriginal}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Main;