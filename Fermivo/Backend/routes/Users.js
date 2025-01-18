const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

// Register (înregistrare utilizator nou)
router.post("/register", async (req, res) => {
  try {
    const {
      nume,
      prenume,
      denumireaFirmei,
      codUnicDeIdentificare,
      adresa,
      telefon,
      email,
      parola,
    } = req.body;

    // Verificăm dacă utilizatorul există deja
    const utilizatorExistent = await User.findOne({ email });
    if (utilizatorExistent) {
      return res.status(400).json({ message: "Email-ul este deja utilizat." });
    }

    // Hash parola
    const hashedPassword = await bcrypt.hash(parola, 10);

    // Creăm un utilizator nou
    const utilizatorNou = new User({
      nume,
      prenume,
      denumireaFirmei,
      codUnicDeIdentificare,
      adresa,
      telefon,
      email,
      parola: hashedPassword,
    });

    await utilizatorNou.save();
    res
      .status(201)
      .json({ message: "Utilizator creat cu succes!", utilizator: utilizatorNou });
  } catch (error) {
    res.status(500).json({ message: "Eroare la crearea utilizatorului.", error });
  }
});

// Login (autentificare utilizator)
router.post("/login", async (req, res) => {
  try {
    const { email, parola } = req.body;

    // Verificăm dacă utilizatorul există
    const utilizator = await User.findOne({ email });
    if (!utilizator) {
      return res.status(400).json({ message: "Email sau parolă incorectă." });
    }

    // Verificăm parola
    const parolaCorecta = await bcrypt.compare(parola, utilizator.parola);
    if (!parolaCorecta) {
      return res.status(400).json({ message: "Email sau parolă incorectă." });
    }

    // Creăm un token JWT
    const token = jwt.sign(
      { id: utilizator._id, email: utilizator.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Autentificare reușită!",
      token,
      utilizator: { id: utilizator._id, email: utilizator.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Eroare la autentificare.", error });
  }
});

// Ștergere toate înregistrările din colecția "users"
router.delete("/delete-all", async (req, res) => {
  try {
    await User.deleteMany({}); // Șterge toate documentele din colecția "users"
    res.status(200).json({ message: "Toți utilizatorii au fost șterși cu succes." });
  } catch (error) {
    res.status(500).json({ message: "Eroare la ștergerea utilizatorilor.", error });
  }
});


module.exports = router;
