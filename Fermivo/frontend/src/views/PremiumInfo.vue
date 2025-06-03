<template>
  <div class="premium-info">
    <h1>Descoperă contul Premium Fermivo! 🌟</h1>
    <p v-if="isSeller">
      Ești vânzător? Iată beneficiile tale:
    </p>
    <p v-else-if="isBuyer">
      Ești cumpărător? Iată beneficiile tale:
    </p>
    <p v-else>
      Aici sunt beneficiile contului Premium:
    </p>

    <ul>
      <li v-if="isSeller">✅ Anunțuri promovate – produsele tale apar primele în lista cumpărătorilor.</li>
      <li>✅ Toate prețurile la zi, fără restricții.</li>
      <li v-if="isBuyer">✅ Tracking GPS – vezi în timp real unde sunt camioanele tale!</li>
    </ul>

    <p>Preț: doar 2 EUR/lună – pentru creșterea vânzărilor și încrederea cumpărătorilor.</p>

    <button @click="activatePremium" class="activate-button">Activează Premium</button>
    <button @click="goBack" class="back-button">Înapoi</button>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  data() {
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");
    const storedUser = localUser || sessionUser;

    // Dacă localStorage e gol dar sessionStorage are date, le restaurăm
    if (!localUser && sessionUser) {
      localStorage.setItem("user", sessionUser);
    }

    return {
      user: storedUser ? JSON.parse(storedUser) : null
    };
  },
  computed: {
    isSeller() {
      return this.user && this.user.role === "seller";
    },
    isBuyer() {
      return this.user && this.user.role === "buyer";
    }
  },
  mounted() {
    if (!this.user || !this.user._id) {
      alert("Trebuie să fii autentificat pentru a accesa această pagină.");
      this.$router.push("/login");
    }
  },
  methods: {
    async activatePremium() {
      try {
        const response = await axios.post('http://localhost:5000/api/payments-premium/create-checkout-session', {
          userId: this.user._id
        });
        window.location.href = response.data.url;
      } catch (error) {
        console.error(error);
        alert('Eroare la inițierea plății.');
      }
    },
    goBack() {
      if (this.isSeller) {
        this.$router.push('/home');
      } else if (this.isBuyer) {
        this.$router.push('/home-buyer');
      } else {
        this.$router.push('/');
      }
    }
  }
};
</script>

<style scoped>
.premium-info {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  font-family: 'Inria Sans', sans-serif;
}

.premium-info h1 {
  margin-bottom: 1rem;
  color: #333;
}

.premium-info ul {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
}

.premium-info li {
  margin-bottom: 0.5rem;
}

.activate-button {
  background-color: #f5b301;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
.activate-button:hover {
  background-color: #e0a300;
}

.back-button {
  background-color: #ccc;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
.back-button:hover {
  background-color: #bbb;
}
.premium-info p {
  margin: 0.5rem 0;
  color: #555;
}
.premium-info p strong {
  color: #f5b301;
}
</style>
