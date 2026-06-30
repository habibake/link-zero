import express from "express";
import cors from "cors";
import empresaRoutes from "./routes/empresa.routes";

import "./config/database";

import lotesRoutes from "./routes/lotes.routes";
import reservasRoutes from "./routes/reservas.routes";
import clienteRoutes from "./routes/cliente.routes";
import pagoRoutes from "./routes/pago.routes";
import reciboRoutes from "./routes/recibo.routes";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Rutas
app.use("/api/lotes", lotesRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/recibos", reciboRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.send("🚀 Link-Zero API funcionando");
});

// 0.0.0.0 = escucha en TODAS las interfaces de red, no solo localhost
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});