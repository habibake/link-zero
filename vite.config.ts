import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Plugin necesario para que Vite trabaje con React.
  plugins: [react()],

  // Configuración del servidor de desarrollo.
  server: {
    // Permite abrir la app desde localhost y también desde Dev Tunnels.
    host: '0.0.0.0',

    // Puerto del frontend.
    port: 5173,

    // Permite dominios de Dev Tunnels.
    allowedHosts: ['.devtunnels.ms'],

    // Proxy para que el frontend use /api y Vite mande la petición al backend.
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
