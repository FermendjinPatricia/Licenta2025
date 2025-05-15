<template>
  <div class="adauga-anunt-page">
    <img src="../assets/login.jpg" alt="Background" class="background-image" />

    <div class="anunt-wrapper">
      <!-- Formularul tău -->
      <div class="anunt-form-box">
        <h2>Adaugă un Anunț Nou 🚜</h2>
        <form @submit.prevent="submitAnunt">
          <!-- Select produs -->
          <div class="input-group">
            <label for="produs">Produs:</label>
            <select
              id="produs"
              v-model="produs"
              @change="fetchScraperData"
              required
            >
              <option disabled value="">Selectează un produs...</option>
              <option v-for="prod in produse" :key="prod" :value="prod">
                {{ prod }}
              </option>
            </select>
          </div>

          <!-- restul campurilor -->
          <div class="input-group">
            <label for="pret">Preț (lei/tonă):</label>
            <input type="number" id="pret" v-model="pret_lei_tona" required />
          </div>

          <div class="input-group">
            <label for="zona">Zona(Oraș):</label>
            <input type="text" id="zona" v-model="zona" required />
          </div>

          <div class="input-group">
            <label for="descriere">Descriere:</label>
            <textarea
              id="descriere"
              v-model="descriere"
              rows="4"
              maxlength="500"
              placeholder="Scrie câteva detalii despre produs..."
              required
            ></textarea>
          </div>

          <button type="submit" class="adauga-button">Publică Anunțul</button>
        </form>
      </div>

      <!-- Tabelul de prețuri -->
      <div v-if="filteredPrices.length" class="preturi-preview">
        <h3>Prețuri curente pentru {{ produs }}</h3>
        <table>
          <thead>
            <tr>
              <th>Zona</th>
              <th>Preț (lei/tonă)</th>
              <th>Variație %</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredPrices" :key="index">
              <td>{{ item.zona }}</td>
              <td>{{ item.pret_lei_tona }}</td>
              <td
                :class="{
                  positive: item.variatie_procente > 0,
                  negative: item.variatie_procente < 0,
                }"
              >
                {{
                  item.variatie_procente !== null
                    ? item.variatie_procente + "%"
                    : "N/A"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: "AdaugaAnunt",
  data() {
    return {
      produs: "",
      pret_lei_tona: "",
      zona: "",
      descriere: "",
      produse: [
        "Grau Panificatie",
        "Grau Furajer",
        "Floarea Soarelui",
        "Rapita",
        "Porumb",
        "Orz",
        "Orz Furajer",
      ],
      filteredPrices: [],
      scraperData: [],
    };
  },
  methods: {
    async fetchScraperData() {
      if (!this.produs) return;

      try {
        const response = await axios.get("http://localhost:5000/scrape/brm");
        if (response.data.success) {
          this.scraperData = response.data;
          this.filterPrices();
        }
      } catch (error) {
        console.error("Eroare la preluarea prețurilor:", error);
      }
    },
    filterPrices() {
      const mapping = {
        "Grau Panificatie": "grau_panificatie",
        "Grau Furajer": "grau_furajer",
        "Floarea Soarelui": "floarea_soarelui",
        Rapita: "rapita",
        Porumb: "porumb",
        Orz: "orz",
        "Orz Furajer": "orz_furajer",
      };

      const key = mapping[this.produs];
      this.filteredPrices = this.scraperData[key] || [];
    },
    async submitAnunt() {
      const userString = localStorage.getItem("user");
      console.log("📦 LocalStorage USER:", userString);

      const user = userString ? JSON.parse(userString) : null;
      console.log("👤 Parsed user:", user);

      //const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        alert("Eroare: utilizatorul nu este autentificat.");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          "/anunturi",
          {
            produs: this.produs,
            pret_lei_tona: parseFloat(this.pret_lei_tona),
            zona: this.zona,
            descriere: this.descriere,
            userId: user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          alert("Anunț adăugat cu succes!");
          this.$router.push("/home");
        }
      } catch (error) {
        alert(
          error.response?.data?.message || "Eroare la adăugarea anunțului."
        );
      }
    },
  },
};
</script>

<style scoped>
.adauga-anunt-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inria Sans", sans-serif;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.anunt-form-box {
  background: rgba(197, 241, 186, 0.85);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
  backdrop-filter: blur(5px);
}

h2 {
  color: #1b5e20;
  text-align: center;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #db8307;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #1b5e20;
}

label {
  display: block;
  color: #1b5e20;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #db8307;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #1b5e20;
}

textarea {
  resize: none;
}

.adauga-button {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #1b5e20, #2e7d32);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.adauga-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
}

.adauga-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.adauga-button:hover {
  background-color: #093b12;
}

.anunt-wrapper {
  display: flex;
  gap: 2rem;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;
}

.anunt-form-box {
  background: rgba(197, 241, 186, 0.85);
  padding: 2rem;
  border-radius: 20px;
  flex: 1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.preturi-preview {
  background: rgba(197, 241, 186, 0.85);
  padding: 1rem;
  border-radius: 20px;
  flex: 1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-height: fit-content;
}

.preturi-preview table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.preturi-preview th,
.preturi-preview td {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: center;
}

.preturi-preview .positive {
  color: green;
  font-weight: bold;
}

.preturi-preview .negative {
  color: red;
  font-weight: bold;
}

@media (max-width: 900px) {
  .anunt-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .anunt-form-box,
  .preturi-preview {
    width: 100%;
  }
}
</style>
