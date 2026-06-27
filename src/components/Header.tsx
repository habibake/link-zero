import React from 'react';
import './Header.css'; // Importamos el estilo aparte

const Header: React.FC = () => {
  return (
    <header className="header-container">
      <div className="header-location">
        <span className="location-city">Cancún &gt;</span>
        <h1 className="location-title">Cerca tuyo</h1>
      </div>
      <div className="header-actions">
        <button className="icon-btn" aria-label="Notificaciones">🔔</button>
        <button className="icon-btn" aria-label="Perfil">👤</button>
      </div>
    </header>
  );
};

export default Header;