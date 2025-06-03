const express = require("express");
const router = express.Router();
const Anunt = require("../models/Anunt");
const verifyToken = require("../middlewares/verifyToken");

// ✅ POST /api/anunturi - Adaugă anunț
router.post("/", verifyToken, async (req, res) => {
  try {
    const { produs, pret_lei_tona,moneda, zona, descriere } = req.body;

    if (!produs || !pret_lei_tona || !zona || !descriere) {
      return res.status(400).json({ message: "Toate câmpurile sunt obligatorii." });
    }

    const anuntNou = new Anunt({
      produs,
      pret_lei_tona,
      moneda: moneda || "lei", // default la lei
      zona,
      descriere,
      userId: req.user._id,
    });

    const savedAd = await anuntNou.save();
    res.status(201).json({ success: true, ad: savedAd });
  } catch (error) {
    console.error("❌ Eroare la salvarea anunțului:", error);
    res.status(500).json({ success: false, error: "Eroare server" });
  }
});

// ✅ GET /api/anunturi - Listare toate anunturi
router.get("/", async (req, res) => {
  try {
    const anunturi = await Anunt.find().sort({ createdAt: -1 });
    res.json({ success: true, anunturi });
  } catch (error) {
    res.status(500).json({ success: false, error: "Eroare la listare anunțuri" });
  }
});

// ✅ GET /api/anunturi/user/:id - Anunturi unui user
router.get("/user/:id", async (req, res) => {
  try {
    const anunturi = await Anunt.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, anunturi });
  } catch (error) {
    res.status(500).json({ success: false, error: "Eroare la fetch user anunțuri" });
  }
});

// ✅ GET /api/anunturi/:id - Un singur anunt (pentru editare/detalii)
router.get("/:id", async (req, res) => {
  try {
    const anunt = await Anunt.findById(req.params.id);
    if (!anunt) return res.status(404).json({ message: "Anunțul nu a fost găsit." });
    res.json({ success: true, anunt });
  } catch (error) {
    res.status(500).json({ success: false, message: "Eroare server" });
  }
});

// ✅ PUT /api/anunturi/:id - Update anunt
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { produs, pret_lei_tona, moneda, zona, descriere } = req.body;

    const updatedAnunt = await Anunt.findByIdAndUpdate(
      req.params.id,
      { produs, pret_lei_tona, moneda, zona, descriere },
      { new: true }
    );

    if (!updatedAnunt) {
      return res.status(404).json({ success: false, message: "Anunțul nu a fost găsit." });
    }

    res.json({ success: true, anunt: updatedAnunt });
  } catch (error) {
    res.status(500).json({ success: false, message: "Eroare la actualizare." });
  }
});

// ✅ DELETE /api/anunturi/:id - Șterge anunț
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const anunt = await Anunt.findById(req.params.id);

    if (!anunt) {
      return res.status(404).json({ success: false, message: "Anunțul nu a fost găsit." });
    }

    // opțional: verificare userId
    if (anunt.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Nu ai dreptul să ștergi acest anunț." });
    }

    await anunt.deleteOne();
    res.json({ success: true, message: "Anunț șters cu succes" });
  } catch (error) {
    console.error("❌ Eroare la ștergere anunț:", error);
    res.status(500).json({ success: false, message: "Eroare server la ștergere" });
  }
});


module.exports = router;
