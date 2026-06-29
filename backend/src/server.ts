import express from 'express';
import cors from 'cors';
import lotesRoutes from './routes/lotes.routes';
import reservasRoutes from './routes/reservas.routes';

const app = express();
const PORT = 3001; // distinto al 5173 de Vite, para no chocar

app.use(cors()); // permite que el frontend (otro puerto) le pegue a esta API
app.use(express.json()); // permite leer JSON en el body de las peticiones POST

// Rutas
app.use('/api/lotes', lotesRoutes);
app.use('/api/reservas', reservasRoutes);

// Ruta de salud, para confirmar rápido que el server está vivo
app.get('/', (req, res) => {
    res.send('Link-Zero API funcionando 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});