const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nume: {
      type: String,
      required: [true, "Numele este obligatoriu."],
      minlength: [2, "Numele trebuie să conțină cel puțin 2 caractere."],
      maxlength: [50, "Numele nu poate depăși 50 de caractere."],
    },
    prenume: {
      type: String,
      required: [true, "Prenumele este obligatoriu."],
      minlength: [2, "Prenumele trebuie să conțină cel puțin 2 caractere."],
      maxlength: [50, "Prenumele nu poate depăși 50 de caractere."],
    },
    denumireaFirmei: {
      type: String,
      required: [true, "Denumirea firmei este obligatorie."],
      unique: true,
    },
    codUnicDeIdentificare: {
      type: String,
      required: [true, "Codul unic de identificare este obligatoriu."],
      unique: true,
      minlength: [7, "Codul unic trebuie să conțină cel puțin 7 caractere."],
      maxlength: [20, "Codul unic nu poate depăși 20 de caractere."],
    },
    adresa: {
      type: String,
      required: [true, "Adresa este obligatorie."],
      minlength: [10, "Adresa trebuie să conțină cel puțin 10 caractere."],
    },
    telefon: {
      type: String,
      required: [true, "Telefonul este obligatoriu."],
      match: [/^\d{10}$/, "Telefonul trebuie să conțină exact 10 cifre."],
    },
    email: {
      type: String,
      required: [true, "Email-ul este obligatoriu."],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Introduceți un email valid.",
      ],
    },
    parola: {
      type: String,
      required: [true, "Parola este obligatorie."],
      minlength: [8, "Parola trebuie să conțină cel puțin 8 caractere."],
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"], // doar aceste valori sunt acceptate
      default: "buyer",
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "/uploads/default_profile.png", // <- poza default (pui acolo imaginea generică)
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // cine a dat review
        rating: { type: Number, required: true },
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
