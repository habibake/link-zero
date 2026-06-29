import express, { type Request, type Response } from 'express';
import usuarioRoutes from './routes/usuarioRoutes'; 

const app = express();
const PORT = 3000;

// Middleware para que Express entienda JSON
app.use(express.json());

// Le decimos al servidor que use esa ruta
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('¡Mi backend en TypeScript ya funciona!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});