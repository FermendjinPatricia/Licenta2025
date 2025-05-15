<template>
  <div class="register-page">
    <img
      src="../assets/register.jpg"
      alt="Background"
      class="background-image"
    />
    <div class="register-container">
      <form class="register-form" @submit.prevent="handleRegister">
        <h1>Register</h1>

        <div class="row">
          <div class="input-group">
            <label for="nume">Nume:</label>
            <input type="text" id="nume" v-model="nume" required />
          </div>
          <div class="input-group">
            <label for="prenume">Prenume:</label>
            <input type="text" id="prenume" v-model="prenume" required />
          </div>
        </div>

        <div class="row">
          <div class="input-group">
            <label for="denumireaFirmei">Denumirea Firmei:</label>
            <input
              type="text"
              id="denumireaFirmei"
              v-model="denumireaFirmei"
              required
            />
          </div>
          <div class="input-group">
            <label for="codUnicDeIdentificare"
              >Cod unic de identificare (CUI):</label
            >
            <input
              type="text"
              id="codUnicDeIdentificare"
              v-model="codUnicDeIdentificare"
              @blur="validateCUI"
              required
            />
            <p v-if="cuiStatusMessage" :class="cuiStatusClass">
              {{ cuiStatusMessage }}
            </p>
          </div>
        </div>

        <div class="row">
          <div class="input-group">
            <label for="adresa">Adresa:</label>
            <input type="text" id="adresa" v-model="adresa" required />
          </div>
          <div class="input-group">
            <label for="telefon">Telefon:</label>
            <input type="tel" id="telefon" v-model="telefon" required />
          </div>
        </div>

        <div class="row">
          <div class="input-group">
            <label for="email">E-mail:</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="input-group">
            <label for="parola">Parola:</label>
            <input type="password" id="parola" v-model="parola" required />
          </div>
        </div>

        <div class="input-group">
          <label for="role">Alege tipul contului:</label>
          <select id="role" v-model="role" required>
            <option value="" disabled selected>Alege un rol...</option>
            <option value="buyer">Cumpărător</option>
            <option value="seller">Vânzător</option>
          </select>
        </div>

        <button type="submit" :disabled="isRegisterDisabled">
          {{ isSubmitting ? "Înregistrare…" : "Register" }}
        </button>

        <div class="register-link">
          <router-link to="/login"
            >Ai deja un cont? Conectează-te acum!</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: "RegisterPage",
  data() {
    return {
      nume: "",
      prenume: "",
      denumireaFirmei: "",
      codUnicDeIdentificare: "",
      adresa: "",
      telefon: "",
      email: "",
      parola: "",
      role: "",
      isSubmitting: false,
      cuiStatusMessage: "",
      cuiStatusValid: null, // null = necunoscut, true = ok, false = invalid
    };
  },
  computed: {
    cuiStatusClass() {
      if (this.cuiStatusValid === true) return "cui-valid";
      if (this.cuiStatusValid === false) return "cui-invalid";
      return "";
    },
    isRegisterDisabled() {
      return (
        !this.role ||
        this.isSubmitting ||
        this.cuiStatusValid !== true
      );
    },
  },
  methods: {
    async validateCUI() {
      if (!this.codUnicDeIdentificare) {
        this.cuiStatusMessage = "";
        this.cuiStatusValid = null;
        return;
      }

      try {
        const apiKey = "364a15bd43a7804f52065fe0c424518fb73acb08"; // 🔒 mută-l ulterior în backend
        const response = await axios.get(`https://infocui.ro/system/api/data`, {
          params: {
            key: apiKey,
            cui: this.codUnicDeIdentificare,
          },
        });

        console.log("✅ Răspuns Infocui:", response.data);

        if (response.data.status === 200) {
          this.cuiStatusMessage = "CUI valid!";
          this.cuiStatusValid = true;
        } else {
          this.cuiStatusMessage = "CUI invalid!";
          this.cuiStatusValid = false;
        }
      } catch (error) {
        console.error("❌ Eroare la validarea CUI:", error);
        this.cuiStatusMessage = "Eroare la validarea CUI!";
        this.cuiStatusValid = false;
      }
    },

    async handleRegister() {
      if (!this.role) {
        alert("Trebuie să alegi un rol.");
        return;
      }

      if (this.cuiStatusValid !== true) {
        alert("Codul unic de identificare (CUI) nu este valid.");
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await axios.post("/users/register", {
          nume: this.nume,
          prenume: this.prenume,
          denumireaFirmei: this.denumireaFirmei,
          codUnicDeIdentificare: this.codUnicDeIdentificare,
          adresa: this.adresa,
          telefon: this.telefon,
          email: this.email,
          parola: this.parola,
          role: this.role,
        });

        if (response.status === 201) {
          alert("Cont creat cu succes!");
          this.$router.push("/login");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Eroare la înregistrare.");
      }

      this.isSubmitting = false;
    },
  },
};
</script>


<style scoped>
.cui-valid {
  color: green;
  font-weight: bold;
  margin-top: 0.5rem;
}

.cui-invalid {
  color: red;
  font-weight: bold;
  margin-top: 0.5rem;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  z-index: -1;
}

.input-group select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #db8307;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;
  color: rgba(45, 26, 0, 0.944);
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: "Inria Sans", sans-serif;
}

.register-form {
  background: rgba(218, 172, 111, 0.85);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  text-align: center;
}

h1 {
  color: rgba(45, 26, 0, 0.944);
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
  width: 100%;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.row div {
  flex: 1;
}

label {
  display: block;
  color: rgba(45, 26, 0, 0.944);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #db8307;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: rgb(147, 83, 19);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #012f19;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
}

.register-link a {
  color: #613399;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-container {
    align-items: flex-start;
    padding-top: 8vh;
  }

  .register-form {
    width: 95%;
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  input {
    font-size: 1rem;
    padding: 0.6rem;
  }

  button {
    font-size: 1rem;
    padding: 0.8rem;
  }

  .row {
    flex-direction: column;
    gap: 0;
  }

  .row div {
    width: 100%;
  }
}
</style>
