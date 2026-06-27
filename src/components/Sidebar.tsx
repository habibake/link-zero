import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onFilterChange: (filtro: string) => void;
  filtroActual: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, filtroActual }) => {
  const opciones = [
    { nombre: 'Todos', icono: '🏠' },
    { nombre: 'Panadería', icono: '🥐' },
    { nombre: 'Pastelería', icono: '🍰' },
  ];

  return (
    <nav className="sidebar-container">
      {opciones.map((opcion) => (
        <button
          key={opcion.nombre}
          onClick={() => onFilterChange(opcion.nombre)}
          className={`sidebar-btn ${filtroActual === opcion.nombre ? 'active' : ''}`}
        >
          <span className="sidebar-icon">{opcion.icono}</span>
          <span className="sidebar-text">{opcion.nombre}</span>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;