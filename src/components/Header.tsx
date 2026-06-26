import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>Link-Zero</h1>
      <nav>
        <button style={{ background: 'none', border: 'none', color: 'white', marginRight: '15px', cursor: 'pointer' }}>Mi Perfil</button>
        <button style={{ backgroundColor: '#e74c3c', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Cerrar Sesión</button>
      </nav>
    </header>
  );
}

export default Header;