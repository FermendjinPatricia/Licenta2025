const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexiune la MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conexiune reușită la MongoDB"))
  .catch((err) => console.log("Eroare la conectarea cu MongoDB:", err));

// Importăm și folosim rutele pentru utilizatori
const userRoutes = require("./routes/Users");
app.use("/api/users", userRoutes);

// Endpoint de test
app.get("/", (req, res) => {
  res.send("Backend funcționează corect!");
});

// Pornim serverul
app.listen(PORT, () => console.log(`Serverul rulează pe portul ${PORT}`));
