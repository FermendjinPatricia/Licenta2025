<template>
  <div class="adauga-anunt-page">
    <img src="../assets/login.jpg" alt="Background" class="background-image" />

    <div class="anunt-wrapper">
      <div class="anunt-form-box">
        <h2>Editează Anunțul ✏️</h2>
        <form @submit.prevent="updateAnunt">
          <div class="input-group">
            <label for="produs">Produs:</label>
            <select id="produs" v-model="anunt.produs" required>
              <option disabled value="">Selectează un produs...</option>
              <option v-for="prod in produse" :key="prod" :value="prod">
                {{ prod }}
              </option>
            </select>
          </div>

          <div class="input-group">
            <label for="pret">Preț (lei/tonă):</label>
            <input type="number" id="pret" v-model="anunt.pret_lei_tona" required />
          </div>

          <div class="input-group">
            <label for="moneda">Monedă:</label>
            <select id="moneda" v-model="anunt.moneda" required>
              <option value="lei">Lei</option>
              <option value="euro">Euro</option>
            </select>
          </div>

          <div class="input-group">
            <label for="judet">Județ:</label>
            <select id="judet" v-model="anunt.judet" @change="updateLocalitati" required>
              <option disabled value="">Selectează județul...</option>
              <option v-for="(localitati, judet) in localitatiRomania" :key="judet" :value="judet">
                {{ judet }}
              </option>
            </select>
          </div>

          <div class="input-group">
            <label for="localitate">Localitate:</label>
            <select id="localitate" v-model="anunt.localitate" required>
              <option disabled value="">Selectează localitatea...</option>
              <option v-for="localitate in localitatiDisponibile" :key="localitate" :value="localitate">
                {{ localitate }}
              </option>
            </select>
          </div>

          <div class="input-group">
            <label for="descriere">Descriere:</label>
            <textarea id="descriere" v-model="anunt.descriere" rows="4" maxlength="500" required></textarea>
          </div>

          <div class="butoane-actiune">
            <button type="submit" class="adauga-button">Salvează Modificările</button>
            <button type="button" class="renunta-button" @click="$router.go(-1)">Renunță</button>
          </div>
        </form>
      </div>

      <div v-if="filteredPrices.length" class="preturi-preview">
        <h3>Prețuri curente pentru {{ anunt.produs }}</h3>
        <table>
          <thead>
            <tr>
              <th>Zonă</th>
              <th>Preț (lei/tonă)</th>
              <th>Variație %</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredPrices" :key="index">
              <td>{{ item.zona }}</td>
              <td>{{ item.pret_lei_tona }}</td>
              <td :class="{ positive: item.variatie_procente > 0, negative: item.variatie_procente < 0 }">
                {{ item.variatie_procente !== null ? item.variatie_procente + "%" : "N/A" }}
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
import { localitatiRomania } from "../data/localitatiRomania";

export default {
  name: "EditareAnunt",
  data() {
    return {
      anunt: {
        produs: "",
        pret_lei_tona: "",
        moneda: "lei",
        judet: "",
        localitate: "",
        descriere: "",
      },
      produse: [
        "Grau Panificatie",
        "Grau Furajer",
        "Floarea Soarelui",
        "Rapita",
        "Porumb",
        "Orz",
        "Orz Furajer",
      ],
      scraperData: [],
      filteredPrices: [],
      localitatiDisponibile: [],
      localitatiRomania,
    };
  },
  watch: {
    "anunt.produs": function () {
      this.fetchScraperData();
    },
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const response = await axios.get(`/anunturi/${id}`);
      if (response.data.success) {
        this.anunt = response.data.anunt;
        this.anunt.moneda = this.anunt.moneda || "lei";
        this.updateLocalitati();
        this.fetchScraperData();
      }
    } catch (error) {
      console.error("Eroare la preluarea anunțului:", error);
    }
  },
  methods: {
    updateLocalitati() {
      this.localitatiDisponibile = this.localitatiRomania[this.anunt.judet] || [];
    },
    async fetchScraperData() {
      if (!this.anunt.produs) return;
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
      const key = mapping[this.anunt.produs];
      this.filteredPrices = this.scraperData[key] || [];
    },
    async updateAnunt() {
      const token = localStorage.getItem("token");
      const id = this.$route.params.id;
      try {
        const response = await axios.put(
          `/anunturi/${id}`,
          {
            produs: this.anunt.produs,
            pret_lei_tona: parseFloat(this.anunt.pret_lei_tona),
            moneda: this.anunt.moneda,
            judet: this.anunt.judet,
            localitate: this.anunt.localitate,
            descriere: this.anunt.descriere,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          this.$router.push("/home");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Eroare la actualizare.");
      }
    },
  },
};
</script>

<style scoped>
.butoane-actiune {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.renunta-button {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #9e9e9e, #bdbdbd);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.renunta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #757575, #9e9e9e);
}

.renunta-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

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

h2 {
  color: #1b5e20;
  text-align: center;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group select,
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

label {
  display: block;
  color: #1b5e20;
  font-weight: bold;
  margin-bottom: 0.5rem;
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
