import express, { type Request, type Response } from 'express';
const app = express();
const PORT = 3000;

// Middleware para que Express entienda JSON
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('¡Mi backend en TypeScript ya funciona!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});