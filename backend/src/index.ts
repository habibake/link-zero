import express from 'express';

const app = express();
const PORT = 3000;


app.use(express.json());


app.get('/', (req, res) => {
  res.send('¡Servidor de Link-Zero corriendo!');
});


app.listen(PORT, () => {
  console.log(`Servidor jalando en el puerto http://localhost:${PORT}`);
});