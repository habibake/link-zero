import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside style={{ width: '250px', backgroundColor: '#ecf0f1', padding: '20px', borderRight: '1px solid #bdc3c7' }}>
      <h3>Filtros de Búsqueda</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}><label><input type type="checkbox" /> Restaurantes</label></li>
        <li style={{ marginBottom: '10px' }}><label><input type="checkbox" /> Hoteles</label></li>
        <li style={{ marginBottom: '10px' }}><label><input type="checkbox" /> Panaderías</label></li>
      </ul>
      <button style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>
        Buscar cerca de mí
      </button>
    </aside>
  );
}

export default Sidebar;