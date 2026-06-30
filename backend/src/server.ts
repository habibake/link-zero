import express from "express";
import cors from "cors";

import "./config/database";

import lotesRoutes from "./routes/lotes.routes";
import reservasRoutes from "./routes/reservas.routes";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/lotes", lotesRoutes);
app.use("/api/reservas", reservasRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.send("🚀 Link-Zero API funcionando");
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});